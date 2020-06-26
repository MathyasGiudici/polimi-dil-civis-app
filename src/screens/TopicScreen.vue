<template>
  <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
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
  font-size: 32;
  font-weight: bold;
}
</style>

<script>
// Import of components
import Article from './components/Article.vue';

export default{
  props: {
    navigation: { type: Object }
  },
  components: { Article, },
  data: function(){
    return {
      topic: this.navigation.state.params.topic,
      articles: [],
    };
  },
  methods:{
  }
}

</script>
