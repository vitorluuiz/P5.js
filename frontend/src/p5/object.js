class Circle {
    constructor(windowWidth, windowHeight, _radius, _mass, _x, _y, _vX, _vY) {
        this.id = circleList.length;
        this.struct = {
            radius: _radius ?? random(0, 50),
            circum: () => this.struct.radius * 2,
            mass: _mass ?? random(0, 10),
        };
        this.cord = {
            x: _x ?? random(this.struct.radius, windowWidth - this.struct.radius),
            y: _y ?? random(this.struct.radius, windowHeight - this.struct.radius),
            vX: _vX ?? random(-MAX_CPU_V, MAX_CPU_V),
            vY: _vY ?? random(-MAX_CPU_V, MAX_CPU_V),
        };
        this.color = {
            r: random(255),
            g: random(255),
            b: random(255)
        };

        this.initCord();
    };

    move() {
        this.cord.x += this.cord.vX;
        this.cord.y += this.cord.vY;
        this.cord.vX *= 1.0002;
        this.cord.vY *= 1.0002;
    }

    display() {
        fill(color(this.color.r, this.color.g, this.color.b, 200));
        circle(this.cord.x, this.cord.y, this.struct.circum());
    }

    initCord() {
        do {
            this.cord.x = random(this.struct.radius, windowWidth - this.struct.radius);
            this.cord.y = random(this.struct.radius, windowHeight - this.struct.radius);
        } while (this.checkCollision(-1) != -1);
    }

    checkCollision(j) {
        let index = -1;

        for (let i = circleList.length - 1; i > j; i--) {
            let distance = dist(this.cord.x, this.cord.y, circleList[i].cord.x, circleList[i].cord.y);
            if (distance < this.struct.radius + circleList[i].struct.radius) {
                index = i;
            }
        }

        return index;
    }

    handleCollision(otherIndex) {
        let lastVx = this.cord.vX;
        let lastVy = this.cord.vY;

        this.cord.vX = circleList[otherIndex].cord.vX;
        this.cord.vY = circleList[otherIndex].cord.vY;
        circleList[otherIndex].cord.vX = lastVx;
        circleList[otherIndex].cord.vY = lastVy;

        if (OBJBOUNCE_SOUND == "ON") {
            bounceSounds[0].play();
        }
    }

    checkWindowcollision(windowWidth, windowHeight) {
        if (
            this.cord.x + this.struct.radius > windowWidth ||
            this.cord.x - this.struct.radius < 0
        ) {
            if (this.cord.x + this.struct.radius > windowWidth) {
                this.cord.x = windowWidth - this.struct.radius;
            } else {
                this.cord.x = this.struct.radius;
            }
            this.cord.vX *= -1;

            if (OBJBOUNCE_SOUND == "ON") {
                bounceSounds[1].play();
            }
        }

        if (
            this.cord.y + this.struct.radius > windowHeight ||
            this.cord.y - this.struct.radius < 0
        ) {
            if (this.cord.y + this.struct.radius > windowHeight) {
                this.cord.y = windowHeight - this.struct.radius;
            } else {
                this.cord.y = this.struct.radius;
            }
            this.cord.vY *= -1;

            if (OBJBOUNCE_SOUND == "ON") {
                bounceSounds[1].play();
            }
        }
    };
}
