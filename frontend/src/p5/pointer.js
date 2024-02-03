class Pointer {
    constructor(_id, _name, _x, _y, _radius) {
        this.id = _id;
        this.name = _name;
        this.cord = {
            x: _x,
            y: _y,
        };
        this.struct = {
            radius: _radius,
        };
        this.stats = {
            voteStart: false,
            isAlive: true,
        }
    };

    checkCollision() {
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
        fill(0);
        textSize(16);
        text(this.name, this.cord.x, this.cord.y - this.struct.radius - 5);
        fill(color(r, g, b));
        circle(this.cord.x, this.cord.y, this.struct.radius);
    }

    movePointer(_xMove, _yMove) {
        this.cord.x = _xMove;
        this.cord.y = _yMove;
    }
}