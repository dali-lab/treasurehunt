const Firebase = require('firebase');
import rootRef from '../../newfirebase.js';
// const ref = new Firebase("https://treasurehuntdali.firebaseio.com/");
const config = require('../../config')

const usersRef = rootRef.ref('users');
// const usersRef = new Firebase("https://treasurehuntdali.firebaseio.com/users")
const React = require('react-native');
const {FBLoginManager} = require('react-native-facebook-login');
const Data = require('./Data');


// const USER_EMAIL_KEY = '@TreasureHunt:email';
const USER_DATA_KEY = 'user_data';
const startingHuntID = 'hgieyty6';

var {
	AsyncStorage,
} = React;


class User {
	static currentUser = null;

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
	}

	// A function for when a user has just been created. It fills the user with empty data tables
	initializeNewUser() {
		this.dataRef.set({
			email: this.email,
			currentHunts: [],
			completedHunts: [],
			name: this.name || "",
			Feed: [],
			friends: [],
		});
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

		user.dataRef.on("value", (snapshot) => {
			if (!snapshot.hasChild("currentHunts")) {
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
		return User.currentUser.logout();
	}

	hasHuntCurrent(hunt) {
		return new Promise((fulfill, reject) => {
			this.getHuntsList().then((huntsList) => {
				fulfill(huntsList != null && huntsList[hunt.id] != undefined);
			}, (error) => {
				reject(error);
			});
		});
	}

	addHunt(hunt) {
		return new Promise((fulfill, reject) => {
			this.hasHuntCurrent(hunt).then((flag) => {
				if (!flag) {
					Data.getHuntWithID(hunt.id).then((hunt2) => {
						var firstClue = hunt2.clues[0];
						this.currentHunts.child(hunt.id).set({
							cluesCompleted: 0,
							currentClue: firstClue
						});
						fulfill();
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
		return this.addHunt({id: startingHuntID});
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
}

export default User;
