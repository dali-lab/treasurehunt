var React = require('react-native');

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
	ListView
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
	huntTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		margin: 5,
		color: '#656565',
		alignSelf: 'center'
	},
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
        color: '#656565',
    }, 
    description: {
        paddingTop: 3,
        paddingBottom: 8
    },
    rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  textContainer: {
    flex: 1
  },
});

const Firebase = require('firebase')
const config = require('../../config')
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)

class Hunt extends Component {
	constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        
        this.state = {
            dataSource: dataSource
        };
    }
    //TODO: add categories,
    convertCluesArrayToMap(clues) {
        var cluesCategoryMap = {};
        var category = "Incomplete";

        for (var i =0; i < clues.length; i++ ) {
            cluesCategoryMap["Incomplete"].push(clues[i]);
        }
        return cluesCategoryMap;
    }

    listenForItems(cluesRef) {
        //TODO: replace userHuntsArray with specific list of user hunts/solutions
        var cluesArray = this.props.hunt.clues;

        var completeClues = [];
        var incompleteClues = [];
        //for each hunt the user has completed
        for (var key in cluesArray) {
            var clueRef = cluesRef.child(key);
            //get that hunt, calculate user progress, get hunt data
            clueRef.on('value', (snap) => {
            	var title = snap.val().title;
               	incompleteClues.push({
               		title:snap.val().title,
               		description: snap.val().description
               	});

            	this.setState({
            		dataSource: this.state.dataSource.cloneWithRowsAndSections(incompleteClues)
            	});
           });
    	}
    }

    componentDidMount() {
        this.listenForItems(cluesRef);
    }

    renderRow(clue) {
    	console.log("rowdata" + clue.title);
        return (
            <TouchableHighlight onPress={() => this.rowPressed(clue)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{clue}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{clue}</Text>
                        </View> 
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

	render() {
		var hunt = this.props.hunt;
		var huntRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`);
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
				</View>
				<View style={styles.separatorSmall}/>
				<ListView
                    dataSource={this.state.dataSource}
                    automaticallyAdjustContentInsets={false}
                    renderRow={this.renderRow.bind(this)}/>
			</View>
		);
	}
}

module.exports = Hunt;

