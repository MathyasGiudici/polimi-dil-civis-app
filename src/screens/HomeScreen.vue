<template>
  <scroll-view class="scrollContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <view class="game">
      <text>{{test}}</text>
    </view>
  </scroll-view>
</template>

<script>

export default {
  data() { return {
    test: 'Ciao',
  }},
}

</script>

<style>
.scrollContainer {
  /* background-color: #BCC5D3; */
  background-color: rgb(242,242,247);
}
.game {
  height: 120;
  background-color: #5887F9;
}
</style>
