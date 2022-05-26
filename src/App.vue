<template>
  <div>
    <div class="header">
      <span>Flags Duel</span>
    </div>
    <router-view />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  margin: 0;
}

#app {
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
}
.header {
  background-color: rgb(52, 133, 210);
  color: white;
  padding: 1.5rem;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
}
</style>
