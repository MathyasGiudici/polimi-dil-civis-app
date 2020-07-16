<template>
  <view class="container">
    <search-bar placeholder="Search by topic..." :onChangeText="updateSearch" :value="search" lightTheme="true" platform="ios"/>
    <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <RefreshControl :refreshing="refreshing" :onRefresh="refresh" />
      <text class="small-title" v-if="!isSearchMode" >Recommended for you</text>
      <text class="small-subtitle" v-if="!isSearchMode && !isLogged" >To see recommended articles you must be logged-in</text>
      <article v-for="article in articles" :article="article" :navigation="navigation"/>
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
.small-title{
  padding-top: 10;
  padding-bottom: 10;
  padding-left: 15;
  padding-right: 15;
  font-size: 15;
  font-weight: bold;
  color: grey;
}
.small-subtitle{
  padding-top: 10;
  padding-bottom: 10;
  padding-left: 15;
  padding-right: 15;
  font-size: 15;
  font-weight: normal;
  color: grey;
}
</style>

<script>
// Import of the searchbar
import { SearchBar } from 'react-native-elements';

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
  components: { Article, SearchBar, RefreshControl },
  data: function(){
    return {
      search: '',
      isSearchMode: false,
      didFocusListener: null,
      refreshing: false,
      isLogged: false,
      articles: []
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
    refresh: function() {
      this.articles = [];
      if(this.isSearchMode)
        this.searchHandler();
      else
        this.recommendsHandler();
    },
    recommendsHandler: async function () {
      // Checking if the user is logged in
      if(store.state.session.token == ''){
        this.isLogged = false;
        return;
      }

      // Creating variables
      var endpoint = store.state.endpoint + 'article/recommended';
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
      this.isLogged = true;
    },
    updateSearch: function(search){
      this.search = search.toLowerCase();
      this.isSearchMode = (this.search != '');
      this.refresh();
    },
    searchHandler: async function () {
      // Creating variables
      var endpoint = store.state.endpoint + 'article/topic?topic=' + this.search;
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
