#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var padChar = '\t';
var lnChar = '\n';

if (argv.h || argv.help) {
  console.log([
    'usage: cssMarker [Directory {Default: Current}] [options]',
    '',
    'options:',
    '  -a           Add Icon After Link',
	'  -b           Add Icon Before Link {Default}',
	'  -h           This Help',
	'  -o           Output Directory',
	'  -m           Build Minified {Default: false}',
	'  -n           Build Filename {Default: extension.css}',
	'  -p           Padding of Icon in px {Default: 4}',
	'  -r           Selector Pattern {Default: a[href$ } ',
	'  -s           Size of Icons'
  ].join('\n'));
  process.exit();
}


var directory = argv._[0];
if (!directory) {
    directory = process.cwd();
}

var iconSize = argv["s"];
if (!iconSize) {
    iconSize = 16;
}

var padding = argv["p"];
if (!padding) {
    padding =  4;
}
var totalPadding = iconSize + padding ;

var output = argv["o"];
if (!output) {
    output = directory;
}

var minified = argv["m"] || false;
if (minified) {
    padChar = '';
    lnChar = '';
}

var cssName = argv["n"];
if (!cssName) {
    cssName = "extension.css";
}

var after = argv["a"];
var before = argv["b"];
var justPosition = 'left';
var justSelector = 'before';

if (typeof(after) === "boolean") {
    if (after) {
        justPosition = 'right';
		justSelector = 'after';
    }
} else {
    if (typeof(before) === "boolean") { 
		if (!before) {
			justPosition = 'right';
			justSelector = 'after';
		}
	}
}

var valuePrepend = ""
var cssSelector = argv["n"];
if (!cssSelector) {
    cssSelector = "a[href$";
	valuePrepend = "."
}

var valuePrepend = "."

console.log("Directory: " + directory);
console.log("Filename : " + cssName);
console.log("Selector : " + cssSelector);
console.log("Icon Size: " + iconSize + "px by " + iconSize + "px");
console.log("Padding  : " + padding + "px");
console.log("Position : " + justSelector + " link");
console.log("Minified : " + minified);


var files = fs.readdirSync(directory);
var css = [];
css.push("/* css Marker Version 1.0.0b  */");

function base64_encode(file) {
    var imageBytes = fs.readFileSync(file);
    return new Buffer(imageBytes).toString('base64');
}

var entries = 0;

for (var i in files) {
    var filename = files[i];
    if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(filename)) {
        var fullPath = path.join(directory, filename);
        var extension = path.extname(filename);
        var cssExt = path.basename(filename, extension);

        //console.log('File: ' + fullPath + ' : .' + cssExt);
        var b64 = base64_encode(fullPath);
        if (!minified) {
			css.push('\n/* Extension : ' + cssExt.toUpperCase() + ' */'+lnChar);
		}
        css.push([
		padChar + cssSelector + '="' + valuePrepend + cssExt.toLowerCase() + '"]:' + justSelector + ',',
		padChar + cssSelector + '="' + valuePrepend + cssExt.toUpperCase() + '"]:' + justSelector + ' {',
        padChar + padChar +'content: "";',
        padChar + padChar +'display: inline-block;',
        padChar + padChar +'width: ' + iconSize + 'px;',
        padChar + padChar +'height: ' + iconSize + 'px;',
        padChar + padChar +'color: #FFF;',
        padChar + padChar +'font-size: 1em;',
        padChar + padChar +'font-weight: bold;',
        padChar + padChar +'background-color: transparent;',
        padChar + padChar +'background-repeat: no-repeat;',
        padChar + padChar +'background-position: '+justPosition+';',
        padChar + padChar +'padding-'+justPosition+': ' + totalPadding + 'px;',
        padChar +'}' + lnChar,
        padChar +cssSelector + '="' + valuePrepend + cssExt.toLowerCase() + '"]:' + justSelector + ',',
        padChar +cssSelector + '="' + valuePrepend + cssExt.toUpperCase() + '"]:' + justSelector + ' {',
        padChar + padChar +'background-image: url(data:image/' + 
			extension.toLowerCase().substring(1, extension.length) +
            ';base64,' + b64 + ');',
        padChar +'}' + lnChar].join(lnChar));
		entries+=1;

    }

}

console.log("Entries  : " + entries);

if (!entries) {
	console.log("Created  : ** No File Created **" );
	process.exit();	
}
var wCss = css.join(lnChar);
var cssFilename = path.join(output, cssName);

fs.writeFile(cssFilename, wCss, function(err) {
    if (err) {
        return console.log(err);
    }
	console.log("Created  : " + cssFilename);

});