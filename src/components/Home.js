'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');
var User = require('./User').default;
var Hunts = require('./Data');

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
        flex: 1,
        justifyContent: 'space-between'
    },
    container:{
        flex: 1,
    },
    emptyContainerTop: {
        backgroundColor: 'white',
        paddingTop: 5,
        flexDirection: 'column',
        height: 70,
    },
    emptyContainerBottom: {
      backgroundColor: 'white',
      flexDirection: 'column',
      height: 52,
      borderTopWidth: 3,
      borderColor: '#23B090'
    },
    separator: {
        height: 10,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Verlag-Book',
        color: '#242021',
    },
    description: {
        paddingTop: 0,
        paddingBottom: 4,
        fontFamily: 'Verlag-Book',
        color: '#242021'
    },
    points: {
        fontWeight: 'bold'
    },
    currentRowContainer: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FEF7C0',
        borderRadius: 3
    },
    pastRowContainer: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#E8F3BB',
        borderRadius: 3
    },

    header: {
        height: 30,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'column',

    },
    headerText: {
        fontSize: 25,
        fontFamily: 'Verlag-Book',
        color: '#242021',
    },
    extraInfoContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10
    },
    searchBar: {
        height: 25,
        backgroundColor: '#E4EEEC',
        borderRadius: 5,
        justifyContent: 'center',
        paddingLeft: 4
    },
    images: {
      width: 80,
      height: 80,
      backgroundColor: 'red',
      alignSelf: 'center',
      marginRight: 10
    },
    searchIcon: {
      width: 13,
      height: 13,
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
            rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid
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
        console.log('huntslist is' + huntsList);
        huntsListRef.on('value', (snap) => {
            huntsList = snap.val();
            return huntsList;
        });
    },

    // the whole function 7/21/16 AES
    getCompletedHuntsList: function() {

        console.log("running getHuntsList");
        var currentUser = User.getCurrentUser();
        var userRef = usersRef.child(currentUser.uid);
        var huntsListRef = userRef.child("hunts_list");
        var huntsList;
        console.log('huntslist is' + huntsList);
        huntsListRef.on('value', (snap) => {
            huntsList = snap.val();
            return huntsList;
        });
    },
    // end of this function 7/21/16 AES

    // Will load all the things!
    listenForItems: function() {
        console.log("running listenForItems");
        console.log(this.state);
        User.getCurrentUser().getHuntsList().then((huntsList) => {
            Hunts.getHuntObjects(huntsList).then((hunts) => {
                console.log("Loaded hunts: " + hunts + "\nSetting the state");
                console.log("State was: ");

            //    var newDataSource = this.state.dataSource.clonewithRowsAndSections({current: hunts}, ['current']);
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
                      <View style={styles.images}>
                      <Text> Image goes here! </Text>
                      </View>
                        <View style={styles.textContainer}>
                          <View>
                            <Text style={styles.title} numberOfLines={1}>{hunt.title.toUpperCase()}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{hunt.description}</Text>
                          </View>
                          <View>
                            <Progress.Bar style={styles.progressBar}
                                progress={hunt.progress} width={200} borderRadius={0} border={0} height={10} color='#ffd900' backgroundColor='white'/>
                          </View>
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
                <View style={styles.emptyContainerTop}>
                </View>

                <View style={styles.extraInfoContainer}>
                  <View style={styles.searchBar}>
                    <Image source={require('./28magnifier.png')}
                    style={styles.searchIcon} />
                  </View>

                <View style={styles.separator}>
                </View>

                  <View style={styles.header}>
                    <Text style={styles.headerText}> Current Puzzles </Text>
                  </View>

                </View>

                {internalView}

                <View style={styles.emptyContainerBottom}>
                </View>
            </View>
        );
    },
});

module.exports = Home;
