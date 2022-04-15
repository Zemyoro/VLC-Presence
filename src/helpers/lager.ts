import { VLCClient as _VLCClient } from 'vlc.js';
import { vlc } from '../../config/config.json';
import fs from 'fs';
import os from 'os';
import path from 'path';

const client = new _VLCClient(vlc);
const destination = path.join(__dirname, '/../../logs/');
const logs = [{
    details: {
        arch: os.arch(),
        type: os.type()
    }
}];

export let log = (...args: any) => ([...args]) => {
    const log: any = {
        msg: args,
        time: Date.now(),
        status: undefined
    };
    client.getStatus()
        .then((status: any) => {
            log.status = status;
            logs.push(log);
        })
        .catch((err: any) => {
            log.status = err.message;
            logs.push(log);
        });
}

process.on('exit', () => {
    if (!fs.existsSync(destination)) fs.mkdirSync(destination);
    fs.writeFileSync(`${destination}${Date.now()}.log`, JSON.stringify(logs));
});