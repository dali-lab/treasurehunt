const Firebase = require('firebase');
var ref = new Firebase("https://treasurehuntdali.firebaseio.com/");
const config = require('../../config')
const usersRef = new Firebase("https://treasurehuntdali.firebaseio.com/users")

class User {
	static currentUser = null;

	// No one but this class should make user objects
	constructor(authData, userRef, email) {
		this.uid = authData.uid;
		this.provider = authData.provider;
		this.token = authData.token;
		this.auth = authData.auth;
		this.email = email;
		this.authData = authData;
		this.userRef = userRef;
		this.huntList = userRef.child("currentHunts");
	}

	static getCurrentUser() {
		return this.currentUser;
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

				var user = new User(authData, userObject, email);
				User.currentUser = user;
				callBack(error, user);
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
				userObject.set({
					email: email,
					currentHunts: [],
					completedHunts: [],
					name: "",
				});

				var user = new User(authData, userObject, email);
				User.currentUser = user;
				callBack(error, user);
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
		console.log("Starting to get...");
		console.log(this.usersRef);
		return new Promise((fulfill, reject) => {
			this.hunts_list.once('value', function(snap) {
				if (snap.val() == NSNull) {
					console.log("hunts list is null!");
					reject(NSNull);
				}else{
					console.log("fulfilling")
					fulfill(snap.exportVal());
				}
			}, function(error) {
				console.log("getHuntsList: something went wrong!");
				reject(error);
			});
			console.log("something happened");
		});
	}
}

export default User;