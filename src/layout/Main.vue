<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade" appear mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>
