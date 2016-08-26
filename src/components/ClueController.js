import rootRef from '../../newfirebase.js'
const usersRef = rootRef.ref('users');
const cluesRef = rootRef.ref('clues');
const huntsRef = rootRef.ref('hunts');

var User = require('./User').default
var Data = require('./Data');

class ClueController {
	static COMPLETE = "completed"
	static IN_PROGRESS = "in_progress"
	static LOCKED = "locked"


	// Hunt object must have id!
	constructor(hunt) {
		this.hunt = hunt



		// References
		this.userHuntRef = User.getCurrentUser().currentHunts.child(hunt.id);
		this.userHuntInfo = null
		this.huntCluesRef = huntsRef.child(hunt.id).child("clues");
		this.huntCluesIDs = null
		this.dataIsLoaded = false

		this.currentClueChangedListeners = []
		this.dataLoadedCallbacks = []
		this.userHuntCallbacks = []
		this.userHuntListeners = []

		this.clues = null
	}

	loadData() {
		console.log("ClueController loading data...")
		return new Promise((fullfill, reject) => {
			console.log("=> Loading user hunt info...");
			this.userHuntInfoListener().then(() => {
				console.log("===> Success!");
				console.log("=> Loading hunt clues...");
				this.getHuntCluesIDs().then((clueIDs) => {
					console.log("===> Success!");
					console.log("=> Loading clues...");
					this.loadClues(clueIDs).then((clues) => {
						console.log("===> Success!");

						// Remember this day!
						this.dataIsLoaded = true

						// Alert the waiters
						ClueController.performCallbacks(this.dataLoadedCallbacks, this)

						fullfill();
					}, (error) => {
						console.log("===> Error! " + error);
						reject(error);
					});
				}, (error) => {
					console.log("===> Error! " + error);
					reject(error);
				});
			}, (error) => {
				console.log("===> Error! " + error);
				console.log("=> Loading hunt clues...");
				this.getHuntCluesIDs().then((clueIDs) => {
					console.log("===> Success!");
					console.log("=> Loading clues...");
					this.loadClues(clueIDs).then((clues) => {
						console.log("===> Success!");

						// Remember this day!
						this.dataIsLoaded = true

						// Alert the waiters
						ClueController.performCallbacks(this.dataLoadedCallbacks, this)

						fullfill();
					}, (error) => {
						console.log("===> Error! " + error);
						reject(error);
					});
				}, (error) => {
					console.log("===> Error! " + error);
					reject(error);
				});
			});
		});
	}

	dataLoadAddCallback(callback) {
		if (callback != null && typeof callback == 'function') {
			if (this.dataIsLoaded && this.clues != null)
				callback(this)
			else
				this.dataLoadedCallbacks.push(callback)
		}
	}

	userHuntInfoListener() {
		return new Promise((fullfill, reject) => {
			this.userHuntRef.on('value', (snap) => {
				this.userHuntInfo = snap.val();

				if (this.userHuntInfo == null){
					reject();
					return;
				}

				if (this.clues != null)
					this.processClues();

				// This is for processes waiting for a single response
				ClueController.performCallbacks(this.userHuntCallbacks, snap.val());
				this.userHuntCallbacks = []

				console.log("Performing Callbacks...");
				ClueController.performCallbacks(this.userHuntListeners, snap.val());


				fullfill();
			})
		})
	}

	userHuntAddCallback(callback) {
		if (callback != null && typeof callback == 'function') {
			if (this.userHuntInfo)
				// We have loaded it, so no need to add a callback!
				callback(this.userHuntInfo)
			else
				// We have yet to load it, so we will save it for later
				this.userHuntCallbacks.push(callback);
		}
	}

	userHuntAddListener(listener) {
		if (listener != null && typeof listener == 'function')
			this.userHuntListeners.push(listener);
	}

	getHuntCluesIDs() {
		return new Promise((fullfill, reject) => {
			this.huntCluesRef.once("value", (snap) => {
				this.huntCluesIDs = snap.val()
				fullfill(this.huntCluesIDs);
			});
		});
	}

	loadClues(cluesIDs) {
		return new Promise((fullfill, reject) => {
			console.log("\tCompiling...");
			var promises = []
			var clues = []
			for (index in cluesIDs) {
				var id = cluesIDs[index];
				var i = 0;
				promises.push(new Promise(function (id, success, failure) {
					console.log("\tGetting clue: " + id + "...");
					Data.getClueWithID(id).then((clue) => {
						console.log("\tGot clue: " + id);
						clue.id = id;
						clue.index = i;
						i += 1;
						clues.push(clue);
						success();
					}, (error) => {
						failure();
					});
				}.bind(this, id)));
			}

			console.log("\tPerforming...");

			Promise.all(promises).then((result) => {
				console.log("\tDone");
				this.clues = clues;
				console.log("\tProcessing...");
				this.processClues()
				console.log("\tComplete");
				fullfill();
			})
		});
	}

