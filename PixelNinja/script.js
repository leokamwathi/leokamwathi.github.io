var w = window.innerWidth,
		h = window.innerHeight;


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

var good_objects,
		bad_objects,
		slashes,
		line,
		scoreLabel,
		score = 0,
    maxScore=0,
    comboTimeout=0,
    comboMultiplier =1,
    punishment = 1,
    isGameOver=false,
		points = [];	

var fireRate = 1000;
var nextFire = 0;


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
	scoreLabel = game.add.text(10,10,'Slash the Cyan boxes not the pink!');
	scoreLabel.fill = 'cyan';
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
  let funModifier = ((5000-score)/5000) < 0?0:((5000-score)/5000)
	if (!isGameOver && game.time.now > nextFire && good_objects.countDead()>0 && bad_objects.countDead()>0) {
		nextFire = game.time.now + parseInt(500*(1-funModifier)) +(fireRate*funModifier);
		throwGoodObject();
		if (Math.random()>0.5) {
			throwBadObject();
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
    comboMultiplier = 1
  }
  if(score>0){
    scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  }
  //scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore + ' Combo : ' + comboTimeout +"/"+game.time.now;
}

function update() {
  
  //comboTimeout = comboTimeout-1
  //comboTimeout = (comboTimeout>0)?comboTimeout-1:0
  
	throwObject();
	points.push({
		x: game.input.x,
		y: game.input.y
	});
	points = points.splice(points.length-15, points.length);
  //points
	if (points.length<1 || points[0].x==0) {
		return;
	}
 
	slashes.clear();
	slashes.beginFill(0x880088);
  
	slashes.alpha = .3;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i=1; i<points.length; i++) {
		slashes.lineTo(points[i].x, points[i].y);
	} 
	slashes.endFill();

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
	var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
	var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
	l2.angle = 90;

	if(Phaser.Line.intersects(line, l1, true) ||
		 Phaser.Line.intersects(line, l2, true)) {

		contactPoint.x = game.input.x;
		contactPoint.y = game.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
		if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
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
  let scorePoints = Math.floor( Math.sqrt((((score/10)*8)+1)/2)-0.5)+1
  //let scorePoints = parseInt(score/100)+1
if (!isGameOver && fruit.parent == good_objects) {
  
  scorePoints = scorePoints * comboMultiplier
  let combo = comboMultiplier>1?"X"+comboMultiplier:''
  let pointsLbl = game.add.text(fruit.x,fruit.y,"+"+scorePoints+combo);
  pointsLbl.blendMode = Phaser.blendModes.ADD
	pointsLbl.fill = 'yellow';
  pointsLbl.fontSize = 32
  pointsLbl.depth = 10
  comboTimeout = 50
  comboMultiplier++
  
  setTimeout(()=>pointsLbl.destroy(true),500)  

	emitter.x = fruit.x;
	emitter.y = fruit.y;
	emitter.start(true, 2500, null, 4);
}
 if (!isGameOver && fruit.parent == bad_objects) {
   scorePoints = parseInt(scorePoints * (-1*(punishment+1)))
   punishment++
   comboTimeout = 0
   comboMultipler = 1
let pointsLbl = game.add.text(fruit.x,fruit.y,scorePoints);
     pointsLbl.blendMode = Phaser.blendModes.ADD
	pointsLbl.fill = 'red';
  pointsLbl.fontSize = 32
  pointsLbl.depth = 10
  
  setTimeout(()=>pointsLbl.destroy(true),500) 
	emitter2.x = fruit.x;
	emitter2.y = fruit.y;
	emitter2.start(true, 3000, null, 4);
} 
	fruit.kill();
	points = [];
	score += scorePoints ;
  maxScore = Math.max(score,maxScore)
  scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  if (score<=0){
    resetScore()
  }
	
  
}
