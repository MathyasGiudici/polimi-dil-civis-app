<template>
  <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <RefreshControl :refreshing="refreshing" :onRefresh="refresh" />
    <view class="container">
      <text class="title">{{topic}}</text>
    </view>

    <article v-for="article in articles" :article="article" :navigation="navigation"/>
  </scroll-view>
</template>

<style>
.scroll-container {
  background-color: rgb(242,242,247);
}
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
  padding-top: 20;
  padding-bottom: 20;
  padding-right: 15;
  padding-left: 15;
  margin-top: 10;
}
.title{
  font-size: 34;
  font-weight: bold;
}
</style>

<script>
// Import of react for refresh control
import { RefreshControl } from 'react-native';

// Import store manager
import store from '../store';
// Network utils
import { isResponseReadable, timerPromise } from '../utils/NetworkUtils';

// Import of components
import Article from './components/Article.vue';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Article, RefreshControl},
  data: function(){
    return {
      refreshing: false,
      didFocusListener: null,
      topic: this.navigation.state.params.topic,
      articles: [],
    };
  },
  mounted: function(){
    // Listener for the page focus (to refresh)
    this.didFocusListener = this.navigation.addListener('didFocus',() =>{
      this.refresh();
    });

    this.refresh();
  },
  beforeDestroy: function(){
    // Removing listeners
    this.didFocusListener.remove();
  },
  methods:{
    refresh: async function () {
      // Creating variables
      var endpoint = store.state.endpoint + 'article/topic?topic=' + this.topic;
      var params = { method: 'GET', headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

      // Promise to handle the request
      var promise = Promise.race([timerPromise(),
        fetch(endpoint,params).then( response => response.json() ).catch((error) => {
            return 'Connection problems';
          })
      ]);

      var array = await promise;

      if(!isResponseReadable(array))
        return;

      this.articles = array;
    }
  }
}

</script>
