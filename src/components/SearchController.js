var React = require('react-native');
var Data = require('./Data');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component,
    AlertIOS,
} = React;

var SearchController = React.createClass({
	searchResults: React.PropTypes.array,
	searchText: React.PropTypes.string.isRequired,

    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid
        });
        return {
            dataSource: dataSource
        };
    },

    renderRow: function(hunt) {

    },

	render: function() {
		var searchInstructions = this.props.searchText == "" ? <Text>You can search using a hunt id</Text> : null

		var searchResults = this.props.searchText != "" ? <Text style={{width: 330, textAlign: 'center'}}>{this.props.searchResults !== null ? JSON.stringify(this.props.searchResults) : "Loading..."}</Text> : null//<ListView
																// dataSource={this.state.dataSource}
										      //                   automaticallyAdjustContentInsets={false}
										      //                   renderRow={this.renderRow}/> : null;

		return <View>
			{searchInstructions}
			{searchResults}
		</View>
	}
});

module.exports = SearchController