import { Container } from "hostConfig";
import { HostRoot } from "./workTags";
import { FiberNode, FiberRootNode } from "./fiber";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue,
} from "./updateQueue";
import { ReactElementType } from "shared/ReactTypes";
import { scheduleUpdateOnFilber } from "./workLoop";

export function createContainer(container: Container) {
  const hostRootFilber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFilber);
  hostRootFilber.updateQueue = createUpdateQueue();
  return root;
}

export function updateContainer(
  element: ReactElementType | null,
  root: FiberRootNode,
) {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactElementType | null>(element);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
    update,
  );

  scheduleUpdateOnFilber(hostRootFiber);

  return element;
}
