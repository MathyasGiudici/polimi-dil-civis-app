<template>
  <view class="container">
    <scroll-view  class="scroll" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <text class="title">Sign Up</text>

      <image class="user-image" :source="imageLoaded" v-if="isImageLoaded" />
      <touchable-opacity class="user-image" style="background-color:lightgrey;" :on-press="selectFile" v-else>
        <text class="user-image-text">Load</text>
      </touchable-opacity>

      <text-input class="inputElement" placeholder="name" v-model="user.name" :onChangeText="text => changeParameter('name',text)" />
      <text-input class="inputElement" placeholder="surname" v-model="user.surname" :onChangeText="text => changeParameter('surname',text)" />
      <text-input class="inputElement" placeholder="phone" v-model="user.phone" :onChangeText="text=>changeParameter('phone',text)" />
      <text-input class="inputElement" placeholder="email" v-model="user.email" :onChangeText="text => changeParameter('email',text)" />
      <text-input class="inputElement" placeholder="password" v-model="user.password" :onChangeText="text=>changeParameter('password',text)" secureTextEntry="true" />

      <view class="row">
        <touchable-opacity class="row-element" :on-press="()=>{isMale=true; changeParameter('gender','male');}">
          <icon name="check" color="black" size="20" v-if="isMale"/>
          <text class="row-element-text">Male</text>
        </touchable-opacity>
        <touchable-opacity class="row-element" :on-press="()=>{isMale=false; changeParameter('gender','female');}">
          <icon name="check" color="black" size="20" v-if="!isMale"/>
          <text class="row-element-text">Female</text>
        </touchable-opacity>
      </view>

      <touchable-opacity class="dateElementContainer" :on-press="()=>{isDateVisible=!isDateVisible;}">
        <text class="inputElement">Birthday: {{user.birthday}}</text>
      </touchable-opacity>
      <view v-if="isDateVisible">
        <DateTimePicker :value="dateObj" mode="date" display="default" :onChange="setDate" />
      </view>

      <touchable-opacity class="element-container button" :on-press="register">
        <text class="button-text">SIGN UP</text>
      </touchable-opacity>
      <view style="justify-content:center;padding-bottom: 50">
        <button title="Already registered? Go back to Sign In" color="grey" :on-press="goToLogin"/>
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
.user-image{
  justify-content: center;
  align-self: center;
  width: 150;
  height: 150;
  borderRadius: 150;
  resizeMode: contain;
}
.user-image-text{
  align-self: center;
  font-size: 20;
  color: white;
  text-align: center;
}
.title{
  padding-top: 150;
  text-align: center;
  font-size: 34;
  font-weight: bold;
  padding-bottom: 50;
}
.inputElement {
  align-self: center;
  width: 75%;
  background-color: white;
  margin-top: 30;
  padding-bottom: 5;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  font-size: 20;
  text-align: center;
}
.row{
  margin-top: 30;
  align-self: center;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
}
.row-element{
  flex-direction: row;
  width: 50%;
  align-items: center;
  justify-content: center;
}
.row-element-text{
  font-size: 20;
  text-align: center;
}
.dateElementContainer{
  align-self: center;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  width: 75%;
}
.button{
  width: 75%;
  align-self: center;
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
</style>

<script>
// Import of react for icons, images and safe area
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Import of date
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const today = new Date();
import DateTimePicker from '@react-native-community/datetimepicker'
// Import of image picker
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

// Managing external modal
import { Animated, Easing, Keyboard } from 'react-native';

// Import store manager
import store from '../store';
// Network utils
import { isResponseReadable, timerPromise } from '../utils/NetworkUtils';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { DateTimePicker, Icon },
  data: function(){
    return {
      user:{
        email: '',
        name: '',
        surname: '',
        password: '',
        gender: 'male',
        birthday: this.printDate(today),
        country: 'italy',
        phone: '',
        profilePic: '',
      },
      isMale: true,
      isDateVisible: false,
      imageLoaded: null,
      isImageLoaded: false,
      dateObj: today,
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
    changeParameter: function (key,value) {
      if(key == 'email')
        value = value.toLowerCase();

      this.user[key] = value;
    },
    register: async function () {
      // Checking parameters
      if(this.user.name == '' || this.user.surname == '' ||
         this.user.email == '' || this.user.password == '' ||
         this.user.phone == '' ){
        alert('You have to fill all the fields');
        return;
      }

      // Adjusting the date
      this.user.birthday = this.dateObj.toISOString().split('T')[0];

      // Parameters
      var endpoint = store.state.endpoint + 'user/register';
      var params = { method: "post", headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.user)};

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      var user = await promise;

      // Evaluation of the response
      if(!isResponseReadable(user)){
        alert('Connection problems');
        return;
      }

      // Saving of the parameters
      store.commit('loginMutation', {email: this.user.email, password: this.user.password});
      store.commit('SAVE');

      if(this.isImageLoaded)
        this.sendPicture(this.user.email);

      // Moving to SMS page
      this.navigation.navigate("Sms",{email: this.user.email});
    },
    sendPicture: async function() {
      var photo = {
        uri: this.imageLoaded.uri,
        type: this.imageLoaded.type,
        name: this.imageLoaded.uri.split('/')[this.imageLoaded.uri.split('/').length-1],
      };

      var endpoint = store.state.endpoint + 'user/register/picture';
      var body = new FormData();

      body.append('image', photo);
      body.append('email', this.user.email);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);
      xhr.send(body);
    },
    goToLogin: function () {
      this.navigation.navigate("Login");
    },
    setDate: function(event,date){
      var result = this.checkDateConsistency(date);
      if(result){
        this.dateObj = date;
        this.user.birthday = this.printDate(date);
      }
    },
    checkDateConsistency: function(newDate){
      // Checking if the date will not be in the future
      if(newDate > today){
        alert('Your birthday could not be in the future!');
        return false;
      }
      // If i'm here there is consistency
      return true;
    },
    printDate: function (date) {
      return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    },
    selectFile: async function() {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }

      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          this.imageLoaded = result;
          this.isImageLoaded = true;
        }
      } catch (E) {
        console.log(E);
      }
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
