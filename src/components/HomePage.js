
import rootRef from '../../newfirebase';

const ReactNative = require('react-native');
const React = require('react');

const {
  Component,
} = React;

const Create = require('./Create');
const Feed = require('./Feed');
const Home = require('./Home');
const User = require('./User').default;

const Firebase = require('firebase');
const config = require('../../config');

const reminder = require('../img/28reminder.png');
const wreminder = require('../img/w28reminder.png');
const pencil = require('../img/28pencil.png');
const wpencil = require('../img/w28pencil.png');
const home = require('../img/home.png');
const whome = require('../img/w28home.png');

const {
  StyleSheet,
  TabBarIOS,
  NavigatorIOS,
} = ReactNative;

const TABS = {
  feed: 'feed',
  home: 'home',
  create: 'create',
};

const Icon = require('react-native-vector-icons/Ionicons');

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
  },
  container: {
    flex: 1,
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC',
  },
  title: {
    fontSize: 20,
    color: '#656565',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  tabBarStyle: {

  },
});

const HomePage = React.createClass({
  propTypes: {
    onLogout: React.PropTypes.func,
  },

  getInitialState() {
    return {
      selectedTab: TABS.home,
    };
  },

  _renderFeed() {
    return (
      <Feed navigator={this.props.navigator} />
      );
  },

  onLogout() {
    User.logout();
    if (typeof this.props.onLogout === 'function') {
      this.props.onLogout();
    }
  },

  _renderHome() {
    return (

      <NavigatorIOS
        style={styles.container}
        barTintColor="#23B090"
        ref="homeRef"
        titleTextColor="white"
        initialRoute={{
          title: 'TREASUREHUNT',
          component: Home,
          rightButtonTitle: 'Logout',
          onRightButtonPress: this.onLogout,
        }}
      />

      );
  },

  _renderCreate() {
    return (
      <Create navigator={this.props.navigator} />
      );
  },

  render() {
    return (

      <TabBarIOS
        tintColor="white"
        barTintColor="#c5ebe0"
      >

        <Icon.TabBarItemIOS
          icon={reminder}
          selectedIcon={wreminder}
          selected={this.state.selectedTab === TABS.feed}
          onPress={() => {
            this.setState({
              selectedTab: TABS.feed,
            });
          }}
        >
          {this._renderFeed()}
        </Icon.TabBarItemIOS>


        <Icon.TabBarItemIOS
          selected={this.state.selectedTab === TABS.home}
          icon={home}
          selectedIcon={whome}
          onPress={() => {
            if (this.state.selectedTab !== TABS.home) {
              this.setState({
                selectedTab: TABS.home,
              });
            } else if (this.state.selectedTab === TABS.home) {
              this.refs.homeRef.popToTop();
            }
          }}
        >
          {this._renderHome()}
        </Icon.TabBarItemIOS>


        <Icon.TabBarItemIOS
          selected={this.state.selectedTab === TABS.create}
          icon={pencil}
          selectedIcon={wpencil}
          onPress={() => {
            this.setState({
              selectedTab: TABS.create,
            });
          }}
        >
          {this._renderCreate()}
        </Icon.TabBarItemIOS>

      </TabBarIOS>


    );
  },

});


module.exports = HomePage;
