'use strict';
 
var React = require('react-native');
const SignUp = require('./SignUp');
const ForgotPassword = require('./ForgotPassword');
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

var screenPadding = 10;
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


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
		width: screenWidth * 0.4,
		height: screenWidth * 0.4 * 0.83,
		alignSelf: "center"
	},
	titleStyle: {
		marginTop: 20,
		marginBottom: screenHeight > 500 ? 40 : 10,
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
			if (typeof this.props.onLogin == 'function' && error == null && user != null) {
				this.props.onLogin();
			}else{
				AlertIOS.alert(
					"Incorrect Login",
					"Either your email or password was incorrect. If you cannot remember your password click 'Forgot your password?'"
				);
			}
			this.setState({
				processingLogin: false,
			});
		}.bind(this));
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
		var modalView = <SignUp hideModal={this.hideModal.bind(this)}/>

		if (this.state.recoveringPassword) {
			modalView = <ForgotPassword hideModal={this.hideModal.bind(this)}/>
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
								onChangeText={(text) => this.setState({email: text})}
    							value={this.state.email}
    							disabled={this.state.processingLogin}
								placeholder="email"/>
							</View>
							<View style={styles.separationBar}></View>
							<View style={styles.loginTextInputViews}>
							<Image
								style={styles.loginIcons}
								source={require('../../password.png')}/>
							<TextInput style={styles.textField}
								secureTextEntry={true}
								onChangeText={(text) => this.setState({password: text})}
								disabled={this.state.processingLogin}
    							value={this.state.password}
								placeholder="password"/>
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
			  		<Text style={styles.skipSyle} onPress={this.skipPressed.bind(this)}>No thanks, just take me to the puzzle</Text>
			  		<View style={styles.bottomBar}></View>
			  	</View>
			</View>
	  	);
	}
}

module.exports = LoginScreen;