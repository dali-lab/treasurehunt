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
        paddingTop: 35, 
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
        var conDataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.guid != r2.guid});
        // var newData = {
        //    ["hunts": [
        //         { "title": "Dartmouth",
        //           "description": "A fun tour through Dartmouth"},

        //         { "title": "Boston",
        //           "description": "A fun tour through Boston"},
        //           ]
        //     ]
        // }
        this.state = {
            //dataSource: dataSource.cloneWithRows(["row 1", "row 2"])
            dataSource: conDataSource
        };
    }

    listenForItems(huntsRef) {
        console.log("HUNTSREFF");
        console.log(huntsRef);
        huntsRef.on('value', (snap) => {
            var hunts = [];
            snap.forEach((child) => {
                hunts.push({
                    title: child.val().title,
                    description: child.val().description,
                    image: child.val().image
                });
            });
            console.log('finalhunts');
            console.log(hunts);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(hunts)
            });
            console.log('datasource' + this.state.dataSource);
        });
    }

    componentDidMount() {
        this.listenForItems(huntsRef);
    }

    rowPressed(propertyGuid) {

    }

    renderRow(rowData, sectionID, rowID) {
        console.log("ROWDATAIMAGE" + rowData.image);
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
                                progress={0.3} width={150} />
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
              dataSource={this.state.dataSource}
              automaticallyAdjustContentInsets={false}
              renderRow={this.renderRow.bind(this)}/>
            <View style={styles.header}>
                <Text style={styles.headerText}>  PAST PUZZLES</Text>
            </View>
            <ListView
              dataSource={this.state.dataSource}
              automaticallyAdjustContentInsets={false}
              renderRow={this.renderRow.bind(this)}/>
        </View>
        );
    }
}

module.exports = Home;