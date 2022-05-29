import { psTree } from '@flemist/ps-cross-platform';
import cliSelect from 'cli-select';
require('pretty-error').start();
require('./launch');

const main = {
    async function(): Promise<any> {
        const option = await cliSelect({
            values: ['Launch VLC', 'Kill VLC', 'Exit'],
            valueRenderer(value, selected) {
                return value;
            }
        }).catch(() => null);
        if (!option) process.exit(0);

        switch (option.id) {
            case 0:
                const running = await psTree().then((processes) => {
                    for (const i in Object.values(processes)) {
                        if (Object.values(processes)[i].command.toLowerCase().includes('vlc')) return true;
                        if (parseInt(i) - 1 === Object.values(processes).length) return false;
                    }
                });

                if (!running) require('./launch');
                break;
            case 1:
                const child = require('./launch').child;
                if (child) {
                    child?.kill();
                    delete require.cache[require.resolve('./rpc')];
                    delete require.cache[require.resolve('./launch')];
                }
                break;
            case 2:
                process.exit(0);
        }

        return this.function();
    }
}

main.function();
process.on('uncaughtException', (error) => {
    if (error.message.startsWith('connect ECONNREFUSED')) {
        console.log('\nVLC is not running. Please launch VLC and try again.');
        process.exit(1);
    }
})