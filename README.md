# pistejaska

With this web app you can easily track board game scores. The app provides support for adding different board game templates.

Using the app requires Google login with whitelisted email. Emails are whitelisted on https://console.firebase.google.com/project/pistejaska-dev/database/firestore/rules

## Requirements

1. node.js

## Technology

This project uses Firebase's authentication & Firestore as database. Admin is panu.vuorinen@gmail.com.

The major libraries used in this project: React.js, Firebase, Material UI.

## Recommended editor experience

1. VS Code
1. Prettier (with format on save)
1. TSLint

## Developing

1. `npm install`
1. `npm start`

## Building

1. `npm run build`

## Hosting

Master branch of this project is automatically built & hosted in Netlify (https://pistejaska.panu.dev)

## TODO

- better authorization (see https://blog.jimmycai.com/p/firebase-limit-access-to-certain-domains/)
- show CHANGELOG.MD on UI
- allow game field definitions editing on UI
- migrate old game scores
- fix data model in Firestore
- make reports based on score data
- dropbown type for GameMiscFieldDefinition
- save every change to localstorage (or even to server?) to prevent accidental data loss
- celebration page on save to see the winner with konfetti animation
