let board;
let boardheight = 750;
let boardwidth = 1400;

let context;

let playerheight = 70;
let playerwidth = 90;
let playerX = boardwidth/2;
let playerY = boardheight - 130;
let player = {
    x: playerX,
    y: playerY,
    width: playerwidth,
    height: playerheight,

};


let starimg;
let star_width = 30;
let star_height = 40;

let minx = 10;
let maxx = 1350;
let miny = 10;
let maxy = 700;

let star = {
    width: star_width,
    height: star_height,

}

let playerimg;
let player_velocity_x = 4;
let player_velocity_y = -4;

let stars = [];
const starCount = 20;


let keys = {};


let min_meteor_x = 20;
let max_meteor_x = 1350;
let min_meteor_y = -200;
let max_meteor_y = -100;

let meteor_velocity = 3;
let meteor_image;

let meteorarray = [];

let laserimg;

let laser_velocity = 6;
let laserwidth = 10;
let laserheight = 50;
let laserarray = [];

let canShoot = true;


let score = 0;
let count = 0;



let gameover;





window.onload = function(){
    board = document.getElementById('board');
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext('2d');


    playerimg = new Image();
    playerimg.src = "assets/player.png";

    starimg = new Image();
    starimg.src = "assets/star.png";

    meteor_image = new Image();
    meteor_image.src = 'assets/meteor.png';


    laserimg = new Image();
    laserimg.src = 'assets/laser.png';



    for (let i = 0; i < starCount; i++) {
        let x = Math.floor(Math.random() * (maxx - minx + 1) + minx);
        let y = Math.floor(Math.random() * (maxy - miny + 1) + miny);
        stars.push({ x: x, y: y });
    }
    
    


    requestAnimationFrame(update);
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.code === 'Space' && canShoot) {
            laser_draw();
            canShoot = false;
        }
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        if (e.code === 'Space') {
            canShoot = true;
        }
    });

    setInterval(drawmeteor, 600);




}

function update(){

    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);

    if(gameover){
        context.fillStyle = 'white';
        context.font = '60px sans-serif';
        context.fillText('You lose', 600, boardheight/2);
        

        return;
    }

    if(keys[' ']){
        gameover = false;

    }
    


    if(keys['w']){
        player.y += player_velocity_y;
    }
    if(keys['s']){
        player.y -= player_velocity_y;
    }
    if(keys['a']){
        player.x -= player_velocity_x;
    }
    if(keys['d']){
        player.x += player_velocity_x;
    }
    player.x = Math.max(0, Math.min(boardwidth - player.width, player.x));
    player.y = Math.max(0, Math.min(boardheight - player.height, player.y));


    for (let i = 0; i < stars.length; i++) {
        let starPos = stars[i];
        context.drawImage(starimg, starPos.x, starPos.y, star.width, star.height);
    }

    context.drawImage(playerimg, player.x, player.y, player.width, player.height);

    for(let i=0;i<meteorarray.length;i++){
        let meteor = meteorarray[i];
        meteor.y +=meteor_velocity;

        context.drawImage(meteor_image, meteor.x, meteor.y, meteor.width, meteor.height);

        if(detectcollision(player, meteor)){
            gameover = true;

        }

    }
    for(let i=0;i<laserarray.length;i++){
        let laser = laserarray[i];
        laser.y -= laser_velocity;

        context.drawImage(laserimg, laser.x, laser.y, laser.width, laser.height);
        if(laser.y < 0){
            laserarray.splice(i, 1);
            i-=1;
            continue;


        }

        for (let j = 0; j < meteorarray.length; j++) {
            let meteor = meteorarray[j];
            if (detectcollision(laser, meteor)) {
                meteorarray.splice(j, 1);
                laserarray.splice(i, 1);
                i--; 
                score+=1;
                if(score%10==0){
                    meteor_velocity+=0.4;
                    laser_velocity+=0.2;

                }

            }
        }

    }


    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score, 8, 45);



}

function drawmeteor(){

    let posx = Math.floor(Math.random() * (max_meteor_x - min_meteor_x + 1) + min_meteor_x);
    let posy = Math.floor(Math.random() * (max_meteor_y - min_meteor_y+ 1) + min_meteor_y);
    let meteor = {
        x: posx,
        y: posy,
        width: 76,
        height: 90,

    }

    meteorarray.push(meteor);


}


function detectcollision(a, b){
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;


}

function laser_draw(){
    posx = player.x;
    posy = player.y;
    let laser = {
        x: posx + 45,
        y: posy - 35,
        width: laserwidth,
        height: laserheight,

    }
    laserarray.push(laser);
}

