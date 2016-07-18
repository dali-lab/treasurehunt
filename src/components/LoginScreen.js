'use strict';

var React = require('react-native');
const SignUp = require('./SignUp');
const ForgotPassword = require('./ForgotPassword');
import User from './User';
var dismissKeyboard = require('dismissKeyboard');

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

var screenPadding = 10;
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


var styles = StyleSheet.create({
	container: {
		flex: 1,
		width: screenWidth,
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "white",
	},
	innerContainer: {
		flexDirection: "column",
		flex: 1,
		width: screenWidth * 2 / 3,
		marginTop: screenPadding + 40,
		marginLeft: screenPadding,
		marginRight: screenPadding,
	},
	icon: {
		width: screenWidth * 0.4,
		height: screenWidth * 0.4 * 0.83,
		alignSelf: "center"
	},
	titleStyle: {
		marginTop: 20,
		marginBottom: 20,
		fontSize: 26,
    	fontFamily: 'Museo Slab',
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
		borderRadius: 5,
		backgroundColor: "#f0f8f5",
		flexDirection: 'column',
		alignSelf: 'stretch',
	},
	loginIconsEmail: {
		top: 13,
		left: 15,
		height: 15,
		marginRight: 3,
		width: 20,
		flexDirection: 'row',
	},
	loginIconsPassword: {
		top: 10,
		left: 17,
		marginRight: 5,
		height: 20,
		width: 17,
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
		color: "#1d8377",
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
			processingLogin: false,
			email: "",
			password: "",
		};
	}

	onLoginPressed() {
		this.setState({
			processingLogin: true,
		});
		User.getUser(this.state.email.toLowerCase(), this.state.password, function(error, user) {
			if (user != null) {
				this.didLogIn(user);
			}else{
				AlertIOS.alert(
					"Incorrect Login",
					"Either your email or password was incorrect. If you cannot remember your password click 'Forgot your password?'"
				);
				this.setState({
					processingLogin: false,
				});
			}
		}.bind(this));
	}

	didLogIn(user) {
		if (typeof this.props.onLogin == 'function') {
			this.props.onLogin(user);
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

	// skipPressed() {
	// 	if (typeof this.props.onSkipLogin == 'function') {
	// 		this.props.onSkipLogin();
	// 	}
	// 	// AlertIOS.alert(
	// 	// 	"Not yet supported",
	// 	// 	"Please create an account to win cool prizes!"
	// 	// );
	// }

	hideModal() {
		this.setState({
			signingUp: false,
			recoveringPassword: false,
		})
	}

	render() {
		var modalView = <SignUp hideModal={this.hideModal.bind(this)} didSignUp={this.didLogIn.bind(this)}/>

		if (this.state.recoveringPassword) {
			modalView = <ForgotPassword hideModal={this.hideModal.bind(this)}/>
		}

		return (
			<TouchableHighlight style={styles.container} activeOpacity={1}
			onPress={() => dismissKeyboard()}
			>
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
								style={styles.loginIconsEmail}
								source={require('../../user.png')}/>
							<TextInput style= {styles.textField}
								ref="emailTextField"
								returnKeyType='next'
								onChangeText={(text) => this.setState({email: text})}
								onSubmitEditing={() =>
									this.refs.passwordTextField.focus()
								}
    							value={this.state.email}
    							disabled={this.state.processingLogin}/>
							</View>
							<View style={styles.separationBar}></View>
							<View style={styles.loginTextInputViews}>
							<Image
								style={styles.loginIconsPassword}
								source={require('../../password.png')}/>
							<TextInput style={styles.textField}
								ref="passwordTextField"
								returnKeyType='go'
								secureTextEntry={true}
								onChangeText={(text) => this.setState({password: text})}
								onSubmitEditing={this.onLoginPressed.bind(this)}
								disabled={this.state.processingLogin}
    							value={this.state.password}/>
							</View>
						</View>

						<ActivityIndicatorIOS
							animating={this.state.processingLogin}
							hidesWhenStopped={true}
							size="small"/>

						<TouchableHighlight style={styles.button}
							onPress={this.onLoginPressed.bind(this)}
							disabled={this.state.processingLogin}
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
			  		<View style={styles.bottomBar}></View>
			  	</View>
			</View>
			</TouchableHighlight>
	  	);

		// For skipping login
		// <Text style={styles.skipSyle} onPress={this.skipPressed.bind(this)}>No thanks, just take me to the puzzle</Text>
	}
}

module.exports = LoginScreen;
