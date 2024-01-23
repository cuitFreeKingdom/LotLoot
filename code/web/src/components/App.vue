<template>
  <Header />
  <Index />
  <ModalConfirm />
  <Loading />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import Header from "./Header.vue";
import Loading from "./Loading.vue";
import Index from "./Index.vue";
import ModalConfirm from "./ModalConfirm.vue";

const components = {
  Header,
  Loading,
  Index,
  ModalConfirm,
};

onBeforeMount(() => {
  // const clientWidth = document.documentElement.clientWidth / 1280;
  // const clientHeight = document.documentElement.clientHeight / 720;
  // const clientZoom = clientHeight < clientWidth ? clientHeight : clientWidth;

  // document.documentElement.style.zoom = String(clientZoom);
  // document.documentElement.style.zoom = "1.5"
  // background UI
  // document.documentElement.style.background =
  //   "linear-gradient(30deg, #9FA5D5, #E8F5C8) no-repeat fixed";
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #0F0E17 no-repeat fixed;
  padding-top: 64px;
}
</style>