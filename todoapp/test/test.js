import { EventEmitter } from "../src/EventEmitter.js";

console.log("test.js");

const event = new EventEmitter();
event.addEventListener('testEvent', () => {console.log("test1")});
event.addEventListener('testEvent', () => {console.log("test2")});

event.emit('testEvent');