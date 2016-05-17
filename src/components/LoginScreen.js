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
  Component
} = React;

var styles = StyleSheet.create({
	icon: {
		marginTop: 50,
		width: 144,
		height: 120,
	},
	container: {
		alignItems: 'center'
	},
	titleStyle: {
		marginTop: 20,
		marginBottom: 40,
		fontSize: 25,
		color: "#59aa91",
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center',
		fontWeight: 'bold',
	},
	button: {
		height: 36,
		flex: 1,
		marginLeft: 50,
		marginRight: 50,
		flexDirection: 'row',
		backgroundColor: '#bfcf60',
		borderColor: '#bfcf60',
		borderWidth: 1,
		borderRadius: 8,
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
		flex: 1,
	},
	loginTextInputMainView: {
		height: 90,
		borderColor: '#f0f8f5',
		borderWidth: 3,
		marginLeft: 50,
		marginRight: 50,
		borderWidth: 1,
		borderRadius: 8,
		backgroundColor: "#f0f8f5",
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'stretch',
		bottom: 20,
	},
	loginIcons: {
		top: 5,
		left: 5,
		height: 30,
		width: 30,
		alignSelf: 'stretch',
		flexDirection: 'row',
	},
	topBar: {
		height: 40,
		marginLeft: 0,
		flexDirection: 'row',
		alignSelf: 'stretch',
		backgroundColor: '#72b7a3',
	},
	separationBar: {
		backgroundColor: "#1d8377",
		height: 1,
		width: 260,
		alignSelf: 'center',
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

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.topBar}></View>
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
					underlayColor='#99d9f4'>
		    		<Text style={styles.buttonText}>Sign in</Text>
		  		</TouchableHighlight>
		  	</View>
	  	);
	}
}

module.exports = LoginScreen;