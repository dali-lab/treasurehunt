const Firebase = require('firebase')
const config = require('../../config')
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)


function getHuntWithID(id) {
	var ref = huntsRef.child(id);

	return new Promise((fulfill, reject) => {
		ref.once('value', function(snapshot) {
			fulfill(snapshot.val());
		}, function (errorObject) {
			reject(errorObject);
		})
	})
}

// Returns a promise the gives all the hunt objects as an array
function getHuntObjects(hunt_ids) {

	return new Promise((fulfill, reject) => {
		var hunts = [];

		// To keep track of asyncronous task
		var complted = 0;
		var todo = hunt_ids.length

	    for (var key in hunt_ids) {
	    	var contents = hunt_ids[key]
	        //get that hunt, calculate user progress, get hunt data

	        getHuntWithID(key).then(function(hunt) {
	        	// We have a hunt

	        	// Now lets get the total clues
	        	var totalCluesInHunt = hunt.clues.length
	        	var totalCluesCompleted = contents.cluesComplete

	        	hunts.push({
	                id: key,
	                title: hunt.title,
	                description: hunt.description,
	                image: hunt.image,
	                progress: totalCluesCompleted/totalCluesInHunt,
	                clues: hunt.clues,
	                hunt: hunt
	            });

	        	complete += 1

	        	if (complete >= todo) {
	        		fulfill(hunts)
	        	}
	        }, { // Rejected!
	        	todo -= 1
	        })

	//         this.setState({
	//             dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHuntsArrayToMap(hunts))
	//         });
			// ^ I dont know what this is does?
	    }
	});
}