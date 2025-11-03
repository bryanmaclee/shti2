function tryIt(){
  return {
    dothing(stuff){
      console.log(stuff)
    },
    tryThing(str){
      this.dothing(str)
    }
  }
}

const yo = tryIt();
yo.tryThing("this is stuff b");

function createCounter() {
  let count = 0; // Private variable via closure

  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    getCount() {
      return count;
    }
  };
}

const counter1 = createCounter();
counter1.increment(); // Output: 1
counter1.increment(); // Output: 2
const c2 = createCounter();
console.log(counter1.getCount()); // Output: 2
console.log(c2.getCount()); // Output: 2