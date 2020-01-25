var w = window.innerWidth,
    h = window.innerHeight;


var good_objects,
    bad_objects,
    slashes,
    line,
    scoreLabel,
    comboLbl,
    score = 0,
    maxScore=0,
    comboTimeout=0,
    slashLength=1,
    scoreLevel = 1,
    maxComboTimeout=65,
    comboMultiplier =1,
    scorePoints = 1,
    punishment = 1,
    isGameOver=false,
    points = [];	
var sword_slash, 
    glass_break,
    paper_cuts=[],
    critical_hit



var fireRate = 1000;
var nextFire = 0;

Phaser.Filter.Glow = function (game) {
  'use strict';
  Phaser.Filter.call(this, game);
  this.uniforms.alpha = { type: '1f', value: 1.0 };
  //the shader, remove cosine/sine to make it a static glow
  this.fragmentSrc = [
    'precision lowp float;',
    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',
    'uniform sampler2D uSampler;',
    'uniform float alpha;',
    'uniform float time;',
    'void main() {',
    'vec4 sum = vec4(0);',
    'vec2 texcoord = vTextureCoord;',
    'for(int xx = -4; xx <= 4; xx++) {',
    'for(int yy = -4; yy <= 4; yy++) {',
    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
    'float factor = 0.0;',
    'if (dist == 0.0) {',
    'factor = 2.0;',
    '} else {',
    'factor = 2.0/abs(float(dist));',
    '}',
    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * (1.0+(abs(sin(time)))+0.06);',
    '}',
    '}',
    'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord)*alpha;',
    '}'
  ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;

Object.defineProperty(Phaser.Filter.Glow.prototype, 'alpha', {

  get: function() {
    return this.uniforms.alpha.value;
  },

  set: function(value) {
    this.uniforms.alpha.value = value;
  }

});


var game = new Phaser.Game(w, h, Phaser.AUTO, 'game',
                           { preload: preload, create: create, update: update, render: render });
var glowFilter=new Phaser.Filter.Glow(game);


function preload() {


  var sword_slash_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/sword_sfx.mp3"
  var glass_break_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/glass_sfx.mp3"
  var critical_hit_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/sword_epic_002.mp3"

  var paper_cut_path_001 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_001_sfx.mp3"
  var paper_cut_path_002 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_002_sfx.mp3"
  var paper_cut_path_003 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_003_sfx.mp3"
  var paper_cut_path_004 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_004_sfx.mp3"
  var paper_cut_path_005 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_005_sfx.mp3"
  //var paper_cut_path_006 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_006_sfx.mp3"
  //var paper_cut_path_007 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_007_sfx.mp3"

  game.load.audio("sword_slash",sword_slash_path)
  game.load.audio("glass_break",glass_break_path)
  game.load.audio("critical_hit",critical_hit_path)


  game.load.audio("paper_cut_001",paper_cut_path_001)
  game.load.audio("paper_cut_002",paper_cut_path_002)
  game.load.audio("paper_cut_003",paper_cut_path_003)
  game.load.audio("paper_cut_004",paper_cut_path_004)
  game.load.audio("paper_cut_005",paper_cut_path_005)
 //game.load.audio("paper_cut_006",paper_cut_path_006)
  //game.load.audio("paper_cut_007",paper_cut_path_007)

  sword_slash = game.sound.add("sword_slash")
  glass_break = game.sound.add("glass_break")
  critical_hit = game.sound.add("critical_hit")

  paper_cuts.push(game.sound.add("paper_cut_001"))
  paper_cuts.push(game.sound.add("paper_cut_002"))
  paper_cuts.push(game.sound.add("paper_cut_003"))
  paper_cuts.push(game.sound.add("paper_cut_004"))
  paper_cuts.push(game.sound.add("paper_cut_005"))
 // paper_cuts.push(game.sound.add("paper_cut_006"))
  //paper_cuts.push(game.sound.add("paper_cut_007"))

  //game.sound.context.resume();
  //sdfsf
  var bmd = game.add.bitmapData(100,100);

  var grd = bmd.ctx.createLinearGradient(0, 0, 100, 100); 

  grd.addColorStop(0, '#00FFFF');
  grd.addColorStop(1, '#00CCCC');

  bmd.ctx.fillStyle = grd; //'#00ffff88';
  bmd.ctx.strokeStyle = '#00ffff';
  bmd.ctx.fillRect(0, 0,100,100)
  bmd.ctx.strokeRect(0, 0,100,100);
  //bmd.ctx.fill();
  game.cache.addBitmapData('good', bmd);

  var bmd = game.add.bitmapData(50,50);
  var grd = bmd.ctx.createLinearGradient(0, 0, 50, 50);  
  grd.addColorStop(0, '#FF00FF');
  grd.addColorStop(1, '#AA00AA');
  bmd.ctx.fillStyle = grd; //'#ff00ff';
  bmd.ctx.strokeStyle = '#ff00ff';
  bmd.ctx.fillRect(0, 0,50,50)
  game.cache.addBitmapData('bad', bmd);
  //game.stage
}

function paper_cut(){

  for (let i=0; i< paper_cuts.length-1;i++){
    if(paper_cuts[i].isPlaying){
      paper_cuts[i].stop()
    }
  }
  if(sword_slash.isPlaying){
    sword_slash.stop()
  }

  paper_cuts[Math.ceil(Math.random()*(paper_cuts.length-1))].play()


}

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 300;

  good_objects = createGroup(10, game.cache.getBitmapData('good'));
  bad_objects = createGroup(20, game.cache.getBitmapData('bad'));
  //bad_objects.filters=[glowFilter];
  //good_objects.filters=[glowFilter];
  slashes = game.add.graphics(0, 0);

  slashes.filters=[glowFilter];
  //slashes.fill = 'red';
  scoreLabel = game.add.text(10,10,'Slash the paper!!');
  scoreLabel.fill = 'cyan';
  comboLbl = game.add.text((w/2)-40,10, '');
  comboLbl.fill='white'


  //scoreLabel.filters=[glowFilter]

  //pointsLabel = game.add.text(-10,-10,'+1');
  //pointsLabel.blendMode = Phaser.blendModes.ADD
  //pointsLabel.fill = 'yellow';
  //pointsLabel.fontSize = 32
  //pointsLabel.setScale(2.0)
  //pointsLabel.filters=[glowFilter]



  emitter = game.add.emitter(0, 0, 300);
  emitter.makeParticles(game.cache.getBitmapData('good'));
  //emitter.blendMode = Phaser.blendModes.ADD
  emitter.setScale(1, 0.25, 1, 0.25, 100)
  emitter.setAlpha(0.65)
  emitter.gravity = 300;
  emitter.setYSpeed(-400,200);

  emitter2 = game.add.emitter(0, 0, 300);
  emitter2.makeParticles(game.cache.getBitmapData('bad'));
  //emitter2.blendMode = Phaser.blendModes.ADD
  emitter2.setScale(1, 0.25, 1, 0.25, 100)
  emitter2.gravity = 300;
  emitter2.setYSpeed(-400,200);

  throwObject();
}

function createGroup (numItems, sprite) {
  var group = game.add.group();
  group.enableBody = true;
  group.physicsBodyType = Phaser.Physics.ARCADE;
  group.createMultiple(numItems, sprite);
  group.setAll('checkWorldBounds', true);
  group.setAll('outOfBoundsKill', true);
  return group;
}

function throwObject() {
  let funModifier = ((5000-(score/10))/5000) < 0?0:((5000-(score/10))/5000)
  if (!isGameOver && game.time.now > nextFire && good_objects.countDead()>0 && bad_objects.countDead()>0) {
    nextFire = game.time.now + parseInt(1000*(1-funModifier)) +(fireRate*funModifier);
    throwGoodObject();
    if (Math.random()>0.5) {
      throwBadObject();
      if(Math.random()<= 0.1+(comboMultiplier/10)){
        throwBadObject();
      }
      if (Math.random()> (0.5+(0.5*funModifier))) {
        throwBadObject();
      }
    }
  }
}

function throwGoodObject() {
  var obj = good_objects.getFirstDead();
  if(obj){
    obj.reset(game.world.centerX + Math.random()*150-Math.random()*150, 600);
    obj.anchor.setTo(0.5, 0.5);
    //obj.body.angularAcceleration = 100;
    game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
  }
}
function throwBadObject() {
  var obj = bad_objects.getFirstDead();
  if(obj){
    obj.reset(game.world.centerX + Math.random()*200-Math.random()*200, 400 + parseInt(Math.random()*200));
    obj.anchor.setTo(0.5, 0.5);
    //obj.body.angularAcceleration = 100;
    game.physics.arcade.moveToXY(obj, game.world.centerX,     game.world.centerY, 530);
  }
}

function render() {
  comboTimeout = (comboTimeout>0)?comboTimeout-1:0
  if(comboTimeout <= 0){
    comboLbl.text =''
    comboMultiplier = 1
  }else{
    comboLbl.fontSize = 15 + 25*(comboTimeout/maxComboTimeout)
  }
  if(!isNaN(score) && score>0){
    scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore // + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  }
  //scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore + ' Combo : ' + comboTimeout +"/"+game.time.now;
}

function update() {

  if(game.sound.context.state === 'suspended') {
    game.sound.context.resume();
  }

  //comboTimeout = comboTimeout-1
  //comboTimeout = (comboTimeout>0)?comboTimeout-1:0

  throwObject();
  points.push({ 
    x: game.input.x,
    y: game.input.y
  });
  points = points.splice(points.length-20, points.length);
  //points
  if (points.length<1 || points[0].x==0) {
    return;
  }

  slashes.clear();
  slashes.beginFill(0x880088);
  slashes.lineStroke = 5;
  slashes.alpha = .3;
  slashes.moveTo(points[0].x, points[0].y);
  for (var i=1; i<points.length; i++) {
    slashes.lineTo(points[i].x, points[i].y);
  } 
  slashes.endFill();

  let deltaX = Math.abs(1+points[0].x - points[points.length-1].x)

  let deltaY = Math.abs(1+points[0].y - points[points.length-1].y)

  slashLength = (Math.ceil(Math.sqrt(deltaX^2+deltaY^2)))

  ///
  if(slashLength>7){
    if(!sword_slash.isPlaying){
      sword_slash.play()  
    }else{
      sword_slash.stop()
      sword_slash.play()
    }
  }

  for(var i = 1; i< points.length; i++) {
    line = new Phaser.Line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
    //line.filters=[glowFilter];
    //line.fill = "red";
    game.debug.geom(line);

    good_objects.forEachExists(checkIntersects);
    bad_objects.forEachExists(checkIntersects);
  }
  glowFilter.update();
}

var contactPoint = new Phaser.Point(0,0);

function checkIntersects(fruit, callback) {

  if(!game.input.x || !game.input.y){
    return
  }
  var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
  l2.angle = 90; 

  if(Phaser.Line.intersects(line, l1, true) ||
     Phaser.Line.intersects(line, l2, true)) {

    contactPoint.x = game.input.x;
    contactPoint.y = game.input.y;
    var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
    if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
      // sword_slash.play()
      return;
    } 
    killFruit(fruit);
    /*
		if (fruit.parent == good_objects) {
			killFruit(fruit);
		} else {
			//resetScore();	
		}*/
  }

}

function resetScore() {
  isGameOver = true
  var highscore = Math.max(score, localStorage.getItem("highscore"));
  localStorage.setItem("highscore", highscore);

  let pointsLbl = game.add.text(10,50,'GAME OVER!!!\nYour Max Score was: '+maxScore+'\nHigh Score: '+highscore);
  pointsLbl.blendMode = Phaser.blendModes.ADD
  pointsLbl.fill = 'cyan';
  pointsLbl.fontSize = 24
  pointsLbl.depth = 10

  setTimeout(()=>{pointsLbl.destroy(true);isGameOver=false},3000) 
  scoreLabel.text = 'Slash the Cyan boxes not the pink!';

  //reseting 
  good_objects.forEachExists(killFruit);
  bad_objects.forEachExists(killFruit);
  score = 0;
  maxScore = 0;
  comboTimeout = 0
  punishment = 1;

  // Retrieve
}



function killFruit(fruit) {
  scoreLevel = Math.floor( Math.sqrt((((score/10)*8)+1)/2)-0.5)+1
  scorePoints = scoreLevel
  //let scorePoints = parseInt(score/100)+1
  if (!isGameOver && fruit.parent == good_objects) {

    //paper_cut.play()
    //sword_slash.play()
    let magneticPull = (maxScore>score)?parseInt((maxScore-score)*0.01) + parseInt(0.05*(parseInt(scorePoints * (-1*(punishment+1))))):0
    scorePoints = ((scoreLevel+parseInt(slashLength)) * comboMultiplier)+magneticPull
    let combo = comboMultiplier>1?"X"+comboMultiplier:''
    comboLbl.text =''
    if(comboMultiplier>1){
      comboLbl.text = combo +' Combo';
      // comboLbl.blendMode = Phaser.blendModes.ADD
      comboLbl.fill = 'white';
      comboLbl.fontSize = 40
      comboLbl.fontWeight = 400
      comboLbl.depth = 100
    }

    //setTimeout(()=>comboLbl.text ='',2000) 
    let isCritical = (Math.random() <= 0.05)
    if (isCritical){
      if(sword_slash.isPlaying){
        sword_slash.stop()
      }
      critical_hit.play()
      scorePoints = parseInt(scorePoints * 10)
      let pointsLbl = game.add.text(fruit.x,fruit.y,"+"+scorePoints);
      pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = '#AA00FF';
      pointsLbl.fontSize = 32
      pointsLbl.depth = 50
      comboTimeout += maxComboTimeout*2
      comboMultiplier += 5
      punishment -= 1

      setTimeout(()=>pointsLbl.destroy(true),2000)  
    }else{
      paper_cut() 
      let pointsLbl = game.add.text(fruit.x,fruit.y,"+"+scorePoints);
      pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = 'yellow';
      pointsLbl.fontSize = 32
      pointsLbl.depth = 10
      comboTimeout = maxComboTimeout
      comboMultiplier++
      setTimeout(()=>pointsLbl.destroy(true),500)  
    }



    emitter.x = fruit.x;
    emitter.y = fruit.y;
    emitter.start(true, 2500, null, 4);
  }
  if (!isGameOver && fruit.parent == bad_objects) {
    punishment = (punishment<1)?0:punishment
    glass_break.play()
    scorePoints = parseInt(scorePoints * 20 * (-1*(punishment+1)))
    punishment++
    //comboTimeout -= 0
    comboMultiplier -= 5
    let pointsLbl = game.add.text(fruit.x,fruit.y,scorePoints);
    pointsLbl.blendMode = Phaser.blendModes.ADD
    pointsLbl.fill = 'red';
    pointsLbl.fontSize = 32
    pointsLbl.depth = 10

    setTimeout(()=>pointsLbl.destroy(true),1000) 
    emitter2.x = fruit.x;
    emitter2.y = fruit.y;
    emitter2.start(true, 3000, null, 4);
  } 
  fruit.kill();
  points = [];
  score += scorePoints;
  maxScore = Math.max(score,maxScore)
  if(!isNaN(score)){
    scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore // + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  }
  if (score<=0){
    resetScore()
  }


}
