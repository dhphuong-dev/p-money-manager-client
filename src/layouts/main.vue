<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <transition name="slide">
        <div>
          <component :is="Component" :key="route" />
        </div>
      </transition>
    </router-view>
    <p-footer />
  </div>
</template>
