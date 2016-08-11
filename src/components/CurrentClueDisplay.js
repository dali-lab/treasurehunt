var React = require('react-native');
var Modal   = require('react-native-modalbox');
var User = require('./User').default

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
	Alert,
	TextInput,
	Dimensions
} = React;

var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30,
		flex: 1,
	},
	huntTitle: {
		fontSize: 20,
		margin: 10,
		color: '#656565',
		alignSelf: 'center'
	},
    topSeparator: {
        height: 2,
        backgroundColor: '#5da990'
    },
	separatorSmall: {
		height: 16,
	},
	separatorLarge: {
		height: 26,
	},
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    clueName: {
        fontSize: 20,
        color: '#000000',
        fontStyle: 'italic'
    },
    modal: {
	    height: 300,
	    width: 300,
  	},
  	btn: {
	    margin: 10,
	    backgroundColor: "#3B5998",
	    color: "white",
	    padding: 10,
  	},

  	btnModal: {
	    position: "absolute",
	    top: 0,
	    right: 0,
	    width: 50,
	    height: 50,
	    backgroundColor: "transparent",
  	},
    description: {
        paddingTop: 3,
        paddingBottom: 8,
    },
    buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center',
	  fontWeight: 'bold'
	},
	button: {
	  height: 36,
	  flexDirection: 'column',
	  backgroundColor: '#5da990',
	  borderColor: '#5da990',
	  justifyContent: 'center',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  padding:20,
	  paddingTop:20,
	},
	hint: {
		textAlign: 'left',
		color: "gray",
		alignSelf: "flex-start",
	},
});

const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js'

const usersRef = rootRef.ref('users');
const cluesRef = rootRef.ref('clues');

// note: these aren't being used currently
const userSolutionsRef = rootRef.ref('user_solutions');
const clueSolutionsRef = rootRef.ref('clue_solutions');

const user = require('./User.js');


/*
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)
const userSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/user_solutions`)
const clueSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/clue_solutions`)
*/


