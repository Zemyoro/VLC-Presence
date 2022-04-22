import { psTree } from "@flemist/ps-cross-platform";

export default async function killVLC() {
    await psTree().then((processes: any) => {
        for (const [key, value] of Object.entries(processes)) {
            // @ts-ignore
            if (value.command.toLowerCase().includes('vlc')) {
                // @ts-ignore
                process.kill(value.pid);
            }
        }
    });
}