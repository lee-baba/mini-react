/* eslint-disable @typescript-eslint/no-explicit-any */
// ReactElement

import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { Key, Props, Ref, Type, ElementType } from "shared/ReactTypes";

//
const ReactElement = (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props,
): ElementType => {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: "custom",
  };

  return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  for (const prop in config) {
    const val = config[prop];
    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val;
      }
      continue;
    }

    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }

    const maybeChildrenLength = maybeChildren.length;

    if (maybeChildrenLength) {
      if (maybeChildrenLength === 1) {
        props.children = maybeChildren[0];
      } else {
        props.children = maybeChildren;
      }
    }

    return ReactElement(type, key, ref, props);
  }
};

export const _jsxDEV = jsx;
