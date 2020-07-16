<template>
    <view class="container">
      <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
        <RefreshControl :refreshing="refreshing" :onRefresh="refresh" />
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
        <comment-visualizer v-for="comment in comments" :navigation="navigation" :comment="comment"/>

        <!-- Padding -->
        <view style="height:60"></view>
      </scroll-view>

      <!-- Comment insertion -->
      <comment-typer class="comment-typer-style" :navigation="navigation" eventType="general"
        :article="article.id.toString()" :comment="null"/>
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
import { Alert, Animated, Easing, Linking, Keyboard, RefreshControl } from 'react-native';

// Event management
import { EventRegister } from 'react-native-event-listeners';

// Import of components
import Article from './components/Article.vue';
import Filter from './components/Filter.vue';
import CommentTyper from './components/CommentTyper.vue';
import CommentVisualizer from './components/CommentVisualizer.vue';

// Import store manager
import store from '../store';
// Network utils
import { isResponseReadable, timerPromise } from '../utils/NetworkUtils';

export default{
  props: {
    navigation: { type: Object },
  },
  components: { Article, CommentTyper, CommentVisualizer, Filter, Icon, RefreshControl },
  data: function(){
    return {
      refreshing: false,
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
      didFocusListener: null,
      commentListener : null,
      filterListener: null,
      comments: [],
    };
  },
  mounted: function() {
    // Keyboard listener
    this.keyboard.height = new Animated.Value(0);
    this.keyboard.showListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboard.hideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    this.keyboard.typerListener = EventRegister.addEventListener('CommentTyper', this.typerEventHandler);

    // Refresh listeners
   this.commentListener = EventRegister.addEventListener('CommentPosted', this.refresh);
   this.filterListener = EventRegister.addEventListener('FilterUpdate', this.sortComments);
   this.didFocusListener = this.navigation.addListener('didFocus',() => {
     this.refresh();});

   this.refresh();
 },
 beforeDestroy: function() {
   // Keyboard listener
   this.keyboard.showListener.remove();
   this.keyboard.hideListener.remove();
   EventRegister.removeEventListener(this.keyboard.typerListener);

   // Refresh listeners
   EventRegister.removeEventListener(this.commentListener);
   EventRegister.removeEventListener(this.filterListener);
   this.didFocusListener.remove();
 },
 methods:{
    goToResource: function(){
      // Cheching the validity of the url
      if(this.article.source.url != '')
        Linking.openURL(this.article.source.url).catch((err) => console.error('An error occurred', err))
      else
        alert('Link to the resource not available');
    },
    getStatistics: function(){
      // Checking if the user is logged
      if(store.state.session.token == ''){
        this.navigation.navigate('Login');
        return;
      }

      // Cheching the premium feature
      if(!store.state.session.user.premium){
        Alert.alert('Alert','You have not the premium feature',
          [ {text: 'OK', onPress: () => {this.navigation.navigate('User')}, style: 'cancel'} ],
          { cancelable: false } );
        return;
      }

      if(this.article.statistics !=null && this.article.statistics != '')
        return;
      else
        alert('Statistics are not available');
    },
    goTopic: function () {
      this.navigation.navigate('Topic',{topic: this.article.topic});
    },
    refresh: function () {
      this.article = this.navigation.state.params.article;
      this.getCurrentArticle();
      this.getComments();
    },
    getCurrentArticle: async function () {
      // Creating variables
      var endpoint = store.state.endpoint + 'article/' + this.article.id;
      var params = { method: 'GET', headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      var article = await promise;

      if(!isResponseReadable(article))
        return;

      this.article = article;
    },
    getComments: async function () {
      // Creating variables
      var endpoint = store.state.endpoint + 'comment?article=' + this.article.id;
      var params = { method: 'GET', headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      var c = await promise;

      if(!isResponseReadable(c))
        return;

      this.comments = c;
      this.sortComments();
    },
    sortComments: function functionName() {

      var sorter = function(a,b) {
        let a_date = new Date(a.timestamp);
        let b_date = new Date(b.timestamp);
        let score = a_date.getTime() - b_date.getTime();
        score = score * (-1);
        return score;
      }
      if(this.filter.filter == 'Relevance'){
        sorter = function(a,b){
          let a_score = a.likesCount + a.commentsCount + a.user.level;
          let b_score = b.likesCount + b.commentsCount + b.user.level;
          return b_score - a_score;
        }
      }

      this.comments.sort(sorter);

      this.comments.forEach((item, i) => {
        item.children.sort(sorter);
      });
    },
    keyboardWillShow: function(event){
      const value = event.endCoordinates.height - this.keyboard.shiftDown;
      // Animation to change the position of the comment-typer
      Animated.timing(this.keyboard.height, {
        toValue: value,
        duration: event.duration,
        easing: Easing.linear,
      }).start(() => {});
    },
    keyboardWillHide: function(event){
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
