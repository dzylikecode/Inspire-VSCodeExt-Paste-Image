'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const url = `https://raw.github.com/imagemin/pngout-bin/v${pkg.version}/vendor/`;

module.exports = new BinWrapper()
	.src(`${url}osx/pngout`, 'darwin')
	.src(`${url}linux/x86/pngout`, 'linux', 'x86')
	.src(`${url}linux/x64/pngout`, 'linux', 'x64')
	.src(`${url}freebsd/x86/pngout`, 'freebsd', 'x86')
	.src(`${url}freebsd/x64/pngout`, 'freebsd', 'x64')
	.src(`${url}win32/pngout.exe`, 'win32')
	.dest(path.resolve(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'pngout.exe' : 'pngout');
