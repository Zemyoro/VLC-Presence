import * as config from '../../config/config.json';

export default function (type: string, content: string) {
    if (!config.verbose) return;
    console.log(`[${type}] ${content}`);
}