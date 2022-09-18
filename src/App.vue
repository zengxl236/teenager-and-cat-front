<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade" appear mode="out-in">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </RouterView>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>
