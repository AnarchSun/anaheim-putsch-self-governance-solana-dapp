import { bold, white } from 'picocolors';
export function finalNote(arguments_) {
    const lines = [
        `That's it!`,
        `Change to your new directory and start developing:`,
        message(`cd ${arguments_.target}`),
        `Start the app:`,
        cmd(arguments_.packageManager, 'dev'),
        ...arguments_.instructions.map((line) => (line.startsWith('+') ? message(line.slice(1)) : line)),
    ];
    return lines.join('\n\n');
}
function cmd(pm, command) {
    return message(`${pm} run ${command}`);
}
function message(message) {
    return bold(white(message));
}
