var ReactNative = require('react-native');
var React = require('react');
var PageControl = require('react-native-page-control');
var ClueCompleteModal = require('./ClueCompleteModal');
var RewardModal = require('./RewardModal');
var User = require('./User');
var dismissKeyboard = require('dismissKeyboard');

var {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableHighlight,
	Alert,
	TextInput,
	Dimensions,
	ScrollView,
	Modal,
	AlertIOS
} = ReactNative;
var {
    Component,
} = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30,
		marginBottom: 60,
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
	  marginTop: 26,
	  flexDirection: 'column',
	  backgroundColor: '#5da990',
	  borderColor: '#5da990',
	  justifyContent: 'center',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  padding:20,
	  marginLeft: 5,
	  marginRight: 5,
	  paddingTop:20,
	},
	hint: {
		textAlign: 'left',
		color: "gray",
		alignSelf: "flex-start",
	},
	imageContainer: {
		flexDirection: "column",
		flex: 1,
	},
	pageControl: {
		alignSelf: 'center',
		bottom: 0
	},
	scrollView: {
		flex: 1,
		marginBottom: 5
	},
	skipButton: {
		marginTop: 5,
		alignSelf: "flex-end",
	},
	skipButtonText: {
		color: "gray"
	},
	heading: {
		fontSize: 20,
		fontFamily: "Verlag-Book",
		alignSelf: "center",
		width: 100,
		height: 15,
		flex: 1
	}
});

const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js'


const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');

const storage = Firebase.storage();
const storageRef = storage.ref();

/**
 * The Create Hunt view for the app to create hunts
 */
var CreateHunt = React.createClass({
		render: function(){
			<View style={styles.heading}>
				<Text>HUNT NAME</Text>
			</View>
		}
	})