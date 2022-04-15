import * as config from '../config/config.json';
import { log } from './helpers/lager';
import { spawn } from 'child_process';
import fs from 'fs';

import { ClientExecute } from './rpc/client';
ClientExecute()

const platformDefaults: any = {
	win32: 'C:/Program Files/VideoLAN/VLC/vlc.exe',
	winalt: 'C:/Program Files (x86)/VideoLAN/VLC/vlc.exe',
	linux: '/usr/bin/vlc',
	unix: '/usr/bin/vlc',
	darwin: '/Applications/VLC.app/Contents/MacOS/VLC'
}

function pass() { return Math.random().toString(36).slice(-8) }

if (config.vlc.password === "") config.vlc.password = pass();

log('Started, config', config);
if (!(config.rpc.detached || process.argv.includes('detached'))) {
	if (process.platform === "win32") {
		if (!fs.existsSync(platformDefaults.win32)) {
			platformDefaults.win32 = platformDefaults.winalt;
		}
	}
	const command = config.vlcPath || platformDefaults[process.platform] || 'vlc';
	// @ts-ignore
	const child = spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', config.vlc.port]);
	// @ts-ignore
	child.on('exit', () => {
		console.log("VLC closed; Exiting.");
		process.exit(0);
	});
	// @ts-ignore
	child.on('error', () => {
		console.log("------------------------------------");
		console.log("ERROR: A problem occurred while launching VLC. If you installed VLC to a custom location, add the vlcPath in ./config/config.json (eg. vlcPath: \"C:/Program Files/videolan/vlc/vlc.exe\")");
		console.log("------------------------------------");
		console.log("Waiting 20 seconds before exiting to analyze the incoming error message");
		setTimeout(process.exit, 20000, 1)
	});
}