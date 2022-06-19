<template>
  <div>
    <div>
      <router-link id="title" :to="{ name: 'home' }">Flags Duel</router-link>
    </div>
    <router-view />
    <div id="footer">
      Made with 💜 by
      <a href="https://github.com/zroumane" target="_blank">Zephyr</a>
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: 'Rubik';
  src: url('./assets/Rubik-Medium.ttf');
}

* {
  box-sizing: border-box;
  font-family: 'Rubik', sans-serif;
}

html,
body {
  text-align: center;
  min-height: 100vh;
  margin: 0;
  background-color: rgb(21, 8, 70);
  color: white;
}

#app {
  padding: 1vh;
}

#title {
  display: block;
  font-size: 5vh;
  margin-top: 1vh;
  margin-bottom: 2vh;
  color: white;
}

#title:hover {
  color: rgb(89, 80, 206);
}

#footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1vh;
  width: 100%;
  font-size: 1.5vh;
}

input[type='text'] {
  border-radius: 1vh;
}

.gameInput {
  margin-top: 2vh;
  margin-bottom: 2vh;
  border: 0.5vh rgb(24, 21, 161) solid;
  background-color: rgba(24, 19, 104);
  color: white;
  border-radius: 1vh;
  transition: 0.3s ease-in-out;
}

.gameInput:hover {
  background-color: rgb(24, 21, 161);
}

.gameInput:disabled {
  filter: opacity(0.7);
}
.gameInput:disabled:hover {
  background-color: rgba(24, 19, 104);
}

.copypasteIcon {
  cursor: pointer;
  color: white;
  vertical-align: baseline;
}

a {
  transition: 0.3s;
  text-decoration: none;
  color: rgb(89, 80, 206);
}

a:visited {
  color: rgb(89, 80, 206);
}

.text {
  transition: 0.3s;
  font-size: 2.5vh;
  margin-top: 1vh;
  margin-bottom: 1vh;
  display: block;
}

.copypasteIcon {
  fill: white;
}

.copypasteIcon.success {
  fill: green;
}
.copypasteIcon.error {
  fill: red;
}
</style>
