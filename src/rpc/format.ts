import { log } from '../helpers/lager';
import * as config from '../../config/config.json';
import * as albumArt from '../../config/art.json';

export let format = (status: any) => {
    if (status.state === 'stopped')
        return {
            state: 'Stopped',
            details: 'Nothing is playing',
            largeImageKey: config.rpc.largeIcon,
            largeImageText: 'VLC Media Player',
            smallImageKey: 'stopped',
            smallImageText: 'Stopped',
            instance: true
        };

    const { meta } = status.information.category;
    const output = {
        details: meta.title || meta.filename,
        state: '',
        partySize: 0,
        partyMax: 0,
        // @ts-ignore
        largeImageKey: albumArt[meta.album] || config.rpc.largeIcon,
        largeImageText: 'VLC Media Player',
        smallImageKey: status.state,
        smallImageText: `Volume: ${Math.round(status.volume / 2.56)}%`,
        startTimestamp: 1,
        endTimestamp: 1,
        instance: true
    };

    if (status.stats.decodedvideo > 0) {
        if (meta['YouTube Start Time'] !== undefined) {
            output.largeImageKey = 'youtube';
            output.largeImageText = meta.url;
        }
        if (meta.showName) output.details = meta.showName;
        if (meta.episodeNumber) {
            output.state = `Episode ${meta.episodeNumber}`;
            if (meta.seasonNumber) {
                output.state += ` - Season ${meta.seasonNumber}`;
            }
        } else if (meta.artist) {
            output.state = meta.artist;
        } else {
            output.state = `${(status.date || '')} Video`;
        }
    } else if (meta.now_playing) {
        output.state = meta.now_playing || "Stream";
    } else if (meta.artist) {
        output.state = meta.artist;
        if (meta.album) output.state += ` - ${meta.album}`;
        if (meta.track_number && meta.track_total && config.rpc.displayTrackNumber) {
            output.partySize = parseInt(meta.track_number, 10);
            output.partyMax = parseInt(meta.track_total, 10);
        }
    } else {
        output.state = status.state;
    }
    const end = Math.floor(Date.now() / 1000 + ((status.length - status.time) / status.rate));
    if (status.state === 'playing' && config.rpc.displayTimeRemaining && status.length != 0) {
        output.endTimestamp = end;
    }
    log('Format output', output);
    return output;
}