<template>
  <touchable-opacity class="container" :on-press="click" :disabled="navigation==null" >
    <text class="title">{{article.title}}</text>
    <text class="text">{{article.text}}</text>
    <text class="source">{{article.source.name}}</text>

    <view class="social">
      <touchable-opacity :on-press="like" >
        <icon name="heart" size="30" color="grey" v-if="article.userLike"/>
        <icon name="heart-outline" size="30" color="grey" v-if="!article.userLike"/>
      </touchable-opacity>
      <text class="social-text">{{article.likesCount}}</text>
      <view class="social-padding"></view>
      <icon name="comment-outline" size="30" color="grey"/>
      <text class="social-text">{{article.commentsCount}}</text>
    </view>
  </touchable-opacity>
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
  padding-top: 5;
  padding-bottom: 5;
  padding-right: 15;
  padding-left: 15;
  margin-top: 10;
}
.title{
  font-size: 28;
  font-weight: bold;
}
.text{
  margin-top: 5;
  font-size: 17;
}
.source{
  margin-top: 10;
  font-size: 15;
  font-weight: 100;
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
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import store manager
import store from '../../store';
// Network utils
import { isResponseReadable, timerPromise } from '../../utils/NetworkUtils';

export default{
  props: {
    navigation: { type: Object },
    article: { Type: Object }
  },
  components: { Icon },
  methods:{
    click: function(){
      this.navigation.navigate('Article',{article: this.article});
    },
    like: async function(){
      // Checking if the user is logged in
      if(store.state.session.token == '')
        this.navigation.navigate('Login');

      // Creating variables
      var endpoint = store.state.endpoint + 'article/like/' + this.article.id;
      var params = { method: "get", headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      if(this.article.userLike)
        params.method = "delete";
      else
        params.method = "post";

      var a = await promise;

      if(!isResponseReadable(a))
        alert('Connection problems! We are not able to post your like');

      this.article = a;
    }
  }
}

</script>
