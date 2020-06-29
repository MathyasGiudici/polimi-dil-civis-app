<template>
  <app-navigator />
</template>

<script>
// Import of vue-native-router
import {
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator
} from "vue-native-router";

// Import of react for icons and images
import * as React from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import of store
import store from './store';
// Import of loading function
// import {loadData} from './utils/DataUtils';

// Import of the screens
import HomeScreen from "./screens/HomeScreen.vue";
import SearchScreen from "./screens/SearchScreen.vue";
import GameScreen from "./screens/GameScreen.vue";
import UserScreen from "./screens/UserScreen.vue";

import LoginScreen from "./screens/LoginScreen.vue";

import ArticleScreen from "./screens/ArticleScreen.vue";
import TopicScreen from "./screens/TopicScreen.vue";

// General Header of CIVIS
var GeneralHeader = {
  defaultNavigationOptions: {
    title: '',
    headerStyle: {
      height: 80, // Specify the height of your custom header
    },
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
    headerLeft: (
      <Image style={{ width: 140, height: 60 }} source={require('../assets/imgs/logoBlack.png')}/>
    )
  }
};

const BottomTabs = createBottomTabNavigator(
  {
    Home: {
      screen: createStackNavigator({
          Home : HomeScreen,
          Article : ArticleScreen,
          Topic : TopicScreen
        },
        GeneralHeader
      ),
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => <Icon name="home" color={tintColor} size={25}/>
      },
    },
    Search :
    {
      screen: createStackNavigator({
          Search : SearchScreen,
          Article : ArticleScreen,
          Topic : TopicScreen
        },
        GeneralHeader
      ),
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({tintColor}) => <Icon name="search" color={tintColor} size={25}/>
      },
    },
    Game :
    {
      screen: GameScreen,
      navigationOptions: {
        tabBarLabel: 'Game',
        tabBarIcon: ({tintColor}) => <Icon name="gamepad" color={tintColor} size={25}/>
      },
    },
    User :
    {
      screen: createSwitchNavigator({
        User : UserScreen,
        Login: LoginScreen
        },
      ),
      navigationOptions: {
        tabBarLabel: 'User',
        tabBarIcon: ({tintColor}) => <Icon name="user-alt" color={tintColor} size={25}/>
      },
    },
  }
);

const SwitchNavigator = createSwitchNavigator(
  {
    BottomTabs: BottomTabs,
  },
  {
    initialRouteName: 'BottomTabs',
  },
);

const AppNavigator = createAppContainer(SwitchNavigator);

export default {
  components: { AppNavigator },
  beforeCreate: async function(){
    var loadingPromise = new Promise(async function(resolve,reject){
        // Loading past state from AsyncStorage
        //await store.commit("RESTORE");
        // Loading ARPA data from remote
        // await loadData();

        resolve("NavigatorCreator finished loading process");
    });

    // Awaiting loading promise
    var result = await loadingPromise;
  }
}
</script>
