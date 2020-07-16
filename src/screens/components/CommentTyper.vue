<template>
  <view class="container">
    <icon name="comment" size="30" color="grey"/>
    <text-input class="input-container" placeholder="Type here to comment!" v-model="text" :onFocus="focus" />
    <touchable-opacity class="button-send" :on-press="send">
      <icon name="send" size="20" color="white"/>
    </touchable-opacity>
  </view>
</template>

<style>
.container{
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 60;
  background-color: white;
  padding-top: 5;
  padding-bottom: 5;
  padding-right: 15;
  padding-left: 15;
}
.input-container{
  width: 80%;
  margin-left: 5;
  font-size: 17;
}
.button-send{
  align-items: center;
  justify-content: center;
  width: 35;
  height: 35;
  border-radius: 35;
  background-color: #5887F9;
}
</style>

<script>
// Import of react for icons and images
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Event management
import { EventRegister } from 'react-native-event-listeners';

// Import store manager
import store from '../../store';
// Network utils
import { isResponseReadable, timerPromise } from '../../utils/NetworkUtils';

export default{
  props: {
    navigation: { type: Object },
    eventType: { type: String },
    article: { type: String },
    comment: { type: String }
  },
  components: { Icon },
  data: function(){
    return {
      text: '',
    };
  },
  methods:{
    send: async function(){
      // Checking if the user is logged in
      if(store.state.session.token == '')
        this.navigation.navigate('Login');

      var parent = this.eventType == 'child' ? parseInt(this.comment) : -1 ;
      var date = new Date();

      var comment = { id: 0, userLike: false, commentsCount : 0, likesCount : 0, children : [],
        article: parseInt(this.article), user: store.state.session.user.email,
        parent: parent,
        text: this.text,
        timestamp: date.toISOString()
      };

      // Creating variables
      var endpoint = store.state.endpoint + 'comment';
      var params = { method: "post", headers: { 'Authorization': 'Bearer ' + store.state.session.token,
        'Content-Type': 'application/json' }, body: JSON.stringify(comment)};

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      await promise;

      EventRegister.emit('CommentPosted',null);
      this.text='';
    },
    focus: function () {
      const code = 'focus:' + this.eventType;
      EventRegister.emit('CommentTyper',code);
    }
  }
}
</script>
