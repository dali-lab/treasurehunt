const Firebase = require('firebase');
import rootRef from '../../newfirebase.js';
// const ref = new Firebase("https://treasurehuntdali.firebaseio.com/");
const config = require('../../config')

const usersRef = rootRef.ref('users');
// const usersRef = new Firebase("https://treasurehuntdali.firebaseio.com/users")
const React = require('react-native');
const {FBLoginManager} = require('react-native-facebook-login');


// const USER_EMAIL_KEY = '@TreasureHunt:email';
const USER_DATA_KEY = 'user_data';

var {
	AsyncStorage,
} = React;


class User {
	static currentUser = null;

	/**
	 * This constructs a user object
	 * Usage: new User(firebase.User)
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

		console.log(Firebase.auth().currentUser);

		if (Firebase.auth().currentUser) {
			return new User(Firebase.auth().currentUser);
		}

		return null;
	}

	static FBonLogin(data) {
		var id = data.credentials.userId;
		console.log(data);

		var user = new User(null, {
			id: id,
			email: "",
			providerId: "facebook.com",
			name: "",
		});

		user.dataRef.on("value", (snapshot) => {
			if (!snapshot.hasChild("currentHunts")) {
				console.log("initializing new user");
				user.initializeNewUser();
			}
		});

		User.currentUser = user;

		return user;
	}

	static loadUserFromStore() {
		console.log("Loading user...");
		return new Promise(async (success, failure) => {
			try {
				const user_data_json = await AsyncStorage.getItem(USER_DATA_KEY);

				if (user_data_json) {
					// Got a token back
					var myUser = new User(JSON.parse(user_data_json), null);
					User.currentUser = myUser
					console.log("Loaded user!");
					success(myUser);
				}else{
					console.log("Loaded null!");
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
		console.log("Saving user...");
		return new Promise(async (success, failure) => {	
			if (this.currentUser.isFacebook()) {
				failure("Type is facebook. Cannot save!");
				return;
			}

			try {
				await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user_data));
				console.log("Saved user!");
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
		console.log("Attempting to log in");
		return new Promise((fulfill, reject) => {
			// if (Firebase.auth().currentUser) {
			// 	reject("Failed to login! There is already a user!!!!");
			//	return;
			// }

			Firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
				// We have lift off!
				var myUser = new User(user, null);
				// The Eagle has landed!
				console.log("Logged in with user: " + myUser);

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
				console.log("Signing up!");

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

	logout() {
		return new Promise((success, failure) => {
			if (this.isFacebook()) {
				FBLoginManager.logout((error, data) => {
					if (!error) {
						console.log("Logged out!");
						success();
					}else{
						console.log("Failed to logout!");
						failure();
					}
				});
			}else{
				Firebase.auth().signOut().then(() => {
					// Completed!
					console.log("Logged out!");
					AsyncStorage.removeItem(USER_PASSWORD_KEY);
					success();
				}, (error) => {
					console.log("Failed to log out!");
					failure(error);
				});
			}
		});
	}












































	// static currentUser = null;

	// No one but this class should make user objects
	// constructor(uid) {
	// 	this.uid = uid;
	// 	this.isFacebook = false;
	// }

	// buildWithData(authData, userRef, email) {
	// 	console.log(authData);
	// 	this.uid = authData.uid;
	// 	this.provider = authData.provider;
	// 	this.token = authData.token;
	// 	this.auth = authData.auth;
	// 	this.authData = authData;
	// 	this.buildWithData2(userRef, email);
	// }

	// buildWithData2(userRef, email) {
	// 	this.email = email;
	// 	this.userRef = userRef;
	// 	this.currentHunts = userRef.child("currentHunts");
	// }

	// static initializeNewUser(id, email) {
	// 	// var userObject = usersRef.child(id);
	// 	// userObject.set({
	// 	// 	email: email,
	// 	// 	currentHunts: [],
	// 	// 	completedHunts: [],
	// 	// 	name: "",
	// 	// });

	// 	// var user = new User(id);
	// 	// user.buildWithData2(userObject, email);

	// 	// return user;
	// }

	// static updateCurrentUserFromStore() {
	// 	// console.log("Updating user from store...");
	// 	// return new Promise(async (fulfill, reject) => {	
	// 	// 	try {
	// 	// 		const value = await AsyncStorage.getItem(USER_STORAGE_KEY)
	// 	// 		console.log("Got something...");

	// 	// 		if (value !== null) {
	// 	// 			console.log("It was: " + value);
	// 	// 			User.currentUser = new User(value);
	// 	// 			User.currentUser.setUpRefs(usersRef.child(value));
	// 	// 			console.log("Set User... fulfilling");
	// 	// 			fulfill(User.getCurrentUser());
	// 	// 		}else{
	// 	// 			reject(null);
	// 	// 			console.log("It was null")
	// 	// 		}
	// 	// 	}catch (error) {
	// 	// 		// console.log("Failed! with error " + error);
	// 	// 		reject();
	// 	// 	}
	// 	// });
	// }

	// static async updateUserInStore() {
	// 	// Method from Documentation on AsyncStorage
	// 	// console.log("Updating user to store...");
	// 	// try {
	// 	// 	console.log("Saving " + User.getCurrentUser().uid + " ...");
	// 	//   	// UserDefaults.setObjectForKey(User.getCurrentUser(), USER_STORAGE_KEY)
	// 	//   	// 	.then(result => {
	// 	//   	// 		console.log(result);
	// 	//   	// 	});

	// 	// 	await AsyncStorage.setItem(USER_STORAGE_KEY, User.getCurrentUser().uid)
	// 	// 	console.log("Complete!");
	// 	// } catch (error) {
	// 	// 	console.log("Failed!!");
	// 	//   // Error saving data
	// 	// 	console.log("AsyncStorage error: " + AsyncStorage);
	// 	// }
	// }

	// /**
	// 	This function authenticates a user, and will call the callBack when done
	// 	callBack = function(error, user)
	// */
	// static getUser(email, password, callBack) {
	// 	// Firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error, authData) {
	// 	// 	if (error) {
	// 	// 		callBack(error, null);
	// 	// 	}else{
	// 	// 		// Get user object
	// 	// 		var userObject = usersRef.child(authData.uid);
	// 	// 		console.log(authData.uid)

