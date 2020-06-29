<template>
  <view class="container">
    <search-bar placeholder="Search by topic..." :onChangeText="updateSearch" :value="search" lightTheme="true" platform="ios"/>
    <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <text class="small-title">Recommended for you</text>
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
</style>

<script>
// Import of the searchbar
import { SearchBar } from 'react-native-elements';

// Import of components
import Article from './components/Article.vue';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Article, SearchBar },
  data: function(){
    return {
      search: '',
      articles: [{
        title: 'Facebook',
        text: 'Subtitle\nsubnsub',
        topic: 'Topic 2',
        source: {
          name: 'Source',
          url: 'https://www.facebook.it'
        },
        userLike: false,
        likesCount: 2,
        commentsCount: 1,
      },],
    };
  },
  methods:{
    updateSearch: function(search){
      this.search = search;
    }
  }
}

</script>