	currentClueChangedListener(listener) {
		if (listener != null && typeof listener == 'function')
			this.userHuntListeners.push(listener)
	}

	// This function will only work if all the data is loaded
	getSubmission(clueObj) {
		var clue = this.clues[clueObj.index]
		var userID = User.getCurrentUser().uid;
		if (clue.submissions == null || clue.submissions.length == 0) {
			return ""
		}

		return clue.submissions[this.hunt.id + "|" + userID]
	}

	setSubmission(clueObj, submission) {
		var clue = this.clues[clueObj.index]

		console.log("=> Saving Submission...");
		if (clue.submissions == null)
			clue.submissions = {}

		console.log("===> Saving locally...")
		clue.submissions[this.hunt.id + "|" + User.getCurrentUser().uid] = submission

		console.log("===> Saving remotely...")
		return new Promise((fullfill, reject) => {
			cluesRef.child(clue.id).child('submissions').child(this.hunt.id + "|" + User.getCurrentUser().uid).set(submission).then(() => {
				console.log("===> Complete")
				fullfill();
			}, (error) => {
				console.log("===> Failed!")
				reject(error);
			});
		});
	}

	checkSolutions(clueObj) {
		var clue = this.clues[clueObj.index]

		var solutions = clue.solutions;
		var mySubmission = this.getSubmission(clue);
		for (solution in solutions) {
			if (solution.toLowerCase().trim() == mySubmission.toLowerCase().trim()) {
				return true;
			}
		}

		return false;
	}

	// Returns a boolean that states whether it was the last clue or not
	completeClue(clueObj) {
		var clue = this.clues[clueObj.index]


		return new Promise((fullfill, reject) => {
			if (!this.checkSolutions(clue))
				reject("The submission isn't correct!");


			clue.status = ClueController.COMPLETE;
			clue.updateNeeded = true;
			var index = this.clues.indexOf(clue);

			// Now I need to update the database
			var cluesCompleted = index + 1;

			if (index + 1 >= this.clues.length){
				this.completeHunt().then(() => {
					fullfill(true);
				});
			} else {
				nextClue = this.clues[index + 1];
				nextClue.status = ClueController.IN_PROGRESS;
				nextClue.updateNeeded = true;

				this.userHuntRef.set({
					cluesCompleted: cluesCompleted,
					currentClue: nextClue.id
				}).then(() => {
					fullfill(false);
				}, (error) => {
					console.log(error);
				})
			}
		});
	}

	huntIsComplete() {
		for (index in this.clues) {
			var clue = this.clues[index];

			if (clue.status != ClueController.COMPLETE) {
				return false
			}
		}
		return true
	}

	completeHunt() {
		return new Promise((fullfill, reject) => {
			console.log("=> Completing hunt...")

			console.log("===> Removing hunt from current...")
			this.userHuntRef.remove(() => {
				console.log("===> Done")
				console.log("===> Adding hunt to completed...")
				User.currentUser.completedHunts.child(this.hunt.id).once('value', (snap) => {
					if (snap.val() == null) {
						
					}
				})
			});
		});
	}

	processClues() {
		console.log("\t\tProcessing clues...")
		var currentClueID = this.userHuntInfo.currentClue
		console.log("\t\tCurrent clue is: " + currentClueID)
		var foundCurrent = false
		for (index in this.clues) {
			var clue = this.clues[index];

			console.log("\t\tProcessing " + clue.id + "...")
			if (clue.id == currentClueID) {
				// Then this is the current clue.
				clue.updateNeeded = clue.status != ClueController.IN_PROGRESS

				clue.status = ClueController.IN_PROGRESS
				console.log("\t\tFound current. Updating clues completed");
				this.userHuntRef.child('cluesCompleted').set(index)
				foundCurrent = true
			}else{
				clue.updateNeeded = clue.status != (!foundCurrent ? ClueController.COMPLETE : ClueController.LOCKED)

				clue.status = !foundCurrent ? ClueController.COMPLETE : ClueController.LOCKED
			}
			console.log("\t\tMarking " + clue.status)
		}
	}


	static performCallbacks(callbackArray, argument) {
		return new Promise((fullfill, reject) => {
			if (callbackArray == null) {
				reject()
				return;
			}

			for (index in callbackArray) {
				callback = callbackArray[index];
				callback(argument);
			}
			fullfill();
		})
	}
}


export default ClueController;