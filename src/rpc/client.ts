import RPC from 'discord-rpc';
import * as config from '../../config/config.json';
import { diff } from '../vlc/diff';
import { format } from './format';
import { log } from '../helpers/lager';
import { verboseLog } from "../index";

export let ClientExecute = () => {
    const client = new RPC.Client({ transport: 'ipc' });
    let awake: Boolean = true;
    let timeInactive = 0;

    function update() {
        diff(async (status: any, difference: any) => {
            if (difference) {
                await client.setActivity(await format(status));
                verboseLog("Presence updated")
                if (!awake) {
                    awake = true;
                    timeInactive = 0;
                }
            } else if (awake) {
                if (status.state !== 'playing') {
                    timeInactive += config.rpc.updateInterval;
                    if ((timeInactive >= config.rpc.sleepTime) || (!config.rpc.showStopped && status.state === 'stopped')) {
                        log('VLC not playing; going to sleep.', true);
                        awake = false;
                        await client.clearActivity();
                    } else {
                        console.log("Presence updated")
                        await client.setActivity(await format(status));
                        awake = false;
                    }
                }
            }
        })
    }

    client.on('ready', () => {
        console.log(`Connected to Discord 🎶`);
    });

    function DiscordLogin() {
        client.login({ clientId: config.rpc.id })
            .then(() => {
                setInterval(update, config.rpc.updateInterval);
            })
            .catch((err: any) => {
                if (err.toString() === "Error: Could not connect") {
                    console.log("Failed to connect to Discord. Retrying in 20 seconds...");
                    setTimeout(DiscordLogin, 20000)
                } else {
                    console.log("An unknown error occurred while attempting a connection to Discord.");
                    throw err;
                }
            });
    }

    DiscordLogin();
}
