import MovingDirection from "./MovingDirection.js";

export default class Enemy {
    constructor(x, y, tileSize, velocity, tileMap) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;

        this.loadImages();

        this.moveingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);

        this.directionTimerDefault = this.random(10, 50);
        this.directionTimer = this.directionTimerDefault;

        this.scaredAboutToExpireTimerDefault = 10;
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
    }

    draw(ctx, pause, pacman) {
        if (!pause) {
            this.move();
            this.changeDirection();
        }
        this.setImage(ctx, pacman);
    }

    collideWith(pacman) {
        const size = this.tileSize / 2;
        if (
            this.x < pacman.x + size &&
            this.x + size > pacman.x &&
            this.y < pacman.y + size &&
            this.y + size > pacman.y
        ) {
            return true;
        } else {
            return false;
        }
    }

    setImage(ctx, pacman) {
        if (pacman.powerDotActive) {
            this.setImageWhenPowerIsActive(pacman);
        } else {
            this.image = this.normalGhost;
        }
        ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);

    }

    setImageWhenPowerIsActive(pacman) {
        if (pacman.powerDotAboutToExpire) {
            this.scaredAboutToExpireTimer--;
            if (this.scaredAboutToExpireTimer == 0) {
                this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
                if (this.image == this.scaredGhost) {
                    this.image = this.scaredGhost2;
                } else {
                    this.image = this.scaredGhost;
                }
            }
        } else {
            this.image = this.scaredGhost;
        }
    }

    changeDirection() {
        this.directionTimer--;
        let newMoveDirection = null;
        if (this.directionTimer == 0) {
            this.directionTimer = this.directionTimerDefault;
            newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
        }
        if (newMoveDirection != null && this.moveingDirection != newMoveDirection) {
            if (
                Number.isInteger(this.x / this.tileSize) &&
                Number.isInteger(this.y / this.tileSize)) {
                if (!this.tileMap.didCollideWithEnviroment(
                        this.x,
                        this.y,
                        newMoveDirection
                    )) {
                    this.moveingDirection = newMoveDirection;
                }
            }
        }
    }

    move() {
        if (!this.tileMap.didCollideWithEnviroment(
                this.x,
                this.y,
                this.moveingDirection
            )) {
            switch (this.moveingDirection) {
                case MovingDirection.up:
                    this.y -= this.velocity;
                    break;
                case MovingDirection.down:
                    this.y += this.velocity;
                    break;
                case MovingDirection.left:
                    this.x -= this.velocity;
                    break;
                case MovingDirection.right:
                    this.x += this.velocity;
                    break;
            }
        }
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    loadImages() {
        this.normalGhost = new Image();
        this.normalGhost.src = '../images/ghost.png';

        this.scaredGhost = new Image();
        this.scaredGhost.src = '../images/scaredGhost.png';

        this.scaredGhost2 = new Image();
        this.scaredGhost2.src = '../images/scaredGhost2.png';

        this.image = this.normalGhost;
    }
}