var CurrentClueDisplay = React.createClass({

	/*
	getInitialState: function() {
		var clueRef = cluesRef.child(this.props.clueId);
		console.log(`the current clueRef is ${clueRef}`);
		var clue;
		var clueSolution;
        clueRef.on('value', (snap) => {
					console.log(`CurrentClueDisplay clueRef val ${JSON.stringify(snap.val())}`);
					console.log(`CurrentClueDisplay clueRef val ${snap.key}`);
        	clue = {
        		title: snap.val().title,
        		description: snap.val().description,
        		type: snap.val().type
        	};
        });

        return {
            clue: clue,
            huntId: this.props.hunt.id,
            clueSolution: clueSolution,
            submission: ''
        };
    },
	*/

		getInitialState: function() {
			console.log('getting initial state...');

		//	var clue = {};
		var clueTitle;
		var clueDescription;
		var clueType;
		var clueData;
		var clueSolutions;
		var clueSubmission;
		var clueSolution;
			/*
		 clueRef.on('value', (snap) => {
						console.log(`CurrentClueDisplay clueRef val ${JSON.stringify(snap.val())}`);
						console.log(`CurrentClueDisplay clueRef val ${snap.key}`);
						console.log(`however, props hunt id is: ${this.props.hunt.id}`);

/*
	        	 var clue = {
	        		title: 'clue title goes here',
	        		description: snap.val().description,
	        		type: snap.val().type,
							data: snap.val().data,
							solutions: snap.val().solutions,
							submission: clueRef.child(submissions).child(currentUser.uid)

	        	};
						return clue;
						*/
						/*
						clue[title]= 'clue title goes here';
						console.log(`clue title is: ${clue[title]}`);
						clue[description]= snap.val().description;
						clue[type]= snap.val().type;
						clue[data]= snap.val().data;
						clue[solutions]= snap.val().solutions;
						clue[submission]= clueRef.child(submissions).child(currentUser.uid);

						console.log(`clue in cb is: ${clue}`);
	        });
					*/
	        return {
						clueTitle: clueTitle,
						clueDescription: clueDescription,
						clueType: clueType,
						clueData: clueData,
						clueSolutions: clueSolutions,
						clueSubmission: clueSubmission,
	          huntId: this.props.hunt.id,
	        };

	    },

    componentDidMount: function() {
		//	console.log('in listen for items 2');
      //  this.listenForItems(clueSolutionsRef);
		//	this.listenForItems2(clueSolutionsRef);
		console.log('component did mount...');
		this.populateClue();

    },

		listenForItems2: function(clueSolutionsRef) {
				//TODO: make this user specific!!!
				clueSolutionsRef.orderByChild('clue_id').equalTo(Number(this.props.clueId)).once('value', (snap) => {
						var solution = snap.val();
						for (var key in solution) {
							clueSolution = solution[key].solution;
						}
			this.setState({
								clueSolution: clueSolution
						});

				});
		},

		populateClue: function() {
			console.log('populating clue....');
				var clueRef = cluesRef.child(this.props.clueId);
				var currentUser = User.getCurrentUser().uid;
				console.log(`the current clueRef is ${clueRef}`);
				clueRef.on('value', (snap) => {
				 console.log(`CurrentClueDisplay clueRef val ${JSON.stringify(snap.val())}`);

				 	// this isn't right.....
	//			 var submission1 = clueRef.child('submissions');
		//		 var submission2 = submission1.child(currentUser);

					var submission1 = snap.val().submissions;
					 var submission2 = submission1[currentUser];

/*
					var clue = {
					 title: snap.val().creator,
					 description: snap.val().description,
					 type: snap.val().type,
					 data: snap.val().data,
					 solutions: snap.val().solutions,
					 submission: submission2
				 };
				*/
				var clueTitle = snap.val().creator;
				var clueDescription = snap.val().description;
				var clueType = snap.val().type;
				var clueData = snap.val().data;
				var clueSolutions = snap.val().solutions;
				var clueSubmission = submission2;

				this.setState({
					clueTitle: clueTitle,
					clueDescription: clueDescription,
					clueType: clueType,
					clueData: clueData,
					clueSolutions: clueSolutions,
					clueSubmission: clueSubmission,
				});

			});  // value
	},

    listenForItems: function(clueSolutionsRef) {
        //TODO: make this user specific!!!
        clueSolutionsRef.orderByChild('clue_id').equalTo(Number(this.props.clueId)).once('value', (snap) => {
            var solution = snap.val();
            for (var key in solution) {
            	clueSolution = solution[key].solution;
            }
			this.setState({
                clueSolution: clueSolution
            });

        });
    },

    openModal: function(id) {
    	this.refs.modal.open();
  	},


		// STILL IN PROGRESS-- AES
		onSubmitPressed: function(submission) {
			this.addUserSubmissionToFirebase();
			console.log('wow look we finished!');

			this.checkSolutions().then((found) => {
				if (found == true) {
					this.clueIsCompleted();
					Alert.alert(
						'Clue Correct',
						"Woohoo!",
						[
							{onPress: this.returnToClueList},
						]
					);
				} else {
					Alert.alert(
						'Incorrect Submission',
						'Try again!',
					);
				}
			});  // then

		//	if (this.checkSolutions()) {
				/*
				var solutionList = this.getSolutionListFromDatabase();
				this.updateDatabaseSolutionList(solutionList);
				*/


				//need to also put next clue in progress at this point
				//TODO: don't hard code these!
				// var thisSolutionRef = userSolutionsRef.child(3);
				// thisSolutionRef.update({completed: 1});
				// var thisSolutionRef = userSolutionsRef.child(2);
				// thisSolutionRef.update({completed: 1});
				//this.openModal();


		},

		// NEW
		clueIsCompleted: function() {

			// update the clue to be completed for that user
			var userHunt = User.getCurrentUser().currentHunts.child(this.state.huntId);
			// child('currentHunts').child(this.state.huntId);
			console.log(`userhunt is: ${userHunt} `);
		},
		// OLD --AES
/*
	onSubmitPressed: function() {
		if (this.checkSolution()) {
			var solutionList = this.getSolutionListFromDatabase();
			this.addUserSolutionToFirebase();
			this.updateDatabaseSolutionList(solutionList);

			//need to also put next clue in progress at this point
			//TODO: don't hard code these!
			// var thisSolutionRef = userSolutionsRef.child(3);
			// thisSolutionRef.update({completed: 1});
			// var thisSolutionRef = userSolutionsRef.child(2);
			// thisSolutionRef.update({completed: 1});
			//this.openModal();
			Alert.alert(
				'Clue Correct',
				"Woohoo!",
				[
					{onPress: this.returnToClueList},
				]
			);
		}
		else {
			Alert.alert(
				'Incorrect Submission',
				'Try again!',
			);
		}
	},
	*/

	returnToClueList: function() {
		this.props.callback(cluesRef);
		this.props.navigator.pop();
	},

	checkSolutions: function() {
		console.log(`clueSOlutions keys is: ${Object.keys(this.state.clueSolutions)}`);

		let found = false;
		var solutions = Object.keys(this.state.clueSolutions);
		let i = 0;
		return new Promise ((fulfill, reject) => {
			if (solutions.length == 0) {
				reject();
			} else {
				// not using a for each loop here because cannot break out of it
				console.log(`solutions.ength is: ${solutions.length}`);
				while(i < solutions.length) {
					var currSolution = solutions[i];
					console.log(`currSolution is: ${currSolution}`);

					if (currSolution.toUpperCase().trim() === this.state.clueSubmission.toUpperCase().trim()) {
						console.log('found the right answer!');
						found = true;
						i++;
						fulfill(true);
					} else {i++;}
				}
				console.log(`found is: ${found}`);
				if (found == false) {
					fulfill(false);
				}
			}  // else
		});  // promise
	},

// OLD
	checkSolution: function() {
		if (this.state.submission.toUpperCase().trim() == this.state.clueSolution.toUpperCase().trim()) {
			return true;
		}
		else {
			return false;
		}
	},

	getHint: function() {
		Alert.alert(
			'Sorry! Not yet supported.',
			'Check back in the future!',
		);
	},

	// OLD-- AES
	/*
	addUserSolutionToFirebase: function() {
		var currentUser = User.getCurrentUser();
  		userSolutionsRef.push({
    		user_id: currentUser.uid,
    		clue_id: this.props.clueId,
    		hunt_id: this.state.huntId,
    		completed: 1,
    		solution: this.state.submission

		});
	},
	*/

	addUserSubmissionToFirebase: function() {
		const clueRef = cluesRef.child(this.props.clueId);
		const currentUser = User.getCurrentUser().uid;

		clueRef.on('value', (snap) => {
		 console.log(`CurrentClueDisplay clueRef val ${JSON.stringify(snap.val())}`);

		 var submissionRef = clueRef.child('submissions').child(currentUser);
	//	 var submission2 = submission1.child(currentUser);

		submissionRef.set(this.state.clueSubmission)
		.then(() => {
			console.log(`success! clueSubmission is: ${this.state.clueSubmission}`);
		});



	});  // snap
},

	// OLD
	addUserSolutionToFirebase: function() {
		var currentUser = User.getCurrentUser();
		var clueRef = cluesRef.child(this.props.clueId);
		var submissionsRef =  clueRef.child(this.state.submission).child(currentUser.uid);
		console.log(`the currentUser is: ${submissionsRef}`);
		submissionsRef.set(submission).then(()=> {
			console.log('successfully saved!');
		})
		.catch((err) => {
			console.log('failed in saving....');
		})

	},
	// OLD
	getSolutionListFromDatabase: function() {
		var currentUser = User.getCurrentUser();
		var userRef = usersRef.child(currentUser.uid);
		var huntsListRef = userRef.child("hunts_list");
		var thisHuntRef = huntsListRef.child(this.state.huntId);

		// if so, get clues_list for specific hunt
		thisHuntRef.once('value', (snap) => {
			var solutionList = snap.val();
			this.updateDatabaseSolutionList(solutionList);
		});

	},

// OLD
	updateDatabaseSolutionList: function(solutionList) {
		var newSolutionList = [];
		var currentUser = User.getCurrentUser();
		var userRef = usersRef.child(currentUser.uid);
		var huntsListRef = userRef.child("hunts_list");

		//append newest solution to list
		if (solutionList == -1) {
			newSolutionList.push(this.props.clueId);
		}
		else if (solutionList) {
			newSolutionList = solutionList;
			newSolutionList.push(this.props.clueId);
		}

		//push new list to Firebase
		if (newSolutionList) {
			var thisHuntRef = huntsListRef.child(this.state.huntId);
			thisHuntRef.update(newSolutionList);
		}
	},
	/*
	if (this.state.clue.type == "fillIn") {
	 return (
		 <View style={styles.container}>
			 <View style={styles.separatorSmall}/>
			 <Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
								 <View style={styles.topSeparator}/>
								 <View style={styles.separatorSmall}/>
			 <Text style={styles.clueName}>{this.state.clue.title}</Text>
			 <Text style={styles.description}>{this.state.clue.description}</Text>
			 <TextInput
					 style={{height: 40, borderColor: 'gray', borderWidth: 1}}
					 onChangeText={(submission) => this.setState({submission})}
					 value={this.state.submission}/>
				 <View style={styles.separatorLarge}/>
			 <TouchableHighlight style = {styles.button}
					 onPress={this.onSubmitPressed}
					 underlayColor='#99d9f4'>
					 <Text style = {styles.buttonText}>Submit</Text>
			 </TouchableHighlight>
			 <Text style={styles.hint} onPress={this.getHint}>
						 Need a hint?
				 </Text>
		 </View>
	 );
 }
 else {
 */

	render: function() {
		var hunt = this.props.hunt;
		console.log(`clueSubmission is: ${this.state.clueSubmission}`);
		console.log(`clueSubmission is: ${ typeof this.state.clueSubmission}`);
	//	var clueSubString = String(this.state.clueSubmission);
	//	var clueSubString2 = JSON.stringify(this.state.clueSubmission);
	//	console.log(`clueSubString is: ${clueSubString}`);
	//	console.log(`clueSubString2 is: ${clueSubString2}`);

		/*
		console.log(`state is now: ${this.state.clue}`);
		console.log(`state title is now: ${this.state.clue.title}`);
		console.log(`state is now: ${this.state.clue.description}`);
		console.log(`state is now: ${this.state.clue.submission}`);
		console.log(`state is now: ${this.state.clue.type}`);
		console.log(`state is now: ${this.state.clue.data}`);
		*/

			return (
				<View style={styles.container}>
					<View style={styles.separatorSmall}/>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
                    <View style={styles.separatorSmall}/>
					<Text style={styles.clueName}>{this.state.clueTitle}</Text>
					<Text style={styles.description}>{this.state.clueDescription}</Text>
					<TextInput
	    				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
	    				onChangeText={(submission) => this.setState({clueSubmission: submission})}
	    				value={this.state.clueSubmission}/>
	    			<View style={styles.separatorLarge}/>
					<TouchableHighlight style = {styles.button}
							onPress={this.onSubmitPressed}
							underlayColor='#99d9f4'>
							<Text style = {styles.buttonText}>Submit</Text>
					</TouchableHighlight>
					<Text style={styles.hint} onPress={this.getHint}>
				  			Need a hint?
			  		</Text>
				</View>
			);
	//	}
	},
});

module.exports = CurrentClueDisplay;
