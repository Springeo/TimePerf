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
timePerf.step('Algorithm').resume();
// Will display "\[TimePerf] > 1. Algorithm : 127 ms"

// ..execute a function to evaluate
timePerf.stop('Function').resume;

timePerf.resume();
// Will display :

--------------------------------
-         TimePerf result      -
--------------------------------
 + Total duration   : 200 ms
 + Test duration    : 200 ms
 + Pause duration   : 0 ms
 + Steps number     : 2

 > 1. Algorithm   : 63.5 % (127 ms)
 > 2. Function    : 36.5 % (73 ms)
```
### Latest features
+ TimePerf functions can now be chained
+ You can now ```pause``` and ```unpause```
+ TimePerf can display any previous action result with ```log```
+ ```resume``` will display the last step result when chained to ```step```

```js
timePerf.start();
timePerf.step("First step").resume().pause();
// display "\[TimePerf] > 1. First Step : 20 ms"

timePerf.unpause().log();
// display "TimePerf has marked a 4 ms pause"
```

+ ```stop``` will ```step``` and ```pause``` TimePerf

```js
timePerf.stop("Last step");
//..
timePerf.unpause()
```

+ ```start``` will ```reset``` and ```step``` TimePerf. You can call it at any time to restart TimePerf