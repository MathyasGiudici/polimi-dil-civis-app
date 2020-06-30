<template>
  <view class="container">
    <icon name="comment" size="30" color="grey"/>
    <text-input class="input-container" placeholder="Type here to comment!" v-model="text" :onFocus="focus" />
    <touchable-opacity class="button-send" :on-press="send">
      <icon name="send" size="20" color="white"/>
    </touchable-opacity>
  </view>
</template>

<style>
.container{
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 60;
  background-color: white;
  padding-top: 5;
  padding-bottom: 5;
  padding-right: 15;
  padding-left: 15;
}
.input-container{
  width: 80%;
  margin-left: 5;
  font-size: 17;
}
.button-send{
  align-items: center;
  justify-content: center;
  width: 35;
  height: 35;
  border-radius: 35;
  background-color: #5887F9;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Event management
import { EventRegister } from 'react-native-event-listeners';

export default{
  props: {
    eventType: { type: String }
  },
  components: { Icon },
  data: function(){
    return {
      text: '',
    };
  },
  methods:{
    send(){
      console.log("text:" + this.text);
      return;
    },
    focus: function () {
      const code = 'focus:' + this.eventType;
      EventRegister.emit('CommentTyper',code);
    }
  }
}
</script>
