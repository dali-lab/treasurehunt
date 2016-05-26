'use strict';
 
var React = require('react-native');
import User from './User';

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  Dimensions,
  Modal,
  AlertIOS,
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
		fontSize: 20,
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
		hideModal: React.PropTypes.func,
    }

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.description}>You cannot forget your password yet</Text>
				<Text style={[styles.returnButton, styles.linkStyle]} onPress={this.props.hideModal}>Return</Text>
			</View>
		);
	}
}

module.exports = ForgotPassword;