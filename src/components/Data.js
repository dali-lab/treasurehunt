const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js';
const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');


/*
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
*/

function getHuntWithID(id) {
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

	        getHuntWithID(key).then(function(hunt) {
	        	// We have a hunt

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

	        	complete += 1;

	        	if (complete >= todo) {
	        		fulfill(hunts);
	        	}
	        }, function(error) { // Rejected!
	        	todo = todo - 1;
	        })

	//         this.setState({
	//             dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHuntsArrayToMap(hunts))
	//         });
			// ^ I dont know what this is does?
	    }
	});
}

export function search(query) {
	var hunt_ids = [];

	return new Promise((success, failure) => {
		huntsRef.once('value', function(snap) {
			console.log("Got " + JSON.stringify(snap.val()));
			for (var key in snap.val()) {
				const hunt = snap.val()[key];
				console.log("Searching hunt: " + JSON.stringify(hunt));
				if (key.includes(query) || hunt.name.includes(query)) {
					hunt_ids.push({key: key, name: hunt.name});
				}
			}

			console.log("Searched and found: " + JSON.stringify(hunt_ids));

			success(hunt_ids);
		}, function(error) {
			failure(error);
		})
	});
}
