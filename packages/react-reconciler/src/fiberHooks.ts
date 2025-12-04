import internals from "shared/internals";
import { FiberNode } from "./fiber";
import { Dispatch, Dispatcher } from "react/src/currentDispatcher";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue,
} from "./updateQueue";
import { Action } from "shared/ReactTypes";
import { scheduleUpdateOnFilber } from "./workLoop";

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}

export function renderWithHoos(wip: FiberNode) {
  //赋值
  currentlyRenderingFiber = wip;
  // 重置
  wip.memoizedState = null;

  const current = wip.alternate;

  if (current !== null) {
    // update
  } else {
    // mount
    currentDispatcher.current = HooksDispatchOnMount;
  }

  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  // 重置
  currentlyRenderingFiber = null;
  return children;
}

const HooksDispatchOnMount: Dispatcher = {
  useState: mountState,
};

function mountState<State>(
  initialState: (() => State) | State,
): [State, Dispatch<State>] {
  // 找到当亲useState对应的hook数据
  const hook = mountWorkInProgressHook();
  let memoizedState = initialState;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }

  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
  queue.dispatch = dispatch;

  return [memoizedState, dispatch];
}

function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFilber(fiber);
}

function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // mouunt时第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error("请在函数组件内调用hook");
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // mount时后续的hook
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }
  return workInProgressHook;
}
