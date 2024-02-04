<template>
  <n-button
    :bordered="false"
    :block="true"
    icon-placement="left"
    size="large"
    text-color="white"
    :builtin-theme-overrides="{
      borderRadiusLarge: '5px',
      fontSizeLarge: '18px',
      fontWeight: 'bold',
      paddingLarge: '2rem 0'
    }"
    class="btn"
  >
    <slot />
  </n-button>
</template>
