'use strict';
 
var React = require('react-native');

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
  Link
} = React;

var screenPadding = 60;
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		flexDirection: "column",
	},
	innerContainer: {
		flexDirection: "column",
		flex: 1,
		width: screenWidth * 2 / 3,
		marginTop: screenPadding,
		marginLeft: screenPadding,
		marginRight: screenPadding,
	},
	icon: {
		width: 144,
		height: 120,
		alignSelf: "center"
	},
	titleStyle: {
		marginTop: 20,
		marginBottom: 40,
		fontSize: 25,
		color: "#59aa91",
		alignSelf: "center"
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center',
		fontWeight: 'bold',
	},
	button: {
		height: 36,
		flexDirection: 'row',
		backgroundColor: '#bfcf60',
		borderColor: '#bfcf60',
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	textField: {
		height: 40,
		flex: 1,
		marginBottom: 10,
		flexDirection: 'row',
		fontSize: 20,
		paddingLeft: 20,
		paddingRight: 20,
	},
	loginTextInputViews: {
		flexDirection: "row",
	},
	loginTextInputMainView: {
		height: 95,
		borderColor: '#f0f8f5',
		borderWidth: 3,
		borderWidth: 1,
		borderRadius: 5,
		backgroundColor: "#f0f8f5",
		flexDirection: 'column',
		alignSelf: 'stretch',
		bottom: 20,
	},
	loginIcons: {
		top: 10,
		left: 10,
		height: 20,
		width: 20,
		flexDirection: 'row',
	},
	topBar: {
		height: 40,
		marginLeft: 0,
		flexDirection: 'row',
		alignSelf: 'stretch',
		backgroundColor: '#72b7a3',
	},
	bottomBar: {
		height: 40,
		flexDirection: 'column',
		alignSelf: 'stretch',
		backgroundColor: '#72b7a3',
	},
	separationBar: {
		backgroundColor: "#1d8377",
		height: 1,
		marginLeft: 5,
		marginRight: 5,
		flexDirection: 'column',
		alignSelf: 'stretch',
	},
	forgotPassword: {
		textAlign: 'left',
		color: "gray",
		alignSelf: "flex-start",
	},
	skipSyle: {
		color: "gray",
		flexDirection: "row",
		alignSelf: "center",
		marginBottom: 10
	},
	linkStyle: {
		color: "blue",
	}
});

class LoginScreen extends Component {
	propTypes: {
		onLogin: React.PropTypes.func,
    }

	constructor(props) {
	  super(props);
	}

	onLoginPressed() {
		if (typeof this.props.onLogin == 'function') {
			this.props.onLogin();
		}
	}

	signUpPressed() {

	}

	forgotPasswordPressed() {

	}

	skipPressed() {

	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.topBar}></View>
				
				<View style={styles.innerContainer}>
					<Image
						style={styles.icon}
						source={require('../../loginLogo.png')}/>

					<Text style={styles.titleStyle}>
						{"TREASURE HUNT"}
					</Text>

					<View style={styles.loginTextInputMainView}>
						<View style={styles.loginTextInputViews}><Image
							style={styles.loginIcons}
							source={require('../../user.png')}/>
						<TextInput style= {styles.textField}
							placeholder="Username"/>
						</View>
						<View style={styles.separationBar}></View>
						<View style={styles.loginTextInputViews}>
						<Image
							style={styles.loginIcons}
							source={require('../../password.png')}/>
						<TextInput style={styles.textField}
							secureTextEntry={true}
							placeholder="Password"/>
						</View>
					</View>

					<TouchableHighlight style={styles.button}
						onPress={this.onLoginPressed.bind(this)}
						underlayColor='#cadb66'>
			    		<Text style={styles.buttonText}>Sign in</Text>
			  		</TouchableHighlight>

			  		<Text style={styles.forgotPassword} onPress={this.forgotPasswordPressed.bind(this)}>Forgot your password?</Text>
			  		<Text style={styles.forgotPassword}>
			  			New? Sign up <Text style={styles.linkStyle} onPress={this.signUpPressed.bind(this)}>
			  				here
		  				</Text>
	  				</Text>

				</View>
		  		<Text style={styles.skipSyle} onPress={this.skipPressed.bind(this)}>No thanks, just take me to the puzzle</Text>
		  		<View style={styles.bottomBar}></View>
		  	</View>
	  	);
	}
}

module.exports = LoginScreen;