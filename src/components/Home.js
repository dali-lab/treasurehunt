'use strict';


var React = require('react-native');
var Progress = require('react-native-progress');

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
        height: 2
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
        height: 95,
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


class Home extends Component {
    constructor(props) {
        super(props);
        var currentHunts = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.guid != r2.guid});
        var pastHunts = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.guid != r2.guid});
        this.state = {
            currentHunts: currentHunts,
            pastHunts: pastHunts
        };
    }

    listenForItems(huntsRef) {
        //TODO: replace userHuntsArray with specific list of user hunts
        var userHuntsArray = {
            0: [1],
            1: [5, 6],
            2: [8, 9, 10],
            3: [11, 12, 13],
            3: [1]
        };

        var pastHunts = [];
        var currentHunts = [];
        
        //for each hunt the user has completed
        for (var key in userHuntsArray) {
            console.log("KEYY " + key);
            var huntRef = huntsRef.child(key);
            console.log("bostonhuntnew "  + " " + userHuntsArray[1].length);
            //get that hunt, calculate user progress, get hunt data
            huntRef.on('value', (snap) => {
                var totalCluesInHunt = snap.val().clues.length;
                var totalCluesCompleted = userHuntsArray[snap.key()].length;
                if (totalCluesInHunt===totalCluesCompleted) {
                    pastHunts.push({
                        title: snap.val().title,
                        description: snap.val().description,
                        image: snap.val().image,
                        progress: totalCluesCompleted/totalCluesInHunt
                });
                }
                else {
                    currentHunts.push({
                        title: snap.val().title,
                        description: snap.val().description,
                        image: snap.val().image,
                        progress: totalCluesCompleted/totalCluesInHunt
                    });
                }
                
                this.setState({
                    currentHunts: this.state.currentHunts.cloneWithRows(currentHunts),
                    pastHunts: this.state.pastHunts.cloneWithRows(pastHunts)
                });
            });
        }
    }

    componentDidMount() {
        this.listenForItems(huntsRef);
    }

    rowPressed(propertyGuid) {

    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight onPress={() => this.rowPressed(rowData.title)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <Image style={styles.thumb} source={{ uri: rowData.image}} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{rowData.title}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{rowData.description}</Text>
                            <Progress.Bar style={styles.progressBar} 
                                progress={rowData.progress} width={200} />
                        </View> 
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
      return (
        <View style= {styles.container}>
            <View style={styles.emptyContainer}>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerText}>  CURRENT PUZZLES</Text>
            </View>
            <ListView
              dataSource={this.state.currentHunts}
              automaticallyAdjustContentInsets={false}
              renderRow={this.renderRow.bind(this)}/>
            <View style={styles.header2}>
                <Text style={styles.headerText}>  PAST PUZZLES</Text>
            </View>
            <ListView
              dataSource={this.state.pastHunts}
              automaticallyAdjustContentInsets={false}
              renderRow={this.renderRow.bind(this)}/>
        </View>
        );
    }
}

module.exports = Home;