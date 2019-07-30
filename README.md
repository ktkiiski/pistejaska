# pistejaska

With this web app you can easily track board game scores. The app provides support for adding different board game templates.

Using the app requires Google login with whitelisted email. Emails are whitelisted on https://console.firebase.google.com/project/pistejaska-dev/database/firestore/rules. Ask panu.vuorinen@gmail.com for permissions.

## Contributing

- Manually test that Pistejaska still works
- Update changelog
- Make PR to https://bitbucket.org/panula/pistejaska-react/

## Requirements

1. node.js (7.6 or newer)

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

## Backups

Are done manually by exporting data. Should automate this.

1. Install gcloud (or use cloud shell https://console.cloud.google.com/?cloudshell=true)
1. `gcloud config set project pistejaska-dev`
1. `gcloud components install beta`
1. `gcloud beta firestore export gs://pistejaska-dev-firestore-backups`
1. Copy backups to Panu's dropbox (~\dev\pistejaska\backups) (optional)

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
- better backups

## Known issues

- automatic focus does not work on option field (the questions cannot be traversed with tabulator)
- cannot set decimals as game duration, only integers allowed (should allow stepping by 0.1)
