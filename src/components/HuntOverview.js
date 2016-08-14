
var React = require('react-native');
var ClueList = require('./ClueList');
import User from './User';

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
		width: screenWidth,
		marginBottom: 10
	},
	likeAction: {
		marginLeft: 40
	},
	shareAction: {
		flex: 1,
		alignSelf: "center",
		marginLeft: 70
	},
	rateAction: {
		marginRight: -10
	},
	actionBarIcons: {
		resizeMode: "contain",
		height: 20,
	}
});


var HuntOverview = React.createClass({
	hunt: React.PropTypes.object,
	huntAdded: React.PropTypes.func,

	getInitialState: function() {
		return {
			shouldShowAddButton: null
		}
	},

	onStartPressed: function() {
		this.props.navigator.push({
            title: "Hunt",
            component: ClueList,
            passProps: {
                hunt: this.props.hunt,
            }
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

	render: function() {
		var hunt = this.props.hunt;

		var actionBar = <View style={styles.actionBarView}>
			<TouchableHighlight
				style={styles.likeAction}
				onPress={this.showUnimplemented}
				underlayColor='white'>
				<Image source={require("./loveIcon.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				style={styles.shareAction}
				onPress={this.showUnimplemented}
				underlayColor='white'>
				<Image source={require("./shareIcon.png")} style={styles.actionBarIcons}/>
			</TouchableHighlight>
			<TouchableHighlight
				style={styles.rateAction}
				onPress={this.showUnimplemented}
				underlayColor='white'>
				<Image source={require("./ratingIcon.png")} style={styles.actionBarIcons}/>
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
				{actionBar}
				<Text style={styles.description}>{hunt.description}</Text>
				<View style={{flex: 1}}/>
				<TouchableHighlight style = {styles.button}
						onPress={this.onStartPressed}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>OPEN HUNT</Text>
				</TouchableHighlight>
				<TouchableHighlight style = {styles.button}
						onPress={this.onAddHuntPressed}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>{ this.state.shouldShowAddButton ? "ADD HUNT" : "REMOVE HUNT" }</Text>
				</TouchableHighlight>
			</View>
		);
	}
});


module.exports = HuntOverview;
