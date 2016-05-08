'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');
var HuntView = require('./HuntView');
var ReactFireMixin = require('reactfire');

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
    header: {
        height: 30,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    header2: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black'
    }
});

const Firebase = require('firebase')
const config = require('../../config')
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const rootRef = new Firebase(`${ config.FIREBASE_ROOT }`)



var Home = React.createClass({
    mixins: [ReactFireMixin],

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
            console.log('huntsarray' + i);
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
        
        // this.bindAsArray(huntsRef, newHuntsArray);
        // debugger;

        var newHuntsRef = rootRef.child("hunts");


        for (var huntID in newUserHuntsArray) {
            let thisHuntRef = newHuntsRef.child(huntID);
            let selectedRef = thisHuntRef.child("selected");
            selectedRef.set("true");
        }

        var queryRef = rootRef.orderByChild("hunts/selected");

        var solution1 = queryRef.equalTo("true").once('value', function(snap) {
            console.log('selected!!', snap.val())
        });
        var newSelectedRef = newHuntsRef.child("selected");
        console.log('newselected' + newSelectedRef);
        var solution = newSelectedRef
            .equalTo("true")
            .once('value', function(snap) {
                console.log('selected ones', snap.val())
            });



        // newHuntsRef.orderByChild("selected").equalTo(true).on("child_added", function(snapshot) {
        //   console.log(snapshot.key());
        // });

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
                        category: "  PAST HUNTS", 
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
                        category: "  CURRENT HUNTS",
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
            component: HuntView,
            passProps: {
                hunt: hunt,
            }
        });
    },

    renderRow: function(hunt) {
        return (
            <TouchableHighlight onPress={() => this.rowPressed(hunt)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <Image style={styles.thumb} source={{ uri: hunt.image}} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{hunt.title}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{hunt.description}</Text>
                            <Progress.Bar style={styles.progressBar} 
                                progress={hunt.progress} width={200} />
                        </View> 
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
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