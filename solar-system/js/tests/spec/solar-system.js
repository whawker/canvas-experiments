describe("Solar System", function() {
    var starConfig;
    var planetConfig;
    var star;
    var planet;

    beforeEach(function() {
        starConfig = {
            name: 'Sun',
            equatorialRadius: 25000,
            imgSrc: '/canvas-experiments/solar-system/assets/sun.gif'
        };
        star = new SolarSystem.AstronomicalObject(starConfig);

        planetConfig = {
            name: 'Earth',
            equatorialRadius: 6371,
            imgSrc: '/canvas-experiments/solar-system/assets/earth.gif',
            orbit: {
                semiMajorAxis: 149598261,
                perihelion: 147098290,
                eccentricity: 0.01671123,
                orbitalPeriod: 365.256
            }
        };
        planet = new SolarSystem.Satellite(planetConfig, star);
    });
    
    describe("Star", function() {
        it("Star is named Sun", function() {
            expect(star.name).toEqual('Sun');
        });

        it("Star's position to be {x: 0, y: 0}", function() {
            expect(star.position).toEqual({x: 0, y: 0});
        });

        it("Star's image is loaded", function() {
            expect(star.image.height).toBeGreaterThan(0);
            expect(star.image.width).toBeGreaterThan(0);
        });
    });
    
    describe("Planet", function() {
        it("Planet is named Earth", function() {
            expect(planet.name).toEqual('Earth');
        });

        it("Planet to be orbiting sun", function() {
            expect(planet.orbitalCenterObject).toEqual(star);
        });

        it("Planet's position not to be {x: 0, y: 0}", function() {
            expect(planet.position).toBeDefined();
            expect(planet.position).not.toEqual({x: 0, y: 0});

            expect(planet.position.x).toEqual(jasmine.any(Number));
            expect(planet.position.x).not.toEqual(NaN);
            expect(planet.position.y).toEqual(jasmine.any(Number));
            expect(planet.position.y).not.toEqual(NaN);
        });

        it("Planet's image is loaded", function() {
            expect(planet.image.height).toBeGreaterThan(0);
            expect(planet.image.width).toBeGreaterThan(0);
        });

        it("Planet moves", function() {
            var planetInitialPosition = JSON.parse(JSON.stringify(planet.position));
            planet.move();
            expect(planet.position).toBeDefined();

            expect(planet.position.x).toEqual(jasmine.any(Number));
            expect(planet.position.x).not.toEqual(NaN);
            expect(planet.position.x).not.toEqual(planetInitialPosition.x);
            expect(planet.position.y).toEqual(jasmine.any(Number));
            expect(planet.position.y).not.toEqual(NaN);
            expect(planet.position.y).not.toEqual(planetInitialPosition.y);
        });

        it("Planet loops back to the start", function() {
            var planetFirstPosition = planet.orbitCoords[0];
            planet.orbitDegree = planet.orbitCoords.length - 1;
            planet.position    = planet.orbitCoords[planet.orbitDegree];
            planet.move();

            expect(planet.position).toBeDefined();
            expect(planet.position).toEqual(planetFirstPosition);
        });

        it("Planet orbits moving center object", function() {
            var planetNextPosition = planet.orbitCoords[planet.orbitDegree + 1];
            
            planet.orbitalCenterObject.position.x += 100;
            planet.orbitalCenterObject.position.y += 100;
            
            planet.move();

            expect(planet.position).toBeDefined();
            expect(planet.position.x).toEqual(planetNextPosition.x + 100);
            expect(planet.position.y).toEqual(planetNextPosition.y + 100);
        });
    });
});
