#! /usr/bin/env node

const shell = require('shelljs');

// var spawn = require('cross-spawn');
const script = process.argv[2];
// const args = process.argv.slice(3);

console.log('Script:', script);

switch (script) {
    case 'start':
        shell.exec('webpack-dev-server');
        break;
    default:
        console.log(`Unknown script ${script}.`);
        console.log('Perhaps you need to update front-end-scripts?');
        break;
}

// case 'build':
// case 'eject':
// case 'test':
//   const result = spawn.sync(
//     'node',
//     [require.resolve('../scripts/' + script)].concat(args),
//     {stdio: 'inherit'}
//   );
//   process.exit(result.status);
//   break;
// default:
//   console.log('Unknown script "' + script + '".');
//   console.log('Perhaps you need to update react-scripts?');
//   break;
