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
