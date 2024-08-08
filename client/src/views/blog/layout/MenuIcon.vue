<!-- 参考 https://navnav.co/menu-icon -->
<script setup lang="ts">
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()
</script>
<template>
  <div class="icon nav-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
/* nav-icon */
.nav-icon {
  width: 35px;
  height: 30px;
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.nav-icon span {
  background-color: v-bind('themeVars.textColor1');
  color: v-bind('themeVars.textColor1');
  position: absolute;
  border-radius: 2px;
  transition: 0.3s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  width: 100%;
  height: 4px;
}
.nav-icon span:nth-child(1) {
  top: 0px;
  left: 0px;
}
.nav-icon span:nth-child(2) {
  top: 13px;
  left: 0px;
}
.nav-icon span:nth-child(3) {
  bottom: 0px;
  left: 0px;
}
.nav-icon:not(.open):hover span:nth-child(1) {
  transform: scaleX(0.8);
}
.nav-icon:not(.open):hover span:nth-child(2) {
  transform: scaleX(0.5);
}
.nav-icon:not(.open):hover span:nth-child(3) {
  transform: scaleX(0.8);
}
.nav-icon.open span:nth-child(1) {
  top: 13px;
}
.nav-icon.open span:nth-child(2) {
  top: 13px;
}
.nav-icon.open span:nth-child(3) {
  top: 13px;
}
</style>
