<template>
    <view class="container">
      <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
        <touchable-opacity class="back-container" :on-press="goBack">
          <icon name="chevron-up" color="grey" size="30"/>
          <text class="back-button">Go back to the Article</text>
        </touchable-opacity>
        <!--Article information-->
        <article :article="article" />

        <image class="image" :source="JSON.parse(article.statistics)" />
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
  height: 480;
  background-color: white;
  resizeMode: contain;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    };
  },
 methods:{
    goBack: function () {
      this.navigation.navigate('Article',{article: this.navigation.state.params.article});
    },
  }
}

</script>
