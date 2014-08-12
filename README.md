# ghost-helm
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url] [![Dependency Status][depstat-dev-image]][depstat-dev-url] 

> A set of build tools for The Iron Yard


## Installation

Install the module with: `npm install ghost-helm`


## Setup

You'll want to require Ghost Helm like you would any other node module.
```js
var ghostHelm = require('ghost-helm');
```

After this, you'll want to merge Ghost Helm's built-in gulp tasks with the tasks you've defined in  your own `gulpfile.js`. Pass in any config options that you'd like to override, and a reference to your `gulpfile.js`'s `gulp` object. 

```js 
ghostHelm.setup({}, gulp);
```


## Usage

Ghost Helm can be used in a few different ways. After calling `ghostHelm.setup`, you can refer to the built in tasks as you would any other gulp task. The built in tasks are:

* `templates`
* `styles`
* `scripts`
* `images`
* `asset-build`
* `fonts`
* `sitemap`
* `clean`
* `build`
* `deploy`
* `connect`
* `serve`
* `watch`


If you're happy with the defaults, the command `ghost-helm build` will simplly produce the dist using the 'build' task:

```sh
$ npm install -g ghost-helm
$ ghost-helm build
```


## License

Copyright (c) 2014 Mason Stewart  
Licensed under the MIT license.


[npm-url]: https://npmjs.org/package/ghost-helm
[npm-image]: https://badge.fury.io/js/ghost-helm.png

[travis-url]: http://travis-ci.org/masondesu/ghost-helm
[travis-image]: https://secure.travis-ci.org/masondesu/ghost-helm.png?branch=master

[coveralls-url]: https://coveralls.io/r/masondesu/ghost-helm
[coveralls-image]: https://coveralls.io/repos/masondesu/ghost-helm/badge.png

[depstat-url]: https://david-dm.org/masondesu/ghost-helm
[depstat-image]: https://david-dm.org/masondesu/ghost-helm.png
[depstat-dev-url]: https://david-dm.org/masondesu/ghost-helm#info=devDependencies
[depstat-dev-image]: https://david-dm.org/masondesu/ghost-helm/dev-status.png