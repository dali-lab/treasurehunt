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

// var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

var TABS = {
  search: 'search',
  create: 'create',
  home: 'home',
  feed: 'feed',
  profile: 'profile'
}
var Icon = require('react-native-vector-icons/Ionicons');

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

var styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   marginTop: 60
  // },
  // tabContent: {
  //   flex: 1,
  //   alignItems: 'center',
  // },
  // tabText: {
  //   color: 'white',
  //   margin: 50,
  // },
  // buttonText: {
  //   fontSize: 18,
  //   color: 'white',
  //   alignSelf: 'center'
  // },
  // button: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: 55,
  //   backgroundColor: '#ededed',
  //   marginBottom:10,
  //   marginLeft:10,
  //   marginRight:10
  // },
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

module.exports = HomePage;