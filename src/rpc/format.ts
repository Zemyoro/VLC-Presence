import { log } from '../helpers/lager';
import * as config from '../../config/config.json';
import { Spotify } from '../helpers/spotify';
import { getLinks } from 'songlink-api';
import { verboseLog } from "../index";

export let spotify = new Spotify(config.spotify)

export let format = async (status: any) => {
    if (status.state === 'stopped')
        return {
            state: 'Stopped',
            details: 'Nothing is playing',
            largeImageKey: config.rpc.largeIcon,
            largeImageText: 'VLC Media Player',
            smallImageKey: 'stopped',
            smallImageText: 'Stopped',
            instance: true,
            buttons: []
        };

    const { meta } = status.information.category;
    const output = {
        details: meta.title || meta.filename,
        state: '',
        partySize: 0,
        partyMax: 0,
        largeImageKey: config.rpc.largeIcon,
        largeImageText: 'VLC Rich Presence',
        smallImageKey: status.state,
        smallImageText: `By M1nx + Zemyoro`,
        startTimestamp: 1,
        endTimestamp: 1,
        buttons: <Array<any>> []
    };

    if (config.alternateAlbumDisplay) {
        if (meta.artist) {
            output.state = meta.artist;
            if (meta.album) output.state += ` - ${meta.album}`;
            if (meta.track_number && meta.track_total && config.rpc.displayTrackNumber) {
                output.partySize = parseInt(meta.track_number, 10);
                output.partyMax = parseInt(meta.track_total, 10);
            }
        } else {
            output.state = status.state;
        }
    } else {
        if (meta.artist) {
            output.details += ` - ${meta.artist}`;
            if (meta.album) output.state = meta.album;
            if (meta.track_number && meta.track_total && config.rpc.displayTrackNumber) {
                output.partySize = parseInt(meta.track_number, 10);
                output.partyMax = parseInt(meta.track_total, 10);
            }
        } else {
            output.state = status.state;
        }
    }

    const end = Math.floor(Date.now() / 1000 + ((status.length - status.time) / status.rate));

    if (status.state === 'playing' && config.rpc.displayTimeRemaining && status.length != 0) {
        output.endTimestamp = end;
    }
    log('Format output', output);

    if (meta.title && meta.artist && config.spotify.enabled) {
        try {
            let songData = await spotify.search({ type: 'track', query: `${meta.title} - ${meta.artist}` })
            if (songData?.tracks.items[0]) {
                let song = songData.tracks.items[0]
                let songLink
                try {
                    songLink = await getLinks({ url: song.external_urls.spotify })
                }
                catch (e) { verboseLog('Failed to get song.link Data'); }

                if (songLink?.pageUrl) {
                    let btn1 = {
                        label: `View on Songlink`,
                        url: songLink.pageUrl
                    }
                    let btn2 = {
                        label: 'Checkout project',
                        url: 'https://github.com/Zemyoro/VLC-Presence'
                    }
                    output.buttons = [btn1, btn2]
                }
                if (song.album.images && song.album.images.length > 0) {
                    output.largeImageKey = song.album.images[0].url
                }
            }
        }
        catch (e) { verboseLog('Failed to get spotify Data'); }
    }

    return output;
}




