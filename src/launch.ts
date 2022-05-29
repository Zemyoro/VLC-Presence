import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as config from '../config.json';
import fs from 'fs';

const platformDefaults: any = {
    win32: 'C:/Program Files/VideoLAN/VLC/vlc.exe',
    winalt: 'C:/Program Files (x86)/VideoLAN/VLC/vlc.exe',
    linux: '/usr/bin/vlc',
    unix: '/usr/bin/vlc',
    darwin: '/Applications/VLC.app/Contents/MacOS/VLC'
}

export let child:
    ChildProcessWithoutNullStreams | null = null;
export function spawnVLC(command: string) {
    return spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', `${config.vlc.port}`]);
}

function pass() { return Math.random().toString(36).slice(-8) }

if (config.vlc.password === "") config.vlc.password = pass();

if (!(config.rpc.detached || process.argv.includes('detached'))) {
    if (process.platform === "win32") {
        if (!fs.existsSync(platformDefaults.win32)) {
            platformDefaults.win32 = platformDefaults.winalt;
        }
    }
    const command = config.vlcPath || platformDefaults[process.platform] || 'vlc';
    child = spawnVLC(command);
    require('./rpc');

    child.on('close', () => {
        child = null;
    })
    child.on('exit', () => {
        child = null;
    })
    child.on('error', () => {
        console.log('VLC error');
        setTimeout(process.exit, 20000, 1)
    });
}