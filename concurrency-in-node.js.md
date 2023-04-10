## Nodejs event loop

Node Js Run Javacript in a single thread.

a hidden threads run Non Blocking I/O operations.

the hidden thread can't overload CPU intensive tasks beacuse it will block the main thread.
note that turning heavly intensive calculation into promise to make the code non blocking. as we leanrned about using non-blocking promise-based I/O methods like file opration wont  make use of Node.js hidden threads.
 
=> promises don’t make JavaScript code execute in parallel and cannot be used to make CPU-bound tasks non-blocking.
_____________________________________________________________________________________

Event loop

* call Stack
* Queue referd also as task queue or message queue

* Memery heap
_____________________________________________________________________________________

JavaScript introduced Promises and async functions to execute code without blocking the thread during I/O like network calls or reading files etc using event loop instead of waiting till the operation is complete. Once the operation is complete it resolves. NodeJS uses libuv to manage the event loop and I/O operations.
_____________________________________________________________________________________

* https://www.youtube.com/watch?v=8aGhZQkoFbQ

event loop in browser // 

* https://youtu.be/JwSEqEalg7E

Here's Why Node JS is NOT Single Threaded
______________________________________________________________________________________

the Best artical ever that describ event loop in Node Js
https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810

https://blog.insiderattack.net/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-2c53fd511bb3

https://blog.insiderattack.net/promises-next-ticks-and-immediates-nodejs-event-loop-part-3-9226cbe7a6aa

By Deepal Jayasekara
____________________________

https://www.youtube.com/watch?v=PNa9OMajw9w  Bert Belder, IBM
_
https://www.youtube.com/watch?v=P9csgxBgaZ8 Sam Roberts, IBM

https://youtu.be/r1omVx3Phrw Don't Let Just Node.js Take the Blame! - Danial Khan

https://acemood.github.io/2016/02/01/event-loop-in-javascript/

https://www.youtube.com/watch?v=zphcsoSJMvM The Node.js Event Loop: Not So Single Threaded

https://youtu.be/Fbhhc4jtGW4  Node.js Performance and Highly Scalable Micro-Services - Chris Bailey, IBM
______________________________________________________________________________________
