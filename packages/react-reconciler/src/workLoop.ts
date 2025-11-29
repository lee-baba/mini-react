import { beginWork } from "./beginWork";
import { commitMutationEffects } from "./commitWork";
import { completeWork } from "./completeWork";
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { MuationMask, NoFlags } from "./filberFlags";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFilber(fiber: FiberNode) {
  // TODO:调度功能
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}

function renderRoot(root: FiberRootNode) {
  // 初始化
  prepareFreshStack(root);
  do {
    try {
      workLoop();
      break;
    } catch (err) {
      // eslint-disable-next-line no-undef
      if (__DEV__) {
        console.warn("workLoop发生错误", err);
      }
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
  const finishWork = root.current.alternate;
  root.finishedWork = finishWork;
  commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (!finishedWork) {
    return;
  }

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log("commit阶段开始");
  }

  root.finishedWork = null;

  // 判断是否存在3个子阶段需要执行的操作
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MuationMask) !== NoFlags;
  const rooHasEffect = (finishedWork.flags & MuationMask) !== NoFlags;

  if (subtreeHasEffect || rooHasEffect) {
    // beformMutation
    // mutation placement
    commitMutationEffects(finishedWork);
    root.current = finishedWork;
    // layout
  } else {
    root.current = finishedWork;
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizeProps = fiber.pendingProps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(filber: FiberNode) {
  let node = filber;

  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return as any;
  } while (node !== null);
}
