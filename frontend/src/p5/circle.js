class Circle {
    constructor(radius, mass, x, y, vX, vY) {
        this.id = circleList.length;
        this.struct = {
            radius: radius,
            circum: () => this.struct.radius * 2,
            mass: mass,
        };
        // If x, y, vX, vY are not defined, then create random values
        this.cord = {
            x: x ?? random(radius, windowWidth - radius),
            y: y ?? random(radius, windowHeight - radius),
            vX: vX ?? random(-MAX_CPU_V, MAX_CPU_V),
            vY: vY ?? random(-MAX_CPU_V, MAX_CPU_V),
        };
        this.color = {
            r: random(255),
            g: random(255),
            b: random(255)
        };

        this.onInitCord();
    };

    move() {
        // Move circles according to their velocity
        this.cord.x += this.cord.vX;
        this.cord.y += this.cord.vY;

        // Speed up circles over time
        this.cord.vX *= 1.0001;
        this.cord.vY *= 1.0001;
    }

    draw() {
        fill(color(this.color.r, this.color.g, this.color.b, 200));
        circle(this.cord.x, this.cord.y, this.struct.circum());
    }

    onInitCord() {
        // Try to init the circle cords in a position that doesn't collide with other circles.
        // Preventing the circles to be created inside each other.

        if (this.checkCollision(-1) != -1) {
            do {
                // Try new cords
                this.cord.x = random(this.struct.radius, windowWidth - this.struct.radius);
                this.cord.y = random(this.struct.radius, windowHeight - this.struct.radius);
            } while (this.checkCollision(-1) != -1);
        }
    }

    checkCollision(j) {
        // collision index is started with -1, because -1 is the default value for no collision
        let index = -1;

        for (let i = circleList.length - 1; i > j; i--) {
            let distance = dist(this.cord.x, this.cord.y, circleList[i].cord.x, circleList[i].cord.y);

            // If collision, index collision is updated
            if (distance < this.struct.radius + circleList[i].struct.radius) {
                index = i;
            }
        }

        // return index of collision, or -1 if no collision
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
        // check left and right window collisions
        if (
            this.cord.x + this.struct.radius > windowWidth ||
            this.cord.x - this.struct.radius < 0
        ) {
            // The following code is to prevent the circles to be stuck in the window borders,
            // and maybe can be improved to take less processing timing
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
            // The following code is to prevent the circles to be stuck in the window borders,
            // and maybe can be improved to take less processing timing
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
