// Additional Array Methods

  /** 2021-03-10
   * Method of an array that returns an array of all even numbers
   * @returns {number[]}
   */
  Array.prototype.extract_evens = function(){
    let evens = [];
    for (let i = 0;i < this.length; i++) {
      if (this[i] % 2 === 0) {evens.push(this[i])};
    }
    return evens.sort(function(a,b) {return a-b;});
  }

  /** 2021-10-03
   * Method of an array that returns an array of all odd numbers
   * @returns {number[]}
   */
  Array.prototype.extract_odds = function() {
    let odds = []
    for (let i = 0;i < this.length;i++) {
      if (this[i] % 2 != 0) {odds.push(this[i])};
    };
    return odds.sort(function(a,b) {return a-b;});
  };

  /**2021-03-10
   * Method of an array that returns an array of all primes
   * @returns {number[]}
   */
  Array.prototype.extract_primes = function() {
    let primes = [];
    for (let i = 0; i < this.length;i++) {
      if (isPrime(this[i])) {primes.push(this[i])};
    }
    return primes.sort(function(a,b) {return a-b;});
  }

  /** 2021-10-03
   * Method of an array that returns sum of all items
   * @returns {number}
   */
  Array.prototype.sum_items = function() {
    let sum = 0;
    for (let i = 0;i < this.length;i++) {
      sum += this[i];
    };
    return sum
  };
//

// Functions
  /** 2021-10-03
   * Returns all fibbonacci numbers below a max value
   * @param {number} maxValue 
   * @return {number[]}
   */
  function fib_to_max(maxValue) {
    let fib = [1,2];
    let x = 1;
    let y = 2;
    for (y;y + x < maxValue;x = y - x) {
      y += x;
      fib.push(y);
    };
    return fib;
  };

  /** 2021-10-03
   * Returns all the even numbers from an input array
   * @param {number[]} array
   * @return {number[]}
   */
  function extract_evens_from_array(array) {
    let evens = []
    for (let i = 0;i < array.length;i++) {
      if (array[i] % 2 == 0) {evens.push(array[i])};
    };
    return evens;
  };

  /** 2021-10-03
   * Returns all the odd numbers from an input array
   * @param {number[]} array
   * @return {number[]}
   */
  function extract_odds_from_array(array) {
    let odds = []
    for (let i = 0;i < array.length;i++) {
      if (array[i] % 2 != 0) {odds.push(array[i])};
    };
    return odds;
  };

  /**2021-03-10
   * Returns array of prime numbers from input array
   * @param {number[]} array 
   * @returns {number[]}
   */
  function extract_primes(array) {
    let primes = [];
    for (let i = 0; i < array.length;i++) {
      if (isPrime(array[i])) {primes.push(array[i])};
    }
    return primes;
  }

  /** 2021-10-03
   * sums all numbers in an array
   * @param {number[]} array 
   * @returns {number}
   */
  function sum_items_in_array(array) {
    let sum = 0;
    for (let i = 0;i < array.length;i++) {
      sum += array[i];
    };
    return sum
  };

  /** 2021-03-10
   * Return all factors of num in array of ascending value
   * @param {number} num 
   * @returns {number[]}
   */
  function get_factors(num) {
    let factors = []
    for (let i = 0; i <= Math.sqrt(num); i++) {
      if (num % i == 0) {
        factors.push(i, num / i);
      };
    };
    return factors.sort(function(a,b) {return a-b;});
  };


  /** 2021-03-10 Copied from "https://en.wikipedia.org/wiki/Primality_test"
   * Returns true if num is prime
   * @param {number} num 
   * @returns {boolean}
   */
  function isPrime(num) {
    // if num is <= 3 and > 1 this returns True else it returns false
    if (num <= 3) return num > 1;

    // if num is divisible by 3 or 2 returns false
    if ((num % 2 === 0) || (num % 3 === 0)) return false;
    
    let count = 5;  

    while (Math.pow(count, 2) <= num) {
      if (num % count === 0 || num % (count + 2) === 0) return false;
      
      count += 6;
    }  
    return true;
  }

  /** 2021-03-21
   * Return the digits of the input number in the reverse order
   * @param {number} num 
   * @returns {number}
   */
  function reverse_number(num) {
    return num.toString().split('').reverse().join('') * Math.sign(num);;
  } 

  /** 2021-03-12
   * Returns an array of all integers <= a max value
   * @param {number} max 
   * @returns {number[]}
   */
  function count_to(max) {
    let nums = [];
    for (let i = 1; i <= max;i++) {
      nums.push(i);
    }
    return nums;
  }
//