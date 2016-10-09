'use strict';

var ReactNative = require('react-native');
var React = require('react');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');
var User = require('./User').default;
var Data = require('./Data');
var SearchController = require('./SearchController');
var CreateHunt = require('./CreateHuntOverview');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    TextInput,
    Text,
    AlertIOS,
    Dimensions
} = ReactNative;

var {
    Component,
} = React;

var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
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
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FEF7C0',
        borderRadius: 3
    },
  header: {
        height: 30,
        backgroundColor: 'white',
        flexDirection: 'column',
        marginBottom: 10,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    headerText: {
      fontSize: 25,
      fontFamily: 'Verlag-Book',
      color: '#242021',
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
    },
    button: {
        justifyContent: 'center',
        backgroundColor: '#242021',
        width: 30,
        height: 30   
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

const storage = Firebase.storage();
const storageRef = storage.ref();

/**
 * The Create view for the app. It is a list of created hunts
 */
var Create = React.createClass({

    getInitialState: function() {
        console.log("running getInitialState");
        var huntsList;

        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid
        });

        return {
            dataSource: dataSource,
            huntsList: huntsList,
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
        console.log('completedhuntslist is' + huntsList);

        huntsListRef.on('value', (snap) => {
            huntsList = snap.val();
            return huntsList;
        });

    },
    // end of this function 7/21/16 AES

    // Will load all the things!
    listenForCreatedItems: function() {
        console.log("running listenForCreatedItems");
        console.log(this.state);

        User.getCurrentUser().getCreatedHunts().then((huntsList) => {
            Data.getHuntObjects(huntsList).then((hunts) => {
                console.log("Loaded hunts: " + hunts + "\nSetting the state");
                console.log("State was: ");

                var thisIsNew = new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
                    sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid
                });
                var newDataSource = thisIsNew.cloneWithRows(hunts);
                console.log("Now it is: ");
                this.setState({
                    hunts: hunts,
                    dataSource: newDataSource,
                })


            })
        });
    },

    componentDidMount: function() {
      console.log('component did mount.');
      this.listenForCreatedItems();
    },

    rowPressed: function(hunt) {
        this.props.navigator.push({
            title: "CreateHunt",
            component: CreateHunt,
            passProps: {
               
            }
        });
    },

    // AES 7/29/16. Function currently not used, but gets the download url from a hunt
    getImage: function(hunt) {
        var huntImage = storageRef.child(hunt.imagename);
        console.log(`current hunt image is ${huntImage}`);
        let huntImageURL;

        huntImage.getDownloadURL().then((url) => {
          huntImageURL = url;

          console.log(`laterhunt image is ${huntImage}`);
          huntsRef.child(hunt.id).update({imageURL: huntImageURL});
          console.log(`the saved image url is ${huntImageURL}`);

        });
    },

    renderRow: function(hunt) {

        var huntimage = hunt.image;
        console.log(`current image is ${huntimage}`);

        console.log("Rendering row for hunt " + hunt.id);
        return (
            <TouchableHighlight onPress={() => this.rowPressed(hunt)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>

                      <Image source={{uri: huntimage}} style={styles.images} />

                        <View style={styles.textContainer}>
                          <View>
                            <Text style={styles.title} numberOfLines={1}>{hunt.name.toUpperCase()}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{hunt.desc}</Text>
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


    /*
    <View style={styles.container}>
        <View style={styles.emptyContainerTop}>
        </View>

        <View style={styles.extraInfoContainer}>
          <View style={styles.searchBar}>
            <Image source={require('../img/28magnifier.png')}
            style={styles.searchIcon} />
          </View>

        <View style={styles.separator}>
        </View>
        */

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

              {searchController}
              <View style={styles.extraInfoContainer}>
              <View style={styles.separator}>
              </View>

                  <View style={styles.header}>
                    <View style={styles.headerButtons}>
                    <View>
                      <Text style={styles.headerText}> Created Puzzles</Text>
                    </View>

                    </View>

                  </View>

                </View>

                {internalView}
                <TouchableHighlight onPress={() => this.rowPressed()}
                underlayColor='#dddddd'>
                    <View style={styles.button}>

                    </View>
                </TouchableHighlight>

                <View style={styles.emptyContainerBottom}>
                </View>
            </View>
        );
    },
});

module.exports = Create;