	// 	// 		var user = new User(authData.uid);
	// 	// 		user.buildWithData(authData, userObject, email);
	// 	// 		User.currentUser = user;
	// 	// 		callBack(error, user);
	// 	// 		User.updateUserInStore();
	// 	// 	}
	// 	// });
	// }

	// static FBonLogin(data) {
	// 	// var id = data.credentials.userId;
	// 	// console.log(data);


	// 	// User.currentUser = User.initializeNewUser(id, id);
	// 	// User.updateUserInStore();
	// 	// User.currentUser.isFacebook = true;
	// 	// User.currentUser.data = data;
	// 	// return User.currentUser;
	// }

	// static logout() {
	// 	// if (!User.currentUser) {
	// 	// 	return;
	// 	// }

	// 	// if (User.currentUser.isFacebook) {
	// 	// 	console.log("Trying to log out of facebook");
	// 	// 	FBLoginManager.logout(() => {
	// 	// 		User.currentUser = null;
	// 	// 		AsyncStorage.removeItem(USER_STORAGE_KEY);
	// 	// 	});
	// 	// }else{
	// 	// 	firebase.auth().signOut().then(function() {
	// 	// 		// Sign-out successful.
	// 	// 		User.currentUser = null;
	// 	// 		AsyncStorage.removeItem(USER_STORAGE_KEY);
	// 	// 	}, function(error) {
	// 	// 		// An error happened.
	// 	// 		console.log("Failed to sign out!!");
	// 	// 	});
	// 	// }
	// }

	// /**
	// 	This function creates a user, and will call the callBack when done
	// 	callBack = function(errorMessage, user)
	// */
	// static signUp(email, password, callBack) {
	// 	Firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {



	// 	}).catch(function(error) {
	// 		// Handle Errors here.
	// 		var errorCode = error.code;
	// 		var errorMessage = error.message;
	// 		// ...
	// 		callBack(errorMessage, null);
	// 	});

	// 	// Firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error, authData) {
	// 	// 	if (error) {
	// 	// 		callBack(error, null);
	// 	// 	}else{
	// 	// 		// Make new user object
	// 	// 		var userObject = usersRef.child(authData.uid);
	// 	// 		console.log(authData.uid)
	// 	// 		userObject.set({
	// 	// 			email: email,
	// 	// 			currentHunts: [],
	// 	// 			completedHunts: [],
	// 	// 			name: "",
	// 	// 		});

	// 	// 		var user = new User(authData.uid);
	// 	// 		user.buildWithData(authData, userObject, email);
	// 	// 		User.currentUser = user;
	// 	// 		callBack(error, user);
	// 	// 		User.updateUserInStore();
	// 	// 	}
	// 	// });
	// }

	// /**
	// 	This sends a reset email to the email, and will call the callBack when done
	// 	callBack = function(error)
	// */
	// static sendResetEmail(email, callBack) {
	// 	// Firebase.auth().resetPassword({
	// 	// 	email: email
	// 	// }, function(error) {
	// 	// 	callBack(error);
	// 	// });
	// }

	getHuntsList() {
		return new Promise((fulfill, reject) => {
			this.currentHunts.once('value', function(snap) {
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
}

export default User;
