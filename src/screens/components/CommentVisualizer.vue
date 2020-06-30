<template>
  <view class="container" >
    <!-- User Information -->
    <view class="user-container">
      <image class="user-img" />
      <!-- :source="require(comment.user.profilePic)"/> -->
      <view>
        <text class="user-name">{{comment.user.name}} {{comment.user.surname}}</text>
        <text class="user-level">Level {{comment.user.level}}</text>
      </view>
    </view>

    <!-- Comment text -->
    <text class="text">{{comment.text}}</text>

    <!-- Socials -->
    <view class="social">
      <touchable-opacity :on-press="like" >
        <icon name="heart" size="30" color="grey" v-if="comment.userLike"/>
        <icon name="heart-outline" size="30" color="grey" v-if="!comment.userLike"/>
      </touchable-opacity>
      <text class="social-text">{{comment.likesCount}}</text>
      <view class="social-padding"></view>
      <view style="flex-direction: row" v-if="comment.commentsCount>0">
        <icon name="comment-outline" size="30" color="grey"/>
        <text class="social-text">{{comment.commentsCount}}</text>
      </view>
    </view>

    <!-- Sub comments -->
    <sub-comment-visualizer v-if="toLoad" :comment="comment.children[0]" />

    <!-- Load more -->
    <view class="loadmore" v-if="toLoad">
      <button title="Load more comments" color="grey" :on-press="loadMore"/>
    </view>

    <sub-comment-visualizer v-if="!toLoad" v-for="child in comment.children" :comment="child" />

    <comment-typer class="comment-typer-style" eventType="child"/>

  </view>
</template>

<style>
.container{
  flex: 1;
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
.user-container{
  flex-direction: row;
  align-items: center;
}
.user-img{
  width: 60;
  height: 60;
  background-color: lightgrey;
}
.user-name{
  margin-left: 10;
  font-size: 20;
  font-weight: bold;
}
.user-level{
  margin-top: 5;
  margin-left: 10;
  font-size: 17;
  font-weight: 200;
}
.text{
  margin-top: 10;
  font-size: 17;
}
.social{
  margin-top: 5;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.social-text{
  margin-left: 3;
  color: grey;
  font-size: 17;
}
.social-padding{
  width: 10;
}
.loadmore{
  margin-top: 10;
  align-self: center;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import of components
import CommentTyper from './CommentTyper.vue';
import SubCommentVisualizer from './SubCommentVisualizer.vue';

export default{
  props: {
    comment: { Type: Object }
  },
  components: { CommentTyper, Icon, SubCommentVisualizer },
  data: function(){
    return {
      toLoad : this.comment.children.length > 1,
    };
  },
  methods:{
    like: function(){
      // Changing the internal state
      this.comment.userLike = !this.comment.userLike
      if(this.comment.userLike)
        this.comment.likesCount += 1;
      else
        this.comment.likesCount -= 1;
    },
    loadMore: function () {
      this.toLoad = !this.toLoad;
    }
  }
}
</script>
