
var React = require('react-native');
var ClueList = require('./ClueList');
import User from './User';


const Firebase = require('firebase')
const config = require('../../config')
import rootRef from '../../newfirebase.js'
const usersRef = rootRef.ref('users');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	Dimensions,
  	AlertIOS,
	TouchableHighlight
} = React;

var screenWidth = Dimensions.get('window').width;
const margin = 30

var styles = StyleSheet.create({
	container: {
		marginTop: 70,
		marginBottom: 50,
		alignItems: 'center',
		flex: 1,
	},
	separatorSmall: {
		height: 16,
	},
	separatorLarge: {
		height: 26,
	},
	image: {
		height: 180,
		width: screenWidth - 25,
		marginBottom: 10,
		resizeMode: "contain",
	},
	description: {
		marginLeft: 30,
		marginRight: 30,
		fontSize: 16,
		alignSelf: "flex-start",
		fontFamily: 'Verlag-Book',
		textAlign: "left",
		color: '#242021',
    },
	title: {
		fontSize: 30,
		marginTop: 15,
		marginBottom: 10,
		letterSpacing: 2,
		color: '#505050',
		fontFamily: 'Verlag-Book',
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		fontWeight: 'bold',
		fontFamily: 'Verlag-Book'
	},
	button: {
		marginLeft: 25,
		marginRight: 25,
		height: 70,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
		alignSelf: 'stretch',
		padding:20,
	},
	buttonImage:{
		height: 70,
		resizeMode: "contain"
	},
	buttonAdd: {
		marginLeft: 25,
		marginRight: 25,
		height: 36,
		flexDirection: 'column',
		backgroundColor: '#cadb66',
		borderColor: '#cadb66',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		padding:20,
	},
	actionBarView: {
		flexDirection: "row",
		width: screenWidth - margin * 2,
		marginBottom: 10,
		marginRight: margin,
		marginLeft: margin
	},
	shareAction: {
		flex: 1,
		alignSelf: "center",
	},
	rateAction: {
		marginRight: -10
	},
	actionBarIcons: {
		resizeMode: "contain",
		width: 20,
		height: 20,
	},
    emptyContainerBottom: {
      backgroundColor: 'white',
      flexDirection: 'column',
      height: 52,
      borderTopWidth: 3,
      borderColor: '#23B090'
    },
});


var HuntOverview = React.createClass({
	hunt: React.PropTypes.object,
	huntAdded: React.PropTypes.func,

	getInitialState: function() {
		return {
			shouldShowAddButton: null,
			stars: 4
		}
	},

	onStartPressed: function() {
		this.props.navigator.push({
            title: "Hunt",
            component: ClueList,
            passProps: {
            	currentClue: this.currentClue,
            	currentClueComplete: (callback) => {
            		this.currentClueCallback = callback
            	},
                hunt: this.props.hunt,
            }
        });
	},

	componentDidMount: function() {
		this.currentClue = null
		this.currentClueCallback = null
		this.getCurrentClue(this.props.hunt.id).then((currentClue) => {
			this.currentClue = currentClue
			if (this.currentClueCallback != null && typeof this.currentClueCallback == "function") {
				this.currentClueCallback(currentClue);
			}
		}, (error) => {
			console.log(error)
		});
	},

	onExitPressed: function() {
		this.props.navigator.pop();
	},

	onAddHuntPressed: function() {
		console.log("Doing something with hunt: " + this.props.hunt.id);
		if (this.state.shouldShowAddButton) {
			User.getCurrentUser().addHunt(this.props.hunt).then(() => {
				if (typeof this.props.huntAdded == "function") {
					this.props.huntAdded();
				}
				this.setState({
					shouldShowAddButton: false
				});
			}, (error) => console.log(error));
		}else{
			User.getCurrentUser().removeHunt(this.props.hunt).then(() => {
				if (typeof this.props.huntAdded == "function") {
					this.props.huntAdded();
				}

				this.setState({
					shouldShowAddButton: true
				});
			}, (error) => console.log(error));
		}
	},

	getCurrentClue: function(huntid) {
		return new Promise((fulfill, reject) => {
			const currentUser = User.getCurrentUser();
			const userRef = usersRef.child(currentUser.uid);
			var currentClueRef = userRef.child('currentHunts').child(huntid).child('currentClue');

			currentClueRef.once('value', (snap) => {
				console.log(`1st instance of currentClue = ${snap.val()}`);
				fulfill(snap.val());
			}, (error) => {
                reject(error);
            });
		});
	},

	updateShouldShowAddButton: function() {
		if (this.state.shouldShowAddButton == null) {
			User.getCurrentUser().hasHuntCurrent(this.props.hunt).then((flag) => {
				this.setState({
					shouldShowAddButton: !flag
				});
			});
		}
	},

	showUnimplemented: function() {
		AlertIOS.alert(
			"Not done yet!",
			"We have yet to implment this feature. Come back soon and try again"
		);
	},

	ratingButtonPressed: function(number) {
		this.setState({
			stars: number
		})
	},

	render: function() {
		var hunt = this.props.hunt;

		var actionBar = <View style={styles.actionBarView}>
			<TouchableHighlight
				style={styles.shareAction}
				onPress={this.showUnimplemented}
				underlayColor='white'>
				<Image source={require("./shareIcon.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(1)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 1 ? require("./star.png") : require("./star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(2)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 2 ? require("./star.png") : require("./star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(3)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 3 ? require("./star.png") : require("./star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(4)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 4 ? require("./star.png") : require("./star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(5)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 5 ? require("./star.png") : require("./star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
		</View>


//		console.log(hunt.category);
		this.updateShouldShowAddButton();
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.title}>{hunt.title}</Text>
				</View>
				<Image style={styles.image}
					source={{uri: hunt.image}} />
				<Text style={styles.description}>{hunt.description}</Text>
				<View style={{flex: 1}}/>
				<TouchableHighlight style = {styles.button}
						onPress={this.onStartPressed}
						underlayColor='#FFFFF'>
						<Image style={styles.buttonImage} source={require("./viewCluseButton.png")}/>
				</TouchableHighlight>
				<TouchableHighlight style = {styles.buttonAdd}
						onPress={this.onAddHuntPressed}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>{ this.state.shouldShowAddButton ? "ADD HUNT" : "REMOVE HUNT" }</Text>
				</TouchableHighlight>
			</View>
		);
	}
});


module.exports = HuntOverview;
