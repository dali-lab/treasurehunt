'use strict';
 
var ReactNative = require('react-native');
var React = require('react');
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
  Dimensions,
  Modal,
  AlertIOS,
} = ReactNative;
var {
    Component,
} = React;

var width = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "white",
	},
	innerContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		marginLeft: 5,
		marginRight: 5,
		padding: 40,

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
	},
	topBar: {
		height: 40,
		marginLeft: 0,
		flexDirection: 'row',
		alignSelf: 'stretch',
		backgroundColor: '#22B08F',
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center',
		fontWeight: 'bold',
	},
	bottomBar: {
		height: 40,
		flexDirection: 'column',
		alignSelf: 'stretch',
		backgroundColor: '#22B08F',
	},
	inputContainerView: {
		marginLeft: 50,
		marginRight: 50,
		height: 125,
		borderColor: '#f0f8f5',
		borderRadius: 5,
		backgroundColor: "#f0f8f5",
		flexDirection: 'column',
		alignSelf: 'stretch',
		marginBottom: 10
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
	button: {
		height: 36,
		flexDirection: 'row',
		backgroundColor: '#BAC928',
		borderColor: '#BAC928',
		borderWidth: 1,
		borderRadius: 5,
		marginTop: 5,
		marginRight: 50,
		marginLeft: 50,
		alignSelf: 'stretch',
		justifyContent: 'center'
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
		left: 16,
		marginRight: 4,
		height: 20,
		width: 17,
		flexDirection: 'row',
	},
	titleStyle: {
		marginBottom: 20,
		fontSize: 35,
		color: "#22B08F",
		alignSelf: "center",
	},
	cancel: {
		color: "gray",
		fontSize: 15,
		flexDirection: "row",
		alignSelf: "center",
		marginBottom: 10
	},
	separationBar: {
		backgroundColor: "#1d8377",
		height: 0.7,
		marginLeft: 5,
		marginRight: 5,
		flexDirection: 'row',
		alignSelf: 'stretch',
	},
});

class SignUp extends Component {
	propTypes: {
		hideModal: ReactNative.PropTypes.func,
		didSignUp: ReactNative.PropTypes.func,
    }

    constructor() {
    	super()

    	this.state = {
			loading: false,
			username: "",
			password: "",
			passwordConfirm: "",
		};
    }

    signUp() {
    	if (this.state.username == "") {
    		AlertIOS.alert(
				"Sign Up problem",
				"You need to include an email"
			);
			this.refs.emailInput.focus()
    	}else if (this.state.password == "") {
    		AlertIOS.alert(
    			"Sign Up problem",
    			"You must have a password"
    		);
    		this.refs.passwordInput.focus()
    	}else if (this.state.passwordConfirm == this.state.password) {
    		this.setState({loading: true})
    		User.signUp(this.state.username.toLowerCase(), this.state.password).then((user) => {


    			if (user) {
    				if (typeof this.props.hideModal == 'function') {
    					this.props.didSignUp(user);
    				}
    				if (typeof this.props.hideModal == 'function') {
    					this.props.hideModal();
    				}
    			}else{
    				AlertIOS.alert(
						"Sign Up problem",
						"Something went wrong signing up!"
					);
					this.refs.emailInput.focus()
    			}


    			this.setState({loading: false})
    		}, (error) => {
    			AlertIOS.alert(
					"Sign Up problem",
					error.message
				);
				this.setState({loading: false})
    		});
    	}else{
    		AlertIOS.alert(
				"Passwords don't match",
				"The password you gave does not match the confirmation password"
			);
			this.refs.passwordInput.focus()
    	}
    }

	render() {
		return (
			<TouchableHighlight style={styles.container} activeOpacity={1}
			onPress={() => dismissKeyboard()}
			>
			<View style={styles.container}>
				<View style={styles.topBar}></View>
				<View style={{width: width, flexDirection: "column", flex: 1, marginTop: 30}}>
				<Text style={styles.titleStyle}>Sign Up</Text>
				<View style={styles.inputContainerView}>
					<View style={{flexDirection: 'row'}}>
						<Image
							style={styles.loginIconsEmail}
							source={require('../img/user.png')}/>
						<TextInput style= {styles.textField}
							onChangeText={(text) => this.setState({username: text})}
							value={this.state.username}
							onSubmitEditing={() => 
								this.refs.passwordInput.focus()
							}
							ref="emailInput"
							returnKeyType='next'
							autoCorrect={false}
							disabled={this.state.loading}
							placeholder="email"/>
					</View>
					<View style={styles.separationBar}></View>
					<View style={{flexDirection: 'row'}}>
						<Image
							style={styles.loginIconsPassword}
							source={require('../img/password.png')}/>
						<TextInput style={styles.textField}
							disabled={this.state.loading}
							onChangeText={(text) => this.setState({password: text})}
							value={this.state.password}
							returnKeyType='next'
							onSubmitEditing={() => 
								this.refs.passwordConfirmInput.focus()
							}
							ref="passwordInput"
							autoCorrect={false}
							secureTextEntry={true}
							placeholder="password"/>
					</View>
					<View style={styles.separationBar}></View>
					<View style={{flexDirection: 'row'}}>
						<Image
							style={styles.loginIconsPassword}
							source={require('../img/password.png')}/>
						<TextInput style={styles.textField}
							disabled={this.state.loading}
							onChangeText={(text) => this.setState({passwordConfirm: text})}
							onSubmitEditing={this.signUp.bind(this)}
							ref="passwordConfirmInput"
							value={this.state.passwordConfirm}
							returnKeyType='go'
							autoCorrect={false}
							secureTextEntry={true}
							placeholder="confirm password"/>
					</View>
				</View>

					<ActivityIndicatorIOS
						animating={this.state.loading}
						hidesWhenStopped={true}
						size="small"/>
					<TouchableHighlight style={[styles.button, this.state.loading ? {backgroundColor: "#cadb66"} : null]}
						onPress={this.signUp.bind(this)}
						disabled={this.state.loading}
						underlayColor='#cadb66'>
			    		<Text style={styles.buttonText}>Sign up</Text>
			  		</TouchableHighlight>
				</View>

				<Text style={styles.cancel} onPress={this.props.hideModal}>Cancel</Text>
				<View style={styles.bottomBar}></View>
			</View>
			</TouchableHighlight>
		);
	}
}

module.exports = SignUp;