<template>
  <div class="tool-tab">
    <div v-for="(item, index) in lists" class="tool-btn" :class="currentPage === index ? 'choosen-btn' : ''"
      @click="tabClick(item, index)">
      <span class="hover">{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const route = useRouter();

const lists = [
  { name: "HOME", pathName: "home" },
  { name: "PARKING", pathName: "parking" },
  { name: "STORE", pathName: "store" }
]
const currentPage = ref<Number>(0);
const tabClick = (item: {
  name: string;
  pathName: string;
}, index: number) => {
  currentPage.value = index;
  route.push({ name: item.pathName });
}

onBeforeMount(() => {
  const currentName = route.currentRoute.value.name;
  for (let i = 0; i <= 2; i++) {
    if (lists[i].pathName === currentName) {
      currentPage.value = i;
    }
  }
});

// 页内跳转不触发Mount
watch(route.currentRoute, (newValue, oldValue) => {
  const currentName = newValue.name;
  for (let i = 0; i <= 2; i++) {
    if (lists[i].pathName === currentName) {
      currentPage.value = i;
    }
  }
})
</script>

<style lang="less">
.tool-tab {
  display: flex;
  position: fixed;
  top: 64px;
  width: 100%;
  height: 60px;
  justify-content: center;
  z-index: 100;

  .tool-btn {
    height: 50px;
    width: 200px;
    background-color: #FFFFFF;
    font-size: 24px;
    line-height: 50px;
    text-align: center;
  }

  .choosen-btn {
    height: 60px;
    background-color: #FF4F80;
    color: #FFFFFF;
    line-height: 60px;
    text-align: center;
  }
}

.hover {
  &:hover {
    cursor: pointer;
  }
}
</style>