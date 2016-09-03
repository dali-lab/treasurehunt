var ReactNative = require('react-native');
var React = require('react');
var CurrentClueDisplay = require('./CurrentClueDisplay');
var CompletedClueDisplay = require('./CompletedClueDisplay');
var User = require('./User').default

import ClueController from "./ClueController";

var {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableHighlight,
	ListView,
    Alert
} = ReactNative;


var {
    Component,
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
	huntTitle: {
		fontSize: 25,
		marginTop: 20,
		fontFamily: 'Verlag-Book',
		color: '#242021',
		alignSelf: 'center'
	},
    topSeparator: {
        height: 2,
        backgroundColor: '#5da990'
    },
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
        color: '#000000',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    description: {
        paddingTop: 3,
        paddingBottom: 8,
        alignSelf: 'center',
				color: '#242021',
    },
    statusDescription: {
        marginTop: 15,
    	alignSelf: 'center',
		fontSize: 16,
		color: '#242021',
    },
    lockedDescription: {
    	textAlign: 'center',
			fontWeight: 'bold',
    	fontSize: 25,
			color: '#242021',
    },
    rowContainer: {
	    flexDirection: 'row',
	    padding: 10,
      paddingTop: 10,
	    height: 90,
	    justifyContent: 'center',
  	},
    completeTextContainer: {
        paddingTop: 10,
    		flex: 1,
        backgroundColor: '#e8f0cd',
				borderRadius: 3
	},
    inProgressTextContainer: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#FFFACD',
				borderRadius: 3
    },
    incompleteTextContainer: {
        paddingTop: 10,
	    flex: 1,
	    backgroundColor: '#f6d1d0',
			borderRadius: 3,
    }
});

const Firebase = require('firebase')
const config = require('../../config')
import rootRef from '../../newfirebase.js'


const cluesRef = rootRef.ref('clues');
const huntRef = rootRef.ref('hunts');
const userSolutionsRef = rootRef.ref('user_solutions');

// AES 8/3/16
const usersRef = rootRef.ref('users');


/*
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)
const userSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/user_solutions`)
*/

var ClueList = React.createClass({
    controller: React.PropTypes.object.isRequired,

	getInitialState: function() {
        this.hunt = this.props.controller.hunt;
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return true;
            },
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        return {
            dataSource: dataSource
        }
    },

    componentWillMount: function() {
        this.props.controller.dataLoadAddCallback((controller) => {
            // Now we know we have to have data!
            this.updateDataSource();

            // This will force the list to reload when the user hunt state changes
            controller.userHuntAddListener((val) => {
                console.log("Got a callback!");
                this.updateDataSource();
            });
        })
    },

    updateDataSource: function() {
        var clues = this.props.controller.clues
        var newDataSource = this.state.dataSource.cloneWithRows(clues);

        this.setState({
            dataSource: newDataSource
        })
    },

    rowPressed: function(clue) {
        if (clue.status == ClueController.IN_PROGRESS) {
            this.props.navigator.push({
                title: "Hunt",
                component: CurrentClueDisplay,
                passProps: {
                    controller: this.props.controller,
                    clue: clue
                }
            });
        }
    },

    renderRow: function(rowData, sectionID, rowID) {
    	if (rowData.status === ClueController.COMPLETE) {
	      	return (
	      		<TouchableHighlight
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.completeTextContainer}>
                            <Text style={styles.statusDescription}
                                >- COMPLETED -</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
	      	);
    	}
        else if (rowData.status === ClueController.IN_PROGRESS || rowData.status === ClueController.SKIPPED) {
            return (
                <TouchableHighlight onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.inProgressTextContainer}>
                            <Text style={styles.statusDescription}
                                >- {rowData.status === ClueController.SKIPPED ? "SKIPPED" : "IN PROGRESS"} -</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
            );
        }
        else {
	      	return (
            <TouchableHighlight
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.incompleteTextContainer}>
							<Text style={styles.statusDescription}>- LOCKED -</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        	);
    	}
	},

	render: function() {
		var hunt = this.hunt;

		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
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
