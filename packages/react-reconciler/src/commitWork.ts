import { appendChildToContainer, Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { MuationMask, NoFlags, Placement } from "./filberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffect: FiberNode | null = null;
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;
  while (nextEffect !== null) {
    const child: FiberNode | null = nextEffect.child;

    if ((nextEffect.subtreeFlags & MuationMask) !== NoFlags && child !== null) {
      nextEffect = child;
    } else {
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect);
        const sibling: FiberNode | null = nextEffect.sibling;
        if (sibling !== null) {
          nextEffect = sibling;
          break up;
        }

        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;
  if ((flags & Placement) !== NoFlags) {
    commitPlacment(finishedWork);
    finishedWork.flags &= ~Placement;
  }
};

const commitPlacment = (finishedWork: FiberNode) => {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log("执行Placment操作");
  }
  const hostParent = getHostParaent(finishedWork);
  //
  appendPlacementNodeIntoContainer(finishedWork, hostParent);
};

function getHostParaent(fiber: FiberNode) {
  let parent = fiber.return;
  while (parent) {
    const parentTag = parent.tag;
    if (parentTag === HostComponent) {
      return parent.stateNode as Container;
    }
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    parent = parent.return;
  }
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log("未找到");
  }
}

function appendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container,
) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent);
    return;
  }
  const child = finishedWork.child;
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent);
    let sibling = child.sibling;

    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent);
      sibling = sibling.sibling;
    }
  }
}
