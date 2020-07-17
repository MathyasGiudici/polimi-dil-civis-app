<template>
    <view class="container">
      <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
        <touchable-opacity class="back-container" :on-press="goBack">
          <icon name="chevron-up" color="grey" size="30"/>
          <text class="back-button">Go back to the Article</text>
        </touchable-opacity>
        <!--Article information-->
        <article :article="article" />

        <image class="image" :source="imageSource" v-if="imageSource != null" />
      </scroll-view>
    </view>
</template>

<style>
.container{
  flex: 1;
}
.scroll-container {
  background-color: rgb(242,242,247);
}
.back-container{
  align-items: center;
  flex-direction: row;
  width: 100%;
  background-color: white;
  borderStyle: solid;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-top: 5;
  padding-bottom: 5;
  padding-right: 15;
  padding-left: 15;
  margin-top: 0;
}
.back-button{
  font-size: 17;
  color: grey;
}
.image{
  margin-top: 20;
  width: 100%;
  height: 380;
  background-color: white;
  resizeMode: contain;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import store manager
import store from '../store';
// Network utils
import { isResponseReadable, timerPromise } from '../utils/NetworkUtils';

// Import of components
import Article from './components/Article.vue';

export default{
  props: {
    navigation: { type: Object },
  },
  components: { Article, Icon },
  data: function(){
    return {
      article: this.navigation.state.params.article,
      imageSource: null,
    };
  },
  mounted: async function() {
    // Creating variables
    var endpoint = store.state.baseUrl + 'statistics/' + this.article.statistics;
    var params = { uri: endpoint, method: 'GET', headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

    this.imageSource = params;
  },
  methods:{
    goBack: function () {
      this.navigation.navigate('Article',{article: this.navigation.state.params.article});
    },
  }
}

</script>
