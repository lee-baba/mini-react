import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { processUpdateQueue, UpdateQueue } from "./updateQueue";
import { HostRoot, HostComponent, HostText } from "./workTags";
import { mountChildFiber, reconcileChildFiber } from "./childFiber";

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
  // 比较，再返回子FilberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    default:
      // eslint-disable-next-line no-undef
      if (__DEV__) {
        console.warn("BeginWork未实现的类型");
      }
      break;
  }

  return null;
};

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconileChildren(wip, nextChildren);
  return wip.child;
}

function reconileChildren(wip: FiberNode, children: ReactElementType) {
  const current = wip.alternate;
  if (current !== null) {
    // update
    wip.child = reconcileChildFiber(wip, current?.child, children);
  } else {
    // mount
    wip.child = mountChildFiber(wip, null, children);
  }
}
