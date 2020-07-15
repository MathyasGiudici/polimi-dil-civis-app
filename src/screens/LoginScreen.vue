<template>
  <view class="container">
    <scroll-view  class="scroll" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <text class="title">Sign In</text>
      <!-- TODO: must be changed an loaded using uri -->
      <image class="user-image" :source="profilePic" v-if="hasProfilePic" />
      <text-input class="element" placeholder="email" v-model="login.email" :onChangeText="text => paramChange('email',text)" v-else/>
      <text-input class="element" placeholder="password" v-model="login.password" :onChangeText="text => paramChange('password',text)" secureTextEntry="true" />
      <touchable-opacity class="element-container button" :on-press="loginHandler">
        <text class="button-text">SIGN IN</text>
      </touchable-opacity>
      <view class="links">
        <button title="Forgot Password?" color="grey" disabled="true" />
        <button title="Swich account" color="grey"  disabled="true" />
      </view>
      <view class="links" style="justify-content:center;">
        <button title="REGISTRATION" color="grey" :on-press="goToRegistration"/>
      </view>
    </scroll-view>
    <animated:view :style="{ height: keyboard.height}" />
  </view>
</template>

<style>
.container{
  align-items: center;
  flex: 1;
}
.title{
  padding-top: 150;
  text-align: center;
  font-size: 34;
  font-weight: bold;
  padding-bottom: 50;
}
.user-image{
  align-self: center;
  width: 150;
  height: 150;
  borderRadius: 150;
  resizeMode: contain;
}
.element {
  background-color: white;
  margin-top: 50;
  padding-bottom: 5;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  font-size: 20;
  text-align: center;
}
.button{
  margin-top: 30;
  flex-direction: row;
  background-color: #5887F9;
  padding-horizontal: 20;
  padding-vertical: 20;
  border-radius: 10;
  align-items: center;
  justify-content: center;
}
.button-text{
  text-align: center;
  font-size: 20;
  font-weight: bold;
  color: white;
}
.links{
  margin-top: 20;
  min-width: 75%;
  max-width: 450px;
  flex-direction: row;
  justify-content: space-between;
}
</style>

<script>
// Managing external modal
import { Animated, Easing, Keyboard } from 'react-native';

// Import store manager
import store from '../store';

// Network utils
import { postLogin } from '../utils/NetworkUtils';

export default{
  props: {
    navigation: { type: Object }
  },
  data: function(){
    return {
      login: JSON.parse(JSON.stringify(store.state.login)),
      hasProfilePic: store.state.session.user.profilePic && (store.state.session.user.profilePic.uri != '')
      && (store.state.login.email != ''),
      profilePic: store.state.session.user.profilePic,
      keyboard: {
        showListener: null,
        hideListener: null,
        typerListener: null,
        height: 0,
      },
    };
  },
  mounted: function() {
    this.keyboard.height = new Animated.Value(0);
    this.keyboard.showListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboard.hideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  },
  beforeDestroy: function() {
    this.keyboard.showListener.remove();
    this.keyboard.hideListener.remove();
  },
  methods:{
    paramChange: function (key,value) {
      this.login[key] = value;
    },
    loginHandler: function() {
      // Making the request
      return postLogin(this.login).then(result => {
        // Checking the result (network)
        if(result.status){
            console.log(result);
            // Evaluation the result
            if(result.session.response != 'Successful login'){
              alert(result.session.response);
            }
            else {
              // Successful login
              delete result.session.response;
              store.commit('sessionMutation', result.session);
              store.commit('loginMutation', this.login);
              store.commit('SAVE');
              this.navigation.navigate('User');
            }
        }
        else {
          alert('Connection problems');
        }
      });
    },
    goToRegistration: function () {
      this.navigation.navigate('Registration');
    },
    keyboardWillShow(event){
      // Animation to change the position of the comment-typer
      Animated.timing(this.keyboard.height, {
        toValue: event.endCoordinates.height ,
        duration: event.duration,
        easing: Easing.linear,
      }).start(() => {});
    },
    keyboardWillHide(event){
      // Animation to get back the comment-typer
      Animated.timing(this.keyboard.height, {
        toValue: 0,
        duration: event.duration,
        easing: Easing.linear,
      }).start(() => {});
    },
  }
}
</script>
