var React = require('react-native');
var Data = require('./Data');

var dismissKeyboard = require('dismissKeyboard');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    ListView,
    Text,
    TextInput,
    Component,
    AlertIOS,
    Image,
} = React;

const DEBUG = false;

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        marginTop: 10
    },
    instructions: {
        color: "grey",
        fontSize: 12,
        alignSelf: "center",
        textAlign: "center"
    },
    searchBar: {
        height: 30,
        backgroundColor: '#E4EEEC',
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 4,
        marginRight: 10,
        marginLeft: 10
    },
    searchIcon: {
        width: 13,
        height: 13,
    },
    titleText: {
        marginLeft: 10,
        marginTop: 10,
        fontSize: 25,
        fontFamily: 'Verlag-Book',
        color: '#242021',
    },
    textInput: {
        flexDirection: 'column',
        justifyContent: "center",
        fontFamily: 'Verlag-Book',
        flex: 1,
        marginLeft: 5
    },
    cancelButton: {
        borderRadius: 5,
        width: 50,
        height: 20,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButtonText: {
        marginLeft: 2,
        marginRight: 2,
        color: "blue",
        alignSelf: 'center'
    },
    resultItemCell: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FEF7C0',
        borderRadius: 3
    },
    resultItemCellBox: {
        padding: 10,
        backgroundColor: "#FEF7C0",
        borderRadius: 5,
        flex: 1,
    },
    images: {
      width: 80,
      height: 80,
      borderRadius: 5,
      alignSelf: 'center',
      marginRight: 10
    },
    cellTitle: {
        fontSize: 18,
        fontFamily: 'Verlag-Book',
        color: '#242021',
    },
    cellDescription: {
        paddingTop: 0,
        paddingBottom: 4,
        fontFamily: 'Verlag-Book',
        color: '#242021'
    },
    idText: {
        color: "grey",
        fontSize: 10,
        textAlign: "right"
    }
});

var SearchController = React.createClass({
    startSearching: React.PropTypes.func,
    endSearching: React.PropTypes.func,
    rowPressed: React.PropTypes.func,

    search: function(text) {
        Data.search(text).then((results) => {
            // I should only update the table if the text hasn't changed since... :P
            if (this.state.searchText === text) {
                var newDataSource = this.state.dataSource.cloneWithRows(results);
                this.setState({
                    searchResults: results,
                    dataSource: newDataSource
                });
            }
        });
    },

    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid
        });
        return {
            dataSource: dataSource,
            searching: false,
            searchText: "",
            searchResults: []
        };
    },

    convertHunt: function(result) {
        /* Format: {
                    id: key,
                    title: hunt.name,
                    description: hunt.desc,
                    image: hunt.image,
                    progress: totalCluesCompleted/totalCluesInHunt,
                    clues: hunt.clues,
                    hunt: hunt
                }*/

        return {
            id: result.key,
            title: result.hunt.name,
            description: result.hunt.desc,
            image: result.hunt.image,
            progress: 0.0,
            clues: result.hunt.clues,
            hunt: result.hunt
        }
    },

    renderRow: function(result) {
        var hunt = result.hunt;

        var huntimage = hunt.image;
        return (
            <TouchableHighlight onPress={() => {
                console.log("row was pressed, now func " + this.props.rowPressed);
                if (typeof this.props.rowPressed == 'function') {
                    console.log("Running the func");
                    this.props.rowPressed(this.convertHunt(result));
                }
            }}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.resultItemCell}>

                      <Image source={{uri: huntimage}} style={styles.images} />

                        <View style={{flex: 1, justifyContent: 'space-between'}}>
                          <View>
                            <Text style={styles.cellTitle} numberOfLines={1}>{hunt.name.toUpperCase()}</Text>
                            <Text style={styles.cellDescription}
                                numberOfLines={2}>{hunt.desc}</Text>
                          </View>
                          <Text style={styles.idText}>{result.key}</Text>
                        </View>
                    </View>
                    <View style={{height: 10, backgroundColor: 'white',}}/>
                </View>
            </TouchableHighlight>
            );
    },

    isSearching: function() {
        return this.state.searching;
    },

    endSearching: function() {
        dismissKeyboard();
        var newDataSource = this.state.dataSource.cloneWithRows([]);
        this.setState({
            searchText: "",
            searching: false,
            searchResults: [],
            dataSource: newDataSource
        });
        // Alert the Home
        if (typeof this.props.endSearching == 'function') {
            this.props.endSearching();
        }
    },

	render: function() {
		var searchInstructions = this.state.searchText == "" && this.isSearching() ? <Text style={styles.instructions}>You can search using a hunt name or id</Text> : null

        // The not nice UI
		var searchResults = this.state.searchText != "" ? <Text style={{width: 330, textAlign: 'center', alignSelf: "center"}}>{this.state.searchResults !== null ? JSON.stringify(this.state.searchResults) : "Loading..."}</Text> : null
        
        // The nice UI
        var resultsListView = <ListView
                                style={styles.list}
                                dataSource={this.state.dataSource}
								automaticallyAdjustContentInsets={false}
								renderRow={this.renderRow}/>;

        const internalView = this.state.searching ? <View style={{flex: 1}}>
            {this.state.searchText != "" ? <Text style={styles.titleText}>{this.state.searchResults ? "Results:": "Loading..."}</Text> : null}
            {DEBUG && this.state.searchResults === null ? searchResults : resultsListView}
        </View> : null;

		return (<View style={this.state.searching ? styles.container : {}}>
            <View style={styles.searchBar}>
                <Image source={require('./28magnifier.png')} style={styles.searchIcon} />
                <TextInput style={styles.textInput}
                    ref="searchBarTextInput"
                    returnKeyType='done'
                    onFocus={() => {
                        this.setState({
                            searching: true,
                        });
                        if (typeof this.props.startSearching == 'function') {
                            this.props.startSearching();
                        }
                    }}
                    onChangeText={(text) => {
                        // So I can keep track of the text

                        this.setState({
                            searchText: text,
                            searchResults: null
                        });
                        if (text !== "") {
                            this.search(text);
                        }else{
                            var newDataSource = this.state.dataSource.cloneWithRows([]);
                            this.setState({
                                searchResults: [],
                                dataSource: newDataSource
                            })
                        }
                    }}
                    onSubmitEditing={() => {
                        // They hit the done button.
                        dismissKeyboard();
                        if (this.state.searchText == "") {
                            this.endSearching();
                        }
                    }}
                    value={this.state.searchText}/>
                {this.isSearching() ? <TouchableHighlight style={styles.cancelButton}
                    onPress={() => {
                        // When they cancel I need to hide the keyboard and stop searching
                        this.endSearching();
                    }}
                    underlayColor='grey'>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableHighlight> : null}
              </View>
              {searchInstructions}

              {internalView}
		</View>)
	}
});

module.exports = SearchController