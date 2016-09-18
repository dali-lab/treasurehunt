'use strict';

var ReactNative = require('react-native');
var React = require('react');
import User from './User';

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Dimensions,
  Modal,
  AlertIOS,
} = ReactNative;
var {
    Component,
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white"
	},
	innerContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		marginLeft: 5,
		marginBottom: 150,
		marginTop: 150,
		marginRight: 5,
		borderRadius: 10
	},
	description: {
		fontSize: 15,
		textAlign: "center"
	},
	returnButton: {
		marginTop: 20,
	},
	linkStyle: {
		color: 'blue',
	}
});

class ForgotPassword extends Component {
	propTypes: {
		hideModal: ReactNative.PropTypes.func,
    }

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.description}>
					We do not have an interface for reseting your password yet, but email us so we can reset your password for you</Text>
				<Text style={[styles.returnButton, styles.linkStyle]} onPress={this.props.hideModal}>Return</Text>
			</View>
		);
	}
}

module.exports = ForgotPassword;
