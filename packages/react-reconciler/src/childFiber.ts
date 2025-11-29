import { ReactElementType } from "shared/ReactTypes";
import { createFiberFromElement, FiberNode } from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { HostText } from "./workTags";
import { Placement } from "./filberFlags";

function childReconciler(shouldTrackEffects: boolean) {
  return function reconilcChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild: ReactElementType,
  ) {
    function reconcileSingleElement(
      returnFiber: FiberNode,
      currentFiber: FiberNode | null,
      element: ReactElementType,
    ) {
      const fiber = createFiberFromElement(element);
      fiber.return = returnFiber;
      return fiber;
    }

    function placeSingChild(fiber: FiberNode) {
      if (shouldTrackEffects && fiber.alternate === null) {
        fiber.flags |= Placement;
      }
      return fiber;
    }

    function reconcileSingleTextNode(
      returnFiber: FiberNode,
      currentFiber: FiberNode | null,
      content: string | number,
    ) {
      const fiber = new FiberNode(HostText, { content }, null);
      fiber.return = returnFiber;
      return fiber;
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild),
          );
        default:
          // eslint-disable-next-line no-undef
          if (__DEV__) {
            console.warn("");
          }
          break;
      }
    }
    if (typeof newChild === "string" && typeof newChild === "number") {
      return placeSingChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    }
    return null;
  };
}

export const reconcileChildFiber = childReconciler(true);
export const mountChildFiber = childReconciler(false);
