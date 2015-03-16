/*************************************************************************
 * Copyright (C) 2013, Paul Lutus                                        *
 *                                                                       *
 * Extended by Will Hawker https://github.com/whawker                    *
 *                                                                       *
 * This program is free software; you can redistribute it and/or modify  *
 * it under the terms of the GNU General Public License as published by  *
 * the Free Software Foundation; either version 2 of the License, or     *
 * (at your option) any later version.                                   *
 *                                                                       *
 * This program is distributed in the hope that it will be useful,       *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 * GNU General Public License for more details.                          *
 *                                                                       *
 * You should have received a copy of the GNU General Public License     *
 * along with this program; if not, write to the                         *
 * Free Software Foundation, Inc.,                                       *
 * 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.             *
 *                                                                       *
 * http://www.arachnoid.com/orbital_dynamics/resources/physics_engine.js *
 *************************************************************************/

'use strict';

import Cart3 from './Cart3';
import OrbitBody from './OrbitBody';
import OrbitBodyCollection from './OrbitBodyCollection';
import {G, RADIANS_IN_DEGREE} from './constants';

export default class Engine {
    constructor (
        canvas,
        orbitBodies = new OrbitBodyCollection(),
        {
            xAngle = 0,
            yAngle = 180,
            oldXAngle = xAngle,
            oldYAngle = yAngle,
            zoom = 1,
            zoomDelta = 0.1,
            minZoom = 0,
            maxZoom = 12,
            drawingScale = 1e-12,
            planetScale = 7e-8,
            pFactor = 1000,
            timeStep = 36000,
            running = true,
            legend = true,
            labels = true
        } = {}
    ) {
        if (typeof canvas === 'string') {
            canvas = document.querySelector(canvas);
        }
        if (!document.contains(canvas)) {
            throw new TypeError('Invalid canvas');
        }
        this.canvas = canvas;
        this.canvas.setAttribute('width', parseInt(getComputedStyle(document.documentElement).width, 10) - 17);
        this.canvas.setAttribute('height', parseInt(getComputedStyle(document.documentElement).height, 10) - 17);
        this.ctx = canvas.getContext('2d');
        this.ctx.globalCompositeOperation = 'source-over';
        this.xs = this.ctx.canvas.width;
        this.ys = this.ctx.canvas.height;
        this.xctr = Math.floor(this.xs / 2);
        this.yctr = Math.floor(this.ys / 2);
        this.frameCount = 0;

        Object.assign(this, {
            xAngle, yAngle, oldXAngle, oldYAngle,
            zoom, zoomDelta, minZoom, maxZoom,
            drawingScale, planetScale, pFactor,
            timeStep, running, legend, labels
        });

        this.orbitBodies = orbitBodies;
        this.sun = this.orbitBodies.getMostMassive();
        this.initx = 0;
        this.inity = 0;
        this.updateTrigValues(this.xAngle, this.yAngle);

        this.setupEvents();
    }

    start () {
        window.requestAnimationFrame(() => { this.perform(true) });
    }

    perform (oneFrame) {
        if (this.running) {
            this.render(oneFrame);
            this.frameCount++;
            window.requestAnimationFrame(() => { this.perform(false) });
        }
    }

    render (oneFrame) {
        this.clear();
        this.drawSubset(
            oneFrame,
            this.timeStep,
            this.xctr,
            this.yctr,
            this.orbitBodies,
            this.sun
        );
        this.drawLabels();
    }

