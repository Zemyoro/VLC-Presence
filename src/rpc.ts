import { Category, Meta } from 'vlc.js/lib/src/http/classes/VLCStatus';
import { SonglinkResponse } from 'songlink-api/lib/types/Response';
import { Client, Presence } from 'discord-rpc';
import { spotify, rpc } from '../config.json';
import { Spotify } from 'ts-spotify-api';
import { getLinks } from 'songlink-api';
import { vlc } from '../config.json';
import { VLCClient } from 'vlc.js';

export let VLC: VLCClient | null = new VLCClient({
    address: vlc.address,
    password: vlc.password,
    port: vlc.port
});

const client = new Client({ transport: 'ipc' });

let lastPresence: Presence = {
    state: '',
    details: '',
    endTimestamp: Date.now(),
}

client.login({ clientId: rpc.id })
    .then(() => {
        setInterval(update, rpc.updateInterval);
    });

async function update() {
    const status = await VLC?.getStatus();
    if (!status) return;

    if (status.state === 'stopped')
        return client.setActivity({
            details: 'Nothing playing',
            largeImageKey: rpc.largeIcon,
            largeImageText: 'VLC Media Player',
            smallImageKey: 'stopped',
            smallImageText: 'Nothing playing',
            instance: true
        } as Presence);

    const { meta } = status.information?.category as Category;

    let newPresence: Presence = {
        details: meta.title || meta.filename,
        state: `by ${meta.artist}`,

        largeImageKey: rpc.largeIcon,
        largeImageText: 'VLC Media Player',

        smallImageKey: status.state,
        smallImageText: `By Zemyoro & M1nx`,

        buttons: [{
            label: 'Checkout project',
            url: 'https://github.com/Zemyoro/VLC-Presence'
        }]
    }

    const end = Math.floor(Date.now() / 1000 + ((status.length - status.time) / status.rate));

    if (status.state === 'playing' && rpc.displayTimeRemaining && status.length != 0) {
        newPresence.endTimestamp = end;
    }

    if (lastPresence.details !== newPresence.details
        && lastPresence.endTimestamp !== newPresence.endTimestamp) {

        if (meta.title && meta.artist && spotify.enabled)
            newPresence = await spotifyInformation(meta, newPresence);

        lastPresence = newPresence;
        client.setActivity(newPresence);
    }
}

async function spotifyInformation(meta: Meta, presence: Presence) {
    const nodeSpotify = new Spotify(spotify);
    const data = await nodeSpotify.trackSearch({ query: `${meta.title} ${meta.artist?.replace('ft.', '')}` });
    if (!data || !data.tracks.items.length) return presence;
    const song = data.tracks.items[0];
    let link: SonglinkResponse;

    try {
        link = await getLinks({ url: song.external_urls.spotify });
    } catch (e) {
        return presence;
    }

    if (link.pageUrl) {
        presence.buttons?.unshift({
            label: 'View on SongLink',
            url: link.pageUrl
        });
    }

    if (song.album.images.length) presence.largeImageKey = song.album.images[0].url;
    return presence;
}