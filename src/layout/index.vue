<template>
  <div class="layout-container">
    <LayoutHeader />
    <LayoutMain />
  </div>
</template>

<script setup>
import LayoutHeader from './Header.vue';
import LayoutMain from './Main.vue';
</script>

<style lang="scss">
.layout-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100%);
  grid-template-rows: auto 1fr;
  height: 100%;
  background-color: #f5f6f6;
}
</style>
