'use strict';

var React = require('react-native');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');
var User = require('./User').default;
var Data = require('./Data');
var SearchController = require('./SearchController');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    TextInput,
    Text,
    Component,
    AlertIOS,
    Dimensions
} = React;

var screenWidth = Dimensions.get('window').width;

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


        backgroundColor: 'white',
        flexDirection: 'column',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    headerTextSelected: {
        fontSize: 25,
        fontFamily: 'Verlag-Book',
        color: '#242021',
    },
    headerTextUnselected: {
        fontSize: 25,
        fontFamily: 'Verlag-Book',
        color: 'grey',
    },
    startingHuntButton: {
        backgroundColor: "#FEF7C0",
        padding: 10,
        borderRadius: 8,
        marginTop: 10
    },
    startingHuntButtonText: {
        alignSelf: 'center',
        fontFamily: 'Verlag-Book',
        fontSize: 20,
        justifyContent: 'center'
    },
    extraInfoContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10
    },
    images: {
      width: 80,
      height: 80,
      borderRadius: 5,
      alignSelf: 'center',
      marginRight: 10
    },

    internalView: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    progressBar: {
        marginLeft: 5,
        marginBottom: 5,
        flex: 1
    }
});

var noHuntsStyle = StyleSheet.create({
    noHuntsView: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    noHuntsText:{
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Verlag-Book',
        width: 330
    }
});

const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js'


const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');

const storage = firebase.storage();
const storageRef = storage.ref();

var teletubbies = storageRef.child('teletubbies.jpg');


/*
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const rootRef = new Firebase(`${ config.FIREBASE_ROOT }`)
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
*/


// AES 7/28/16
// var url = 'gs://treasurehuntdali.appspot.com'
// const storage = new Firebase(`${url}`);
// storageRef = storage.key();

// const storage = Firebase.storage();
// const storageRef = storage.ref();


/**
 * The Home view for the app. It is a list of hunts
 */
