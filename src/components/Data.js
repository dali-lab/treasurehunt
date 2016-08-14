const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js';
const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');

const SEARCH_WITH_SERVER = false;


/**====== SEARCHING =====**/
// Set the configuration for your app
// TODO: Replace with your project's config object

// TODO: Replace this with the path to your ElasticSearch queue
// TODO: This is monitored by your app.js node script on the server
// TODO: And this should match your seed/security_rules.json
var PATH = "search";
/**====== /SEARCHING =====**/

/*
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
*/

export function getHuntWithID(id) {
	var ref = huntsRef.child(id);

	return new Promise((fulfill, reject) => {
		ref.once('value', function(snapshot) {
			if (snapshot.val() == null) {
				reject()
			}

			fulfill(snapshot.val());
		}, function (errorObject) {
			reject(errorObject);
		})
	})
}

// Returns a promise the gives all the hunt objects as an array
export function getHuntObjects(hunt_ids) {

	console.log("Starting to load hunt objects");
	return new Promise((fulfill, reject) => {
		var hunts = [];

		if (hunt_ids == null) {
			console.log("No hunts");
			fulfill(hunts);
			return;
		}

		// To keep track of asyncronous task
		var complete = 0;
		var todo = Object.keys(hunt_ids).length;

	    for (var key in hunt_ids) {
	    	var contents = hunt_ids[key];
	        //get that hunt, calculate user progress, get hunt data

	        getHuntWithID(key).then((function(key, hunt) {
	        	// We have a hunt
	        	console.log(key, hunt);

	        	// Now lets get the total clues
	        	var totalCluesInHunt = hunt.clues.length;
	        	var totalCluesCompleted = contents.cluesComplete;

	        	hunts.push({
	                id: key,
	                title: hunt.name,
	                description: hunt.desc,
	                image: hunt.image,
	                progress: totalCluesCompleted/totalCluesInHunt,
	                clues: hunt.clues,
	                hunt: hunt
	            });

							console.log(hunt.name);

	        	complete += 1;

	        	if (complete >= todo) {
	        		fulfill(hunts);
	        	}
	        }).bind(undefined, key), function(error) { // Rejected!
	        	todo = todo - 1;
	        })

	//         this.setState({
	//             dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHuntsArrayToMap(hunts))
	//         });
			// ^ I dont know what this is does?
	    }
	});
}

function manualSearch(query) {
	var hunt_ids = [];

	return new Promise((success, failure) => {
		huntsRef.once('value', function(snap) {
			for (var key in snap.val()) {
				const hunt = snap.val()[key];
				if (key.toLowerCase().indexOf(query.toLowerCase()) == 0 || hunt.name.toLowerCase().includes(query.toLowerCase())) {
					hunt_ids.push({key: key, hunt: hunt});
				}
			}

			success(hunt_ids);
		}, function(error) {
			failure(error);
		})
	});
}

function serverSearch(query) {

}

export function search(query) {
	return (SEARCH_WITH_SERVER ? serverSearch(query) : manualSearch(query));
}
