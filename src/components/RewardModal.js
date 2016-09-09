var ReactNative = require('react-native');
var React = require('react');
import ClueController from "./ClueController";

var {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableHighlight,
	ListView,
    Alert
} = ReactNative;

var {
    Component,
} = React;


const FONT = "Verlag-Book";

var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	    justifyContent: 'center',
	    flexDirection: "row",
	    backgroundColor: "rgba(0, 0, 0, 0.5)",
	    padding: 30,
	},
	innerContainer: {
		flex: 1,
	    borderRadius: 10,
	    marginTop: 7,
	    marginBottom: 7,
	    marginRight: 20,
	    marginLeft: 20,
	    padding: 10,
	    alignItems: 'center',
	    backgroundColor: "#fff8bd"
	},
	doneButton: {
		backgroundColor: "#f4cd44",
		width: 200,
		borderRadius: 10,
		padding: 10,
		marginBottom: 10
	},
	doneButtonText: {
		color: "black",
		alignSelf: "center",
		justifyContent: "center",
		fontSize: 17,
	},
	rewardText: {

		textAlign: "center",
		marginRight: 10,
		fontSize: 15,
		marginLeft: 10,
		marginBottom: 20
	},
	iconImage: {
		width: 130,
		height: 130,
		resizeMode: "contain",
		marginTop: 10,
		marginBottom: 20
	}
});


var RewardModal = React.createClass({
	done: React.PropTypes.func.isRequired,
	hunt: React.PropTypes.object.isRequired,

	render: function() {
		return (<View style={styles.container}>
			<View style={styles.innerContainer}>
				<Image
					style={styles.iconImage}
					source={require("./rewardHeadPeice.png")}/>

				<Text style={styles.rewardText}>{this.props.hunt.reward}</Text>

				<TouchableHighlight
					style={styles.doneButton}
					underlayColor="#cfb866"
					onPress={this.props.done}>
					<Text style={styles.doneButtonText}>Done</Text>
				</TouchableHighlight>
			</View>
		</View>)
	}

});

module.exports = RewardModal