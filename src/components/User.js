const Firebase = require('firebase');
var ref = new Firebase("https://incandescent-torch-4551.firebaseio.com/");

class User {
	// No one but this class should make user objects
	constructor(authData) {
		this.uid = authData.uid;
		this.provider = authData.provider;
		this.token = authData.token;
		this.auth = authData.auth;
		this.email = authData.password.email;
		this.authData = authData;
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
				var user = new User(authData);
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
				var user = new User(authData);
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
}

export default User;