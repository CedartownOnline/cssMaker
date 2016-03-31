# ** CSS Icon Maker **

The easy way to turn your icon into a CSS.
<img src="https://raw.githubusercontent.com/CedartownOnline/cssMaker/master/documentation/img/sampleOutput.png" width="600">

Install:
npm install cssmaker

```
cssmaker -h

usage: cssMarker [Directory {Default: Current}] [options]

options:
        -a      Add icon after element
        -b      Add icon before element {Default}
        -h      This help screen
        -m      Build minified {Default: false}
        -n      Build filename {Default: extension.css}
        -o      Output directory
        -p      Padding of icon in px {Default: 4}
        -r      Selector pattern {Default: a[href$ }
                        "={image_name}]" appended
        -s      Size of icons {Default: 16}
        -t      Filename of sample html page {Default: None}

```


Eample Run:

cssmaker N:\icons\16px -o .\sample -t extension.html -m
