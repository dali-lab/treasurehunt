const Firebase = require('firebase');
import rootRef from '../../newfirebase.js';
// const ref = new Firebase("https://treasurehuntdali.firebaseio.com/");
const config = require('../../config')

const usersRef = rootRef.ref('users');
// const usersRef = new Firebase("https://treasurehuntdali.firebaseio.com/users")
const React = require('react-native');

const USER_STORAGE_KEY = '@TreasureHunt:userObject'

var {
	AsyncStorage,
} = React;

// var UserDefaults = require('react-native-userdefaults-ios');

class User {
	static currentUser = null;

	// No one but this class should make user objects
	constructor(uid) {
		this.uid = uid;
	}

	buildWithData(authData, userRef, email) {
		this.uid = authData.uid;
		this.provider = authData.provider;
		this.token = authData.token;
		this.auth = authData.auth;
		this.email = email;
		this.authData = authData;
		this.userRef = userRef;
		this.currentHunts = userRef.child("currentHunts");
		this.completedHunts = userRef.child("completedHunts");  // 7/21/16 AES
	}

	setUpRefs(userRef) {
		this.userRef = userRef;
		this.currentHunts = userRef.child("currentHunts");
		this.completedHunts = userRef.child("completedHunts");  // 7/21/16 AES
	}

	static async logout() {
		this.currentUser = null;
		try {
			console.log("Logging out...");
			await AsyncStorage.removeItem(USER_STORAGE_KEY);
			console.log("Logged out!");
		}catch (error) {
			console.log("Failed to logout!");
		}
	}

	static getCurrentUser() {
		return this.currentUser;
	}

	static updateCurrentUserFromStore() {
		console.log("Updating user from store...");
		return new Promise(async (fulfill, reject) => {
			try {
				const value = await AsyncStorage.getItem(USER_STORAGE_KEY)
				console.log("Got something...");

				if (value !== null) {
					console.log("It was: " + value);
					User.currentUser = new User(value);
					User.currentUser.setUpRefs(usersRef.child(value));
					console.log("Set User... fulfilling");
					fulfill(User.getCurrentUser());
				}else{
					reject(null);
					console.log("It was null")
				}
			}catch (error) {
				// console.log("Failed! with error " + error);
				reject();
			}
		});
	}

	static async updateUserInStore() {
		// Method from Documentation on AsyncStorage
		console.log("Updating user to store...");
		try {
			console.log("Saving " + User.getCurrentUser().uid + " ...");
		  	// UserDefaults.setObjectForKey(User.getCurrentUser(), USER_STORAGE_KEY)
		  	// 	.then(result => {
		  	// 		console.log(result);
		  	// 	});

			await AsyncStorage.setItem(USER_STORAGE_KEY, User.getCurrentUser().uid)
			console.log("Complete!");
		} catch (error) {
			console.log("Failed!!");
		  // Error saving data
			console.log("AsyncStorage error: " + AsyncStorage);
		}
	}

	/**
		This function authenticates a user, and will call the callBack when done
		callBack = function(error, user)
	*/
	static getUser(email, password, callBack) {
		ref.authWithPassword({
			email: email,
			password: password
		}, function(error, authData) {
			if (error) {
				callBack(error, null);
			}else{
				// Get user object
				var userObject = usersRef.child(authData.uid);
				console.log(authData.uid)

				var user = new User(authData.uid);
				user.buildWithData(authData, userObject, email);
				User.currentUser = user;
				callBack(error, user);
				User.updateUserInStore();
			}
		});
	}

	/**
		This function creates a user, and will call the callBack when done
		callBack = function(error, user)
	*/
	static signUp(email, password, callBack) {
		ref.createUser({
			email: email,
			password: password
		}, function(error, authData) {
			if (error) {
				callBack(error, null);
			}else{
				// Make new user object
				var userObject = usersRef.child(authData.uid);
				console.log(authData.uid)
				userObject.set({
					email: email,
					currentHunts: [],
					completedHunts: [],
					name: "",
				});

				var user = new User(authData.uid);
				user.buildWithData(authData, userObject, email);
				User.currentUser = user;
				callBack(error, user);
				User.updateUserInStore();
			}
		});
	}

	/**
		This sends a reset email to the email, and will call the callBack when done
		callBack = function(error)
	*/
	static sendResetEmail(email, callBack) {
		ref.resetPassword({
			email: email
		}, function(error) {
			callBack(error);
		});
	}

	getHuntsList() {
		return new Promise((fulfill, reject) => {
			this.currentHunts.once('value', function(snap) {
				if (snap.val() == null) {
					reject(NSNull);
				}else{
					fulfill(snap.exportVal());
				}
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
					reject(NSNull);
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
