const React = require('react-native');

const {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
} = React;

const BACKGROUND_COLOR = "#e5ecbc";
const BUTTON_COLOR = "#becf60";

const CONFETI_CIRCLE_WIDTH = 200;
const FONT = "Verlag-Book";

var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	    justifyContent: 'center',
	    flexDirection: "row",
	    padding: 20,
	},
	innerContainer: {
		flex: 1,
	    borderRadius: 10,
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
		marginBottom: 20,
		alignItems: "center"
	},
	confetiImage: {
		flex: 1,
		marginBottom: CONFETI_CIRCLE_WIDTH / 15,
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

	render: function() {
		return (<View style={styles.container}>
			<View style={styles.innerContainer}>
				<Text style={[{fontFamily: FONT}, styles.titleText]}>{"Congratulations!!".toUpperCase()}</Text>
				<Text style={[{fontFamily: FONT}, styles.descriptionText]}>You successfully completed the clue</Text>

				<View style={styles.confetiImageCircle}>
					<Image
						style={styles.confetiImage}
						source={require("./congratsSparkler.png")}/>
				</View>

				<Text style={[{fontFamily: FONT}, styles.prizeText]}>Go to xxxxx to collect your prize</Text>

				<TouchableHighlight
					style={styles.buttonView}
					underlayColor='#abba56'
					onPress={this.props.done}>
						<Text style={[{fontFamily: FONT}, styles.buttonText]}>Next</Text>
				</TouchableHighlight>
			</View>
		</View>);
	}
});

module.exports = ClueCompleteModal