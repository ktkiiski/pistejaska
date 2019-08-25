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
1. [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
1. Prettier extension (with format on save enabled)
1. [Eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
1. Format on save enabled: `"editor.formatOnSave": true`

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

- support automatic game length detection
- read support for everyone, write support for whitelisted emails
- better authorization (see https://blog.jimmycai.com/p/firebase-limit-access-to-certain-domains/)
- allow game field definitions editing on UI
- migrate old game scores from Google docs
- make better reports based on score data
- save every change to localstorage (or even to server?) to prevent accidental data loss
- celebration page on save to see the winner with konfetti animation
- better backups
- generic variation support for games (e.g. different maps or different rules result in different scores that should be taken into account in reporting)
- automatic tests
- consider refactoring components to presentational & container components

## Known issues

- automatic focus does not work on option field (the questions cannot be traversed with tabulator)
- cannot set decimals as game duration, only integers allowed (should allow stepping by 0.1)
- PWA does not work
