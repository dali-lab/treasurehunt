const ReactNative = require('react-native');
const React = require('react');
const PageControl = require('react-native-page-control');
const ClueCompleteModal = require('./ClueCompleteModal');
const RewardModal = require('./RewardModal');
const User = require('./User');
const dismissKeyboard = require('dismissKeyboard');
const Firebase = require('firebase');
const config = require('../../config');

import rootRef from '../../newfirebase.js'


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
	heading: {
		marginTop: 90,
		fontSize: 28,
		fontFamily: "Verlag-Book",
		alignSelf: "center",
		width: 180,
		height: 15,
		flex: 1
	},
	topViewStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    middleViewStyle: {
    	flex: 1,
    	flexDirection: 'row',
    	justifyContent: "space-between",

    },
    addButton: {
    	width: 100,
    	height: 100,
    	backgroundColor: '#22AF8E',
    	alignSelf: "center",
    	fontSize: 43,
    	paddingLeft: 36,
    	paddingTop: 19,
    	color: "white",
    	marginRight: 35,
    	marginBottom: 935
    },
    textBoxHunt: {
    	width: 200,
    	height: 100,
       	backgroundColor:'#E1EEEC',
       	marginLeft: 30,
       	padding: 10,
       	fontSize: 19,
       	fontFamily: "Verlag-Book",
    	alignSelf: "center",
    	marginBottom: 935,
    	borderRadius: 10
    },
	divider: {
    	width: 320,
    	height: 2,
    	backgroundColor: '#23B090',
    	alignSelf: "center",
    	marginBottom: 530
	},
});


const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');

const storage = Firebase.storage();
const storageRef = storage.ref();

/**
 * The Create Hunt view for the app to create hunts
 */
var CreateHunt = React.createClass({
		render: function(){
			return (
				<View style={styles.topViewStyle}>
					<Text style={styles.heading}>HUNT NAME</Text>
					<View style={styles.divider}/>
					<View style={styles.middleViewStyle}>
						<TextInput style={styles.textBoxHunt} multiline = "true" placeholder="Hunt description..."/>
						<Text style={styles.addButton}>+</Text>
					</View>
				</View>
			);
		}
	})

module.exports = CreateHunt;

