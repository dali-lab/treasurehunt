
var React = require('react-native');
var Hunt = require('./Hunt');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight
} = React;

var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30, 
		flex: 1
	},
	heading: {
		backgroundColor: '#F8F8F8',
	},
	separatorSmall: {
		height: 16
	},
	separatorLarge: {
		height: 26
	},
	image: {
		width: 300,
		height: 200,
		alignSelf: 'center'
	},
	description: {
        paddingTop: 3,
        paddingBottom: 8,
        paddingRight: 23,
        paddingLeft: 23,
        alignSelf: 'center'
    },
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		margin: 5,
		color: '#656565',
		alignSelf: 'center'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flexDirection: 'column',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  justifyContent: 'center',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  padding:20
	}
});


class HuntView extends Component {
	onStartPressed() {
		this.props.navigator.push({
            title: "Hunt",
            component: Hunt,
            passProps: {
                hunt: this.props.hunt,
            }

        });
	}

	onExitPressed() {
		this.props.navigator.pop();
	}

	render() {
		var hunt = this.props.hunt;

		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.title}>{hunt.title.toUpperCase()}</Text>
				</View>
				<Image style={styles.image}
					source={{uri: hunt.image}} />
				<View style={styles.separatorSmall}/>
				<Text style={styles.description}>{hunt.description}</Text>
				<View style={styles.separatorLarge}/>
				<TouchableHighlight style = {styles.button}
						onPress={this.onStartPressed.bind(this)}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>GET STARTED</Text>
				</TouchableHighlight>
				<TouchableHighlight style = {styles.button}
						onPress={this.onExitPressed.bind(this)}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>RETURN HOME</Text>
				</TouchableHighlight>
			</View>
		);
	}
}


module.exports = HuntView;

