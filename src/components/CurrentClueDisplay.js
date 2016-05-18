var React = require('react-native');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
	Alert
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



var CurrentClueDisplay = React.createClass({
	getInitialState: function() {
		var clueRef = cluesRef.child(this.props.clueId);
		var clue;
        clueRef.on('value', (snap) => {
        	clue = {
        		title: snap.val().title,
        		description: snap.val().description,
        	};
        });
        
        return {
            clue: clue,
            huntId: this.props.hunt.id,
        };

    },

	onSubmitPressed: function() {
		if (this.checkSolution()) {
			var solutionList = this.getSolutionListFromDatabase();
			console.log("sollist" + solutionList);
			this.addUserSolutionToFirebase();
			this.updateDatabaseSolutionList(solutionList);
			

			//need to also put next clue in progress at this point
			var thisSolutionRef = userSolutionsRef.child(3);
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

	checkSolution: function(userSolution) {
		return true;
	},

	addUserSolutionToFirebase: function() {

		//TODO: fix this so we're pushing a new child 
		var thisSolutionRef = userSolutionsRef.child(this.props.clueId);

		//thisSolutionRef.update({
  		userSolutionsRef.push({
    			user_id: 0,
    			clue_id: this.props.clueId,
    			hunt_id: 0,
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
		var userRef = usersRef.child(0);
		var huntsListRef = userRef.child("hunts_list");

		//append newest solution to list
		if (solutionList) {
			newSolutionList = solutionList;
			newSolutionList.push(this.props.clueId);
			console.log("newest solution list" + newSolutionList);
		}

		//push new list to Firebase
		//TODO: for some reason set doesn't work here--newSolutionList becomes undefined?
		if (newSolutionList) {
			var thisHuntRef = huntsListRef.child(this.state.huntId);
			thisHuntRef.update(newSolutionList);
		}
	},

	render: function() {	        		
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{this.state.clue.title}</Text>
				<TouchableHighlight style = {styles.button}
						onPress={this.onSubmitPressed}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>SUBMIT CLUE</Text>
				</TouchableHighlight>
			</View>
		);
	},
});

module.exports = CurrentClueDisplay;

