<template>
  <view class="container" v-if="comment!=null">
    <!-- User Information -->
    <view class="user-container">
      <image class="user-img" :source="comment.user.profilePic"/>
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
    </view>
  </view>
</template>

<style>
.container{
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  background-color: lightgrey;
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
  borderRadius: 60;
  background-color: grey;
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
    comment: { Type: Object }
  },
  components: { Icon },
  methods:{
    like: async function(){
      // Checking if the user is logged in
      if(store.state.session.token == ''){
          this.navigation.navigate('Login');
          return;
      }

      // Creating variables
      var endpoint = store.state.endpoint + 'comment/like/' + this.comment.id;
      var params = { method: '', headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

      if(this.comment.userLike)
        params.method = 'DELETE';
      else
        params.method = 'POST';

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      var c = await promise;

      if(!isResponseReadable(c))
        alert('Connection problems! We are not able to post your like');

      this.comment.likesCount = c.likesCount;
      this.comment.userLike = c.userLike;
    }
  }
}
</script>
