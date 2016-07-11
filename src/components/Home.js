'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');
var HuntOverview = require('./HuntOverview');
var User = require('./User').default

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

var Home = React.createClass({

    getInitialState: function() {

        var userHuntsArray = {
            0: [1],
            1: [2,3],
            2: [8, 9, 10],
            3: [11, 12, 13],
        };
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

    getHuntsList: function() {
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
        var huntsCategoryMap = {};
        for (var i =0; i < hunts.length; i++ ) {
            if (!huntsCategoryMap[hunts[i].category]) {
                huntsCategoryMap[hunts[i].category] = [];
            }
            huntsCategoryMap[hunts[i].category].push(hunts[i]);
        }

        return huntsCategoryMap;
    },

    listenForItems: function() {
        var currentUser = User.getCurrentUser();
        var userRef = usersRef.child(currentUser.uid);
        var huntsListRef = userRef.child("hunts_list");
        var huntsList; 

        huntsListRef.on('value', (snap) => {
            huntsList = snap.exportVal();
            this.updateStateWithHunts(huntsList);
        });
    },

    updateStateWithHunts: function(huntsList) {

        var hunts = [];
        //for each hunt the user has completed
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
                    totalCluesCompleted =0;
                }
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