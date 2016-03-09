/**
 * TimePerf is a simple node module to evaluate the performance of a function|application|algorithm
 * @constructor
 * @property {Step[]} steps - Each recorded step
 * @example
 * var timePerf = require('time-perf');
 *
 * timePerf.start();
 * // ..execute algorithm to evaluate
 * timePerf.step('Algorithm');
 * // ..execute a function to evaluate
 * timePerf.stop('Function');
 *
 * timePerf.resume();
 * // Will display :
 * --------------------------------
 * -          TimePerf result         -
 * --------------------------------
 *  + Test duration   : 3235 ms
 *  + Steps number     : 2
 *
 *  > 1. Algorithm   : 15.23 %
 *  > 2. Function    : 84.77 %
 */
function TimePerf(){
	/**
	 * @typedef {object} Step
	 * @property {number} time
	 * @property {string} msg
	 */
	this.steps = [];
	this.pauseStep = 0;
	this.pauseTime = 0;
	this.result = 0;
	this.strResult = "TimePerf created";
	return this;
}

TimePerf.prototype = {
	/**
	 * Reset TimePerf & mark a step in TimePerf measurements associated with a given name
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	start: function () {
		this.reset().step();
		this.result = 0;
		this.strResult = "TimePerf started";
		return this;
	},
	/**
	 * Mark a step in TimePerf measurements associated with a given name and switch TimePerf to pause
	 * You can use {@link resume} just after to show a resume
	 * @function
	 * @param [name] - Name associated to the step
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	stop: function (name) {
		this.step(name).pause();
		this.result = 0;
		this.strResult = "TimePerf stopped";
		return this;
	},
	/**
	 * Mark a step in TimePerf measurements associated with a given name
	 * You can also use {@link resume} and {@link pause} to after
	 * @param {string} [name] - Name associated to the step
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	step: function (name) {
		if(this.pauseStep){
			console.log("/!\\ TimePerf can't mark a step during a pause or when it's stopped ("+name+" step has been ignored)");
			this.result = 0;
			return this;
		}
		if(!name){
			name = "Step "+this.steps.length+1;
		}
		this.steps.push({time:Date.now()-this.pauseTime,msg: name});
		this.result = this.steps.length-1;
		this.strResult = "[TimePerf] > "+this.result+". "+name;
		return this;
	},

	/**
	 * Get the result of the measurements
	 * @param {number} [index] - Get only the given step result
	 * @param {boolean} [silent=false] - No console message will be displayed
	 * @example <caption>Resume after step</caption>
	 * // display the duration of the previous step
	 * timePerf.step("Step name").resume();
	 * @example <caption>Resume after stop</caption>
	 * // display a resume of TimePerf steps and switch to pause
	 * timePerf.stop("Last Step").resume();
	 * @example <caption>Resume one with messages</caption>
	 * // display the duration of the second step
	 * timePerf.resume(2);
	 * @example <caption>Resume all steps silently</caption>
	 * // returns an Array of percentage without console messages
	 * timePerf.resume(true);
	 * @example <caption>Resume one step silently</caption>
	 * // returns the second step percentage without console messages
	 * timePerf.resume(2,true);
	 * @returns {TimePerf} timePerf - The TimePerf Object plus a percentage or an array of percentage (timePerf.result == 0 for error)
	 */
	resume: function (index,silent) {
		if(arguments.length==1 && arguments[0]===true){
			silent = true;
			index = this.result;
		}
		if(!index && typeof this.result === 'number'){
			index = this.result;
		}
		if(index && index>0 && index<this.steps.length){
			this.result = this.steps[index].time-this.steps[index-1].time;
			this.strResult = "[TimePerf] > "+this.steps[index].msg+"\t: "+this.result+" ms)\n";
		} else if(this.steps.length>1) {
			var nbSteps = this.steps.length-1;
			var testDuration = this.steps[nbSteps].time-this.steps[0].time;
			var strResult = "--------------------------------\n";
			strResult    += "-         TimePerf result      -\n";
			strResult    += "--------------------------------\n";
			strResult    += " + Total duration  : "+(this.pauseTime+testDuration)+" ms\n";
			strResult    += " + Test duration   : "+testDuration+" ms\n";
			strResult    += " + Pause duration  : "+this.pauseTime+" ms\n";
			strResult    += " + Steps number    : "+nbSteps+"\n\n";
			var percentage,percentages = [];
			for (var i = 1; i < this.steps.length; i++) {
				var iDuration = this.steps[i].time-this.steps[i-1].time;
				percentage = 100*iDuration/testDuration;
				percentages.push(percentage);
				strResult+= " > "+i+". "+this.steps[i].msg+"\t: "+percentage.toFixed(2)+" %\t("+iDuration+" ms)\n";
			}
			this.result = percentages;
			this.strResult = strResult;
		} else {
			this.strResult = "\n/!\\ TimePerf did not find enough steps too display a result";
			if(this.steps.length==1)
				this.strResult+="\n\t> TimePerf is started but never stepped/stopped\n";
			else
				this.strResult+="\n\t> TimePerf has not been started\n";
			this.result = [];
		}
		return silent?this:this.log();
	},

	/**
	 * Resets the TimePerf tool (Removes all steps)
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	reset: function () {
		this.steps = [];
		this.pauseStep = 0;
		this.pauseTime = 0;
		this.result = 0;
		this.strResult = "TimePerf reset";
		return this;
	},

	/**
	 * Switch TimePerf to pause. You can't mark a step during a pause.
	 * pause doesn't modify the previous action result and strResult
	 * @example
	 * timePerf.step("Step name").pause().resume();
	 * //Will display
	 * "[TimePerf] > 1. Step name : 127 ms"
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	pause: function () {
		this.pauseStep = Date.now();
		return this;
	},

	/**
	 * Unpauses TimePerf and returns the pause duration
	 * @example <caption>chain log with unpause</caption>
	 * timePerf.unpause().log();
	 * // will display
	 * "TimePerf has marked a 20 ms pause"
	 * @returns {TimePerf} scope - The TimePerf object plus the last pause duration
	 */
	unpause: function () {
		var res = 0;
		if(this.pauseStep){
			res = Date.now() - this.pauseStep;
			this.pauseTime+= res;
			this.strResult = "TimePerf has marked a "+res+" ms pause";
		} else {
			this.strResult = "/!\\ TimePerf has not been paused before to unpause.";
		}
		this.pauseStep = 0;
		this.result = res;
		return this;
	},

	log: function () {
		if(this.strResult)
			console.log(this.strResult);
		return this;
	}
};

module.exports = new TimePerf();
