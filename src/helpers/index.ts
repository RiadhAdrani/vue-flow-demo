export const createPortId = (parent: string, name: string, type: "input" | "output"): string => {
  return `${parent}-${type}-${name}`;
};
