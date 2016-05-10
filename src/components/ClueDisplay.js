var React = require('react-native');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
} = React;

var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30, 
		flex: 1
	},
	separatorSmall: {
		height: 16
	},
	separatorLarge: {
		height: 26
	},
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
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


var ClueDisplay = React.createClass({

	onSubmitPressed: function() {
		console.log('submit pressed!');
	},

	render: function() {
		console.log('got to clue display');
		return (
			<View style={styles.container}>
				<Text style={styles.title}>CLUE</Text>
				<TouchableHighlight style = {styles.button}
						onPress={this.onSubmitPressed()}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>SUBMIT CLUE</Text>
				</TouchableHighlight>
			</View>
		);
	},
});

module.exports = ClueDisplay;

