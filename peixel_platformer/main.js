"use strict"

const TILE_SIZE = 70;

class Base {
    constructor(image, x, y, w, h) {
        this.image = new Image();
        this.image.src = image;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;

        this.image.onload = () => {
            this.image.width = "100px";
            this.image.height = "100px";
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class BaseCharacter extends Base {
    left() {
        this.x -= 5;
    }
    right() {
        this.x += 5;
    }
    up() {
        this.y -= 5;
    }
    down() {
        this.y += 5;
    }
}

class Character extends BaseCharacter {
    constructor(image, x, y, w, h) {
        super(image, x, y, w, h);
        this.velocityY = 0;
        this.gravity = 0.5;
        this.jumpForce = -13;
        this.onGround = false;
        this.isBlocking = false;
        this.isJumping = false;
        
        // List of non-collidable tiles
        this.nonCollidableTiles = [
            129, 88, 124, 127, 137, 116, 96, 118, 99, 144, 131, 111, 145, 117, 71, 51, 106
        ];
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Check for collisions with blocks
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tileId = map[y][x];
                
                // Skip collision check for non-collidable tiles
                if (this.nonCollidableTiles.includes(tileId)) {
                    continue;
                }
                
                if (tileId > 0) {
                    const blockX = x * TILE_SIZE;
                    const blockY = y * TILE_SIZE;
                    
                    // Check if character is touching the special tile
                    if (tileId === 71 || tileId === 51) {
                        // Check if character is touching the tile
                        if (this.x + this.width > blockX && 
                            this.x < blockX + TILE_SIZE &&
                            this.y + this.height > blockY &&
                            this.y < blockY + TILE_SIZE) {
                            // Make the player ascend
                            this.velocityY = -15; // Strong upward force
                            this.jumpForce = -13; // Reset jump force
                            this.isJumping = true;
                            this.onGround = false;
                        }
                    }
                    
                    // Check if character is colliding with block from above
                    if (this.x + this.width > blockX && 
                        this.x < blockX + TILE_SIZE &&
                        this.y + this.height >= blockY &&
                        this.y + this.height <= blockY + TILE_SIZE) {
                        this.onGround = true;
                        this.y = blockY - this.height;
                        this.velocityY = 0;
                        this.isJumping = false;
                    }

                    // Check if character is hitting block from below
                    if (this.x + this.width > blockX && 
                        this.x < blockX + TILE_SIZE &&
                        this.y <= blockY + TILE_SIZE &&
                        this.y > blockY) {
                        this.y = blockY + TILE_SIZE;
                        this.velocityY = 0;
                    }
                }
            }
        }

        // Handle jumping - only jump once per press
        if(keys["space"] && this.onGround && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }

        // Handle horizontal movement
        if(keys["left"])
            this.left();
        if(keys["right"])
            this.right();

        // Handle collisions with walls
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tileId = map[y][x];
                // Skip collision check for non-collidable tiles
                if (this.nonCollidableTiles.includes(tileId)) {
                    continue;
                }
                
                if (tileId > 0) {
                    const blockX = x * TILE_SIZE;
                    const blockY = y * TILE_SIZE;
                    
                    if (this.x + this.width > blockX && 
                        this.x < blockX + TILE_SIZE &&
                        this.y + this.height > blockY &&
                        this.y < blockY + TILE_SIZE) {
                        
                        if (keys["right"] && this.x + this.width > blockX) {
                            this.x = blockX - this.width;
                        }
                        if (keys["left"] && this.x < blockX + TILE_SIZE) {
                            this.x = blockX + TILE_SIZE;
                        }
                    }
                }
            }
        }

        // Check for blocking
        if(keys["space"] && !this.isBlocking) {
            this.isBlocking = true;
        } else if(!keys["space"] && this.isBlocking) {
            this.isBlocking = false;
        }

