var robber, robberImg, robberStop;
var bgImage,bg;
var coneImage, barrierImage, cone, barrier;
var policemen,policemenImg;
var policeRunningImg;
var coneGroup, barrierGroup, stopSignGroup;
var speedBoost, speedBoostImg;
var stopSign, stopSignImg;
var obs, obsGroup;
var points;
var gameState = "serve";
var bgMusic, speedBoostSound, oofSound, sirenSound;
var robberCar, robberCarImage, robberCarGroup

function preload(){
    bgImage = loadImage("road.jpeg");
    robberImg = loadAnimation("robber.png", "robber2.png","robber.png", "robber2.png", "robber.png", "robber2.png","robber.png", "robber2.png");
    policemenImg = loadImage("car.png")
    coneImage = loadImage("cone.png");
    barrierImage = loadImage("donotcross.png");
    stopSignImg = loadImage("stopSign.png")
    speedBoostImg = loadAnimation("speed1.png", "speed2.png", "speed3.png", "speed4.png", "speed1.png", "speed2.png", "speed3.png", "speed4.png");
    bgMusic = loadSound("missionImpossible.wav")
    speedBoostSound = loadSound("speedBoostSound.mp3")
    oofSound = loadSound("oof.mp3")
    sirenSound = loadSound("policeSiren.wav")
    robberStop = loadAnimation("robber.png", "robber.png");
    robberCarImage = loadAnimation("robberCar.png")


}

function setup(){
    bgMusic.play();
    bgMusic.setVolume(0.1);
    createCanvas(500, 700);
    bg = createSprite(250,300);
    bg.addImage(bgImage);
    bg.scale=1.9;
   
    
    robber = createSprite(250, 350);
    robber.addAnimation("run",robberImg);
    robber.addAnimation("stop", robberStop)
    robber.addAnimation("robberCar", robberCarImage)
    robber.scale = 3;
    robber.debug=false;
    robber.setCollider("circle",0,0,10);
    robber.debug=false;
    coneGroup = createGroup()
    barrierGroup = createGroup()
    speedBoostGroup = createGroup()
    stopSignGroup = createGroup()
    obsGroup = createGroup()
    robberCarGroup = createGroup()
    
    policemen= createSprite(robber.x, 600,30,30);
    policemen.addImage(policemenImg)
    policemen.debug=false
    policemen.scale = 1.5


    policemen.setCollider("circle", 0, 0, 150)
    
    points = 0

}

function draw(){
    if(frameCount % 800 == 0){
        bgMusic.play();
        bgMusic.setVolume(0.1);
    }
    console.log(frameCount)
    background("black");
    policemen.x = robber.x ;
    
    if(gameState=="serve"){
        intro();
        robber.changeAnimation("stop", robberStop)
    }
    
    else if(gameState=="play"){
        robber.changeAnimation("run")
        bg.velocityY = 6+(points);
    
        for(var i=0; i<obsGroup.length;i++){
            if(robber.isTouching(obsGroup[i])){
                policemen.y -= 15;
            
                
                if(robber.isTouching(obsGroup[i])){
                    oofSound.play();
                    obsGroup[i].y+=15;
                    obsGroup[i].x+=15;
                
                }
            
            }
        }
   
        for(var i=0; i<speedBoostGroup.length;i++){    
            if(robber.isTouching(speedBoostGroup[i])){
                speedBoostSound.play();
                policemen.y += 25;
                speedBoostGroup[i].destroy();
            }
        }
        if (bg.y > 500){
            bg.y=300;
        }

        if(policemen.y < 350){
            gameState = "gameOver";
            sirenSound.play();
        }
        
        if(points > 50){
            gameState = "end";
        }

        if(robber.x < 10){
            robber.x = 10;
        }

        if(robber.x > 450){
            robber.x = 450;
        }

        spawnObstacles();
        spawnSpeedBoost();
        spawnCar();
        moving();
    }
    else if(gameState == "end"){
        end()
        bg.velocityY = 0;
        obsGroup.velocityY = 0;
        speedBoostGroup.velocityY = 0;
        robber.changeAnimation("stop");
        policemen.destroy()
    }

    else if(gameState == "gameOver"){
        gameOver();

        bg.velocityY = 0;
        obsGroup.velocityY = 0;
        speedBoostGroup.velocityY = 0;
        bgMusic.stop();
        robber.changeAnimation("stop");
    }
    
    drawSprites();
    fill("white");
    textSize(20);
    text("points: " + points, 40, 20);
}
   
function spawnObstacles(){
    if(frameCount % 30 == 0){
        obs = createSprite(100, -100, 10, 10);

        points += 1;
        var r= Math.round(random(1,3));
        switch(r){
            case 1:obs.addImage(barrierImage);
            break;
            case 2: obs.addImage(coneImage);
            break;
            case 3: obs.addImage(stopSignImg);
            break;
            default: break;
        }
        
        // cone.debug=true;
        obs.setCollider("circle",0,0,17);
        obs.scale = 3;
        obs.velocityY = 6 + (points/2);
        obs.x = random(20, 470);
        obsGroup.add(obs);
    }
   
    
   
    
}

function spawnSpeedBoost(){
    if(frameCount % 150 == 0){
        speedBoost = createSprite(250, -100, 10, 10);
        speedBoost.addAnimation("speedBoostImg", speedBoostImg);
        speedBoost.debug = false;
        speedBoost.scale = 0.5;
        speedBoost.velocityY = 6 + (points/2);
        speedBoost.x = random(20, 470);
        speedBoostGroup.add(speedBoost);

        
    }
}

function spawnCar(){
    if(frameCount % 300 == 0){
        robberCar = createSprite(100, -100, 10, 10)
        robberCar.addAnimation("robberCar",robberCarImage)
        robberCar.scale = 0.5
        robberCar.velocityY = 6 + (points/2)
        robberCar.x = random(20, 470)
        robberCarGroup.add(robberCar)
    }
}





function moving(){
    if(keyDown(LEFT_ARROW)){
        robber.x -= 10;
    } 
    if(keyDown(RIGHT_ARROW)){
        robber.x += 10;
    }
}

function gameOver() {
    swal(
    {
      title: `You got caught!`,
      text: "Be better Lol",
      imageUrl: "https://contevo.com.au/wp-content/uploads/2016/08/busted.png",
      imageSize: "100x100",
      confirmButtonText: "Run Again",
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function end() {
    swal(
    {
      title: `You escaped!`,
      text: "You are either VERY good or VERY lucky.",
      imageUrl: "https://www.pngitem.com/pimgs/m/29-298847_money-bag-bank-rich-free-picture-cartoon-money.png",
      imageSize: "100x100",
      confirmButtonText: "Play again",
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function intro() {
    swal(
    {
      title: `Escape the cops!`,
      text: "Use the arrow keys to move. Get 50 points to win! Dodge the obstacles and use speed boosts to go faster!",
      imageUrl: "https://simg.nicepng.com/png/small/208-2084741_thief-robbery.png",
      imageSize: "100x100",
      confirmButtonText: "Start!",
    },
    function(isConfirm) {
      if (isConfirm) {
        gameState="play";
      }
    }
  );
}