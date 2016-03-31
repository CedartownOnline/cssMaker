#!/usr/bin/env node

/*
** CSS Icon Maker **

The MIT License (MIT)
Copyright (c) 2016 James F Thompson(Thompsons of Cedartown)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies
 or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';
const defaultPadding = 4;
const defaultIconSize = 16;
const defaultCssSelector = 'a[href$';
const defaultCssName = 'extension.css';
const Version = '1.0.2';

var CleanCSS, after, argv, b64, base64_encode, baseSelector
    , before, buildHtml, buildTimestamp, css
    , cssBase, cssExt, cssFilename, cssImage, cssName, cssSelector
    , directory, entries, extension, filename
    , files, fs, fullPath, html, htmlFilename, htmlName, i, iconSize
    , justPosition, justSelector, lnChar
    , minified, output, padChar, padding, path, totalPadding, wCss
    , wHtml;

base64_encode = function(file) {
    var imageBytes;
    imageBytes = fs.readFileSync(file);
    return new Buffer(imageBytes).toString('base64');
};


argv = require('minimist')(process.argv.slice(2));


/* Output Help Information if Requested */
if (argv.h || argv.help) {
    console.log([
        'usage: cssMarker [Directory {Default: Current}] [options]'
        , '', 'options:'
        , '\t-a\tAdd icon after element'
        , '\t-b\tAdd icon before element {Default}'
        , '\t-h\tThis help screen'
        , '\t-m\tBuild minified {Default: false}'
        , '\t-n\tBuild filename {Default: ' + defaultCssName +
        '}'
        , '\t-o\tOutput directory'
        , '\t-p\tPadding of icon in px {Default: ' +
        defaultPadding + '}'
        , '\t-r\tSelector pattern {Default: ' +
        defaultCssSelector + ' } '
        , '\t\t\t"={image_name}]" appended'
        , '\t-s\tSize of icons {Default: ' + defaultIconSize +
        '}'
        , '\t-t\tFilename of sample html page {Default: None}'
    ].join('\n'));
    process.exit();
}

/* Init Variables */
fs = require('fs');
path = require('path');
padChar = '\t';
lnChar = '\n';
buildTimestamp = (new Date).toUTCString();

/* Resolved Source Directory */
directory = argv._[0];
if (!directory) {
    directory = process.cwd();
}

/* Resolved  Icon Size */
iconSize = argv['s'];
if (!iconSize) {
    iconSize = 16;
}

/* Resolved Padding or default */
padding = argv['p'];
if (!padding) {
    padding = defaultPadding;
}
totalPadding = padding;

/* Resolved output directory or default */
output = argv['o'];
if (!output) {
    output = directory;
}


/* Resolved Minification options */
minified = argv['m'] || false;



/* Resolved CSS Name or default */
cssName = argv['n'];
if (!cssName) {
    cssName = defaultCssName;
}
cssFilename = path.join(output, cssName);


/* Resolve Html Name and build flag */
htmlName = argv['t'];
if (!htmlName) {
    htmlName = '';
}
buildHtml = htmlName !== '';


/* Resolve Icon Placement and Justification */
after = argv['a'];
before = argv['b'];
justPosition = 'left';
justSelector = 'before';

if (typeof after === 'boolean') {
    if (after) {
        justPosition = 'right';
        justSelector = 'after';
    }
}
else {
    if (typeof before === 'boolean') {
        if (!before) {
            justPosition = 'right';
            justSelector = 'after';
        }
    }
}

/* Check and Default CSS Selector */
cssSelector = argv['n'];
if (!cssSelector) {
    cssSelector = defaultCssSelector;
}

/* Output resolved run options */
console.log('Directory: ' + directory);
console.log('Filename : ' + cssName);
console.log('Selector : ' + cssSelector);
console.log('Icon Size: ' + iconSize + 'px by ' + iconSize + 'px');
console.log('Padding  : ' + padding + 'px');
console.log('Position : ' + justSelector + ' link');
console.log('Minified : ' + minified);



/* Start CSS document if not minified */
css = [];
if (!minified) {
    css.push(['/* css Marker Version 1.0.0b  ', padChar +
        'Created  : ' + buildTimestamp, padChar +
        'Directory: ' + directory, padChar + 'Filename : ' +
        cssName, padChar + 'Selector : ' +
        cssSelector, padChar + 'Icon Size: ' + iconSize +
        'px by ' + iconSize + 'px', padChar +
        'Padding  : ' + padding + 'px', padChar +
        'Position : ' + justSelector + ' link', ' */' +
        lnChar
    ].join(lnChar));
}


