(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// class Cart3, a three-simensional Cartesian vector class

var Cart3 = (function () {
    function Cart3() {
        var x = arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments[1] === undefined ? 0 : arguments[1];
        var z = arguments[2] === undefined ? 0 : arguments[2];

        _classCallCheck(this, Cart3);

        if (x instanceof Cart3) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    _createClass(Cart3, {
        sub: {
            value: function sub() {
                var cart3 = arguments[0] === undefined ? new Cart3() : arguments[0];

                return new Cart3(this.x - cart3.x, this.y - cart3.y, this.z - cart3.z);
            }
        },
        mult: {
            value: function mult() {
                var factor = arguments[0] === undefined ? 1 : arguments[0];

                return new Cart3(this.x * factor, this.y * factor, this.z * factor);
            }
        },
        addTo: {
            value: function addTo() {
                var cart3 = arguments[0] === undefined ? new Cart3() : arguments[0];

                this.x += cart3.x;
                this.y += cart3.y;
                this.z += cart3.z;
                return this;
            }
        },
        invSumCube: {
            value: function invSumCube() {
                return Math.pow(this.x * this.x + this.y * this.y + this.z * this.z, -1.5);
            }
        },
        abs: {
            value: function abs() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            }
        },
        toString: {
            value: function toString() {
                return this.x + "," + this.y + "," + this.z;
            }
        }
    });

    return Cart3;
})();

module.exports = Cart3;

},{}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Cart3 = _interopRequire(require("./Cart3"));

var OrbitBody = _interopRequire(require("./OrbitBody"));

var OrbitBodyCollection = _interopRequire(require("./OrbitBodyCollection"));

var _constants = require("./constants");

var G = _constants.G;
var RADIANS_IN_DEGREE = _constants.RADIANS_IN_DEGREE;

