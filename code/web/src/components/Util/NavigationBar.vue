<template>
  <div class="bottom-navigation">
    <div class="go-parking-btn ripple" @click="goParking(backText.pathName)">
      <span class="go-parking-text">{{ backText.text }}</span>
    </div>
    <div class="store-btn ripple" @click="goStore(storeText.pathName)">
      <span class="store-text">{{ storeText.text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const backText = ref<{ text: string, pathName: string }>({
  text: 'GO PARKING',
  pathName: 'parking'
});
const storeText = ref<{ text: string, pathName: string }>({
  text: 'GO STORE',
  pathName: 'parking'
});
const route = useRouter();
const goParking = (pathName: string = 'parking') => {
  route.push({ name: pathName });
}
const goStore = (pathName: string = 'store') => {
  route.push({ name: pathName });
}
onBeforeMount(() => {
  const currentRouteName = route.currentRoute.value.name;
  if (currentRouteName === 'home') {
    backText.value.text = 'PARKING';
    backText.value.pathName = 'parking';
    storeText.value.text = 'STORE';
    storeText.value.pathName = 'store';
  }
  if (currentRouteName === 'parking') {
    backText.value.text = 'BACK HOME';
    backText.value.pathName = 'home';
    storeText.value.text = 'STORE';
    storeText.value.pathName = 'store';
  }
  if (currentRouteName === 'store') {
    backText.value.text = "BACK HOME";
    backText.value.pathName = 'home';
    storeText.value.text = 'GO PARKING';
    storeText.value.pathName = 'parking';
  }
})
watch(route.currentRoute, (newValue, oldValue) => {
  const currentRouteName = newValue.name;
  if (currentRouteName === 'home') {
    backText.value.text = 'PARKING';
    backText.value.pathName = 'parking';
    storeText.value.text = 'STORE';
    storeText.value.pathName = 'store';
  }
  if (currentRouteName === 'parking') {
    backText.value.text = 'BACK HOME';
    backText.value.pathName = 'home';
    storeText.value.text = 'STORE';
    storeText.value.pathName = 'store';
  }
  if (currentRouteName === 'store') {
    backText.value.text = "BACK HOME";
    backText.value.pathName = 'home';
    storeText.value.text = 'GO PARKING';
    storeText.value.pathName = 'parking';
  }
})
</script>

<style scoped lang="less">
.bottom-navigation {
  position: fixed;
  height: 231px;
  width: 300px;
  right: 20px;
  top: 72vh;
  background-color: rgba(60, 77, 97, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.go-parking-btn {
  height: 80px;
  width: 250px;
  background: linear-gradient(0deg, #FEE969, #FEE969),
    linear-gradient(0deg, #FFFFFF, #FFFFFF);
  border: 3px solid #FFFFFF;
  opacity: 1;
  box-shadow: 0px 2px 4px 0px #00000040;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
}

.go-parking-text {
  line-height: 29px;
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 0 3px #202739;
}

.store-btn {
  height: 80px;
  width: 250px;
  background-color: #2687FA;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
}

.store-text {
  line-height: 29px;
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 0 3px #202739;
}

.ripple {
  position: relative;
  //隐藏溢出的径向渐变背景
  overflow: hidden;
}

.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  //设置径向渐变
  background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .3s, opacity .5s;
}

.ripple:active:after {
  transform: scale(0, 0);
  opacity: .3;
  //设置初始状态
  transition: 0s;
}
</style>