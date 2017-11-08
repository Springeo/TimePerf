# TimePerf
> light performance measure tool

TimePerf is a simple npm module to evaluate et measure a javascript application. TimePerf is a singleton it can be require in through several modules/files.

### Documentation [(click here)](http://springeo.github.io/TimePerf/TimePerf.html)

### Installation
```bash
npm install time-perf
```
### Quick start
```js
var timePerf = require('time-perf');

timePerf.start('Test');
// ..execute algorithm to evaluate
timePerf.step('Algorithm').print();
// Will display "> 1. Algorithm : 127 ms"

// ..execute a function to evaluate
timePerf.stop('Function').print();

timePerf.print();
// Will display :

--------------------------------
-         TimePerf result      -
--------------------------------
# Test
 + TimePerf duration   : 200 ms
 + Pause duration   : 0 ms

 > 1. Algorithm   : 63.5 % (127 ms)
 > 2. Function    : 36.5 % (73 ms)
```
### Latest features :
> We know you wanted to do this, at least we wanted to: get/create identified TimePerf instance
+ You can now create new TimePerf instance and access it through the TimePerf singleton with the newInstance/getInstance function

> Rename for better readibility
+ Better use ```print``` to print measure durations (```resume``` still an alias)
+ For permanent duration measure and easiest duration analysis use ```getTime(index)```

> TimePerf made some children ! You can now create children in each step.

+ To do it use ```child``` or even faster ```childStart``` and ```childStop``` to make quick child.
A child is a TimePerf object you can use it as its parent.
You can add as much child and as deep as you want to.  


##### Use example
```js
timePerf.start('Test').childStart('SmallChild 1');
// .. some stuff
timePerf.childStop().childStart('SmallChild 2');
// .. more stuff
timePerf.lastChild().stop();
timePerf.step('Parent 1');
var perfChild = timePerf.child().start('BigChild');//same as timePerf.childStart('BigChild')
// ..inside step
perfChild.step('inside step 1');
timePerf.childStop('inside step 2').stop('Parent 2').print();

// Will display
--------------------------------
-         TimePerf result      -
--------------------------------
## Test
+ TimePerf duration : 19609 ms
+ Pause duration    : 0 ms
> 1. Parent 1	: 0.54 %	(105 ms)
	> SmallChild 1	: 12 ms
	> SmallChild 2	: 92 ms
> 2. Parent 2	: 99.46 %	(19504 ms)
	## BigChild
	+ TimePerf duration : 19504 ms
	+ Pause duration    : 0 ms
	> 1. inside step 1	: 65.56 %	(12787 ms)
	> 2. inside step 2	: 34.44 %	(6717 ms)
```
### More features
+ TimePerf functions can be chained
+ You can ```pause``` and ```unpause```
+ TimePerf can display any previous action result with ```log```
+ ```print``` will display the last step result when chained to ```step```

```js
timePerf.start();
timePerf.step("First step").print().pause();
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

## Dev
To regenerate documentation
```jsdoc --configure documentation/jsdoc.json```