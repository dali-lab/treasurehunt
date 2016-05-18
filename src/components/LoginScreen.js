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
  Modal,
} = React;

var screenPadding = 60;
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		width: screenWidth,
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
		marginBottom: 0,
		flexDirection: 'row',
		fontSize: 20,
		paddingLeft: 20,
		paddingRight: 20,
	},
	loginTextInputViews: {
		flexDirection: "row",
	},
	loginTextInputMainView: {
		height: 85,
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
		flexDirection: 'row',
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

var signUpStyles = StyleSheet.create({

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
	}
});

class LoginScreen extends Component {
	propTypes: {
		onLogin: React.PropTypes.func,
		onSkipLogin: React.PropTypes.func,
    }

	constructor(props) {
		super(props);

		this.state = {
			signingUp: false,
			recoveringPassword: false,
		};
	}

	onLoginPressed() {
		if (typeof this.props.onLogin == 'function') {
			this.props.onLogin();
		}
	}

	signUpPressed() {
		this.setState({
			signingUp: true,
		})
	}

	forgotPasswordPressed() {
		this.setState({
			recoveringPassword: true,
		})
	}

	skipPressed() {
		if (typeof this.props.onSkipLogin == 'function') {
			this.props.onSkipLogin();
		}
	}

	hideModal() {
		this.setState({
			signingUp: false,
			recoveringPassword: false,
		})
	}

	render() {
		var modalView = <View style={signUpStyles.container}>
							<Text style={signUpStyles.description}>You cannot sign up yet</Text>
							<Text style={[signUpStyles.returnButton, styles.linkStyle]} onPress={this.hideModal.bind(this)}>Return</Text>
						</View>

		if (this.state.recoveringPassword) {
			modalView = <View style={signUpStyles.container}>
							<Text style={signUpStyles.description}>You cannot forget your password yet</Text>
							<Text style={[signUpStyles.returnButton, styles.linkStyle]} onPress={this.hideModal.bind(this)}>Return</Text>
						</View>
		}

		return (
			<View style={styles.container}>
				<Modal
					animated={true}
					animationType='fade'
					transparent={true}
					visible={this.state.signingUp || this.state.recoveringPassword}
					onRequestClose={() => {this.hideModal}}
					>
					{modalView}
				</Modal>
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
			</View>
	  	);
	}
}

module.exports = LoginScreen;