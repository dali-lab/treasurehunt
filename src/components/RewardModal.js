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
	    padding: 20,
	},
	innerContainer: {
		flex: 1,
	    borderRadius: 10,
	    marginTop: 7,
	    marginBottom: 7,
	    padding: 10,
	    alignItems: 'center',
	    backgroundColor: "#fff8bd"
	},
	doneButton: {
		backgroundColor: "#ffe37e",
		width: 200,
		borderRadius: 10,
		padding: 10
	},
	doneButtonText: {
		color: "black",
		alignSelf: "center",
		fontSize: 17,
		marginBottom: 10
	},
	rewardText: {

		textAlign: "center",
		marginRight: 20,
		fontSize: 15,
		marginLeft: 20,
		marginBottom: 10
	}
});


var RewardModal = React.createClass({
	done: React.PropTypes.func.isRequired,
	hunt: React.PropTypes.object.isRequired,

	render: function() {
		return (<View style={styles.container}>
			<View style={styles.innerContainer}>

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