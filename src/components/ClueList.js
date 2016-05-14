var React = require('react-native');
var ClueDisplay = require('./ClueDisplay');

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
        alignSelf: 'center'
    }, 
    description: {
        paddingTop: 3,
        paddingBottom: 8,
        alignSelf: 'center'
    },
    statusDescription: {
    	paddingTop: 5,
    	paddingBottom: 8,
    	alignSelf: 'center',
    },
    lockedDescription: {
    	textAlign: 'center',
    	fontSize: 25,
    	paddingTop: 10
    },
    rowContainer: {
	    flexDirection: 'row',
	    padding: 10,
	    height: 75,
	    justifyContent: 'center'
  	},
    completeTextContainer: {
    	flex: 1,
	    borderWidth: 2,
	    borderColor:'#000000', 
	},
    incompleteTextContainer: {
	    flex: 1,
	    backgroundColor: '#dddddd',
	    borderWidth: 2,
	    borderColor:'#000000', 
    }
});

const Firebase = require('firebase')
const config = require('../../config')
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)

var ClueList = React.createClass({
	getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        
        return {
            dataSource: dataSource
        };
    },

    convertCluesArrayToMap: function(clues) {
        var cluesCategoryMap = {};

        for (var i =0; i < clues.length; i++ ) {
            if (!cluesCategoryMap[clues[i].category]) {
                cluesCategoryMap[clues[i].category] = [];
            }
            cluesCategoryMap[clues[i].category].push(clues[i]);
        }
        return cluesCategoryMap;
    },

    listenForItems: function(cluesRef) {
        //TODO: fix logic coming from completed clue
        var userCompletedClues = [0, 1, 2, 5];

        //check if most recent clue is in progress or not
        
        
        var cluesArray = this.props.hunt.clues;

        var clues = [];
        for (var i = 0; i < cluesArray.length; i++) {
        	var clueRef = cluesRef.child(cluesArray[i]);
        	clueRef.on('value', (snap) => {
        		if (userCompletedClues.indexOf(snap.val().id) > -1) {
	        		clues.push({
	        			title:snap.val().title,
	        			description: snap.val().description,
	        			category: "complete", 
                        clueId: snap.val().id
	        		});
	        	}
        		else {
        			clues.push({
	        			title:snap.val().title,
	        			description: snap.val().description, 
	        			category: "incomplete",
                        clueId: snap.val().id
        			});
        		}
        		this.setState({
            		dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertCluesArrayToMap(clues))
            	});
        	});
        }
    },

    componentDidMount: function() {
        this.listenForItems(cluesRef);
    },

    rowPressed: function(clueId) {
        //TODO: if clue is completed, load solution. 
        //if clue is in progress, load current progress
        console.log('row pressed');
        this.props.navigator.push({
            title: "Hunt",
            component: ClueDisplay,
            passProps: {
                hunt: this.props.hunt,
                clueId: clueId
            }
        });
    },

    renderRow: function(rowData, sectionID, rowID) {
    	if (rowData.category === "complete") {
	      	return (
	      		<TouchableHighlight onPress={() => this.rowPressed(rowData.clueId)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.completeTextContainer}>
                            <Text style={styles.title}>{rowData.title}</Text>
                            <Text style={styles.statusDescription}
                                >- COMPLETED -</Text>
                        </View> 
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
	      	);
    	} else {
	      	return (
            <TouchableHighlight
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.incompleteTextContainer}>
                            <Text style={styles.lockedDescription}
                                >- LOCKED -</Text>
                        </View> 
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        	);
    	}
	},

	// unneccessary unless we want different sections
    // renderSectionHeader(sectionData, category) {
    //     return (
    //         <View style={styles.header}>
    //             <Text style={styles.headerText}>{category}</Text>
    //         </View>
    //     );
    // }

	render: function() {
		var hunt = this.props.hunt;
		var huntRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`);
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
					<Text style={styles.huntTitle}>CLUES LIST</Text>
				</View>
				<View style={styles.separatorSmall}/>
				<ListView
                    dataSource={this.state.dataSource}
                    automaticallyAdjustContentInsets={false}
                    renderRow={this.renderRow}/>
			</View>
		);
	},
});

module.exports = ClueList;

