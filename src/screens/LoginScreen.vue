<template>
  <view class="container">
    <text>Login Screen</text>
  </view>
</template>

<style>
.container{
  flex: 1;
  align-items: center;
  justify-content: center;
}
</style>

<script>
// Import of react for icons, images and safe area
import * as React from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Icon, Image },
  data: function(){
    return {
      test: '',
    };
  },
  methods:{
  }
}

</script>
