process.on('unhandledRejection', r => console.log(r));
process.on('uncaughtException', r => console.log(r,r.stack));

const Library = require('../Source/Library/Library.js');
let path = process.argv[ process.argv.length - 1 ];
if (!path) {
	console.log("specify full path as last argument");
	process.exit(1);
}
const lib = new Library();
lib.updateLib(path);