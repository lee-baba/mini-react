export type Container = Element;
export type Instance = Element;

// export const createInstance = (type: string, props: any) => {
export const createInstance = (type: string) => {
  // eslint-disable-next-line no-undef
  const element = document.createElement(type);
  return element;
};

export const appendInitalChild = (
  parent: Instance | Container,
  child: Instance,
) => {
  parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

export const appendChildToContainer = appendInitalChild;
