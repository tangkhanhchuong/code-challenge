// Solution 1: Using loop to iterate all array's elements and add to sum
// Time complexity: O(n) for looping
// Space complexity: O(1)
function sumToN1(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Solution 2: Using mathematical formula
// Time complexity: O(1)
// Space complexity: O(1)
function sumToN2(n: number): number {
  return n * (n + 1) / 2;
}

// Solution 3: Using recursion start from n with base case is 0
// Time complexity: O(n) for n recursive calls
// Space complexity: O(n) for recursion stack
function sumToN3(n: number): number {
  if (n <= 0) {
    return 0;
  }
  return n + sumToN3(n-1);
}

console.log(`Result using loop: ${sumToN1(5)}`);
console.log(`Result using formula: ${sumToN2(5)}`);
console.log(`Result using recursion: ${sumToN3(5)}`);