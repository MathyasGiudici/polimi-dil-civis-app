<template>
  <safe-area-view style="flex:1">
    <!-- User part -->
    <view class="user-container">
      <touchable-opacity class="user-edit" :on-press="notImplemented">
        <icon name="account-edit" size="30" color="grey"/>
      </touchable-opacity>
      <view class="user-info">
        <image class="user-image" :source="user.profilePic" />
        <text class="user-name">{{user.name}} {{user.surname}}</text>
        <text class="user-level">Level {{user.level}}</text>
      </view>
    </view>
    <!-- Options -->
    <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <touchable-opacity class="element-container" :on-press="notImplemented">
        <text class="element-text">User Statistics</text>
      </touchable-opacity>
      <touchable-opacity class="element-container" :on-press="notImplemented">
        <text class="element-text">Notifications</text>
      </touchable-opacity>
      <touchable-opacity class="element-container":on-press="statistics">
        <text class="element-text">Advanced Statistics</text>
        <icon name="professional-hexagon" size="30" color="#5887F9" style="margin-left:3"/>
      </touchable-opacity>
      <touchable-opacity class="element-container":on-press="logout">
        <text class="element-text">Logout</text>
      </touchable-opacity>
      <touchable-opacity class="element-container":on-press="refreshState">
        <text class="element-text">Delete State</text>
      </touchable-opacity>
    </scroll-view>
  </safe-area-view>
</template>

<style>
.user-container{
  padding-top: 10;
  padding-bottom: 20;
  padding-left: 15;
  padding-right: 15;
  background-color: white;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
}
.user-edit{
  align-items: flex-end;
}
.user-info{
  padding-top: 20;
  align-items: center;
}
.user-image{
  width: 150;
  height: 150;
  borderRadius: 150;
  resizeMode: contain;
}
.user-name{
  padding-top: 10;
  margin-left: 10;
  font-size: 28;
  /* font-weight: bold; */
}
.user-level{
  margin-top: 5;
  margin-left: 10;
  font-size: 20;
  font-weight: 200;
}
.scroll-container {
  background-color: rgb(242,242,247);
}
.element-container{
  margin-top: 10;
  padding-top: 20;
  padding-bottom: 20;
  padding-left: 15;
  padding-right: 15;
  background-color: white;
  flex-direction: row;
  align-items: center;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
}
.element-text{
  font-size: 17;
}
</style>

<script>
// Import of react for icons, images and safe area
import * as React from 'react';
import { Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import store manager
import store from '../store';
import {getDefaultState} from '../store/state';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Icon, Image, SafeAreaView },
  data: function(){
    return {
      user: store.state.session.user
    };
  },
  mounted: function(){
    // Listener for the page focus (to refresh)
    this.willFocusListener = this.navigation.addListener('willFocus',() =>{
      return this.checkLogin();
    });
    this.checkLogin();
  },
  beforeDestroy: function(){
    // Removing listeners
    this.willFocusListener.remove();
  },
  methods:{
    notImplemented: function () {
      alert("We are sorry, the function will be available soon!");
    },
    checkLogin: function(){
      console.log(store.state.session);
      if(store.state.session.token == '')
        this.navigation.navigate('Login');
    },
    statistics: function () {
      this.notImplemented();
    },
    logout: function () {
      this.navigation.navigate('Login');
    },
    refreshState: function () {
      store.commit("DELETE");
      store.commit("REPLACE", getDefaultState());
    }
  }
}

</script>
