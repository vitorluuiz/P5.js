class Pointer {
    constructor(_x, _y, _radius) {
        this.cord = {
            x: _x,
            y: _y,
        };
        this.struct = {
            radius: _radius,
        };
    };

    detectCollision() {
        let index = -1;
        for (let i = 0; i < circleList.length; i++) {
            let distance = dist(this.cord.x, this.cord.y, circleList[i].cord.x, circleList[i].cord.y);

            if (distance < this.struct.radius + circleList[i].struct.radius) {
                index = i;
            }
        }

        return index;
    }

    drawPointer(r, g, b) {
        fill(color(r, g, b));
        circle(this.cord.x, this.cord.y, this.struct.radius);
    }

    movePointer(_xMove, _yMove) {
        this.cord.x = _xMove;
        this.cord.y = _yMove;
    }
}