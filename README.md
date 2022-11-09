# VLC Presence

Show your friends and servers your horrible music taste. Thank me and M1nx.

## How do I use this?

It's pretty simple, really. Read along...

### Terminal instructions

1. Download and set up [NodeJS](https://nodejs.org) from the link or your package manager (Be sure to install NPM)
2. Clone this repository: `git clone https://github.com/Zemyoro/VLC-Presence.git`
3. Set current directory to the repository: `cd VLC-Presence`
4. Install modules: `npm install`
5. Run VLC Presence: `npm start`

#### You have successfully started VLC Presence!!! Now show your horrible music taste...

## How do I show album artwork?

These steps require a [Spotify account](https://www.spotify.com/signup)!

1. Head over to the [Spotify for Developers](https://desktop.github.com/) dashboard
2. Click `LOG IN` and enter your Spotify login details
3. Click `CREATE AN APP` and enter your desired `App name` and `App description`
4. Agree to Spotify's Developer Terms of Service and Branding Guidelines
5. Go to the `config.json` file inside the repository folder and edit it (e.g. `vim config.json`)
6. Copy the `Client ID` value from the website and paste it into the `spotify` > `id` value
7. Click `SHOW CLIENT SECRET` on the website
8. Copy the `Client Secret` value from the website and paste it into the `spotify` > `secret` value
9. Change the `spotify` > `enabled` value from `false` to `true`
10. Run VLC Presence: `npm start`

#### You have successfully learned how to show album artwork. Now shoo!