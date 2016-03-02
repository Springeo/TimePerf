#TimePerf
> light performance measure tool

'TimePerf' is a simple npm module to evaluate et measure a javascript application

### Documentation [(click here)](http://remy199210.github.io/TimePerf/TimePerf.html)

### Installation
```bash
npm install time-perf
```
### Quick start
```js
var timePerf = require('time-perf');

timePerf.start();
// ..execute algorithm to evaluate
timePerf.step('Algorithm');
// ..execute a function to evaluate
timePerf.stop('Function');

timePerf.resume();
// Will display :
--------------------------------
-          TimePerf result         -
--------------------------------
 + Test duration   : 3235 ms
 + Steps number     : 2

 > 1. Algorithm   : 15.23 %
 > 2. Function    : 84.77 %
```