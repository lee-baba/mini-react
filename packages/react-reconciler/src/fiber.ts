import type { Key, Props, ReactElementType, Ref } from "shared/ReactTypes";
import { FunctionComponent, HostComponent, type WorkTag } from "./workTags";
import { Flags, NoFlags } from "./filberFlags";
import { Container } from "hostConfig";

export class FiberNode {
  type: any;
  tag: WorkTag;
  pendingProps: Props;
  key: Key;
  stateNode: any;
  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;
  ref: Ref;
  memoizeProps: Props | null;
  alternate: FiberNode | null;
  flags: Flags;
  subtreeFlags: Flags;
  updateQueue: unknown;
  memoizedState: any;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 示例属性
    this.tag = tag;
    this.key = key;
    // HostComponent -> <div> div Dom
    this.stateNode = null;
    // FunctionComponent ->  () => {}
    this.type = null;

    // 构成树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;
    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps;
    this.memoizeProps = null;
    this.memoizedState = null;
    this.alternate = null;
    this.updateQueue = null;

    // 副作用
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props,
): FiberNode => {
  let wip = current.alternate;
  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    current.alternate = wip;
  } else {
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
  }
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizeProps = current.memoizeProps;
  wip.memoizedState = current.memoizedState;

  return wip;
};

export function createFiberFromElement(element: ReactElementType) {
  const { type, key, props } = element;
  let FiberTag: WorkTag = FunctionComponent;

  if (typeof type === "string") {
    FiberTag = HostComponent;
    // eslint-disable-next-line no-undef
  } else if (typeof type !== "function" && __DEV__) {
    console.warn("");
  }
  const fiber = new FiberNode(FiberTag, props, key);
  fiber.type = type;
  return fiber;
}
