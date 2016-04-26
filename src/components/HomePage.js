var React = require('react-native');
var Create = require('./Create');
var Feed = require('./Feed');
var Search = require('./Search');
var Home = require('./Home');
var Profile = require('./Profile');

const Firebase = require('firebase')
const config = require('../../config')
const itemsRef = new Firebase(`${ config.FIREBASE_ROOT }/items`)

var {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  TouchableHighlight,
  Image,
  ListView
} = React;

var TABS = {
  search: 'search',
  create: 'create',
  home: 'home',
  feed: 'feed',
  profile: 'profile'
}

var Icon = require('react-native-vector-icons/Ionicons');

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

var HomePage = React.createClass({

  componentWillMount: function() {
    Icon.getImageSource('android-arrow-back', 30).then((source) => this.setState({ backIcon: source }));
  },

  getInitialState: function() {
    return {
      selectedTab: TABS.home,
    };
  },

  _renderContent: function(color: string, pageText: string, num?: number) {
    var price = "hello it's me";
    var title = "who are you";
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid != r2.guid});
    return (
      <TouchableHighlight
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title}
                numberOfLines={1}>{title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>

    );
  },

  renderRow() {
    var price = "hello it's me";
    var title = "who are you";
    return (
      <TouchableHighlight
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title}
                numberOfLines={1}>{title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
      );
  },

  _renderFeed: function(){
    return(
      <Feed navigator = {this.props.navigator} />
      );
  },
  _renderHome: function(){
    return(
      <Home navigator = {this.props.navigator} />
      );
  },
  _renderSearch: function(){
    return(
      <Search navigator = {this.props.navigator} />
      );
  },
  _renderCreate: function(){
    return(
      <Create navigator = {this.props.navigator} />
      );
  },
  _renderProfile: function(){
    return(
      <Profile navigator = {this.props.navigator} />
      );
  },

  render: function() {
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="darkslateblue">
        <Icon.TabBarItemIOS
          title="SEARCH"
          selected={this.state.selectedTab === TABS.search}
          iconName="ios-search"
          selectedIconName="ios-search"
          onPress={() => {
            this.setState({
              selectedTab: TABS.search,
            });
          }}>
         {this._renderSearch()}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="CREATE"
          selected={this.state.selectedTab === TABS.create}
          iconName="ios-gear"
          selectedIconName="ios-gear"
          onPress={() => {
            this.setState({
              selectedTab: TABS.create,
            });
          }}>
         {this._renderCreate()}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="HOME"
          selected={this.state.selectedTab === TABS.home}
          iconName="ios-home"
          selectedIconName="ios-home"
          onPress={() => {
            this.setState({
              selectedTab: TABS.home,
            });
          }}>
         {this._renderHome()}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="FEED"
          iconName="ios-star"
          selectedIconName="ios-star"
          selected={this.state.selectedTab === TABS.feed}
          onPress={() => {
            this.setState({
              selectedTab: TABS.feed,
            });
         }}>
         {this._renderFeed()}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="PROFILE"
          selected={this.state.selectedTab === TABS.profile}
          iconName="ios-person"
          selectedIconName="ios-person"
          onPress={() => {
            this.setState({
              selectedTab: TABS.profile,
            });
          }}>
         {this._renderProfile()}
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    );
  },

});


module.exports = HomePage;