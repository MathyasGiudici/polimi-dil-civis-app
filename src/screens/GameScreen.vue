<template>
  <view class="container">
      <view class="front">
        <image
          :style="{ width: 300, height: 150 }"
          :source="require('../../assets/imgs/logoWhite.png')" />
        <text class="game-title">DAILY GAME</text>
        <text class="game-subtitle">How it will work?</text>
        <text class="game-text">5 questions, 3 answers</text>
        <text class="game-text">You have to select the correct answers</text>
        <view class="button">
          <text class="button-text">Coming soon!</text>
        </view>
      </view>
      <image class="bg"
        :source="require('../../assets/imgs/game.png')" />
  </view>
</template>

<style>
.container{
  flex: 1;
  justify-content:flex-end;
  align-items: center;
  background-color: #5887F9;
}
.front{
  justify-content:center;
  align-items: center;
  height: 100%;
}
.bg{
  width: 425;
  height: 300;
  position: absolute;
  opacity: .5;
  z-index: -1;
}
.game-title{
  margin-left: 40;
  margin-right: 40;
  margin-top: 10;
  font-size: 56;
  font-weight: 800;
  text-align: center;
  color: white;
}
.game-subtitle{
  margin-left: 40;
  margin-right: 40;
  margin-top: 10;
  font-size: 36;
  font-weight: bold;
  text-align: center;
  color: white;
}
.game-text{
  margin-left: 40;
  margin-right: 40;
  margin-top: 10;
  font-size: 28;
  text-align: center;
  color: white;
}
.button{
  margin-top: 20;
  align-self: center;
  flex-direction: row;
  background-color: rgba(148,160,189,.7);
  padding-horizontal: 20;
  padding-vertical: 20;
  padding-left: 70;
  padding-right: 70;
  border-radius: 10;
  align-items: center;
  justify-content: center;
}
.button-text{
  text-align: center;
  font-size: 20;
  font-weight: bold;
  color: white;
}
</style>
