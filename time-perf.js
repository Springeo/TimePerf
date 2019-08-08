"use strict"

/**
 * @namespace TimePerf
 *
 * @typedef {object} Step
 * @property {number} time
 * @property {string} name
 * @property {TimePerf} [child]
 */

/**
 * TimePerf is a simple node module to evaluate the performance of a function|application|algorithm
 * @constructor
 * @property {Step[]} steps - Each recorded step
 * @property {object<*, TimePerf>} instances
 *
 * @example
 * import timePerf from "time-perf"
 *
 * timePerf.start()
 * // ..execute algorithm to evaluate
 * timePerf.step("Algorithm")
 * // ..execute a function to evaluate
 * timePerf.stop("Function")
 *
 * timePerf.print()
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
class TimePerf {
	steps = []
	pauseStep = 0
	pauseTime = 0
	result = 0
	strResult = "TimePerf created"
	children = []
	tag = "[TimePerf] "
	instances = {}

	constructor(depth) {
		this.depth = depth ? depth : 0
		this.name = `TimePerf session ${ this.depth }`
		return this
	}

	/**
	 * Remove all created instances
	 */
	cleanInstances() {
		this.instances = {}
	}

	/**
	 * Create a new TimePerf instance and store it in the instance map
	 * @param {string} name
	 * @returns {TimePerf}
	 * @example <caption>Create a new TimePerf instance</caption>
	 * // Better use startInstance and stopInstance for simple usages
	 * // alias getInstance both will return the instance if it exists or create it if not
	 * const instance = timePerf.newInstance("instance1")
	 * if (instance.pauseStep)
	 *  instance.unpause()
	 * else
	 *  instance.start()
	 * // step
	 * instance.pause()
	 * // end
	 * instance.stop().print()
	 */
	newInstance(name) {
		if (!this.instances[name]) {
			this.instances[name] = new TimePerf()
		}
		return this.instances[name]
	}

	getInstance() {
		return this.newInstance.apply(this, arguments)
	}

	/**
	 * Create a new instance or get it if it exists and start/unpause it.
	 * It is recommended to use startInstance with stopInstance only
	 * @param {string} name
	 * @returns {TimePerf}
	 * @example <caption>Instance simple usage</caption>
	 * // At the begining of the function to measure
	 * timePerf.startInstance("Function duration")
	 * // At the end of it
	 * const endCondition = index === lastIndex
	 * timePerf.stopInstance("Function duration", endCondition)
	 */
	startInstance(name) {
		const tpInst = this.getInstance(name)

		if (tpInst.pauseStep) {
			tpInst.unpause()
		} else {
			tpInst.start(name)
		}

		return tpInst
	}

	/**
	 * Switch to pause the instance or stop, print and clean it when the endCondition is true.
	 * It is recommended to use stopInstance with startInstance only
	 * @param {string}  name         - The id of the instance
	 * @param {boolean} [endCondition=true] - When the instance is stopped
	 * @returns {TimePerf}
	 */
	stopInstance(name, endCondition = true) {
		const tpInst = this.getInstance(name)
		if (endCondition) {
			tpInst.stop().print()
			delete this.instances[name]
		} else {
			tpInst.pause()
		}
		return tpInst
	}

	/**
	 * Reset TimePerf & mark a step in TimePerf measurements associated with a given name
	 * @param {String} name - Name of the new TimePerf session
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	start(name) {
		if (name) {
			this.name = name
		}
		this.reset().step()
		this.result = 0
		this.strResult = this.tag + this.name + " started"
		return this
	}

	/**
	 * Mark a step in TimePerf measurements associated with a given name and switch TimePerf to pause
	 * You can use {@link resume} just after to show a resume
	 * @function
	 * @param [name] - Name associated to the step
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	stop(name) {
		this.step(name ? name : this.name).pause()
		this.result = 0
		this.strResult = this.tag + this.name + " stopped"
		return this
	}

	/**
	 * Mark a step in TimePerf measurements associated with a given name
	 * You can also use {@link resume} and {@link pause} to after
	 * @param {string} [name] - Name associated to the step
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	step(name) {
		if (this.pauseStep) {
			console.error("/!\\ " + this.tag + this.name + " can't mark a step during a pause or when it's stopped (" + name + " step has been ignored)")
			this.result = 0
			return this
		}
		if (!name) {
			name = "Step " + this.steps.length + 1
		}
		this.steps.push({ time: Date.now() - this.pauseTime, name: name, children: this.children })
		this.children = []
		this.result = this.steps.length - 1
		this.strResult = "[TimePerf] > " + this.result + ". " + name
		return this
	}

	/**
	 * Get the result of the measurements (alias resume)
	 * @param {number} [index] - Get only the given step result
	 * @param {boolean} [silent=false] - No console message will be displayed
	 * @example <caption>Resume after step</caption>
	 * // display the duration of the previous step
	 * timePerf.step("Step name").print();
	 * @example <caption>Resume after stop</caption>
	 * // display a resume of TimePerf steps and switch to pause
	 * timePerf.stop("Last Step").print();
	 * @example <caption>Resume one with messages</caption>
	 * // display the duration of the second step
	 * timePerf.print(2);
	 * @example <caption>Resume all steps silently</caption>
	 * // returns an Array of percentage without console messages
	 * timePerf.print(true);
	 * @example <caption>Resume one step silently</caption>
	 * // returns the second step percentage without console messages
	 * timePerf.print(2,true);
	 * @returns {TimePerf} timePerf - The TimePerf Object plus a percentage or an array of percentage (timePerf.result
	 *     == 0 for error)
	 */
	print(index, silent) {
		if (this.steps.length < 2) {
			this.strResult = `${indent}\n/!\\ TimePerf did not find enough steps too display a result`
			if (this.steps.length == 1)
				this.strResult += `${indent}\n\t> TimePerf is started but never stepped/stopped\n`
			else
				this.strResult += `${indent}\n\t> TimePerf has not been started\n`
			this.result = []
		} else {
			var indent = ""
			for (var i = 0; i < this.depth; i++) {
				indent += "\t"
			}
			if (arguments.length == 1 && arguments[0] === true) {
				silent = true
				index = null
			}
			if (!index) {
				if (typeof this.result === "number" && this.result > 0)
					index = this.result
				else if (this.depth > 0)
					index = this.steps.length - 1
			}
			if (index && index > 0 && index < 2) {
				this.result = this.steps[index].time - this.steps[index - 1].time
				this.strResult = indent + "> " + this.steps[index].name + "\t: " + this.result + " ms\n"
			} else {
				const nbSteps = this.steps.length - 1
				const testDuration = this.steps[nbSteps].time - this.steps[0].time
				let strResult = ""
				if (this.depth === 0) {
					strResult += "┌─────────────────────────────┐\n"
					strResult += "│       TimePerf result       │\n"
					strResult += "├─────────────────────────────┘\n"
				}
				strResult += `│${indent} « ${this.name} »\n`
				//strResult    += indent+"+ Total duration  : "+(this.pauseTime+testDuration)+" ms\n";
				strResult += `│${indent}▐ TimePerf duration : ${testDuration} ms\n`
				strResult += `│${indent}▐ Pause duration    : ${this.pauseTime} ms\n`
				let percentage
				const percentages = []
				for (let i = 1; i < this.steps.length; i++) {
					const step = this.steps[i]

					const iDuration = step.time - this.steps[i - 1].time
					percentage = 100 * iDuration / testDuration
					percentages.push(percentage)
					strResult += `│${indent} ■ ${i}. ${step.name}\t: ${percentage.toFixed(2)} %\t (${iDuration} ms)\n`

					for (let j = 0; j < step.children.length; j++) {
						strResult += step.children[j].print(true).strResult
					}
				}
				this.result = percentages
				this.strResult = strResult
			}
		}
		return silent ? this : this.log()
	}

	resume() {
		this.print.apply(this, arguments)
	}

	/**
	 * Resets the TimePerf tool (Removes all steps)
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	reset() {
		this.steps = []
		this.pauseStep = 0
		this.pauseTime = 0
		this.result = 0
		this.strResult = "TimePerf reset"
		return this
	}

	/**
	 * Switch TimePerf to pause. You can't mark a step during a pause.
	 * pause doesn't modify the previous action result and strResult
	 * @example
	 * timePerf.step("Step name").pause().print()
	 * // Will display
	 * "[TimePerf] > 1. Step name : 127 ms"
	 * @returns {TimePerf} timePerf - The TimePerf Object
	 */
	pause() {
		this.pauseStep = Date.now()
		return this
	}

	/**
	 * Unpauses TimePerf and returns the pause duration
	 * @example <caption>chain log with unpause</caption>
	 * timePerf.unpause().log()
	 * // will display
	 * "TimePerf has marked a 20 ms pause"
	 * @returns {TimePerf} scope - The TimePerf object plus the last pause duration
	 */
	unpause() {
		let res = 0
		if (this.pauseStep) {
			res = Date.now() - this.pauseStep
			this.pauseTime += res
			this.strResult = `${this.tag}${this.name} has marked a ${res} ms pause`
		} else {
			this.strResult = `/!\\ ${this.tag}${this.name} has not been paused before to unpause.`
		}
		this.pauseStep = 0
		this.result = res
		return this
	}

	/**
	 * Display the last result as a message in the console
	 * @returns {TimePerf}
	 */
	log() {
		if (this.strResult)
			console.log(this.strResult)
		return this
	}

	/**
	 * Create a new TimePerf child. This child will be bind to the next step
	 * @returns {TimePerf} child - The created child
	 */
	child() {
		if (this.steps.length > 0) {
			const newChild = new TimePerf(this.depth + 1)
			this.children.push(newChild)
			return newChild
		} else {
			console.log("TimePerf hasn't been started. Child can't be created without available parent")
		}
	}

	/**
	 * Create and start a new TimePerf child. This child will be bind to the next
	 * @param {string} name - Child's name
	 * @returns {TimePerf} child - The created child
	 */
	childStart(name) {
		return this.child().start(name)
	}

	/**
	 * Stop the last TimePerf child
	 * @param {string} [name] - Name of the last child step (otherwise will be the child name)
	 * @returns {TimePerf} parent - Return the current TimePerf (not the child)
	 */
	childStop(name) {
		if (this.children.length > 0) {
			const child = this.children[this.children.length - 1]
			child.stop(name)
		} else {
			console.log(`${this.tag}No child has been started yet`)
		}
		return this
	}

	/**
	 * Return the last created child for the current step, if none returns the current TimePerf.
	 * @returns {TimePerf} child
	 */
	lastChild() {
		if (this.children.length > 0) {
			return this.children[this.children.length - 1]
		}
		console.log(`${this.tag}No child has been started yet`)
		return this
	}

	/**
	 * Return the duration (in ms) of a specific step
	 * @param {number} index - Step's index
	 * @returns {number}
	 */
	getTime(index) {
		if (index > 0 && index < this.steps.length) {
			return this.steps[index].time - this.steps[index - 1].time
		} else {
			console.log(`${index} index does not exist`)
		}
	}
}

module.exports.TimePerf = TimePerf
module.exports = new TimePerf()
