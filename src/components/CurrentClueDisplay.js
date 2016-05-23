var React = require('react-native');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
	Alert,
	TextInput
} = React;

var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30, 
		flex: 1
	},
	separatorSmall: {
		height: 16
	},
	separatorLarge: {
		height: 26
	},
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
        color: '#656565',
        alignSelf: 'center'
    }, 
    description: {
        paddingTop: 3,
        paddingBottom: 8,
        paddingRight: 23,
        paddingLeft: 23,
        alignSelf: 'center'
    },
    buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flexDirection: 'column',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  justifyContent: 'center',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  padding:20
	}
});

const Firebase = require('firebase')
const config = require('../../config')
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)
const userSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/user_solutions`)
const clueSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/clue_solutions`)


var CurrentClueDisplay = React.createClass({
	getInitialState: function() {
		var clueRef = cluesRef.child(this.props.clueId);
		var clue;
		var clueSolution;
        clueRef.on('value', (snap) => {
        	clue = {
        		title: snap.val().title,
        		description: snap.val().description,
        		type: snap.val().type
        	};
        });
        clueSolutionsRef.orderByChild('clue_id').equalTo(Number(this.props.clueId)).once('value', (snap) => {
            var solution = snap.val();
            for (var key in solution) {
            	clueSolution = solution[key].solution;
            }
        });
            
        return {
            clue: clue,
            huntId: this.props.hunt.id,
            clueSolution: clueSolution,
            submission: 'Your answer here'
        };

    },

	onSubmitPressed: function() {
		var output2 = this.getSolutionAndCompare();
		console.log('output2 ' + output2);
		if (this.getSolutionAndCompare()) {
			var solutionList = this.getSolutionListFromDatabase();
			this.addUserSolutionToFirebase();
			this.updateDatabaseSolutionList(solutionList);
			

			//need to also put next clue in progress at this point
			//TODO: figure out a way to not hard code these!
			var thisSolutionRef = userSolutionsRef.child(3);
			thisSolutionRef.update({completed: 1});
			var thisSolutionRef = userSolutionsRef.child(2);
			thisSolutionRef.update({completed: 1});
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

	returnToClueList: function() {
		this.props.callback(cluesRef);
		this.props.navigator.pop();
	},

	getSolutionAndCompare: function() {
		//get solution from database
		var clueSolution;
        clueSolutionsRef.orderByChild('clue_id').equalTo(Number(this.props.clueId)).once('value').then(function(snap) {
            var solution = snap.val();
            for (var key in solution) {
            	clueSolution = solution[key].solution;
            }
            console.log('output ' + this.checkSolution(clueSolution));
            return this.checkSolution(clueSolution);
        });

	},

	checkSolution: function(clueSolution) {
		console.log('submission' + this.state.submission);
		console.log('cluesoltuion ' + clueSolution);
		if (this.state.submission == clueSolution) {
			return true;
		}
		else {
			return false;
		}
	},


	addUserSolutionToFirebase: function() {

		//TODO: fix this so we're pushing a new child 
		var thisSolutionRef = userSolutionsRef.child(this.props.clueId);

		//TODO: make this specific to user!!
		//thisSolutionRef.update({
  		userSolutionsRef.push({
    			user_id: 0,
    			clue_id: this.props.clueId,
    			hunt_id: this.state.huntId,
    			completed: 1
  			
		});
	},

	getSolutionListFromDatabase: function() {
		//TODO: Don't hard code this!!
		var userRef = usersRef.child(0);
		var huntsListRef = userRef.child("hunts_list");
		var thisHuntRef = huntsListRef.child(this.state.huntId);

		// TODO: check if clue is correct


		// if so, get clues_list for specific hunt
		thisHuntRef.once('value', (snap) => {
			var solutionList = snap.val();
			this.updateDatabaseSolutionList(solutionList);
		});

	},

	updateDatabaseSolutionList: function(solutionList) {
		var newSolutionList = [];

		//TODO: make this specific to user!
		var userRef = usersRef.child(0);
		var huntsListRef = userRef.child("hunts_list");

		//append newest solution to list
		if (solutionList) {
			newSolutionList = solutionList;
			newSolutionList.push(this.props.clueId);
		}

		//push new list to Firebase
		//TODO: for some reason set doesn't work here--newSolutionList becomes undefined?
		if (newSolutionList) {
			var thisHuntRef = huntsListRef.child(this.state.huntId);
			thisHuntRef.update(newSolutionList);
		}
	},

	render: function() {
		 if (this.state.clue.type == "fillIn") { 
			return (
				<View style={styles.container}>
					<Text style={styles.title}>{this.state.clue.title}</Text>
					<Text style={styles.description}>{this.state.clue.description}</Text>

					<TextInput
	    				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
	    				onChangeText={(submission) => this.setState({submission})}
	    				value={this.state.submission}/>
					<TouchableHighlight style = {styles.button}
							onPress={this.onSubmitPressed}
							underlayColor='#99d9f4'>
							<Text style = {styles.buttonText}>SUBMIT CLUE</Text>
					</TouchableHighlight>
				</View>
			);
		}   		
	},
});

module.exports = CurrentClueDisplay;

