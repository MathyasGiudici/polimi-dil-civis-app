<template>
  <scroll-view class="scrollContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <status-bar bar-style="dark-content" />
    <touchable-opacity class="game" :on-press="game">
      <text class="game-text">DAILY GAME</text>
      <text class="game-text">available</text>
    </touchable-opacity>
    <article v-for="article in articles" :article="article" :navigation="navigation"/>
  </scroll-view>
</template>

<style>
.scrollContainer {
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
// Import of react for icons and images
import Article from './components/Article.vue';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Article, },
  data: function(){
    return {
      articles: [
        {
          title: 'Title',
          text: 'Subtitle\nsub\nsub',
          source: {
            name: 'Source',
          },
          userLike: false,
          likesCount: 10,
          commentsCount: 0,
        },
        {
          title: 'Title2',
          text: 'Subtitle\nsub\nsub',
          source: {
            name: 'Source',
          },
          userLike: false,
          likesCount: 2,
          commentsCount: 1,
        },
      ],
    };
  },
  methods:{
    game: function(){
      this.navigation.navigate('Game');
    }
  }
}

</script>
