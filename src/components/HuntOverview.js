
var React = require('react-native');
var ClueList = require('./ClueList');

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
		flex: 1,
	},
	separatorSmall: {
		height: 16,
	},
	separatorLarge: {
		height: 26,
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
    alignSelf: 'center',
		fontSize: 16,
		fontFamily: 'Verlag-Book',
		color: '#242021',
    },
	title: {
		fontSize: 25,
		margin: 5,
		color: '#242021',
		alignSelf: 'center',
		fontFamily: 'Verlag-Book',
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center',
	  fontWeight: 'bold',
		fontFamily: 'Verlag-Book'
	},
	button: {
	  height: 36,
	  flexDirection: 'column',
	  backgroundColor: '#cadb66',
	  borderColor: '#cadb66',
	  justifyContent: 'center',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  padding:20,
	}
});


class HuntOverview extends Component {
	onStartPressed() {
		this.props.navigator.push({
            title: "Hunt",
            component: ClueList,
            passProps: {
                hunt: this.props.hunt,
            }
        });
				console.log('1111111111111111111111111111');
				console.log(`the hunt overview id of current hunt is ${JSON.stringify(this.props.hunt.id)}`);
	}

	onExitPressed() {
		this.props.navigator.pop();
	}

	render() {
		var hunt = this.props.hunt;
//		console.log(hunt.category);
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
						<Text style = {styles.buttonText}>OPEN HUNT</Text>
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


module.exports = HuntOverview;
