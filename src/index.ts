import * as config from '../config/config.json';
import killVLC from "./helpers/killVLC";
import { log } from './helpers/lager';
import { spawn } from 'child_process';
import { Client } from './rpc/client';
import error from './helpers/error';
import fs from 'fs';

Client(); // Runs the RPC Client

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

	(async () => {
		await killVLC();

		const child: any = spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', `${config.vlc.port}`]);
		child.on('exit', () => {
			error('VLC', 'Process closed. Exiting...')
			process.exit(0);
		});
		child.on('error', () => {
			error('VLC', 'A problem occured while attempting to launch VLC. If VLC is installed to a custom location, add the path to ./config/config.json (e.g. vlcPath: "C:/Program Files/VideoLAN/vlc/vlc.exe"')
			error('VLC', 'Wait 20 Seconds to analyze the error or exit with ^C (Ctrl + C)')
			setTimeout(process.exit, 20000, 1)
		});
	})()
}