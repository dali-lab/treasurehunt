
var React = require('react-native');
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
		marginTop: 65
	},
	heading: {
		backgroundColor: '#F8F8F8',
	},
	separator: {
		height: 1,
		backgroundColor: '#DDDDDD'
	},
	image: {
		width: 300,
		height: 200,
		justifyContent: 'center'
	},
	description: {
        paddingTop: 3,
        paddingBottom: 8
    },
	title: {
		fontSize: 20,
		margin: 5,
		color: '#656565'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	}
});


class HuntView extends Component {
	onStartPressed() {
		console.log('start pressed');
	}

	render() {
		var hunt = this.props.hunt;

		return (
			<View style={styles.container}>
				<View style={styles.heading}>
					<Text style={styles.title}>{hunt.title}</Text>
					<View style={styles.separator}/>
				</View>
				<Image style={styles.image}
					source={{uri: hunt.image}} />
				<Text style={styles.description}>{hunt.description}</Text>
				<TouchableHighlight style = {styles.button}
						onPress={this.onStartPressed.bind(this)}
						underlayColor='#99d9f4'>
						<Text style = {styles.buttonText}>GET STARTED</Text>
					</TouchableHighlight>
			</View>
		);
	}
}


module.exports = HuntView;

