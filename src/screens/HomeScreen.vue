<template>
  <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}" >
    <RefreshControl :refreshing="refreshing" :onRefresh="refresh" />
    <status-bar bar-style="dark-content" />
    <touchable-opacity class="game" :on-press="game">
      <text class="game-text">DAILY GAME</text>
      <text class="game-text">available</text>
    </touchable-opacity>
    <article v-for="article in articles" :article="article" :navigation="navigation"/>
  </scroll-view>
</template>

<style>
.scroll-container {
  background-color: rgb(242,242,247);
}
.game {
  justify-content: center;
  align-items: center;
  height: 120;
  background-color: #5887F9;
}
.game-text{
  font-size: 42;
  font-weight: 800;
  color: white;
}
</style>

<script>
// Import of react for refresh control
import { RefreshControl } from 'react-native';

// Import store manager
import store from '../store';

// Network utils
import { getHome } from '../utils/NetworkUtils';

// Import of components
import Article from './components/Article.vue';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Article, RefreshControl},
  data: function(){
    return {
      articles: store.state.blob.home,
      didFocusListener: null,
      refreshing: false
    };
  },
  mounted: function(){
    // Listener for the page focus (to refresh)
    this.didFocusListener = this.navigation.addListener('didFocus',() =>{
      return this.refresh();
    });
  },
  beforeDestroy: function(){
    // Removing listeners
    this.didFocusListener.remove();
  },
  methods:{
    game: function(){
      this.navigation.navigate('Game');
    },
    refresh: async function () {
      await getHome();
      this.articles = store.state.blob.home;
    }
  }
}

</script>
