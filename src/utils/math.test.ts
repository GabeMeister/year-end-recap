import getPercentDifference from "./math";

describe("math.ts", () => {
  it("does", () => {
    expect(getPercentDifference(1, 2)).toBe("100%");
  });
});
