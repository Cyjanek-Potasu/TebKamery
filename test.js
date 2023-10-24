const EventEmitter = require('events');

// Create an instance of EventEmitter
const eventEmitter = new EventEmitter();

// Your object
const myObject = { value: 42 };

// Create a Proxy for the object
const myObjectProxy = new Proxy(myObject, {
  set(target, property, value) {
    // Detect property changes and emit an event
    if (target[property] !== value) {
      eventEmitter.emit('objectPropertyChanged', {
        property,
        oldValue: target[property],
        newValue: value,
      });
    }
    // Set the property's new value
    target[property] = value;
    return true; // Indicate success
  },
});

// Create an event listener for property changes
eventEmitter.on('objectPropertyChanged', ({ property, oldValue, newValue }) => {
  console.log(`Property "${property}" changed from ${oldValue} to ${newValue}`);
});

// Modify the object through the proxy
myObjectProxy.value = 100;

// Another example
myObjectProxy.anotherProperty = 'New Value';
