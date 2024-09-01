export type TPositiveNumberWithoutZero = number & {
  __type: "PositiveNumberWithotZero";
};
export type TPositiveNumber = number & { __type: "PositiveNumber" };

export const assertsPositiveNumberWithoutZero = (
  value: number,
): asserts value is TPositiveNumberWithoutZero => {
  if (value <= 0) {
    throw new Error("value must be positive and not zero");
  }
};

export const assertsPositiveNumber = (
  value: number,
): asserts value is TPositiveNumber => {
  if (value < 0) {
    throw new Error("value must be positive");
  }
};