var Engine = (function () {
    function Engine(canvas) {
        var orbitBodies = arguments[1] === undefined ? new OrbitBodyCollection() : arguments[1];

        var _ref = arguments[2] === undefined ? {} : arguments[2];

        var _ref$xAngle = _ref.xAngle;
        var xAngle = _ref$xAngle === undefined ? 0 : _ref$xAngle;
        var _ref$yAngle = _ref.yAngle;
        var yAngle = _ref$yAngle === undefined ? 180 : _ref$yAngle;
        var _ref$oldXAngle = _ref.oldXAngle;
        var oldXAngle = _ref$oldXAngle === undefined ? xAngle : _ref$oldXAngle;
        var _ref$oldYAngle = _ref.oldYAngle;
        var oldYAngle = _ref$oldYAngle === undefined ? yAngle : _ref$oldYAngle;
        var _ref$zoom = _ref.zoom;
        var zoom = _ref$zoom === undefined ? 1 : _ref$zoom;
        var _ref$zoomDelta = _ref.zoomDelta;
        var zoomDelta = _ref$zoomDelta === undefined ? 0.1 : _ref$zoomDelta;
        var _ref$minZoom = _ref.minZoom;
        var minZoom = _ref$minZoom === undefined ? 0 : _ref$minZoom;
        var _ref$maxZoom = _ref.maxZoom;
        var maxZoom = _ref$maxZoom === undefined ? 12 : _ref$maxZoom;
        var _ref$drawingScale = _ref.drawingScale;
        var drawingScale = _ref$drawingScale === undefined ? 1e-12 : _ref$drawingScale;
        var _ref$planetScale = _ref.planetScale;
        var planetScale = _ref$planetScale === undefined ? 7e-8 : _ref$planetScale;
        var _ref$pFactor = _ref.pFactor;
        var pFactor = _ref$pFactor === undefined ? 1000 : _ref$pFactor;
        var _ref$timeStep = _ref.timeStep;
        var timeStep = _ref$timeStep === undefined ? 36000 : _ref$timeStep;
        var _ref$running = _ref.running;
        var running = _ref$running === undefined ? true : _ref$running;
        var _ref$legend = _ref.legend;
        var legend = _ref$legend === undefined ? true : _ref$legend;
        var _ref$labels = _ref.labels;
        var labels = _ref$labels === undefined ? true : _ref$labels;

        _classCallCheck(this, Engine);

        if (typeof canvas === "string") {
            canvas = document.querySelector(canvas);
        }
        if (!document.contains(canvas)) {
            throw new TypeError("Invalid canvas");
        }
        this.canvas = canvas;
        this.canvas.setAttribute("width", parseInt(getComputedStyle(document.documentElement).width, 10) - 17);
        this.canvas.setAttribute("height", parseInt(getComputedStyle(document.documentElement).height, 10) - 17);
        this.ctx = canvas.getContext("2d");
        this.ctx.globalCompositeOperation = "source-over";
        this.xs = this.ctx.canvas.width;
        this.ys = this.ctx.canvas.height;
        this.xctr = Math.floor(this.xs / 2);
        this.yctr = Math.floor(this.ys / 2);
        this.frameCount = 0;

        Object.assign(this, {
            xAngle: xAngle, yAngle: yAngle, oldXAngle: oldXAngle, oldYAngle: oldYAngle,
            zoom: zoom, zoomDelta: zoomDelta, minZoom: minZoom, maxZoom: maxZoom,
            drawingScale: drawingScale, planetScale: planetScale, pFactor: pFactor,
            timeStep: timeStep, running: running, legend: legend, labels: labels
        });

        this.orbitBodies = orbitBodies;
        this.sun = this.orbitBodies.getMostMassive();
        this.initx = 0;
        this.inity = 0;
        this.updateTrigValues(this.xAngle, this.yAngle);

        this.setupEvents();
    }

    _createClass(Engine, {
        start: {
            value: function start() {
                var _this = this;

                window.requestAnimationFrame(function () {
                    _this.perform(true);
                });
            }
        },
        perform: {
            value: function perform(oneFrame) {
                var _this = this;

                if (this.running) {
                    this.render(oneFrame);
                    this.frameCount++;
                    window.requestAnimationFrame(function () {
                        _this.perform(false);
                    });
                }
            }
        },
        render: {
            value: function render(oneFrame) {
                this.clear();
                this.drawSubset(oneFrame, this.timeStep, this.xctr, this.yctr, this.orbitBodies, this.sun);
                this.drawLabels();
            }
        },
        clear: {
            value: function clear() {
                this.ctx.fillStyle = "#000";
                this.ctx.fillRect(0, 0, this.xs, this.ys);
            }
        },
        drawLabels: {
            value: function drawLabels() {
                if (this.legend) {
                    this.writeText("X    " + this.formatNum(this.xAngle, 2, 8) + "°", 8, this.ys - 40);
                    this.writeText("Y    " + this.formatNum(this.yAngle, 2, 8) + "°", 8, this.ys - 24);
                    this.writeText("Zoom " + this.formatNum(this.zoom, 2, 8), 8, this.ys - 8);
                }
            }
        },
        formatNum: {
            value: function formatNum(x, dp, sz) {
                var s = "              " + x.toFixed(dp);
                return s.substr(s.length - sz);
            }
        },
        drawSubset: {
            value: function drawSubset(oneFrame, timeStep, cx, cy, bodies, center) {
                var _this = this;

                if (!oneFrame) {
                    this.updateObjects(bodies, timeStep, center);
                }

                var toDraw = [];

                bodies.forEach(function (body) {
                    var pp = _this.scaleRotateOrbitingBody(body, cx),
                        radius = body.radius * _this.planetScale * _this.zoom;
                    if (radius < 1) {
                        radius = 1;
                    }
                    toDraw.push({
                        z: pp.z,
                        color: body.color,
                        bodyArgs: [pp.x, pp.y, pp.z, pp.pFactor, cx, cy, radius],
                        textArgs: [body.name, cx + pp.x + 6, cy + pp.y + 4, pp.pFactor],
                        name: body.name
                    });

                    //if (body.moons.length) {
                    //    this.drawSubset(oneFrame, timeStep, cx + pp.x, cy + pp.y, body.moons, body);
                    //}
                });

                //Sort bodies by depth so that objects at the back are drawn first
                toDraw.sort(function (a, b) {
                    return b.z - a.z;
                });

                toDraw.forEach(function (body) {
                    _this.ctx.fillStyle = body.color;
                    _this.drawOval.apply(_this, body.bodyArgs);
                    if (_this.labels && body.name !== "Sun") {
                        _this.writeText.apply(_this, body.textArgs);
                    }
                });
            }
        },
        scaleRotateOrbitingBody: {
            value: function scaleRotateOrbitingBody(body, cx) {
                // make a copy, don't modify the original values
                var p = body.pos.mult(this.drawingScale * this.zoom * cx);

                // this simple rotation matrix is from my Apple World 1979
                var h = p.x * this.sinx - p.z * this.cosx;
                var x = p.x * this.cosx + p.z * this.sinx;
                var y = p.y * this.cosy + this.siny * h;
                var z = -p.y * this.siny + this.cosy * h;

                var pp = new Cart3(x, y, z);

                // compute perspective
                pp.pFactor = this.pFactor / (this.pFactor + pp.z);
                pp.x *= pp.pFactor;
                pp.y *= pp.pFactor;
                return pp;
            }
        },
        updateObjects: {
            value: function updateObjects(bodies, dt, center) {
                var _this = this;

                // compute gravitation only wrt the sun, not wrt all other bodies
                bodies.forEach(function (body) {
                    _this.updateOrbit(body, center, dt);
                });
            }
        },
        updateOrbit: {
            value: function updateOrbit(body, focus, dt) {
                if (body instanceof OrbitBody && focus instanceof OrbitBody && body !== focus) {
                    // this trig-free method does this:
                    // 1. vel += dt * radius * -G * mass * radius.abs()^-3
                    // 2. pos += dt * vel
                    // including an optional dark energy constant (lambda)

                    // compute radius of separation
                    var radius = body.pos.sub(focus.pos);
                    // update velocity with gravitational acceleration
                    body.vel.addTo(radius.mult(dt * (0 - G * focus.mass * radius.invSumCube())));
                    // update position with velocity
                    body.pos.addTo(body.vel.mult(dt));
                }
            }
        },
        drawOval: {
            value: function drawOval(x, y, z, pf, cx, cy, ovalSize) {
                // pf < 0 means position is behind viewer
                if (pf > 0) {
                    try {
                        var os = ovalSize * pf;
                        this.ctx.beginPath();
                        this.ctx.arc(x + cx, y + cy, os, 0, 2 * Math.PI, false);
                        this.ctx.fill();
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        },
        writeText: {
            value: function writeText(text, x, y) {
                var pf = arguments[3] === undefined ? 1 : arguments[3];

                //pf < 0 means position is behind viewer
                if (pf > 0) {
                    try {
                        this.ctx.fillStyle = "#FFF";
                        this.ctx.fillText(text, x, y);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        },
        setupEvents: {
            value: function setupEvents() {
                var _this = this;

                // mouse events
                this.canvas.addEventListener("mousedown", function (e) {
                    e.preventDefault();
                    // preserve mouse initial position
                    _this.initx = _this.ntrp(e.clientX, 0, _this.xs, -90, 90);
                    _this.inity = _this.ntrp(e.clientY, 0, _this.ys, 90, -90);
                    _this.mouseDown = true;
                }, false);

                this.canvas.addEventListener("mousemove", function (e) {
                    e.preventDefault();
                    // preserve mouse initial position
                    if (_this.mouseDown) {
                        // present angle equals old angle plus mouse
                        // delta position since last mouse press
                        _this.xAngle = _this.ntrp(e.clientX, 0, _this.xs, -90, 90) + _this.oldXAngle - _this.initx;
                        _this.yAngle = _this.ntrp(e.clientY, 0, _this.ys, 90, -90) + _this.oldYAngle - _this.inity;
                        _this.mouseMotion();
                    }
                }, false);

                this.canvas.addEventListener("click", function (e) {
                    e.preventDefault();
                    _this.mouseDown = false;
                    _this.oldXAngle = _this.xAngle;
                    _this.oldYAngle = _this.yAngle;
                }, false);

                // zoom with mouse wheel
                this.canvas.addEventListener("mousewheel", function (e) {
                    _this.mouseWheel(e);
                    return false;
                }, false);
                this.canvas.addEventListener("DOMMouseScroll", function (e) {
                    _this.mouseWheel(e);
                    return false;
                }, false);

                //// touchscreen touch events
                //this.canvas.addEventListener('touchstart', (e) => {
                //    e.preventDefault();
                //    // multiple touches always appear separately
                //    // but with different identifiers
                //    var touches = e.changedTouches;
                //    var touch = touches[0];
                //    switch (touch.identifier) {
                //        case 0:
                //        {
                //            this.zoomFlag = false;
                //            this.tax = touch.clientX;
                //            this.tay = touch.clientY;
                //            this.initx = this.ntrp(this.tax, 0, this.xs, -90, 90);
                //            this.inity = this.ntrp(this.tay, 0, this.ys, 90, -90);
                //            break;
                //        }
                //        case 1:
                //        {
                //            var tbx = touch.clientX;
                //            var tby = touch.clientY;
                //            this.oldZoom = this.zoom;
                //            // old zoom = magnitude of separation between two touches
                //            this.oldMag = Math.sqrt(Math.pow(tbx - this.tax, 2) + Math.pow(tby - this.tay, 2));
                //            break;
                //        }
                //    }
                //}, false);
                //this.canvas.addEventListener('touchend', (e) => {
                //    e.preventDefault();
                //    this.oldXAngle = this.xAngle;
                //    this.oldYAngle = this.yAngle;
                //    this.oldZoom = this.zoom;
                //    //this.updateSliderTitles();
                //}, false);
                //this.canvas.addEventListener('touchcancel', (e) => {
                //    e.preventDefault();
                //}, false);
                //this.canvas.addEventListener('touchleave', (e) => {
                //    e.preventDefault();
                //    this.oldXAngle = this.xAngle;
                //    this.oldYAngle = this.yAngle;
                //    this.oldZoom = this.zoom;
                //    //this.updateSliderTitles();
                //}, false);
                //this.canvas.addEventListener('touchmove', (e) => {
                //    e.preventDefault();
                //    try {
                //        var touches = e.changedTouches;
                //        var touch = touches[0];
                //        var dax = touch.clientX;
                //        var day = touch.clientY;
                //        // if two touches, compute new scale
                //        if (touches.length > 1 && this.oldZoom != undefined) {
                //            touch = touches[1];
                //            var dbx = touch.clientX;
                //            var dby = touch.clientY;
                //
                //            // compute zoom based on distance between two touches
                //            var newMag = Math.sqrt(Math.pow(dbx - dax, 2) + Math.pow(dby - day, 2));
                //            var r = newMag / this.oldMag;
                //            this.zoom = this.oldZoom * r;
                //            this.mouseMotion();
                //            // the zoom flag avoids a bug in which the viewing
                //            // angle changes abruptly after a zoom gesture
                //            this.zoomFlag = true;
                //        } else {
                //            if (!this.zoomFlag) {
                //                this.xAngle = this.ntrp(dax, 0, this.xs, -90, 90) + this.oldXAngle - this.initx;
                //                this.yAngle = this.ntrp(day, 0, this.ys, 90, -90) + this.oldYAngle - this.inity;
                //                this.mouseMotion();
                //            }
                //        }
                //    } catch (err) {
                //        this.logDebug(err);
                //    }
                //}, false);
            }
        },
        mouseMotion: {
            value: function mouseMotion() {
                this.updateTrigValues(this.xAngle, this.yAngle);
            }
        },
        mouseWheel: {
            value: function mouseWheel(e) {
                if (!e) {
                    e = window.event;
                }
                e.preventDefault();
                // note sign reversal on e.detail
                var delta = e.wheelDelta ? e.wheelDelta : -e.detail;
                var m = 1 + (delta > 0 ? this.zoomDelta : this.zoomDelta * -1);

                if (m > 1 && this.zoom < this.maxZoom || m < 1 && this.zoom > this.minZoom) {
                    this.zoom *= m;
                }
            }
        },
        updateTrigValues: {
            value: function updateTrigValues(xa, ya) {
                xa *= RADIANS_IN_DEGREE;
                ya *= RADIANS_IN_DEGREE;
                this.sinx = Math.sin(xa);
                this.cosx = Math.cos(xa);
                this.siny = Math.sin(ya);
                this.cosy = Math.cos(ya);
            }
        },
        ntrp: {
            value: function ntrp(x, xa, xb, ya, yb) {
                return (x - xa) * (yb - ya) / (xb - xa) + ya;
            }
        },
        getPlanet: {
            value: function getPlanet(name) {
                return this.orbitBodies.getByName(name);
            }
        }
    });

    return Engine;
})();

module.exports = Engine;

},{"./Cart3":1,"./OrbitBody":3,"./OrbitBodyCollection":4,"./constants":5}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Cart3 = _interopRequire(require("./Cart3"));

var OrbitBody = (function () {
    function OrbitBody() {
        var name = arguments[0] === undefined ? "" : arguments[0];
        var radius = arguments[1] === undefined ? 0 : arguments[1];
        var pos = arguments[2] === undefined ? new Cart3() : arguments[2];
        var vel = arguments[3] === undefined ? new Cart3() : arguments[3];
        var mass = arguments[4] === undefined ? 0 : arguments[4];
        var color = arguments[5] === undefined ? "" : arguments[5];

        _classCallCheck(this, OrbitBody);

        Object.assign(this, { name: name, radius: radius, mass: mass, pos: pos, vel: vel, color: color });
        this.moons = [];
    }

    _createClass(OrbitBody, {
        addMoons: {
            value: function addMoons() {
                for (var _len = arguments.length, moons = Array(_len), _key = 0; _key < _len; _key++) {
                    moons[_key] = arguments[_key];
                }

                Array.prototype.push.apply(this.moons, moons);
            }
        },
        getMoons: {
            value: function getMoons() {
                return this.moons;
            }
        }
    });

    return OrbitBody;
})();

module.exports = OrbitBody;

},{"./Cart3":1}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var OrbitBodyCollection = (function (_Array) {
    function OrbitBodyCollection() {
        for (var _len = arguments.length, bodies = Array(_len), _key = 0; _key < _len; _key++) {
            bodies[_key] = arguments[_key];
        }

        _classCallCheck(this, OrbitBodyCollection);

        Array.prototype.push.apply(this, bodies);
    }

    _inherits(OrbitBodyCollection, _Array);

    _createClass(OrbitBodyCollection, {
        getMostMassive: {
            value: function getMostMassive() {
                this.sort(function (a, b) {
                    return b.mass - a.mass;
                });
                return this[0];
            }
        },
        getByName: {
            value: function getByName(name) {
                var matching = this.filter(function (elem) {
                    return elem.name === name;
                });
                return matching[0];
            }
        }
    });

    return OrbitBodyCollection;
})(Array);

module.exports = OrbitBodyCollection;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var G = 6.6742e-11;exports.G = G;
// universal gravitational constant
var RADIANS_IN_DEGREE = Math.PI / 180;
exports.RADIANS_IN_DEGREE = RADIANS_IN_DEGREE;

},{}],6:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Cart3 = _interopRequire(require("./Cart3"));

var OrbitBody = _interopRequire(require("./OrbitBody"));

var OrbitBodyCollection = _interopRequire(require("./OrbitBodyCollection"));

var Engine = _interopRequire(require("./Engine"));

var engine = new Engine("canvas", new OrbitBodyCollection(
//new OrbitBody('Sun',     695000000, new Cart3(0, 0, 0),              new Cart3(0, 0, 0),     1.989E+030, '#fc5110'),
new OrbitBody("Sun", 348000000, new Cart3(0, 0, 0), new Cart3(0, 0, 0), 1.989e+30, "#fc5110"), //Using smaller sun for visuals (but using correct mass)
new OrbitBody("Mercury", 2440000, new Cart3(-57909050000, 0, 0), new Cart3(0, 0, 47900), 3.33e+23, "grey"), new OrbitBody("Venus", 6050000, new Cart3(-108000000000, 0, 0), new Cart3(0, 0, 35000), 4.869e+24, "yellow"), new OrbitBody("Earth", 6378140, new Cart3(-150000000000, 0, 0), new Cart3(0, 0, 29800), 5.976e+24, "blue"), new OrbitBody("Mars", 3397200, new Cart3(-227940000000, 0, 0), new Cart3(0, 0, 24100), 6.421e+23, "red"), new OrbitBody("Jupiter", 71492000, new Cart3(-778330000000, 0, 0), new Cart3(0, 0, 13100), 1.9e+27, "#daa520"), new OrbitBody("Saturn", 60268000, new Cart3(-1429400000000, 0, 0), new Cart3(0, 0, 9640), 5.688e+26, "#f7d560"), new OrbitBody("Uranus", 25559000, new Cart3(-2870990000000, 0, 0), new Cart3(0, 0, 6810), 8.686e+25, "cyan"), new OrbitBody("Neptune", 24746000, new Cart3(-4504300000000, 0, 0), new Cart3(0, 0, 5430), 1.024e+26, "blue"), new OrbitBody("Pluto", 1137000, new Cart3(-5913520000000, 0, 0), new Cart3(0, 0, 4740), 1.27e+22, "grey")));

//    new OrbitBody('Moon',   1740000,   new Cart3(-384400000, 0, 0), new Cart3(0, 0, 1000),  7.347E+22,  'grey')

window.addEventListener("load", engine.start.bind(engine), false);

},{"./Cart3":1,"./Engine":2,"./OrbitBody":3,"./OrbitBodyCollection":4}]},{},[6]);
