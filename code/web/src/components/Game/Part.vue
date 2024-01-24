<template>
  <div class="part">
    <img :src="img_src" class="part-icon">
    <div class="info">{{ props.infoText }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  assetsPath: string,
  infoText: string,
};
const props = withDefaults(defineProps<Props>(), {
  assetsPath: '../../assets/car-part.png',
  infoText: 'aaa'
});

const img_src = ref(`require(${props.assetsPath})`);
</script>

<style scoped lang="less">
.part {
  height: 214px;
  width: 104px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .part-icon {
    height: 100px;
    width: 100px;

    &:hover {
      cursor: pointer;
      background-color: rgba(57, 69, 84, 0.9);
      opacity: 0.5;
    }
  }

  .info {
    border: 1px #ffffff solid;
    width: 100px;
    height: 100px;
  }
}
</style>