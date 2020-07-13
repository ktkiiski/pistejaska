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

## Developing

Please use eslint and prettier for code formatting & linting.

Easiest way to achieve this is to

- use VS Code
- install [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension
- install [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension
- configure `"editor.formatOnSave": true` setting.

## Developing

1. `npm install`
1. `npm start`

## Building

1. `npm run build`

## Hosting

Master branch of this project is automatically built & hosted in Netlify (https://pistejaska.panu.dev)

## Backups

### Backup export

Are done manually by exporting data. Should automate this.

1. Install gcloud (or use cloud shell https://console.cloud.google.com/?cloudshell=true)
1. `gcloud config set project pistejaska-dev`
1. `gcloud components install beta`
1. `gcloud beta firestore export gs://pistejaska-dev-firestore-backups`
1. Copy backups to Panu's dropbox (~\dev\pistejaska\backups) (optional)

### Backup import

1. Install gcloud (or use cloud shell https://console.cloud.google.com/?cloudshell=true)
1. `gcloud config set project pistejaska-dev`
1. `gcloud components install beta`
1. Get backup name from https://console.cloud.google.com/storage/browser/pistejaska-dev-firestore-backups?project=pistejaska-dev
1. `gcloud beta firestore import gs://pistejaska-dev-firestore-backups/{name}`

## Migrations

If you need to perform data migrations, do this:

1. Take a backup of the current database :) 
1. Acquire Google Cloud Service Account credentials JSON from one of the project admins.
1. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to the credentials JSON
(see https://cloud.google.com/firestore/docs/quickstart-servers#set_up_authentication for details).
1. Write a migration script under migrations/, prefix the script name with the next free version number.
See existing scripts for examples.

## TODO

- reports (winrates, avg scores etc) for different races in asymmetrical games (like race in caverna or gameboard in 7 wonders)
- statistical analysis for strongest victory predictor (eg. start order (is starting player more likely to win), number of dwarfs in caverna, player, race used)
- generic reports: games by plays, longest/shortest games, best ELO rating for all games etc
- support automatic game length detection
- read support for everyone, write support for whitelisted emails
- normalize player names (firstname and first letter of surname)
- better authorization (see https://blog.jimmycai.com/p/firebase-limit-access-to-certain-domains/)
- allow game field definitions editing on UI
- save every change to localstorage (or even to server?) to prevent accidental data loss
- celebration page on save to see the winner with konfetti animation

### Technical debt

- denormalize players to their own root entity
- consider refactoring components to presentational & container components
- better backups
- automatic tests

## Known issues

- PWA does not work
