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