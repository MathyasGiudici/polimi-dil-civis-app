<template>
    <view class="container">
      <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
        <!--Article information-->
        <article :article="article" />

        <!-- Resources -->
        <view class="object-container">
          <touchable-opacity class="link-container" :on-press="goToResource">
            <icon name="open-in-new" size="30" color="#5887F9"/>
            <text class="link">Link to the resource</text>
          </touchable-opacity>
          <touchable-opacity class="link-container" :on-press="getStatistics">
            <icon name="chart-bar" size="30" color="#5887F9"/>
            <text class="link">Statistics</text>
          </touchable-opacity>
        </view>

        <!-- Filter -->
        <filter :filter="filter" />
        <!-- Comment visualization -->
        <comment-visualizer :comment="comment"/>

        <!-- Padding -->
        <view style="height:50"></view>
      </scroll-view>

      <!-- Comment insertion -->
      <comment-typer class="comment-typer-style"/>
      <animated:view :style="{ height: keyboardHeight }" />
    </view>
</template>

<style>
.container{
  flex: 1;
}
.comment-typer-style{
  width: 100%;
}
.scroll-container {
  background-color: rgb(242,242,247);
}
.object-container{
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-top: 5;
  padding-bottom: 5;
  padding-right: 15;
  padding-left: 15;
  margin-top: 10;
}
.link-container{
  padding-top: 2;
  padding-bottom: 2;
  flex-direction: row;
}
.link{
  margin-top: 5;
  margin-left: 3;
  font-size: 17;
  color: #5887F9;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Managin external links and modal
import { Animated, Easing, Linking, Keyboard } from 'react-native';

// Import of components
import Article from './components/Article.vue';
import Filter from './components/Filter.vue';
import CommentTyper from './components/CommentTyper.vue';
import CommentVisualizer from './components/CommentVisualizer.vue';

export default{
  props: {
    navigation: { type: Object },
  },
  components: { Article, CommentTyper, CommentVisualizer, Filter, Icon },
  data: function(){
    return {
      article : this.navigation.state.params.article,
      filter: {
        filter: "Relevance"
      },
      keyboardWillShowSub: null,
      keyboardWillHideSub: null,
      keyboardHeight: 0,
      comment: {
        text: 'Subtitle\nsubnsub',
        userLike: true,
        likesCount: 2,
        commentsCount: 1,
        user:{
          name: 'Mario',
          surname: 'Rossi',
          level: 1,
        }
      },
    };
  },
  mounted: function() {
   this.keyboardHeight = new Animated.Value(0);
   this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
   this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
 },
 beforeDestroy: function() {
   this.keyboardWillShowSub.remove();
   this.keyboardWillHideSub.remove();
 },
 methods:{
    goToResource: function(){
      Linking.openURL(this.article.source.url).catch((err) => console.error('An error occurred', err));
    },
    getStatistics: function(){

    },
    keyboardWillShow(event){
      // Animation to change the position of the comment-typer
      Animated.timing(this.keyboardHeight, {
        toValue: event.endCoordinates.height,
        duration: event.duration,
        easing: Easing.linear,
      }).start(() => {});
    },
    keyboardWillHide(event){
      // Animation to get back the comment-typer
      Animated.timing(this.keyboardHeight, {
        toValue: 0,
        duration: event.duration,
        easing: Easing.linear,
      }).start(() => {});
    },
  }
}

</script>
