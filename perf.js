/**
 * Perf is a simple node module to evaluate the performance of a function|application|algorithm
 * @constructor
 * @property {Step[]} steps - Each recorded step
 * @example
 * var perf = require('Perf');
 *
 * perf.start();
 * // ..execute algorithm to evaluate
 * perf.step('Algorithm');
 * // ..execute a function to evaluate
 * perf.stop('Function');
 *
 * perf.resume();
 * // Will display :
 * --------------------------------
 * -          Perf result         -
 * --------------------------------
 *  + Test duration   : 3235 ms
 *  + Steps number     : 2
 *
 *  > 1. Algorithm   : 15.23 %
 *  > 2. Function    : 84.77 %
 */
function Perf(){
	/**
	 * @typedef {object} Step
	 * @property {number} time
	 * @property {string} msg
	 */
	this.steps = [];
}

Perf.prototype = {
	/**
	 * Mark a step in perf measurements associated with a given name
	 * You can also use {@link step} and {@link stop} to a better readable integration
	 * @param [name] - Name associated to the step
	 * @return {number} index - Index of the step
	 */
	start: function (name) {
		this.step(name);
	},
	/**
	 * Mark a step in perf measurements associated with a given name
	 * You can also use {@link start} and {@link step} to a better readable integration
	 * @function
	 * @param [name] - Name associated to the step
	 * @return {number} index - Index of the step
	 */
	stop: function (name) {
		this.step(name);
	},
	/**
	 * Mark a step in perf measurements associated with a given name
	 * You can also use {@link start} and {@link stop} to a better readable integration
	 * @param {string} [name] - Name associated to the step
	 * @return {number} index - Index of the step
	 */
	step: function (name) {
		if(!name){
			name = "Step "+this.steps.length+1;
		}
		this.steps.push({time:Date.now(),msg: name});
		return this.steps.length-1;
	},

	/**
	 * Get the result of the measurements
	 * @param {number} [index] - Get only the given step result
	 * @param {boolean} [silent=false] - No console message will be displayed
	 * @example <caption>Resume one with messages</caption>
	 * // returns a number and display the perf result of the second step in the console
	 * perf.resume(2);
	 * @example <caption>Resume all steps silently</caption>
	 * // returns an Array of percentage without console messages
	 * perf.resume(true);
	 * @example <caption>Resume one step silently</caption>
	 * // returns the second step percentage without console messages
	 * perf.resume(2,true);
	 * @returns {number|number[]}
	 */
	resume: function (index,silent) {
		if(arguments.length==1 && typeof arguments[0]==='boolean'){
			index = 0;
			silent =  arguments[0];
		}

		var iDuration, percentage;
		var nbSteps = this.steps.length-1;
		var totalDuration = this.steps[nbSteps].time-this.steps[0].time;
		var strResult = "--------------------------------\n";
		strResult    += "-          Perf result         -\n";
		strResult    += "--------------------------------\n";
		strResult    += " + Test duration   : "+totalDuration+" ms\n";
		strResult    += " + Steps number     : "+nbSteps+"\n\n";

		if(index && index>0 && index<this.steps.length){
			iDuration = this.steps[index].time-this.steps[index-1].time;
			percentage = 100*iDuration/totalDuration;
			strResult+= " > "+this.steps[index].msg+"\t: "+percentage.toFixed(2)+"%\n";
			if(!silent)
				console.log(strResult);
			return percentage;
		} else if(this.steps.length>1) {
			var percentages = [];
			for (var i = 1; i < this.steps.length; i++) {
				iDuration = this.steps[i].time-this.steps[i-1].time;
				percentage = 100*iDuration/totalDuration;
				percentages.push(percentage);
				strResult+= " > "+i+". "+this.steps[i].msg+"\t: "+percentage.toFixed(2)+" %\t("+iDuration+" ms)\n";
			}
			if(!silent)
				console.log(strResult);
			return percentages;
		} else {
			console.log("/!\\ perf did not find enough steps too display a result");
			if(this.steps.length==1)
				console.log("\t> perf is started but never stopped");
			else
				console.log("\t> perf has not been started");
			return 0;
		}
	},

	/**
	 * Resets the perf tool (Removes all steps)
	 */
	reset: function () {
		this.steps = [];
	}
};

module.exports = new Perf();