# flags-duel

A duel game where you have to find the country associated with a flag. You can play it on [Flags Duel](https://flags.zph.ovh).

## Usage

```
yarn install
```

### Development

```
# server side (Express.js + Socket.io)
yarn run server:dev

# client side (Vue.js + Router)
yarn run client:watch
```

### Production

```
yarn run build
yarn run country
forever start src/app.js
```
