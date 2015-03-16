'use strict';
// class Cart3, a three-simensional Cartesian vector class

export default class Cart3 {
    constructor (x = 0, y = 0, z = 0) {
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

    sub (cart3 = new Cart3()) {
        return new Cart3(this.x - cart3.x, this.y - cart3.y, this.z - cart3.z);
    }

    mult (factor = 1) {
        return new Cart3(this.x * factor, this.y * factor, this.z * factor);
    }

    addTo (cart3 = new Cart3()) {
        this.x += cart3.x;
        this.y += cart3.y;
        this.z += cart3.z;
        return this;
    }

    invSumCube () {
        return Math.pow(this.x * this.x + this.y * this.y + this.z * this.z, -1.5);
    }

    abs () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    toString () {
        return this.x + ',' + this.y + ',' + this.z;
    }
}