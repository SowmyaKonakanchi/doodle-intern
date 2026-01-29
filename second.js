function secondLargestFromString(str) {
  let arr = str.split(" ").map(Number);

  let largest = -Infinity;
  let second = -Infinity;

  for (let num of arr) {
    if (num > largest) {
      second = largest;
      largest = num;
    } else if (num > second && num < largest) {
      second = num;
    }
  }
////gdyvvc
  return second;
}

console.log(secondLargestFromString("10 5 20 8"));
