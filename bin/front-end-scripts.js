#! /usr/bin/env node

const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3); // eslint-disable-line

switch (script) {
    // case 'eject':
    // case 'test':
    case 'build':
    case 'start':
        process.exit(run().status);
        break;
    default:
        console.log(`Unknown script ${script}.`);
        console.log('Perhaps you need to update front-end-scripts?');
        break;
}


function run() {
    const result = spawn.sync(
        'node',
        [require.resolve('../script/' + script)].concat(args), // eslint-disable-line
        { stdio: 'inherit' }
    );
    return result;
}
