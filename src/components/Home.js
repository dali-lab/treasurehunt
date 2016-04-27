'use strict';


var React = require('react-native');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component
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
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    }, 
    rowContainer: {
        flexDirection: 'row',
        padding: 10
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
                                numberOfLines={1}>{rowData.description}</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}/>
        );
    }
}

module.exports = Home;