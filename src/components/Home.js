'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component,
} = React; 

var styles = StyleSheet.create({
    thumb: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    container:{
        flex: 1
    },
    emptyContainer: {
        backgroundColor: 'white',
        paddingTop: 5, 
        flexDirection: 'column',
        height: 70
    },
    separator: {
        height: 10,
        backgroundColor: '#FFFFFF'
    },
    title: {
        fontSize: 20,
        color: '#656565',
    }, 
    description: {
        paddingTop: 3,
        paddingBottom: 4
    },
    points: {
        fontWeight: 'bold'
    },
    currentRowContainer: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFFACD'
    },
    pastRowContainer: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#e8f0cd'
    },
    header: {
        height: 30,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    headerText: {
        fontSize: 20,
        padding:10,
        color: 'black'
    }
});

const Firebase = require('firebase')
const config = require('../../config')
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const rootRef = new Firebase(`${ config.FIREBASE_ROOT }`)



var Home = React.createClass({

    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        
        return {
            dataSource: dataSource
        };

    },

    convertHuntsArrayToMap: function(hunts) {
        var huntsCategoryMap = {};
        for (var i =0; i < hunts.length; i++ ) {
            if (!huntsCategoryMap[hunts[i].category]) {
                huntsCategoryMap[hunts[i].category] = [];
            }
            huntsCategoryMap[hunts[i].category].push(hunts[i]);
        }

        return huntsCategoryMap;
    },

    listenForItems: function(huntsRef) {
        //TODO: replace userHuntsArray with specific list of user hunts/solutions
        var userHuntsArray = {
            0: [1],
            1: [2,3],
            2: [8, 9, 10],
            3: [11, 12, 13],
        };

        var newUserHuntsArray = [0,1,2,3];
        var hunts = [];

        //for each hunt the user has completed
        for (var key in userHuntsArray) {
            var huntRef = huntsRef.child(key);
            
            //get that hunt, calculate user progress, get hunt data
            huntRef.on('value', (snap) => {
                var totalCluesInHunt = snap.val().clues.length;
                var totalCluesCompleted = userHuntsArray[snap.key()].length;
                if (totalCluesInHunt===totalCluesCompleted) {
                    hunts.push({
                        id: snap.key(),
                        title: snap.val().title,
                        description: snap.val().description,
                        image: snap.val().image,
                        progress: totalCluesCompleted/totalCluesInHunt,
                        category: "  Past Puzzles", 
                        clues: snap.val().clues
                });
                }
                else {
                    hunts.push({
                        id: snap.key(),
                        title: snap.val().title,
                        description: snap.val().description,
                        image: snap.val().image,
                        progress: totalCluesCompleted/totalCluesInHunt,
                        category: "  Current Puzzles",
                        clues: snap.val().clues
                    });
                }
                
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHuntsArrayToMap(hunts))
                });
            });
        }
    },

    componentDidMount: function() {
        this.listenForItems(huntsRef);
    },

    rowPressed: function(hunt) {
        this.props.navigator.push({
            title: "Hunt",
            component: HuntOverview,
            passProps: {
                hunt: hunt,
            }
        });
    },

    renderRow: function(hunt) {
        if (hunt.category == "  Past Puzzles") {
            return (
                <TouchableHighlight onPress={() => this.rowPressed(hunt)}
                    underlayColor='#dddddd'>
                    <View>
                        <View style={styles.pastRowContainer}>
                            <Image style={styles.thumb} source={{ uri: hunt.image}} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={1}>{hunt.title.toUpperCase()}</Text>
                                <Text style={styles.description}
                                    numberOfLines={2}>{hunt.description}</Text>
                                <Text style={styles.points}
                                    numberOfLines={1}>Points: N/A </Text>
                            </View> 
                        </View>
                        <View style={styles.separator}/>
                    </View>
                </TouchableHighlight>
            );
        }
        else {
            return (
                <TouchableHighlight onPress={() => this.rowPressed(hunt)}
                    underlayColor='#dddddd'>
                    <View>
                        <View style={styles.currentRowContainer}>
                            <Image style={styles.thumb} source={{ uri: hunt.image}} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={1}>{hunt.title.toUpperCase()}</Text>
                                <Text style={styles.description}
                                    numberOfLines={2}>{hunt.description}</Text>
                                <Progress.Bar style={styles.progressBar} 
                                    progress={hunt.progress} width={200} height={10} color='#fbda3d'/>
                            </View> 
                        </View>
                        <View style={styles.separator}/>
                    </View>
                </TouchableHighlight>
            );
        }
    },

    renderSectionHeader: function(sectionData, category) {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{category}</Text>
            </View>
        );
    },

    render: function() {
        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    automaticallyAdjustContentInsets={false}
                    renderRow={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader}/>
            </View>
        );
    },
});

module.exports = Home;