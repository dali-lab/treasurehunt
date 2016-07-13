'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');
var User = require('./User').default;

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
        var huntsList;

        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        
        return {
            dataSource: dataSource,
            huntsList: huntsList
        };

    },

    // Will load all the things!
    listenForItems: function() {
        User.getCurrentUser().getHuntsList().then((huntsList) => {
            this.updateStateWithHunts(huntsList);
        });
    },

    updateStateWithHunts: function(huntsList) {

        var hunts = [];

        for (var key in huntsList) {
            var huntRef = huntsRef.child(key);
            //get that hunt, calculate user progress, get hunt data
            //for now, if they're only on first clue set progress to 0
            huntRef.on('value', (snap) => {
                var totalCluesInHunt = snap.val().clues.length;
                var keys = Object.keys(huntsList[snap.key()]);
                var totalCluesCompleted = keys.length;

                //TODO: get last clue, check if it's complete. if not don't add it to totalCluesCompleted
                if (totalCluesCompleted == 1) {
                    totalCluesCompleted = 0;
                }
                hunts.push({
                    id: snap.key(),
                    title: snap.val().title,
                    description: snap.val().description,
                    image: snap.val().image,
                    progress: totalCluesCompleted/totalCluesInHunt,
                    clues: snap.val().clues
                });
                
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHuntsArrayToMap(hunts))
                });
            });
        }

        this.setState({
            hunts: hunts
        })
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
    },

    render: function() {
        var listView = <ListView
                        dataSource={this.state.dataSource}
                        automaticallyAdjustContentInsets={false}
                        renderRow={this.renderRow}/>

        var noHunts = <View style={noHuntsStyle.noHuntsView}>
                        <Text style={noHuntsStyle.noHuntsText}>You have no hunts yet</Text>
                    </View>

        var internalView = <View></View>

        // if (this.hunts === null || this.hunts.length === 0) {
        //     internalView = noHunts
        // }else{
            internalView = noHunts
        // }

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