    clear () {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.xs, this.ys);
    }

    drawLabels () {
        if (this.legend) {
            this.writeText('X    ' + this.formatNum(this.xAngle, 2, 8) + '°', 8, this.ys - 40);
            this.writeText('Y    ' + this.formatNum(this.yAngle, 2, 8) + '°', 8, this.ys - 24);
            this.writeText('Zoom ' + this.formatNum(this.zoom, 2, 8), 8, this.ys - 8);
        }
    }

    formatNum (x, dp, sz) {
        var s = '              ' + x.toFixed(dp);
        return s.substr(s.length - sz);
    }

    drawSubset (oneFrame, timeStep, cx, cy, bodies, center) {
        if (!oneFrame) {
            this.updateObjects(bodies, timeStep, center);
        }

        let toDraw = [];

        bodies.forEach((body) => {
            let pp = this.scaleRotateOrbitingBody(body, cx),
                radius = body.radius * this.planetScale * this.zoom;
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
        toDraw.sort((a, b) => {
            return b.z - a.z;
        });

        toDraw.forEach((body) => {
            this.ctx.fillStyle = body.color;
            this.drawOval.apply(this, body.bodyArgs);
            if (this.labels && body.name !== 'Sun') {
                this.writeText.apply(this, body.textArgs);
            }
        });
    }

    scaleRotateOrbitingBody (body, cx) {
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

    updateObjects (bodies, dt, center) {
        // compute gravitation only wrt the sun, not wrt all other bodies
        bodies.forEach((body) => {
            this.updateOrbit(body, center, dt);
        })
    }

    updateOrbit (body, focus, dt) {
        if (body instanceof OrbitBody && focus instanceof OrbitBody && body !== focus) {
            // this trig-free method does this:
            // 1. vel += dt * radius * -G * mass * radius.abs()^-3
            // 2. pos += dt * vel
            // including an optional dark energy constant (lambda)

            // compute radius of separation
            let radius = body.pos.sub(focus.pos);
            // update velocity with gravitational acceleration
            body.vel.addTo(radius.mult(dt * (0 - G * focus.mass * radius.invSumCube())));
            // update position with velocity
            body.pos.addTo(body.vel.mult(dt));
        }
    }

    drawOval (x, y, z, pf, cx, cy, ovalSize) {
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

    writeText (text, x, y, pf = 1) {
        //pf < 0 means position is behind viewer
        if (pf > 0) {
            try {
                this.ctx.fillStyle = '#FFF';
                this.ctx.fillText(text, x, y);
            } catch (e) {
                console.log(e);
            }
        }
    }

    setupEvents () {
        // mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            // preserve mouse initial position
            this.initx = this.ntrp(e.clientX, 0, this.xs, -90, 90);
            this.inity = this.ntrp(e.clientY, 0, this.ys, 90, -90);
            this.mouseDown = true;
        }, false);

        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            // preserve mouse initial position
            if (this.mouseDown) {
                // present angle equals old angle plus mouse
                // delta position since last mouse press
                this.xAngle = this.ntrp(e.clientX, 0, this.xs, -90, 90) + this.oldXAngle - this.initx;
                this.yAngle = this.ntrp(e.clientY, 0, this.ys, 90, -90) + this.oldYAngle - this.inity;
                this.mouseMotion();
            }
        }, false);

        this.canvas.addEventListener('click', (e) => {
            e.preventDefault();
            this.mouseDown = false;
            this.oldXAngle = this.xAngle;
            this.oldYAngle = this.yAngle;
        }, false);

        // zoom with mouse wheel
        this.canvas.addEventListener('mousewheel', (e) => {
            this.mouseWheel(e);
            return false;
        }, false);
        this.canvas.addEventListener('DOMMouseScroll', (e) => {
            this.mouseWheel(e);
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

    mouseMotion () {
        this.updateTrigValues(this.xAngle, this.yAngle);
    }

    mouseWheel (e) {
        if (!e) {
            e = window.event;
        }
        e.preventDefault();
        // note sign reversal on e.detail
        var delta = (e.wheelDelta) ? e.wheelDelta : -e.detail;
        var m = 1 + ((delta > 0) ? this.zoomDelta : this.zoomDelta * -1);

        if ((m > 1  && this.zoom < this.maxZoom) || (m < 1  && this.zoom > this.minZoom)) {
            this.zoom *= m;
        }
    }

    updateTrigValues (xa, ya) {
        xa *= RADIANS_IN_DEGREE;
        ya *= RADIANS_IN_DEGREE;
        this.sinx = Math.sin(xa);
        this.cosx = Math.cos(xa);
        this.siny = Math.sin(ya);
        this.cosy = Math.cos(ya);
    }

    ntrp (x, xa, xb, ya, yb) {
        return (x - xa) * (yb - ya) / (xb - xa) + ya;
    }

    getPlanet (name) {
        return this.orbitBodies.getByName(name);
    }
}