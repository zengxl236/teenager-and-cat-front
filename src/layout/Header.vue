<template>
  <header class="layout-header">
    <h1 class="logo">
      <SvgIcon icon-class="logo" />
      <span>Cat</span>
    </h1>

    <nav>
      <RouterLink v-for="it in navLink" :key="it.path" :to="it.path" custom v-slot="{ navigate }">
        <div
          role="link"
          class="nav-item"
          @click="navigate"
          @keypress.enter="navigate"
          @mouseenter="navItemEnter"
          @mouseleave="navItemLeave"
          :class="{ 'is-active': activeHandler(it.path) }"
        >
          {{ it.meta.title }}
        </div>
      </RouterLink>
      <div ref="highlight" class="highlight"></div>
    </nav>

    <div class="user">
      <SvgIcon icon-class="user" />
      <span>{{ userStore.username }}</span>
    </div>
  </header>
</template>

<script setup>
import { shallowRef, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { navLink } from '@/router';
import useUserStore from '@/store/user';

const userStore = useUserStore();

const highlight = shallowRef();
const navItemEnter = e => {
  const currentNode = e.target;
  const fromNodeClassList = Array.from(e.fromElement.classList);
  const width = window.getComputedStyle(currentNode).getPropertyValue('width');
  const translateX = currentNode.offsetLeft;
  const property = fromNodeClassList.includes('nav-item') ? 'width, opacity, transform' : 'opacity';
  highlight.value.style = `
            width: ${width};
            transform: translateX(${translateX}px);
            transition-property: ${property};
          `;
  currentNode.style.color = '#f7f7f7';
};
const navItemLeave = e => {
  const currentNode = e.target;
  currentNode.style.color = '#2c3e50';
};

const route = useRoute();
const activeHandler = computed(() => path => {
  const nodePaths = path.split('/');
  const currentPaths = route.path.split('/');
  let isActive = true;

  nodePaths.forEach((it, idx) => {
    if (it !== currentPaths[idx]) isActive = false;
  });

  return isActive;
});
</script>

<style lang="scss">
$transition: 150ms cubic-bezier(0.25, 0.8, 0.5, 1);

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 16px;

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    line-height: 1;

    .svg-icon {
      font-size: 32px;
    }
  }

  nav {
    display: flex;
    align-items: center;
    position: relative;

    .nav-item {
      padding: 12px 20px;
      box-sizing: border-box;
      user-select: none;
      cursor: pointer;
      z-index: 2;
      font-size: 16px;
      transition: $transition;
      position: relative;
    }

    .nav-item::after {
      content: '';
      position: absolute;
      left: 20px;
      bottom: 0;
      height: 4px;
      width: 0;
      background-color: #002fa7;
      transition: $transition;
      z-index: 2;
    }

    .nav-item.is-active::after {
      width: calc(100% - 40px);
    }

    .highlight {
      height: 100%;
      background-color: #475668;
      border-radius: 4px;
      position: absolute;
      z-index: 1;
      pointer-events: none;
      opacity: 0;
      transition: $transition;
    }

    &:hover .highlight {
      opacity: 1;
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