/* Start HTML document if requested */
html = [];
if (buildHtml) {
    html.push(['<!DOCTYPE html>', '', '<html>', '<head>'
        , ' <title>ccsMaker Sample Page</title>', ' <style>'
        , ' h1,h2,h3,h4 {text-align: center; color: #fffbaa; font-style: bold;}'
        , ' body{margin: 5%; background-color: #512C73;}'
        , ' div.sample { width: 70%; border-radius: 25px; border: 2px solid #200439; padding: 20px; '
        , ' margin-top: 10px; margin-bottom: 10px; margin-left: auto; margin-right: auto;'
        , ' background-color: white; height: ' + iconSize +
        'px; white-space: nowrap;}', ' </style>'
        , ' <link rel="stylesheet" type="text/css" href="' +
        cssName + '">', '</head>', '<body>'
        , '<h1> ccsMaker Sample Page</h1>', '<h4>Created ' +
        buildTimestamp + '</h4>'
    ].join('\n'));
}

/* Init build variables */
entries = 0;
cssBase = [];
cssImage = [];

/* Loop thru each image in source directory */
files = fs.readdirSync(directory);
for (i in files) {
    filename = files[i];
    if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(filename)) {
        fullPath = path.join(directory, filename);
        extension = path.extname(filename);
        cssExt = path.basename(filename, extension);

        /* Add Selectore to base section */
        baseSelector = cssSelector + '=' + cssExt.toLowerCase() +
            ']:' + justSelector;
        cssBase.push(baseSelector + ',' + cssSelector + '=' + cssExt.toUpperCase() +
            ']:' + justSelector);

        /* Add documentation to Images Section */
        if (!minified) {
            cssImage.push('\n/* Extension : ' + cssExt.toUpperCase() +
                ' */' + lnChar);
        }
        /* Add Image to Images Section */
        b64 = base64_encode(fullPath);
        cssImage.push([padChar + cssSelector + '="' + cssExt.toLowerCase() +
            '"]:' + justSelector + ','
            , padChar + cssSelector + '="' + cssExt.toUpperCase() +
            '"]:' + justSelector + ' {'
            , padChar + padChar +
            'background-image: url(data:image/' + extension.toLowerCase()
            .substring(
                1, extension.length) + ';base64,' + b64 +
            ');', padChar + '}' + lnChar
        ].join(lnChar));


        /* Add HTML entry if requested */
        if (htmlName) {
            html.push(['<div class="sample">'
                , '<a href="this_is_a_dummy_link.' + cssExt.toLowerCase() +
                '"><i>(' + filename + ')' +
                '</i></a>&nbsp;&nbsp;&nbsp;&nbsp;CSS&nbsp;Selector: "' +
                baseSelector + '"'
                , '</div>'
            ].join('\n'));
        }

        /* Count Entry */
        entries += 1;
    }
}

/* Show Entries */
console.log('Entries  : ' + entries);

/* Exit if nothing to do, Exit! */
if (!entries) {
    console.log('Created  : ** No File Created **');
    process.exit();
}

/* Build Base Class setting */
css.push([padChar + cssBase.join(lnChar + padChar + ',')
    , padChar + '{', padChar + padChar + 'content: "";'
    , padChar + padChar + 'display: inline-block;'
    , padChar + padChar + 'width: ' + iconSize + 'px;'
    , padChar + padChar + 'height: ' + iconSize + 'px;'
    , padChar + padChar + 'color: #FFF;', padChar +
    padChar + 'font-size: 1em;'
    , padChar + padChar + 'font-weight: bold;'
    , padChar + padChar + 'background-color: transparent;'
    , padChar + padChar + 'background-repeat: no-repeat;'
    , padChar + padChar + 'background-position: ' +
    justPosition + ';'
    , padChar + padChar + 'padding-' + justPosition + ': ' +
    totalPadding + 'px;'
    , padChar + '}' + lnChar
].join(lnChar));

/* Add Images Section to CSS */
css.push(cssImage.join(lnChar));


/* Create Full CSS document */
wCss = css.join(lnChar);


/* If requested Minify CSS Document */
if (minified) {
    CleanCSS = require('clean-css');
    wCss = (new CleanCSS).minify(wCss).styles;
}

/* Write CSS Document to output directory */
fs.writeFile(cssFilename, wCss, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Created  : ' + cssFilename);
});


/*
 * If Requested Build HTML sample document
 */
if (buildHtml) {
    html.push(['</body>', '</html>'].join('\n'));
    wHtml = html.join('\n');
    htmlFilename = path.join(output, htmlName);
    fs.writeFile(htmlFilename, wHtml, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('Html     : ' + htmlFilename);
    });
}