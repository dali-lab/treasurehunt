const Firebase = require('firebase');
import rootRef from '../../newfirebase.js';
// const ref = new Firebase("https://treasurehuntdali.firebaseio.com/");
const config = require('../../config')

const usersRef = rootRef.ref('users');
// const usersRef = new Firebase("https://treasurehuntdali.firebaseio.com/users")
const ReactNative = require('react-native');
const {FBLoginManager} = require('react-native-facebook-login');
const Data = require('./Data');
const cluesRef = rootRef.ref('clues');


// const USER_EMAIL_KEY = '@TreasureHunt:email';
const USER_DATA_KEY = 'user_data';

var {
	AsyncStorage,
} = ReactNative;


class User {
	static currentUser = null;
	static startingHunt = null;
	static startingHuntCallback = null;

	/**
	 * This constructs a user object
	 * Usage: new User(firebase.User, null) or new User(null, {
	 	id: String,
	 	email: String,
	 	providerId: String,
	 	name: String or null
	 * })
	 */
	constructor(firebaseUser, otherData) {
		if (firebaseUser) {

			this.firebaseUser = firebaseUser;
			this.email = firebaseUser.email;
			this.name = firebaseUser.displayName;
			this.emailVerified = firebaseUser.emailVerified;
			this.providerId = firebaseUser.providerId;

			this.uid = firebaseUser.uid;
		}else if (otherData) {
			this.firebaseUser = null;
			this.uid = otherData.id;
			this.email = otherData.email;
			this.providerId = otherData.providerId;
			this.emailVerified = true;
			this.name = otherData.name || "";
		}

		this.token = null;

		this.dataRef = usersRef.child(this.uid);
		this.currentHunts = this.dataRef.child("currentHunts");
		this.completedHunts = this.dataRef.child("completedHunts");

		console.log("My user id: " + this.uid);
	}

	// A function for when a user has just been created. It fills the user with empty data tables
	initializeNewUser() {
		this.dataRef.set({
			email: this.email,
			name: this.name || "",
		});
	}

	// Each passed function MUST implment the snap system of firebase
	setUpListeners(userHuntDataUpdated, userDataUpdated) {
		if (userHuntDataUpdated !== null) {
			this.currentHunts.on('value', userHuntDataUpdated, () => {});
			this.userHuntDataUpdated = userHuntDataUpdated;
		}else if (this.userHuntDataUpdated !== null && this.userHuntDataUpdated !== undefined) {
			this.currentHunts.off('value', this.userHuntDataUpdated);
			this.userHuntDataUpdated = null;
		}

		if (userDataUpdated !== null) {
			this.dataRef.on('value', userDataUpdated, () => {});
			this.userDataUpdated = userDataUpdated;
		}else if (this.userDataUpdated !== null && this.userDataUpdated !== undefined) {
			this.currentHunts.off('value', this.userDataUpdated);
			this.userDataUpdated = null;
		}
	}

	cancelListeners() {
		setUpListeners(null, null);
	}

	isFacebook() {
		return this.firebaseUser == null;
	}

	static getCurrentUser() {
		if (User.currentUser) {
			return User.currentUser;
		}

		if (Firebase.auth().currentUser) {
			return new User(Firebase.auth().currentUser);
		}
		
		return null;
	}

	static FBonLogin(data) {
		var id = data.credentials.userId;

		var user = new User(null, {
			id: id,
			email: "",
			providerId: "facebook.com",
			name: "",
		});

		user.dataRef.once("value", (snapshot) => {
			if (!snapshot.hasChild("email")) {
				user.initializeNewUser();
			}
		});

		User.currentUser = user;

		return user;
	}

	static loadUserFromStore() {
		return new Promise(async (success, failure) => {
			try {
				const user_data_json = await AsyncStorage.getItem(USER_DATA_KEY);

				if (user_data_json) {
					// Got a token back
					var myUser = new User(JSON.parse(user_data_json), null);
					Firebase.auth().currentUser = JSON.parse(user_data_json);
					User.currentUser = myUser
					success(myUser);
				}else{
					User.currentUser = null;
					success(null);
				}
			} catch(error) {
				console.log("Failed to get user: " + error);
				failure("Failed to get user: " + error);
			}
		});
	}

