// Minimal smoke test for the repro. Uses Jest globals, as in the Expo unit-testing guide.
const sum = (a: number, b: number): number => a + b;

describe('jest-expo preset smoke test', () => {
  it('runs a plain assertion', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('runs a mock-function matcher', () => {
    const callback = jest.fn();
    callback('tip');
    expect(callback).toHaveBeenCalledWith('tip');
  });
});