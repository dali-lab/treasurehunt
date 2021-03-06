
var ReactNative = require('react-native');
var React = require('react');
var ClueList = require('./ClueList');
var RewardModal = require('./RewardModal');
import User from './User';
import ClueController from './ClueController';


const Firebase = require('firebase')
const config = require('../../config')
import rootRef from '../../newfirebase.js'
const usersRef = rootRef.ref('users');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Dimensions,
  	AlertIOS,
	TouchableHighlight,
	Modal
} = ReactNative;

var {
    Component,
} = React;

var screenWidth = Dimensions.get('window').width;
const margin = 30
const BUTTON_COLOR = "#c8e7a6";
const BUTTON_UNDERLAY_COLOR = "#abba56"
const FONT = "Verlag-Book";

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
		marginBottom: 20,
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
		width: screenWidth - 50,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
		alignSelf: 'stretch',
		padding:20,
	},
	buttonImage:{
		height: 70,
		width: screenWidth - 50,
		resizeMode: "contain"
	},
	buttonAdd: {
		marginLeft: 25,
		marginRight: 25,
		width: Math.min(screenWidth - 50, 325),
		height: 36,
		flexDirection: 'column',
		backgroundColor: '#c8e7a6',
		borderColor: '#c8e7a6',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'center',
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

    rewardButtonView: {
        marginLeft: 25,
		marginRight: 25,
		width: Math.min(screenWidth - 50, 325),
		height: 36,
		flexDirection: 'column',
		backgroundColor: '#c8e7a6',
		borderColor: '#c8e7a6',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'center',
		padding:20,
    },
    rewardButtonText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		fontFamily: 'Verlag-Book'
    },
});


var HuntOverview = React.createClass({
	hunt: React.PropTypes.object,
	huntAdded: React.PropTypes.func,

	getInitialState: function() {
		this.controller = null

		User.getCurrentUser().completedHunt(this.props.hunt).then((flag) => {
			this.setState({
				hadCompleted: flag
			})
		})

		return {
			shouldShowAddButton: null,
			processingAddHunt: false,
			hasHunt: null,
			stars: 4,
			showReward: false,
			hadCompleted: false
		}
	},

	onStartPressed: function() {

		this.props.navigator.push({
            title: "Hunt",
            component: ClueList,
            passProps: {
            	controller: this.controller
            }
        });
	},

	componentWillMount: function() {
		this.currentClue = null
		this.currentClueCallback = null

		console.log(this.props.hunt.procedural)

		User.getCurrentUser().hasHuntCurrent(this.props.hunt).then((flag) => {
			this.setState({
				hasHunt: flag
			});

			if (flag) { // Meaning that the user has the hunt
				// Now I am going to load the clue controller
				this.controller = new ClueController(this.props.hunt)
				this.controller.loadData().then(() => {
					// Do something :)
				})
			}
		});
	},

	onExitPressed: function() {
		this.props.navigator.pop();
	},

	onAddHuntPressed: function() {
		console.log("Doing something with hunt: " + this.props.hunt.id);

		this.setState({
			processingAddHunt: true
		});
		if (!this.state.hasHunt) {
			User.currentUser.addHunt(this.props.hunt).then(() => {
				if (typeof this.props.huntAdded == "function") {
					this.props.huntAdded();
				}

				this.controller = new ClueController(this.props.hunt)
				this.controller.loadData().then(() => {

				});

				this.setState({
					hasHunt: true,
					processingAddHunt: false
				});
			}, (error) => {
				AlertIOS.alert("Error", error);
				this.setState({
					processingAddHunt: false
				});
			});
		}else{
			User.currentUser.removeHunt(this.props.hunt).then(() => {
				if (typeof this.props.huntAdded == "function") {
					this.props.huntAdded();
				}

				this.controller = null

				this.setState({
					hasHunt: false,
					processingAddHunt: false
				});
				this.props.navigator.pop();
			}, (error) => {
				AlertIOS.alert("Error", error);
				this.setState({
					processingAddHunt: false
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
				<Image source={require("../img/shareIcon.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(1)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 1 ? require("../img/star.png") : require("../img/star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(2)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 2 ? require("../img/star.png") : require("../img/star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(3)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 3 ? require("../img/star.png") : require("../img/star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(4)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 4 ? require("../img/star.png") : require("../img/star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					this.ratingButtonPressed(5)
				}}
				underlayColor='white'>
				<Image source={this.state.stars >= 5 ? require("../img/star.png") : require("../img/star_empty.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
		</View>


		return (
			<View style={styles.container}>
				<Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.showReward}
                    onRequestClose={() => {
                        this.setState({  showReward: false  });
                    }}>
                    <RewardModal
                        done={() => this.setState({showReward: false})}
                        hunt={hunt}/>
                </Modal>
				<View>
					<Text style={styles.title}>{hunt.name}</Text>
				</View>
				<Image style={styles.image}
					source={{uri: hunt.image}} />
				{actionBar}
				<Text style={styles.description}>{hunt.desc}</Text>
				<View style={{flex: 1}}/>

				{this.state.hadCompleted ?
					<TouchableHighlight style = {styles.rewardButtonView}
						onPress={() => this.setState({ showReward: true })}
						underlayColor='#bccfa8'>
						<Text style = {styles.rewardButtonText}>Collect Prize</Text>
					</TouchableHighlight> : null }


				{this.state.hasHunt != null && this.state.hasHunt ?
				<TouchableHighlight style = {styles.button}
						onPress={this.onStartPressed}
						underlayColor='#FFFFFF'>
						<Image style={styles.buttonImage} source={require("../img/viewCluseButton.png")}/>
				</TouchableHighlight> : null}
				<TouchableHighlight style = {[styles.buttonAdd, this.state.processingAddHunt ? {backgroundColor: '#bccfa8'} : null]}
						disabled={this.state.processingAddHunt}
						onPress={this.onAddHuntPressed}
						underlayColor='#bccfa8'>
						<Text style = {styles.buttonText}>{ !this.state.hasHunt ? "REDO HUNT" : "REMOVE HUNT" }</Text>
				</TouchableHighlight>
			</View>
		);
	}
});


module.exports = HuntOverview;