var Home = React.createClass({

    getInitialState: function() {
        var huntsList;

        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.firstLoad = true;

        User.getCurrentUser().setUpListeners(() => {
            // the user hunt data function
            this.listenForItems();
        }, null /* The user data function */)

        return {
            dataSource: dataSource,
            huntsList: huntsList,
            searching: false,
            huntsList: huntsList,
            hunts: null,
            puzzle: 'current'
        };
    },

    getHuntsList: function() {
        var currentUser = User.getCurrentUser();
        var userRef = usersRef.child(currentUser.uid);
        var huntsListRef = userRef.child("hunts_list");
        var huntsList;
        huntsListRef.once('value', (snap) => {
            huntsList = snap.val();
            return huntsList;
        });
    },

    // the whole function 7/21/16 AES
    getCompletedHuntsList: function() {
        var currentUser = User.getCurrentUser();
        var userRef = usersRef.child(currentUser.uid);
        var huntsListRef = userRef.child("hunts_list");
        var huntsList;
        huntsListRef.once('value', (snap) => {
            huntsList = snap.val();
            return huntsList;
        });
    },
    // end of this function 7/21/16 AES


    listenForCompletedItems: function() {
      User.getCurrentUser().getCompletedHuntsList().then((huntsList) => {
        Data.getHuntObjects(huntsList).then((hunts) => {
            console.log("Loaded completed hunts: " + JSON.stringify(hunts) );
            var newDataSource = this.state.dataSource.cloneWithRows(hunts);
            this.setState({
                hunts: hunts,
                dataSource: newDataSource,
              })

          });
      }, () => {
        // ERROR: TODO deal with it
      });
    },

    // Will load all the things!
    listenForItems: function() {
        console.log("running listenForItems");
        console.log(this.state);

        User.getCurrentUser().getHuntsList().then((huntsList) => {
            Data.getHuntObjects(huntsList).then((hunts) => {
                if (hunts.length == 0 && this.firstLoad) {
                    AlertIOS.alert(
                        "Welcome!",
                        "Welcome to Treasurehunt. Would you like to start with the Activities Fair hunt?",
                        [
                            {text: "Close", onPress: ()=>{}, style: "cancel"},
                            {text: "Let's go!", onPress: ()=>{
                                User.currentUser.addStartingHunt().then(() => {
                                    this.firstLoad = true;
                                    this.setState({
                                        hunts: null
                                    })

                                    this.listenForItems();
                                });
                            }}
                        ]
                    );
                }

            //    var newDataSource = this.state.dataSource.clonewithRowsAndSections({current: hunts}, ['current']);
                var newDataSource = this.state.dataSource.cloneWithRows(hunts);
                this.setState({
                    hunts: hunts,
                    dataSource: newDataSource,
                })
            })
        });
    },

    componentDidUpdate: function(nextProps, nextState) {

        if (nextState.hunts != null) {
            if (nextState.hunts.length == 1 && this.firstLoad) {
                this.firstLoad = false
                this.rowPressed(nextState.hunts[0]);
            }
        }
    },

    componentWillMount: function() {
        if (this.state.puzzle === 'current'){
            this.listenForItems();
        } else if (this.state.puzzle == 'past'){
            this.listenForCompletedItems();
        }
    },

    rowPressed: function(hunt) {

        console.log("GOING -> ----->")
        console.log(`row pressed! hunt is: ${JSON.stringify(hunt)}`)
        this.props.navigator.push({
            title: "Hunt",
            component: HuntOverview,
            passProps: {
                hunt: hunt,
                huntAdded: this.listenForItems.bind(this)
            }
        });
    },

    // AES 7/29/16. Function currently not used, but gets the download url from a hunt
    getImage: function(hunt) {
        var huntImage = storageRef.child(hunt.imagename);
        let huntImageURL;

        huntImage.getDownloadURL().then((url) => {
          huntImageURL = url;
          huntsRef.child(hunt.id).update({imageURL: huntImageURL});
        });
    },

    renderRow: function(hunt, SectionID, rowID) {
        var huntimage = hunt.image;


        return (
            <TouchableHighlight onPress={() => this.rowPressed(hunt)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.currentRowContainer}>

                      <Image source={{uri: huntimage}} style={styles.images} />

                        <View style={styles.textContainer}>
                          <View>
                            <Text style={styles.title} numberOfLines={1}>{hunt.title.toUpperCase()}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{hunt.description}</Text>
                          </View>
                          <View>
                            <Progress.Bar style={styles.progressBar}
                                progress={hunt.progress} width={screenWidth - 160} borderRadius={0} border={0} height={10} color='#ffd900' backgroundColor='white'/>
                          </View>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    },

    isSearching: function() {
        return this.state.searching;
    },

    render: function() {
        var searchController = <SearchController
                                    ref="searchController"
                                    startSearching={() => {
                                        this.setState({searching: true});
                                    }}
                                    endSearching={() => {
                                        this.setState({searching: false});
                                    }}
                                    rowPressed={(hunt) => {
                                        this.rowPressed(hunt)
                                    }}/>;


        var listView = <ListView
                        dataSource={this.state.dataSource}
                        automaticallyAdjustContentInsets={false}
                        renderRow={this.renderRow}/>

        var noHunts = <View style={noHuntsStyle.noHuntsView}>
                        <Text style={[noHuntsStyle.noHuntsText, {}]}>You have no hunts yet</Text>
                        <TouchableHighlight
                            style={styles.startingHuntButton}
                            underlayColor="#fef48f"
                            onPress={() => {
                                User.currentUser.addStartingHunt().then(() => {
                                    this.setState({
                                        hunts: null
                                    })

                                    this.listenForItems();
                                });
                            }}><Text style={styles.startingHuntButtonText}>Start the Activity Fair Hunt</Text></TouchableHighlight>
                    </View>

        var internalView;

        if (this.state.hunts == undefined) {
            internalView = <View style={noHuntsStyle.noHuntsView}>
                            <Text style={noHuntsStyle.noHuntsText}>Loading...</Text>
                        </View>
        }else if (this.state.hunts === null || this.state.hunts.length === 0) {
            internalView = noHunts;
        }else{
            internalView = listView;
        }

        var currPuzzlesText = <View style={styles.header}>
                    <Text style={styles.headerText}> Current Puzzles </Text>
                </View>

        if (this.isSearching()) {
            currPuzzlesText = null;
            internalView = null;
        }


        /*
        For reference:
        <TextInput style= {styles.textField}
            ref="emailTextField"
            returnKeyType='next'
            onChangeText={(text) => this.setState({email: text})}
            onSubmitEditing={() =>
                this.refs.passwordTextField.focus()
            }
            value={this.state.email}
            disabled={this.state.processingLogin}/>*/

        return (
            <View style={styles.container}>
                <View style={styles.emptyContainerTop}>
                </View>

                <View style={styles.extraInfoContainer}>
                <View style={styles.separator}>
                </View>

                  <View style={styles.header}>
                    <View style={styles.headerButtons}>
                    {this.isSearching() ? null : <View style={styles.headerButtons}>
                    <TouchableHighlight underlayColor='#dddddd' onPress={() => {
                        var newDataSource = this.state.dataSource.cloneWithRows([]);
                        this.setState({
                            dataSource: newDataSource,
                            puzzle: "current"
                        });
                        this.listenForItems();
                    }}>
                      <Text style={this.state.puzzle == 'current' ? styles.headerTextSelected : styles.headerTextUnselected}>Current Puzzles</Text>
                    </TouchableHighlight>
                    </View>}

                    {this.isSearching() ? null : <View style={styles.headerButtons}>
                    <TouchableHighlight underlayColor='#dddddd' onPress={() => {
                        var newDataSource = this.state.dataSource.cloneWithRows([]);
                        this.setState({
                            dataSource: newDataSource,
                            puzzle: "past"
                        });
                        this.listenForCompletedItems();
                    }}>
                      <Text style={this.state.puzzle == 'past' ? styles.headerTextSelected : styles.headerTextUnselected}> Past Puzzles</Text>
                    </TouchableHighlight>
                    </View>}

                    </View>

                  </View>

                </View>

                {internalView}
                <View style={styles.emptyContainerBottom}/>
            </View>
        );
    },
});

module.exports = Home;
