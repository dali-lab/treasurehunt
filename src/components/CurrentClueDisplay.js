var ReactNative = require('react-native');
var React = require('react');
var ClueCompleteModal = require('./ClueCompleteModal');
var User = require('./User').default

var {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableHighlight,
	Alert,
	TextInput,
	Dimensions,
	Modal
} = ReactNative;
var {
    Component,
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
		alignSelf: 'center',
		fontFamily: 'Verlag-Book'
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

const user = require('./User');
import ClueController from "./ClueController";


/*
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)
const userSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/user_solutions`)
const clueSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/clue_solutions`)
*/


var CurrentClueDisplay = React.createClass({
	controller: React.PropTypes.object.isRequired,
	clue: React.PropTypes.object.isRequired,

	getInitialState: function() {
        return {
        	clueSubmission: this.props.controller.getSubmission(this.props.clue),
  			showModal: false,
  			solutionCorrect: false,
  			waitingForSolutions: false
        };

    },

    openModal: function(id) {
    	this.refs.modal.open();
  	},

	onSubmitPressed: function() {
		console.log("Submit Button pressed");

		this.props.controller.setSubmission(this.props.clue, this.state.clueSubmission);

		var correct = this.props.controller.checkSolutions(this.props.clue);
		console.log("The submission " + (correct ? "is" : "isn't") + " correct");

		if (correct) {
			this.props.controller.completeClue(this.props.clue).then((flag) => {
				this.clueIsCompleted();
			});
		}else{
			this.solutionIsWrong();
		}
	},

	solutionIsWrong: function() {
		this.setState({
			showModal: true,
			solutionCorrect: false
		});
	},

	clueIsCompleted: function() {
		this.setState({
			showModal: true,
			solutionCorrect: true
		});
	},

	returnToClueList: function() {
		this.props.navigator.popN(this.props.controller.huntIsComplete() ? 3 : 1);
	},

	getHint: function() {
		Alert.alert(
			'Sorry! Not yet supported.',
			'Check back in the future!',
		);
	},

	render: function() {
		var hunt = this.props.controller.hunt;

		var modalView = <ClueCompleteModal
			wrong={!this.state.solutionCorrect}
			huntDone={this.props.controller.huntIsComplete()}
			done={() => {
				this.setState({  showModal: false  });
				if (this.state.solutionCorrect) {
					this.returnToClueList();
				}
			}}/>

			return (
				<View style={styles.container}>
					<Modal
						animated={true}
						animationType='fade'
						transparent={true}
						visible={this.state.showModal}
						onRequestClose={() => {
							this.setState({  showModal: false  });
							this.returnToClueList();
						}}
						>
						{modalView}
					</Modal>
					<View style={styles.separatorSmall}/>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
                    <View style={styles.separatorSmall}/>
					<Text style={styles.description}>{this.props.clue.description}</Text>
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
					
				</View>
			);
	},
});

module.exports = CurrentClueDisplay;
