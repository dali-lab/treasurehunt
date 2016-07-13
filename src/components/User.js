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
		this.huntList = userRef.child("hunts_list");
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
					hunts_list: {},
					completedHunts: {},
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

	/**
	 * Gets the hunts reference for the current user
	 */
	getHuntsRef() {
		return this.hunts_list
	}

	getHuntsList() {
		return new Promise((fulfill, reject) => {
			this.getHuntsRef().once('value', (snap) => {
				if (snap.val() == NSNull) {
					reject()
				}else{
					fulfill(snap.exportVal())
				}
			}, (error) => {
				reject()
			})
		})
	}
}

export default User;