        // Check for collisions with blocks
        if (this.isBlocking) {
            this.checkBlockCollisions();
        }
    }

    checkBlockCollisions() {
        // Check if character is colliding with any blocks
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tileId = map[y][x];
                // Skip collision check for non-collidable tiles
                if (this.nonCollidableTiles.includes(tileId)) {
                    continue;
                }
                
                if (tileId > 0) {
                    const blockX = x * TILE_SIZE;
                    const blockY = y * TILE_SIZE;
                    
                    const distanceX = Math.abs(this.x - blockX);
                    const distanceY = Math.abs(this.y - blockY);
                    
                    if (distanceX < TILE_SIZE && distanceY < TILE_SIZE) {
                        // Draw a blocking effect
                    }
                }
            }
        }
    }
}

class Enemy extends BaseCharacter {
    update() {
        if(keys["down"])
            this.down();
        if(keys["up"])
            this.up();
        if(keys["left"])
            this.left();
        if(keys["right"])
            this.right();
    }
}

function drawMap() {
    for (let y = 0; y < tiles.length; y++) {
        tiles[y].draw()
    }
}

function loadMap() {
    // for (let i = 0; i < 180; i++) {
        // let tile = new Image();
        // tile.src = `images/Tiles/tile_0${i.toString().padStart(3, '0')}.png`;
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] != 0) {
                    let tile = new Base(`images/Tiles/tile_0${map[y][x].toString().padStart(3, '0')}.png`, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    tiles.push(tile);
                }
            }
        }
    // }
}

function game_loop() { 
    bg.draw();
    drawMap();

    plaeyer.draw();
    plaeyer.update();
    requestAnimationFrame(game_loop);

    check_coligin();
}

function loadImage(src, callback) {
    let img = new Image();
    img.onload = callback;
    img.src = src;
    return img;
}

function check_coligin_to_objects(a, b) {
    if (a.y + a.height >= b.y && a.y <= b.y + b.height &&
        a.x + a.width >= b.x && a.x <= b.x + b.width
    ) {
        return true;
    }
    else {
        return false;
    }
}

function check_coligin() {
    for (let y = 0; y < tiles.length; y++) {
        if (check_coligin_to_objects(plaeyer, tiles[y])){
            console.log("coligen", plaeyer.y, plaeyer.height, tiles[y].y, tiles[y].height, y);
        }
    }
}

function move_player() {
    if(keys["down"])
        plaeyer.y += 10;
    if(keys["up"])
        plaeyer.y -= 10;
    if(keys["left"])
        plaeyer.x -= 10;
    if(keys["right"])
        plaeyer.x += 10;
}



document.addEventListener("keydown", function(event){
    if(event.code == "KeyS" || event.code == "ArrowDown"){
        keys["down"] = true;
    }
    if(event.code == "KeyW" || event.code == "ArrowUp"){
        keys["up"] = true;
    }
    if(event.code == "KeyA" || event.code == "ArrowLeft"){
        keys["left"] = true;
    }
    if(event.code == "KeyD" || event.code == "ArrowRight"){
        keys["right"] = true;
    }
    if(event.code == "Space"){
        keys["space"] = true;
    }
})
document.addEventListener("keyup", function(event){
    if(event.code == "KeyS" || event.code == "ArrowDown"){
        keys["down"] = false;
    }
    if(event.code == "KeyW" || event.code == "ArrowUp"){
        keys["up"] = false;
    }
    if(event.code == "KeyA" || event.code == "ArrowLeft"){
        keys["left"] = false;
    }
    if(event.code == "KeyD" || event.code == "ArrowRight"){
        keys["right"] = false;
    }
    if(event.code == "Space"){
        keys["space"] = false;
    }
})

let keys = {}

let canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

let plaeyer = new Character("images/Tiles/Characters/tile_0000.png", 200, 500, TILE_SIZE, TILE_SIZE);
let bg = new Base("images/bg.png", 0, 0, canvas.width, canvas.height);

let background = {
    x: 0,
    y: 0,
    image: new Image()
}

let tiles = [];


loadMap();
console.log(tiles)
game_loop();