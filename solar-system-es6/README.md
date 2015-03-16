Solar System 3D (ES6)
==================

An update to the work done by [Paul Lutus](http://www.arachnoid.com/orbital_dynamics/) using the Physics Engine and logic he created. 

Rewritten in ES6 and incorporating relative sizes of planetoids.

## Building
Uses Babel to transpile ES6 to ES5
```bash
npm install -g browserify
npm install
browserify es6/script/index.js -t babelify --outfile script/bundle.js
``` 
 
###TODO
* Rebuild in Three.js to incorporate textures and lighting.
* Implement moons
* Display orbit paths
