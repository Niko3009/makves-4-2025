export function getMean(array: number[]) {
  return (
    array.reduce((currentSum: number, currentNumber: number) => {
      return currentSum + currentNumber;
    }, 0) / array.length
  );
}

export function getVariance(array: number[], mean: number) {
  return (
    array.reduce((currentSum: number, currentNumber: number) => {
      return currentSum + (currentNumber - mean) ** 2;
    }, 0) / array.length
  );
}
