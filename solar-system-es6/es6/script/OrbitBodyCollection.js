'use strict';

export default class OrbitBodyCollection extends Array {
    constructor(...bodies) {
        Array.prototype.push.apply(this, bodies);
    }

    getMostMassive () {
        this.sort((a, b) => {
            return b.mass - a.mass;
        });
        return this[0];
    }

    getByName (name) {
        var matching = this.filter(function (elem) {
            return elem.name === name;
        });
        return matching[0];
    }
}