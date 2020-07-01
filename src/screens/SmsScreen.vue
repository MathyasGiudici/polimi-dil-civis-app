<template>
  <scroll-view  class="container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <text class="title">Verification</text>
      <text class="subtitle">Enter the code we just sent to your mobile phone number</text>
      <text-input class="code" placeholder="SMS code" v-model="code" :onChangeText="codeChange"/>
      <touchable-opacity class="element-container button">
        <text class="button-text">VERIFY</text>
      </touchable-opacity>
      <view style="justify-content:center;padding-top: 20">
        <button title="Not received? Resend" color="grey" :on-press="()=>{}"/>
      </view>
  </scroll-view>
</template>

<style>
.container{
  flex: 1;
}
.title{
  padding-top: 150;
  text-align: center;
  font-size: 34;
  font-weight: bold;
  padding-bottom: 20;
}
.subtitle{
  width: 80%;
  align-self: center;
  text-align: center;
  font-size: 17;
  color: grey;
}
.user-image{
  align-self: center;
  width: 150;
  height: 150;
  borderRadius: 150;
  resizeMode: contain;
}
.code {
  width: 80%;
  align-self: center;
  background-color: white;
  margin-top: 50;
  padding-bottom: 5;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  font-size: 20;
  text-align: center;
}
.button{
  width: 80%;
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
export default{
  props: {
    navigation: { type: Object }
  },
  data: function(){
    return {
      code: '',
    };
  },
  methods:{
    codeChange: function (t) {
      this.code = t;
    },
  }
}
</script>
