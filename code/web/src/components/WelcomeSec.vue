<template>
  <div class="welcome-sec">
    <div class="head">
      <p class="head-font wow fadeInLeft" data-wow-duration="1.2s">Game Rules</p>
      <p class="wow fadeInRight aaa" data-wow-duration="1.2s">
        <span class="font-pre">Parking Space and Car Rules: </span>
        <span class="font-con">Each player has 5 parking Spaces, parking space can park
          their own car, can also be seized by friends, when the vehicle is parked in the parking space, the vehicle can
          change with time and gain (LLT token), income speed and wheel level is proportional to the maximum income time
          determined by the body level, when their parking space is seized by friends, You can put a ticket on it and
          receive a portion of the proceeds, and the proportion of the proceeds is determined by the class of your
          friend's license plate. The higher class license plate will resist the force of the fine, but don't worry, your
          friend will not park wirelessly in your spot, because the components of the vehicle (tires, body, license plate)
          will also wear out while helping your friend earn revenue. Recovery of component wear is performed only when the
          vehicle carrying the component is parked in its own parking space. The repair process consumes the parking
          space's power, which can only be restored if the space is parked by a friend.</span>
      </p>
    </div>


    <div class="video wow zoomIn" data-wow-duration="1.2s">
      <!-- <iframe width="672" height="400" src="https://www.youtube.com/watch?v=pD-4gR-98V4" frameborder="0"
        allowfullscreen></iframe> -->
      <iframe width="672" height="400" src="https://www.youtube.com/embed/pD-4gR-98V4?si=pPj-jev8oWuOTzdt"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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

    .aaa {
      text-align: left;
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
}</style>