#TimePerf
> light performance measure tool

'TimePerf' is a simple npm module to evaluate et measure a javascript application

### [Documentation](http://remy199210.github.io/TimePerf/TimePerf.html)

### Installation
```bash
npm install time-perf
```
### Quick start
```js
var perf = require('perf');

perf.start();
// ..execute algorithm to evaluate
perf.step('Algorithm');
// ..execute a function to evaluate
perf.stop('Function');

perf.resume();
// Will display :
--------------------------------
-          Perf result         -
--------------------------------
 + Test duration   : 3235 ms
 + Steps number     : 2

 > 1. Algorithm   : 15.23 %
 > 2. Function    : 84.77 %
```