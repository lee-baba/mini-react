import {
  appendInitalChild,
  Container,
  createInstance,
  createTextInstance,
  Instance,
} from "hostConfig";
import { FiberNode } from "./fiber";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTags";
import { NoFlags } from "./filberFlags";

//
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        console.log("");
      } else {
        // const instance = createInstance(wip.type, newProps);
        const instance = createInstance(wip.type);
        appendAllChildren(instance, wip);
        wip.stateNode = wip;
      }
      bubbleProperties(wip);
      return null;
    case HostText:
      if (current !== null && wip.stateNode) {
        console.log("");
      } else {
        const instance = createTextInstance(newProps);
        appendAllChildren(instance as any, wip);
        wip.stateNode = wip;
      }
      bubbleProperties(wip);
      return null;
    case HostRoot:
      bubbleProperties(wip);
      return null;

    case FunctionComponent:
      bubbleProperties(wip);
      return null;

    default:
      // eslint-disable-next-line no-undef
      if (__DEV__) {
        console.warn("未处理的completeWork", wip);
      }
      break;
  }
};

// eslint-disable-next-line no-undef
function appendAllChildren(parent: Instance | Container, wip: FiberNode) {
  let node = wip.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitalChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === wip) {
      return;
    }

    while (node!.sibling === null) {
      if (node!.return === null && node!.return === wip) {
        return;
      }

      node = node?.return as any;
    }

    node!.sibling.return = node!.return;
    node = node!.sibling;
  }
}

function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = wip.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = wip;
    child = child.sibling;
  }

  wip.subtreeFlags |= subtreeFlags;
}
