'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');
var User = require('./User').default;
var Hunts = require('./Hunts');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component,
    AlertIOS,
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

var noHuntsStyle = StyleSheet.create({
    noHuntsView: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    noHuntsText:{
        fontSize: 20,
    }
})

const Firebase = require('firebase')
const config = require('../../config')
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const rootRef = new Firebase(`${ config.FIREBASE_ROOT }`)
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)

/**
 * The Home view for the app. It is a list of hunts
 */
var Home = React.createClass({

    getInitialState: function() {
        console.log("running getInitialState");
        var huntsList;

        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid !== r2.guid
        });
        
        return {
            dataSource: dataSource,
            huntsList: huntsList
        };
    },

    getHuntsList: function() {

        console.log("running getHuntsList");
        var currentUser = User.getCurrentUser();
        var userRef = usersRef.child(currentUser.uid);
        var huntsListRef = userRef.child("hunts_list");
        var huntsList;

        huntsListRef.on('value', (snap) => {
            huntsList = snap.val();
            return huntsList;     
        });
    },

    convertHuntsArrayToMap: function(hunts) {
        console.log("running convertHuntsArrayToMap");
        var huntsCategoryMap = {};
        for (var i =0; i < hunts.length; i++ ) {
            if (!huntsCategoryMap[hunts[i].category]) {
                huntsCategoryMap[hunts[i].category] = [];
            }
            huntsCategoryMap[hunts[i].category].push(hunts[i]);
        }

        return huntsCategoryMap;
    },

    // Will load all the things!
    listenForItems: function() {
        console.log("running listenForItems");
        console.log(this.state);
        User.getCurrentUser().getHuntsList().then((huntsList) => {
            Hunts.getHuntObjects(huntsList).then((hunts) => {
                console.log("Loaded hunts: " + hunts + "\nSetting the state");
                console.log("State was: ");

                var newDataSource = this.state.dataSource.cloneWithRows(hunts);
                console.log("Now it is: ");
                this.setState({
                    hunts: hunts,
                    dataSource: newDataSource
                })
            })
        });
    },

    componentDidMount: function() {
        this.listenForItems();
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
        // <Image style={styles.thumb} source={{ uri: hunt.image}} />

        console.log("Rendering row for hunt " + hunt.id);
        return (
            <TouchableHighlight onPress={() => this.rowPressed(hunt)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.currentRowContainer}>
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
    },

    render: function() {

        console.log("running render ...");
        var listView = <ListView
                        dataSource={this.state.dataSource}
                        automaticallyAdjustContentInsets={false}
                        renderRow={this.renderRow}/>

        console.log("listView Done");

        var noHunts = <View style={noHuntsStyle.noHuntsView}>
                        <Text style={noHuntsStyle.noHuntsText}>You have no hunts yet</Text>
                    </View>

        console.log("noHunts done");

        var internalView;

        console.log(internalView);
        if (this.state.hunts == undefined) {
            internalView = <View style={noHuntsStyle.noHuntsView}>
                            <Text style={noHuntsStyle.noHuntsText}>Loading...</Text>
                        </View>
        }else if (this.state.hunts === null || this.state.hunts.length === 0) {
            internalView = noHunts;
        }else{
            internalView = listView;
        }


        console.log("internalView rendered. Returning");
        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                </View>
                {internalView}
            </View>
        );
    },
});

module.exports = Home;