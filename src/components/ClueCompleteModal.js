const ReactNative = require('react-native');
const React = require('react');
const IMAGE = require('./success.png')
const CONFETI_IMAGE = require('./congratsSparkler.png');
const WRONG_IMAGE = require('./failX.png');

const {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableHighlight,
} = ReactNative;
var {
    Component,
} = React;

const BACKGROUND_COLOR = "#e5ecbc";
const BUTTON_COLOR = "#becf60";
const BUTTON_UNDERLAY_COLOR = "#abba56"

const WRONG_BUTTON_COLOR = "#ee766d";
const WRONG_BACKGROUND_COLOR = "#f5c7c6";
const WRONG_BUTTON_UNDERLAY_COLOR = "#c97e79"

const CONFETI_CIRCLE_WIDTH = 200;
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
	    alignItems: 'center',
	    backgroundColor: BACKGROUND_COLOR
	},
	buttonView: {
		marginTop: 20,
		marginBottom: 20,
		borderRadius: 3,
		backgroundColor: BUTTON_COLOR,
		padding: 7,
		width: 250,
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold"
	},
	confetiImageCircle: {
		backgroundColor: "white",
		borderRadius: CONFETI_CIRCLE_WIDTH / 2 + CONFETI_CIRCLE_WIDTH / 10,
		height: CONFETI_CIRCLE_WIDTH,
		width: CONFETI_CIRCLE_WIDTH,
		padding: CONFETI_CIRCLE_WIDTH / 10,
		marginTop: 10,
		alignItems: "center"
	},
	confetiImage: {
		flex: 1,
		marginBottom: CONFETI_CIRCLE_WIDTH / 15,
		height: CONFETI_CIRCLE_WIDTH / 4,
		resizeMode: "contain",
		justifyContent: "center"
	},
	successImage: {
		flex: 1,
		marginTop: CONFETI_CIRCLE_WIDTH / 15,
		marginBottom: CONFETI_CIRCLE_WIDTH / 15,
		height: CONFETI_CIRCLE_WIDTH / 4,
		resizeMode: "contain",
		justifyContent: "center"
	},
	failImage: {
		flex: 1,
		marginTop: CONFETI_CIRCLE_WIDTH / 15,
		marginBottom: CONFETI_CIRCLE_WIDTH / 15,
		height: CONFETI_CIRCLE_WIDTH / 4,
		resizeMode: "contain",
		justifyContent: "center"
	},
	titleText: {
		marginTop: 20,
		fontSize: 28,
		fontWeight: "bold"
	},
	descriptionText: {
		fontSize: 20,
		fontWeight: "300",
	},
	prizeText: {
		fontSize: 19,
		fontWeight: "300",
	}
});


// This will render a view to show when a person completes a clue
var ClueCompleteModal = React.createClass({
	done: React.PropTypes.func.isRequired,
	wrong: React.PropTypes.bool.isRequired,
	huntDone: React.PropTypes.bool.isRequired,

	render: function() {
		const wrong = this.props.wrong;

		/* {!wrong ? <Text style={[{fontFamily: FONT}, styles.prizeText]}>Go to xxxxx to collect your prize</Text> : null} */

		var image = wrong ? WRONG_IMAGE : (this.props.huntDone ? CONFETI_IMAGE : IMAGE)
		var imageStyle = wrong ? styles.failImage : (this.props.huntDone ? styles.confetiImage : styles.successImage)

		return (<View style={styles.container}>
			<View style={[styles.innerContainer, wrong ? {backgroundColor: WRONG_BACKGROUND_COLOR} : null]}>
				<Text style={[{fontFamily: FONT}, styles.titleText]}>{wrong ? "OOPS" : "CONGRATULATIONS!!"}</Text>
				<Text style={[{fontFamily: FONT}, styles.descriptionText]}>{wrong ? "Your answer was incorrect" : ("You successfully completed the " + (this.props.huntDone ? "hunt!!" : "clue"))}</Text>

				<View style={styles.confetiImageCircle}>
					<Image
						style={imageStyle}
						source={image}/>
				</View>

				<TouchableHighlight
					style={[styles.buttonView, wrong ? {backgroundColor: WRONG_BUTTON_COLOR} : null]}
					underlayColor={wrong ? WRONG_BUTTON_UNDERLAY_COLOR : BUTTON_UNDERLAY_COLOR}
					onPress={this.props.done}>
						<Text style={[{fontFamily: FONT}, styles.buttonText]}>{wrong ? "Try again" : "Next"}</Text>
				</TouchableHighlight>
			</View>
		</View>);
	}
});

module.exports = ClueCompleteModal