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
    description: {
        paddingTop: 3,
        paddingBottom: 8,
    },
    yourSolution: {
        paddingTop: 3,
        paddingBottom: 8,
        fontWeight: 'bold'
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


var CompletedClueDisplay = React.createClass({

	getInitialState: function() {
		var clueRef = cluesRef.child(this.props.clueId);
		var clue;
		var clueSolution;
        clueRef.on('value', (snap) => {
        	clue = {
        		title: snap.val().title,
        		description: snap.val().description,
        		id: snap.val().id
        	};
        });

        return {
            clue: clue,
            huntId: this.props.hunt.id,
            clueSolution: clueSolution
        };

    },

    componentDidMount: function() {
        this.listenForItems(clueSolutionsRef);
    },

    listenForItems: function(clueSolutionsRef) {
        
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

	returnToClueList: function() {
		this.props.navigator.pop();
	},

	checkSolution: function(userSolution) {
		return true;
	},

	render: function() {	 
		var hunt = this.props.hunt;
		return (
			<View style={styles.container}>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
					<Text style={styles.clueName}>{this.state.clue.title}</Text>
					<Text style={styles.description}>{this.state.clue.description}</Text>
					<Text style={styles.yourSolution}>SOLUTION: </Text>
					<Text style={styles.description}>{this.state.clueSolution}</Text>

			</View>
		);
	},
});

module.exports = CompletedClueDisplay;
