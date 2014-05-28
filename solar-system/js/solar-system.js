// shim layer with setTimeout fallback - http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
    };
})();

var Utils = {
	extendObj: function() {
		if (!arguments.length)
			return {};

		var args = Array.prototype.slice.call(arguments),
			primary = args.shift();
			
		for (var i in args) {
			for (var key in args[i]) {
				if (args[i].hasOwnProperty(key))
					primary[key] = args[i][key];
			}
		}
		
		return primary;
	},
	/* semiMajor = semi-major axis
	 * eccentricity = 0 for circle, 0 < eccentricity < 1 for ellipse, eccentricity > 1 for hiperboloid
	 * orbitalPeriod 
	 */
	getEllipseCoords: function(semiMajor, eccentricity, orbitalPeriod, offsetX, offsetY) {
		var x0 = 0 + offsetX,
			y0 = 0 + offsetY;
		x0 += semiMajor * eccentricity;
		var r = semiMajor * (1 - eccentricity * eccentricity) / (1 + eccentricity),
			x = x0 + r,
			y = y0,
			coords = [];
		coords.push({x: x, y: y});
		
		var speed = (365.256 / orbitalPeriod) / 100,
		    factor = 1;
		if (speed > 1) {
			factor = Math.floor(speed);
			speed  = speed - factor;
		}

		var i = 0,
		    twoPi = factor * 2 * Math.PI; //Always needs to be multiple of 2 so path is full circle

		while (i < twoPi) {
			r = semiMajor * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(i));
			x = x0 + r * Math.cos(i);
			y = y0 + r * Math.sin(i);
			coords.push({x: x, y: y});
			i += speed;
		}
		return coords;
	}
}

function SolarSystem(canvas, backgroundImgSrc) {
	var canvasWidth  = canvas.getAttribute('width'),
		canvasHeight = canvas.getAttribute('height'),
		ctx = canvas.getContext('2d'),
		center  = {
			x: canvasWidth / 2,
			y: canvasHeight / 2
		},
		astroObjs = [],
		background = new Image();
	background.src = backgroundImgSrc;
	
	this.addPlanet = function(planet, centerObj) {
		centerObj = centerObj || {'position': this.getCenter()};
		
		if (typeof centerObj === 'string') {
			centerObj = this.getPlanetByName(centerObj);
			if (centerObj === false) {
				centerObj = {'position': this.getCenter()};
			}
		}
		
		var astroObj;
		if (planet.orbit) {
			astroObj = new SolarSystem.Satellite(planet, centerObj);
		} else {
			planet.position = centerObj.position;
			astroObj = new SolarSystem.AstronomicalObject(planet, centerObj);
		}

		astroObjs.push(astroObj);
		return this;
	}
	
	this.getPlanetByName = function(name) {
		var matches = astroObjs.filter(function(astro) {
			if (astro.name === name) {
				return true;
			}
			return false;
		});
		if (matches.length) {
			return matches[0];
		}
		return false;
	}
	
	this.getCenter = function() {
		return center;
	}
	
	this.draw = function() {
		ctx.drawImage(background, 0, 0);
		var showOrbitPaths = document.getElementById('paths').checked;
		
		astroObjs.forEach(function(obj, index, array) {
			obj.move();
			if (obj.orbitalCenterObject && showOrbitPaths) {
				ctx.beginPath();
				var orbits = obj.orbitalCenterObject,
					x = obj.orbitCoords[0].x + orbits.position.x,
					y = obj.orbitCoords[0].y + orbits.position.y;
				
				ctx.moveTo(x, y);
				//arcTo might be more efficient, use fewer coords and semiAxis as radius
				var lastCoords = {x: x, y: y},
					step = Math.ceil(obj.orbitCoords.length / 100);

				obj.orbitCoords.forEach(function(coord, index, arr) {
					if (index % step != 0)
						return;
					x = coord.x + orbits.position.x;
					y = coord.y + orbits.position.y;
					if (x > 0 && x <= canvasWidth && y > 0 && y <= canvasHeight)
						ctx.arcTo(lastCoords.x, lastCoords.y, x, y, obj.semiMajorAxis);
					lastCoords = {x: x, y: y};
				});
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#FFF';
				ctx.closePath();
				ctx.stroke();
			}
			obj.draw(ctx);
		});
	}
}

SolarSystem.AstronomicalObject = function(config){
	var defaults = {
		name: '',
		equatorialRadius: 503.916,
		position: {
			x: 0,
			y: 0
		},
		imgSrc: ''
	};
	config = Utils.extendObj({}, defaults, config);

	this.name             = config.name;
	this.equatorialRadius = config.equatorialRadius / 503.916;
	this.position         = config.position;

	var imgObj = new Image();
	imgObj.src = config.imgSrc;
	this.image = imgObj;
};

SolarSystem.AstronomicalObject.prototype = {
	draw: function(ctx) {
		//Minus equatorialRadius, so center of images is on center point.
		var x = this.position.x - (this.image.width / 2),
			y = this.position.y - (this.image.height / 2);
		ctx.drawImage(this.image, x, y);
	},
	move: function() {}
}

SolarSystem.Satellite = function(config, orbitalCenterObject){
	var defaults = {
		orbit: {
			semiMajorAxis: 800000,
			perihelion: 800000,
			eccentricity: 0, //perfect circle
			orbitalPeriod: 365.256
		}
	};
	config = Utils.extendObj({}, defaults, config);

	this.semiMajorAxis       = config.orbit.semiMajorAxis / 800000;
	this.perihelion          = config.orbit.perihelion / 800000;

	var semiMajor			 = this.semiMajorAxis + orbitalCenterObject.equatorialRadius,
		offsetX			     = this.semiMajorAxis - this.perihelion;

	this.eccentricity        = config.orbit.eccentricity;
	this.orbitalPeriod       = config.orbit.orbitalPeriod;
	this.orbitalCenterObject = orbitalCenterObject;
	this.orbitCoords         = Utils.getEllipseCoords(semiMajor, this.eccentricity, this.orbitalPeriod, offsetX, 0);
	this.orbitDegree         = Math.floor(this.orbitCoords.length / 2);

	config.position = {
		x: orbitalCenterObject.position.x + this.orbitCoords[this.orbitDegree].x,
		y: orbitalCenterObject.position.y + this.orbitCoords[this.orbitDegree].y
	}
	//Call super class
	SolarSystem.AstronomicalObject.call(this, config);
}

SolarSystem.Satellite.prototype = Object.create(SolarSystem.AstronomicalObject.prototype, {
	move : {
		value: function() {
			this.orbitDegree = (this.orbitDegree + 1 < this.orbitCoords.length) ? this.orbitDegree + 1 : 0;

			var position = {
				x: this.orbitCoords[this.orbitDegree].x,
				y: this.orbitCoords[this.orbitDegree].y
			}

			this.position.x = this.orbitalCenterObject.position.x + position.x;
			this.position.y = this.orbitalCenterObject.position.y + position.y;
		}
	}
});
SolarSystem.Satellite.prototype.constructor = SolarSystem.Satellite;