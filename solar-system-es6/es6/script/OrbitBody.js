'use strict';

import Cart3 from './Cart3';

export default class OrbitBody {
    constructor (
        name = '',
        radius = 0.0,
        pos = new Cart3(),
        vel = new Cart3(),
        mass = 0,
        color = ''
    ) {
        Object.assign(this, {name, radius, mass, pos, vel, color});
        this.moons = [];
    }

    addMoons (...moons) {
        Array.prototype.push.apply(this.moons, moons);
    }

    getMoons () {
        return this.moons;
    }
}
