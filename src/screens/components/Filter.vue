<template>
    <view class="container">
      <!-- Filter -->
      <touchable-opacity class="button-container" :on-press="changeFilter">
        <view style="flex-direction:row">
          <icon name="filter-outline" color="white" size="25"/>
          <text class="button-text">{{text()}}</text>
        </view>
        <icon :name="visibility?'chevron-up':'chevron-down'" color="white" size="25"/>
      </touchable-opacity>
      <!-- Filter Options -->
      <view class="button-container" v-if="visibility" style="flex-direction:column">
        <touchable-opacity :on-press="()=>{picker('Relevance')}">
          <text class="picker-text">Order by Relevance</text>
        </touchable-opacity>
        <view style="height:15"></view>
        <touchable-opacity :on-press="()=>{picker('Date')}">
          <text class="picker-text">Order by Date</text>
        </touchable-opacity>
      </view>
    </view>
</template>

<style>
.container{
  align-items: center;
}
.button-container{
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 10;
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 20;
  width: 70%;
  flex-direction: row;
  background-color: #5887F9;;
}
.button-text{
  text-align: center;
  font-size: 20;
  color: white;
}
.picker-text{
  text-align: center;
  font-size: 20;
  color: white;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default{
  props: {
    filter: { type: Object },
  },
  components: { Icon },
  data: function(){
    return {
      visibility: false
    };
  },
  methods:{
    text: function(){
      if(this.visibility)
        return "";
      else
        return "Order by " + this.filter.filter;
    },
    changeFilter: function(){
      this.visibility = !this.visibility
    },
    picker: function(filter){
      this.filter.filter = filter;
      this.changeFilter();
    }
  }
}

</script>
