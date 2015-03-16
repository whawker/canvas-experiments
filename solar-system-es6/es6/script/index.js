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
import Engine from './Engine';


var engine = new Engine('canvas', new OrbitBodyCollection(
    //new OrbitBody('Sun',     695000000, new Cart3(0, 0, 0),              new Cart3(0, 0, 0),     1.989E+030, '#fc5110'),
    new OrbitBody('Sun',     348000000, new Cart3(0, 0, 0),              new Cart3(0, 0, 0),     1.989E+030, '#fc5110'), //Using smaller sun for visuals (but using correct mass)
    new OrbitBody('Mercury', 2440000,   new Cart3(-57909050000, 0, 0),   new Cart3(0, 0, 47900), 3.33E+023,  'grey'),
    new OrbitBody('Venus',   6050000,   new Cart3(-108000000000, 0, 0),  new Cart3(0, 0, 35000), 4.869E+024, 'yellow'),
    new OrbitBody('Earth',   6378140,   new Cart3(-150000000000, 0, 0),  new Cart3(0, 0, 29800), 5.976E+024, 'blue'),
    new OrbitBody('Mars',    3397200,   new Cart3(-227940000000, 0, 0),  new Cart3(0, 0, 24100), 6.421E+023, 'red'),
    new OrbitBody('Jupiter', 71492000,  new Cart3(-778330000000, 0, 0),  new Cart3(0, 0, 13100), 1.9E+027,   '#daa520'),
    new OrbitBody('Saturn',  60268000,  new Cart3(-1429400000000, 0, 0), new Cart3(0, 0, 9640),  5.688E+026, '#f7d560'),
    new OrbitBody('Uranus',  25559000,  new Cart3(-2870990000000, 0, 0), new Cart3(0, 0, 6810),  8.686E+025, 'cyan'),
    new OrbitBody('Neptune', 24746000,  new Cart3(-4504300000000, 0, 0), new Cart3(0, 0, 5430),  1.024E+026, 'blue'),
    new OrbitBody('Pluto',   1137000,   new Cart3(-5913520000000, 0, 0), new Cart3(0, 0, 4740),  1.27E+022,  'grey')
));


//    new OrbitBody('Moon',   1740000,   new Cart3(-384400000, 0, 0), new Cart3(0, 0, 1000),  7.347E+22,  'grey')


window.addEventListener('load', engine.start.bind(engine), false);