	static saveUser(user_data) {
		return new Promise(async (success, failure) => {	
			if (this.currentUser.isFacebook()) {
				failure("Type is facebook. Cannot save!");
				return;
			}

			try {
				await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user_data));
				success();
			} catch(error) {
				failure("Error saving user: " + error);
			}
		});
	}

	/**
	 * Returns a promise with a non-null User
	 */
	static login(email, password) {
		return new Promise((fulfill, reject) => {
			// if (Firebase.auth().currentUser) {
			// 	reject("Failed to login! There is already a user!!!!");
			//	return;
			// }
			if (email == "") {
				reject({message: "You need to input an email"});
				return;
			}
			if (password == "") {
				reject({message: "You need to input your password"});
				return;
			}


			Firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
				// We have lift off!
				var myUser = new User(user, null);
				// The Eagle has landed!

				User.currentUser = myUser;
				User.saveUser(user);
				fulfill(myUser);
			}).catch(function(error) {
				console.log("Failed to login with error message: '" + error.message + "' and error: " + error);
				reject(error);
			});
		});
	}

	static signUp(email, password) {
		return new Promise((fulfill, reject) => {
			// if (Firebase.auth().currentUser) {
			// 	reject("Failed to sign up! There is already a user!!!!");
			//	return;
			// }

			Firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
				// We have lift off!
				var myUser = new User(user, null);
				// The Eagle has landed!

				User.currentUser = myUser;
				myUser.initializeNewUser();
				User.saveUser(user);
				fulfill(myUser);
			}).catch(function(error) {
				console.log("Failed to login with error message: '" + error.message + "' and error: " + error);
				reject(error);
			});
		});
	}

	static resetPassword(email) {
		return Firebase.auth().sendPasswordResetEmail(email);
	}

	static logout() {
		if (User.currentUser)
			return User.currentUser.logout();
		return null
	}

	hasHuntCurrent(hunt) {
		return new Promise((fulfill, reject) => {
			this.getHuntsList().then((huntsList) => {
				fulfill(huntsList != null && huntsList[hunt.id] != null);
			}, (error) => {
				reject(error);
			});
		});
	}

	addHunt(hunt) {
		return new Promise((fulfill, reject) => {
			this.hasHuntCurrent(hunt).then((flag) => {
				if (!flag) {
					console.log("-> The user doesn't have the hunt at the moment");
					Data.getHuntWithID(hunt.id).then((huntData) => {

						console.log("-> Got the hunt");
						var firstClue = huntData.clues[0];
						this.currentHunts.child(hunt.id).set({
							cluesCompleted: 0,
							currentClue: firstClue
						});
						console.log("-> ... And added it");


						console.log("-> Compiling submission clearing promises");
						var promises = []
						for (index in huntData.clues) {
							var clueID = huntData.clues[index];
							var ref = cluesRef.child(clueID).child("submissions").child(hunt.id + "|" + this.uid);
							promises.push(new Promise((success, failure) => {
								console.log("REMOVING... ref " + ref);
								ref.remove((error) => {
									console.log("Done removing", error);
									success();
								})
							}));
						}

						console.log("-> Performing submission clearing promises");
						Promise.all(promises).then(() => {
							console.log("Done removing all of them!");
							fulfill();
						}, (error) => {
							console.log("Encountered error when clearing submissions: ", error);
							fulfill();
						});
					}, (error) => {
						reject(error);
					});
				}else{
					reject("Already have that hunt!");
				}
			}, (error) => {
				reject(error);
			});
		});
	}

	addStartingHunt() {
		console.log("Adding starting hunt...");
		return this.addHunt(User.startingHunt);
	}

	removeHunt(hunt) {
		return new Promise((fulfill, reject) => {
			this.hasHuntCurrent(hunt).then((flag) => {
				if (flag) {
					this.currentHunts.child(hunt.id).remove();
					fulfill();
				}else{
					reject("User does not have that hunt");
				}
			}, (error) => {
				reject(error);
			});
		});
	}

	logout() {
		return new Promise((success, failure) => {
			if (this.isFacebook()) {
				FBLoginManager.logout((error, data) => {
					if (!error) {
						success();
					}else{
						failure();
					}
				});
			}else{
				Firebase.auth().signOut().then(() => {
					// Completed!
					AsyncStorage.removeItem(USER_DATA_KEY);
					success();
				}, (error) => {
					failure(error);
				});
			}
		});
	}

	getHuntsList() {
		return new Promise((fulfill, reject) => {
			this.currentHunts.once('value', function(snap) {
				fulfill(snap.val());
			}, function(error) {
				reject(error);
			});
		});
	}

	// This whole function 7/21/16 AES
	getCompletedHuntsList() {
		return new Promise((fulfill, reject) => {
			this.completedHunts.once('value', function(snap) {
				if (snap.val() == null) {
					reject();
				}else{
					fulfill(snap.exportVal());
				}
			}, function(error) {
				reject(error);
			});
		});
	}
	// end of function 7/21/16 AES

	static getStartingHuntID() {
		rootRef.ref('startingHunt').once('value', (snap) => {
			Data.getHuntWithID(snap.val()).then(function (key, hunt) {
				hunt.id = key
				User.startingHunt = hunt
				if (User.startingHuntCallback != null && typeof User.startingHuntCallback == 'function') {
					User.startingHuntCallback(hunt);
				}
				User.startingHuntCallback = null;
			}.bind(undefined, snap.val()), (error) => {
				console.log("--- Encountered error getting starting hunt! " + error);
			})
		})
	}

	static setStartingHuntCallback(callback) {
		if (User.startingHunt != null) {
			callback(User.startingHuntCallback);
		}else{
			User.startingHuntCallback = callback
		}
	}
}

export default User;
