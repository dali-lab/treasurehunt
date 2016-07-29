var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyBFr1BC7KCuOGfntwBL3LTnhkK0K-I6AE8",
  authDomain: "treasurehuntdali.firebaseapp.com",
  databaseURL: "https://treasurehuntdali.firebaseio.com",
  storageBucket: "treasurehuntdali.appspot.com"
};

 firebase.initializeApp(config);

var rootRef = firebase.database();

 module.exports = rootRef
