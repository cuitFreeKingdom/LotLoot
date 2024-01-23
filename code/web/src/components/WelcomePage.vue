<template>
  <Introduction />
  <OpenSea />
  <Youtube class="wow zoomIn" data-wow-duration="1.5s" />
  <RoadMap />
  <Team />
  <Partner />
  <Link />
</template>


<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Introduction from "../components/Welcome/Introduction.vue";
import OpenSea from "../components/Welcome/OpenSea.vue";
import Youtube from "../components/Welcome/Youtube.vue";
import RoadMap from "../components/Welcome/RoadMap.vue";
import Team from "../components/Welcome/Team.vue";
import Partner from "../components/Welcome/Partner.vue";
import Link from "../components/Welcome/Link.vue";
import WOW from "wow.js";

export default defineComponent({
  name: "WelcomePage",
  components: { Link, Partner, Introduction, OpenSea, Youtube, RoadMap, Team },
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




