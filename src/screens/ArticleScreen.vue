<template>
    <view class="container">
      <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
        <touchable-opacity class="back-container" :on-press="goTopic">
          <icon name="chevron-up" color="grey" size="30"/>
          <text class="back-button">Go to Topic</text>
        </touchable-opacity>
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
        <comment-visualizer v-for="comment in comments" :comment="comment"/>

        <!-- Padding -->
        <view style="height:60"></view>
      </scroll-view>

      <!-- Comment insertion -->
      <comment-typer class="comment-typer-style" eventType="general"/>
      <animated:view :style="{ height: keyboard.height }" />
    </view>
</template>

<style>
.container{
  flex: 1;
}
.comment-typer-style{
  width: 100%;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;

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
  padding-top: 10;
  padding-bottom: 10;
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

// Managing external links and modal
import { Animated, Easing, Linking, Keyboard } from 'react-native';

// Event management
import { EventRegister } from 'react-native-event-listeners';

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
      keyboard: {
        showListener: null,
        hideListener: null,
        typerListener: null,
        height: 0,
        shiftDown: 0,
      },
      comments: [
        {
          text: 'Subtitle\nsubnsub',
          userLike: true,
          likesCount: 2,
          commentsCount: 1,
          user:{
            name: 'Primo',
            surname: 'Commento',
            level: 1,
          },
          children: [{
            text: 'Subtitle\nsubnsub',
            userLike: true,
            likesCount: 2,
            commentsCount: 1,
            user:{
              name: 'Figlio',
              surname: 'Uno',
              level: 1,
            },
          },{
            text: 'Subtitle\nsubnsub',
            userLike: true,
            likesCount: 2,
            commentsCount: 1,
            user:{
              name: 'Figlio',
              surname: 'Due',
              level: 1,
            },
          }],
        },
        {
          text: 'Subtitle\nsubnsub',
          userLike: true,
          likesCount: 2,
          commentsCount: 1,
          user:{
            name: 'Secondo',
            surname: 'Commento',
            level: 1,
          },
          children: [{
            text: 'Subtitle\nsubnsub',
            userLike: true,
            likesCount: 2,
            commentsCount: 1,
            user:{
              name: 'Figlio',
              surname: 'Unico',
              level: 1,
            }
          }],
        }
      ],
    };
  },
  mounted: function() {
   this.keyboard.height = new Animated.Value(0);
   this.keyboard.showListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
   this.keyboard.hideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
   this.keyboard.typerListener = EventRegister.addEventListener('CommentTyper', this.typerEventHandler);
 },
 beforeDestroy: function() {
   this.keyboard.showListener.remove();
   this.keyboard.hideListener.remove();
   EventRegister.removeEventListener(this.keyboard.typerListener);
 },
 methods:{
    goToResource: function(){
      Linking.openURL(this.article.source.url).catch((err) => console.error('An error occurred', err));
    },
    getStatistics: function(){

    },
    goTopic: function () {
      this.navigation.navigate('Topic',{topic: this.article.topic});
    },
    keyboardWillShow(event){
      const value = event.endCoordinates.height - this.keyboard.shiftDown;
      // Animation to change the position of the comment-typer
      Animated.timing(this.keyboard.height, {
        toValue: value,
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
    typerEventHandler: function (code) {
      if(code == 'focus:child')
        this.keyboard.shiftDown = 60;
      else
        this.keyboard.shiftDown = 0;
    }
  }
}

</script>
