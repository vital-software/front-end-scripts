#! /usr/bin/env node

const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
    // case 'build':
    // case 'eject':
    // case 'test':
    case 'start':
        const result = spawn.sync(
            'node',
            [require.resolve('../script/' + script)].concat(args),
            { stdio: 'inherit' }
        );
        process.exit(result.status);
        break;
    default:
        console.log(`Unknown script ${script}.`);
        console.log('Perhaps you need to update front-end-scripts?');
        break;
}
