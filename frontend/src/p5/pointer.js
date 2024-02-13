class Pointer {
    constructor(id, name, x, y, radius) {
        this.id = id;
        this.name = name;
        this.cord = {
            x: x,
            y: y,
        };
        this.struct = {
            radius: radius,
            circum: () => radius * 2
        };
        this.stats = {
            isAlive: true,
        }
    };

    checkCollision() {
        // collision index is started with -1, because -1 is the default value for no collision
        let index = -1;

        // check collision with CPU Objs
        for (let i = circleList.length - 1; i >= 0; i--) {
            let distance = dist(this.cord.x, this.cord.y, circleList[i].cord.x, circleList[i].cord.y);

            // If collision, index collision is updated
            if (distance < this.struct.radius + circleList[i].struct.radius) {
                index = i;
            }
        }

        // return index of collision, or -1 if no collision
        return index;
    }

    drawPointer(r, g, b) {
        fill(0);
        // draw pointer name
        textSize(16);
        text(this.name, this.cord.x, this.cord.y - this.struct.radius - 5);

        // draw pointer
        fill(color(r, g, b));
        circle(this.cord.x, this.cord.y, this.struct.circum());
    }

    movePointer(newX, newY) {
        this.cord.x = newX;
        this.cord.y = newY;
    }
}