const Firebase = require('firebase');
const ref = new Firebase("https://treasurehuntdali.firebaseio.com/");
const config = require('../../config')
const usersRef = new Firebase("https://treasurehuntdali.firebaseio.com/users")
const React = require('react-native');

var {
  AsyncStorage
} = React;

const USER_STORAGE_KEY = '@TreasureHunt:userObject'

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
	}

	static getCurrentUser() {
		if (this.currentUser === null) {
			User.updateCurrentUserFromStore()
		}
		return this.currentUser;
	}

	static updateCurrentUserFromStore() {
		console.log("Updating user from store...");
		try {
			console.log("Got something...");
			var value = AsyncStorage.getItem(USER_STORAGE_KEY);
			console.log("It is: " + value);
			if (value !== null) {
				console.log("Made a user!");
				this.currentUser = User(value);
			}else{
				console.log("It was null :(");
				this.currentUser = null;
			}
		}catch (error) {
			console.log("Failed!");
			return;
		}
	}

	static updateUserInStore() {
		// Method from Documentation on AsyncStorage
		console.log("Updating user to store...");
		try {
			console.log("Saving " + User.getCurrentUser().uid + " ...");
		  AsyncStorage.setItem(USER_STORAGE_KEY, User.getCurrentUser().uid);
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
}

export default User;
