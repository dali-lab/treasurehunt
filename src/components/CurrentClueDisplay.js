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
	TextInput
} = React;

var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30, 
		flex: 1
	},
	huntTitle: {
		fontSize: 20,
		margin: 5,
		color: '#656565',
		alignSelf: 'center'
	},
    topSeparator: {
        height: 2,
        backgroundColor: '#5da990'
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
    clueName: {
        fontSize: 20,
        color: '#000000',
        fontStyle: 'italic'
    }, 
    modal: {
	    height: 300,
	    width: 300
  	},
  	btn: {
	    margin: 10,
	    backgroundColor: "#3B5998",
	    color: "white",
	    padding: 10
  	},

  	btnModal: {
	    position: "absolute",
	    top: 0,
	    right: 0,
	    width: 50,
	    height: 50,
	    backgroundColor: "transparent"
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
	  padding:20
	},
	hint: {
		textAlign: 'left',
		color: "gray",
		alignSelf: "flex-start",
	},
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
            
        return {
            clue: clue,
            huntId: this.props.hunt.id,
            clueSolution: clueSolution,
            submission: ''
        };

    },

    componentDidMount: function() {
        this.listenForItems(clueSolutionsRef);
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

	onSubmitPressed: function() {
		if (this.checkSolution()) {
			var solutionList = this.getSolutionListFromDatabase();
			this.addUserSolutionToFirebase();
			this.updateDatabaseSolutionList(solutionList);
			
			//need to also put next clue in progress at this point
			//TODO: don't hard code these!
			var thisSolutionRef = userSolutionsRef.child(3);
			thisSolutionRef.update({completed: 1});
			var thisSolutionRef = userSolutionsRef.child(2);
			thisSolutionRef.update({completed: 1});
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

	returnToClueList: function() {
		this.props.callback(cluesRef);
		this.props.navigator.pop();
	},

	checkSolution: function() {
		if (this.state.submission == this.state.clueSolution) {
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

	addUserSolutionToFirebase: function() {

		//TODO: fix this so we're pushing a new child 
		var thisSolutionRef = userSolutionsRef.child(this.props.clueId);

		//TODO: make this specific to user!!
		//thisSolutionRef.update({
  		userSolutionsRef.push({
    			user_id: 0,
    			clue_id: this.props.clueId,
    			hunt_id: this.state.huntId,
    			completed: 1,
    			solution: this.state.submission
  			
		});
	},

	getSolutionListFromDatabase: function() {

		//DANITODO: need to plug in user id here
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

	updateDatabaseSolutionList: function(solutionList) {
		var newSolutionList = [];

		var currentUser = User.getCurrentUser();
		var userRef = usersRef.child(currentUser.uid);
		var huntsListRef = userRef.child("hunts_list");
		//append newest solution to list
		if (solutionList) {
			newSolutionList = solutionList;
			newSolutionList.push(this.props.clueId);
		}

		//push new list to Firebase
		console.log(`newSolutionList ${newSolutionList}`);
		if (newSolutionList) {
			var thisHuntRef = huntsListRef.child(this.state.huntId);
			thisHuntRef.update(newSolutionList);
		}
	},

	render: function() {
		var hunt = this.props.hunt;
		 if (this.state.clue.type == "fillIn") { 
			return (
				<View style={styles.container}>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
					<Text style={styles.clueName}>{this.state.clue.title}</Text>
					<Text style={styles.description}>{this.state.clue.description}</Text>

					<TextInput
	    				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
	    				onChangeText={(submission) => this.setState({submission})}
	    				value={this.state.submission}/>
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
	},
});

module.exports = CurrentClueDisplay;

