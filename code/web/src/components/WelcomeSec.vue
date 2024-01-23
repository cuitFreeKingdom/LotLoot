<template>
  <div class="welcome-sec">
    <div class="head">
      <p class="head-font wow fadeInLeft" data-wow-duration="1.2s">Game Rules</p>
      <p class="wow fadeInRight" data-wow-duration="1.2s">
        <span class="font-pre">Parking Space and Car Rules: </span>
        <span class="font-con">Each player has 5 parking spaces, with one parking space for their own use, and the
          remaining 4 parking spaces can be used by other players. When a car is parked in a space, it generates token
          income every second based on the car's quality. The income is capped at 24 hours, after which the car needs to
          be moved to collect the earnings. The car's quality and income rate can be upgraded by spending tokens.</span>
      </p>
    </div>


    <div class="video wow zoomIn" data-wow-duration="1.2s">
      <iframe width="672" height="400" src="https://www.youtube.com/embed/WsRujp43jzY" frameborder="0"
        allowfullscreen></iframe>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import WOW from "wow.js";

export default defineComponent({
  name: "WelcomeFirst",
  setup() {
    onMounted(() => {
      var wow = new WOW({
        boxClass: "wow", // animated element css class (default is wow)
        animateClass: "animated", // animation css class (default is animated)
        offset: 0, // distance to the element when triggering the animation (default is 0)
        mobile: true, // trigger animations on mobile devices (default is true)
        live: true, // act on asynchronously loaded content (default is true)
        callback: function () {
          // the callback is fired every time an animation is started
          // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null, // optional scroll container selector, otherwise use window,
        resetAnimation: true, // reset animation on end (default is true)
      });
      wow.init();
    });
  }
})
</script>

<style scoped lang="less">
.welcome-sec {
  background-color: #FFFFFF;
  width: 100%;
  // height: calc(100vh - 64px);
  // min-height: 560px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .head {
    width: 70%;
    padding: 40px 0px;

    .head-font {
      font-size: 96px;
      line-height: 116px;
      font-family: Copperplate, Papyrus, fantasy;
      font-weight: 700;
      color: #000000;
      margin-bottom: 12px;
    }

    .font-pre {
      color: #FF8906;
      font-size: 32px;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .font-con {
      font-size: 32px;
      line-height: 38px;
      color: #000000;
      letter-spacing: 0.5px;
      // text-align: left;
    }
  }
}
</style>