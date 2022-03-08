// phaser 2.11.2 version code

// GLOBAL VARIABLES
{
var w = window.innerWidth,
    h = window.innerHeight;

var intro_music
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
    maxComboTimeout=100,
    inputTimeout=0,
    comboMultiplier =1,
    scorePoints = 1,
    punishment = 1,
    isGameOver=false,
    paper_width=100,
    glass_width=50,
    font_size_mod=12,
    points = [];	
var sword_slash,
    sword_phase,
    glass_break,
    glass_throw_effect,
    paper_throw_effect,
    wind_effect,
    freeze_effect,
    lightning_effect,
    yoooo_effect,
    music=[],
    music_paths=[],
    paper_cuts=[],
    blades_cartridge = [],
    blades_path = [],
    current_blades=6,
    critical_hit,
    lastX=0,
    lastY=0,
    ui,
    play_button,
    currentGameLevel = 1

var critical_color = '#a40079',
    goodpoints_color='#a44200',
    badpoints_color='#9b1000',
    score_color='#007097',
    gameover_color='#7a0e17',
    phaser_color='#3f0055',
    specials_color='#005500',
    combo_color='#3f0055'
//#ffff99
var slash_color='#a800e3',
    critical_highlight_color = '#ffff99',
    goodpoints_highlight_color='#ffff99',
    badpoints_highlight_color='#ffff99',
    score_highlight_color='#ffff99',
    gameover_highlight_color='#ffff99',
    phaser_highlight_color='#ffff99',
    specials_highlight_color='#ffff99',
    combo_highlight_color='#ffff99'

var matrixtime_color = 'pink'

var game_font='Righteous'
var minCutLevels = 4
var phase_rate=0.0 //chance to miss cutting glass and instead teleport it to the void.
var specialsRate = 0.25;
var total_good_objects = 50
var total_bad_objects = 20
var isMatrixTime = false
var paper_scale = 0.5

var fireRate = 1000;
var nextFire = 0;
var background_dojo_paths = []
var background_dojo = []
var isSafe = false
var isLightningMode = false
var lightningObj
var lightningBolts = 0
var lightningBoltsMod = 0
var isPressed = false

var paper_normal_texture_paths = []
var paper_normal_texture_path = []
var paper_normal_json_path = ''
var cursor_path = 'https://leokamwathi.github.io/PixelNinja/assets/images/cursors/cursor_001.cur'
var paperAtlas = "paperAtlas_0"


}

// GLOBAL FUNCTIONS
{

Phaser.Filter.Glow = function (game,amount=10) {
  amount = amount>10?10:amount<0?0:amount
  let glowAmount = 0.0005 + (0.0020 * amount/10)
  //'use strict';
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
    'gl_FragColor = sum * '+glowAmount+' + texture2D(uSampler, texcoord)*alpha;',
    '}'
  ];
};
//0.025
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

var glowFilter
var glowFilterLevel

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
  //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    active: function() { game.time.events.add(Phaser.Timer.SECOND, ()=>{}, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Righteous','Luckiest Guy']
    }

};
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

function stopMusic(){
    music.forEach((song)=>{song.stop()})
}
function playMusic(){
  stopMusic()
  music[parseInt(Math.random()*music.length)].play()
}
function stopSoundEffects(){
    //game.sound.mute = true;
    for (let i=0; i< paper_cuts.length-1;i++){
      if(paper_cuts[i].isPlaying){
        paper_cuts[i].stop()
      }
    }
    if(sword_slash.isPlaying){
     // sword_slash.stop()
    }
    
}

function playSound(sound_effect){
  //stopSoundEffects()
  if(sound_effect && sound_effect.play ){ //&& !sound_effect.isPlaying
    sound_effect.play()
  }
}

function paper_cut(){
  playSound(paper_cuts[Math.ceil(Math.random()*(paper_cuts.length-1))])
}

function onReleased(){
  slashes.clear();
  isPressed = false
  if(points && points.length>0){
    points = [] ; //points.splice(points.length, points.length);
  }
}

function onPressed(){
  //console.log("Pressed")
  slashes.clear();
  isPressed = true
  if(points && points.length>0){
    points = [] ; //points.splice(points.length-1, points.length);
  }
}


function setupEmitters(){
  emitter = game.add.emitter(0, 0, 30);  
  let spritex = game.add.sprite(0,0,paperAtlas,"paper_aa")
  let spriteMask = game.add.sprite(0,0,"mask_aaa_texture")
  spritex.visible = false
  spriteMask.visible = false
  
  let bmdctx = game.make.bitmapData(280, 280);
  bmdctx.alphaMask(spritex, spriteMask);
   let newSize = paper_scale * 280*0.75
     let scaledbmp = game.add.bitmapData(newSize, newSize)
    scaledbmp.draw(bmdctx,0,0,newSize, newSize)
    game.cache.addBitmapData('scaled_paper_aaa', scaledbmp);
  emitter.makeParticles(game.cache.getBitmapData('scaled_paper_aaa')); 
  emitter.setAlpha(0.25)
  emitter.gravity = 300;
  emitter.setYSpeed(-400,200);
w
  let glassSprite = game.add.sprite(0,0,"glass_texture")
  //console.log(glassSprite)
  glassSprite.scale.setTo(paper_scale*1.35, paper_scale*1.35);
  //console.log(glassSprite)
  glassSprite.visible = false
  let glassSpriteBmd = game.make.bitmapData(glassSprite.width, glassSprite.height);
  glassSpriteBmd.draw(glassSprite,0,0,glassSprite.width, glassSprite.height)
  game.cache.addBitmapData('glass_texture_emitter', glassSpriteBmd);
  
  emitter2 = game.add.emitter(0, 0, 24);
  emitter2.makeParticles(game.cache.getBitmapData('glass_texture_emitter'));
  // emitter2.blendMode = Phaser.blendModes.ADD
  // emitter2.setScale(1, 0.25, 1, 0.25, 100)
  emitter2.gravity =500;
  emitter2.setYSpeed(-100,400);
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
  let comboModx = (0.1*(comboMultiplier/10))<0.10?(0.1*(comboMultiplier/10)):0.1
  if (!isGameOver && game.time.now > nextFire && good_objects.countDead()>0 && bad_objects.countDead()>0) {
    nextFire = game.time.now + parseInt((fireRate/2)*(1-funModifier)) +(fireRate*funModifier);
    if(good_objects.countLiving()<=0){
      setTimeout(()=>{throwGoodObject()},Math.random()*1000);
    }
    throwGoodObject();
     if (Math.random()<(0.25+comboModx)) {
      setTimeout(()=>{throwGoodObject()},Math.random()*3000);
    }
    
    if(Math.random()<= 0.05+comboModx){
      //setTimeout(()=>throwGoodObject(),parseInt(Math.random()*1000))
    }
    if (Math.random()>0.7) {
      setTimeout(()=>{throwBadObject()},Math.random()*1000);
      if (Math.random()> (0.5+(0.5*funModifier))) {
        //throwBadObject();
      }
      if(Math.random()<= 0.1+comboModx){
        //throwBadObject();
      }
    }
  }
}

function lightningEffect(targetObj){
  
  if(Math.random()<0.4 && lightningBolts>0 && lightningObj && targetObj && lightningObj != targetObj){
    /*
    var bolt = game.add.line(
            0,
            0,
            lightningObj.x,
            lightningObj.y,
            targetObj.x,
            targetObj.y,
            0xffffff
        ).setOrigin(0, 0)
        */
    /*
     var bolt = new Phaser.Line(lightningObj.x, lightningObj.y, targetObj.x, targetObj.y);
    //bolt.filters=[glowFilter];
    bolt.fill = 'white'
    bolt.lineStroke = 5;
    //bolt.lineStyle(10, 0xffffff)
    //graphics.drawShape(bolt);
    game.debug.geom(bolt);
    */
    
    var bolt=game.add.graphics(0,0);
    bolt.filters=[glowFilter];
    bolt.lineStyle(3, 0xffffff, 1);
    bolt.moveTo(lightningObj.x,lightningObj.y);
    bolt.lineTo(targetObj.x,targetObj.y);
    bolt.endFill();
    
    
    killFruit(targetObj)
    lightningBolts--
     game.add.tween(bolt).to({ alpha:0.25 }, 500, Phaser.Easing.Linear.None, true,500).onComplete.add(()=>{bolt.destroy(true)});
  }
  
}

function showLabel(position,text,timeout=500,fillColor=specials_color,outline=specials_highlight_color,fontSizeScale=2){
  let pointsLbl = game.add.text(position.x,position.y,text);
  //pointsLbl.blendMode = Phaser.blendModes.ADD
  pointsLbl.font=game_font
  pointsLbl.fill = fillColor;
  pointsLbl.fontSize = font_size_mod*fontSizeScale
  pointsLbl.depth = 10
  pointsLbl.fontWeight = 'bold';
  pointsLbl.stroke = outline
  pointsLbl.strokeThickness = 2;
  pointsLbl.anchor.set(0.5);
  pointsLbl.align = 'center';
  game.add.tween(pointsLbl).to({ fontSize:(font_size_mod),alpha:0.25 }, timeout, Phaser.Easing.Linear.None, true,timeout).onComplete.add(()=>{pointsLbl.destroy(true)});
}

function throwGoodObject() {
  if(isGameOver || game.paused == true){
    return
  }
  var obj = good_objects.getFirstDead();
  if(obj){
    obj.loadTexture(paperAtlas,'paper')
    obj.tint = 0xffffff;
    obj.reset(game.world.centerX + Math.random()*(w/4) -Math.random()*(w/4) , h); //(h*9)/10
    obj.anchor.setTo(0.5, 0.5);
    obj.alpha = 0.95
    obj.scale.setTo(paper_scale, paper_scale);
    //obj.body.gravity.y = game.physics.arcade.gravity.y/10
    obj.body.allowGravity = true
    //obj.tint = Phaser.Color.hexToColor('#fcebc5')
    obj.body.angularAcceleration = Math.random()*100;
    //game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, (h*9)/10);
    let wMod = (Math.random()*(w/4) )-(Math.random()*(w/4))
    game.physics.arcade.moveToXY(obj, (w/2)+wMod,0, ((h*3)/5));
    playSound(paper_throw_effect)
  }else{
    if(Math.random()>0.5){
      setTimeout(()=>throwGoodObject(),parseInt(Math.random()*10000))
    }
  }
}

function cutGoodObject(parentObj,isSpecialEffect=false) {
 
  let scaleX,scaleY
  if(parentObj.scale.x==parentObj.scale.y){
    scaleX = parentObj.scale.x /2
    scaleY = parentObj.scale.y
  }else{
    scaleX = parentObj.scale.x
    scaleY = parentObj.scale.y / 2
  }
  if(scaleX<(paper_scale/2) || scaleY<(paper_scale/2)){
    return;
  }
  if(parentObj.frameName == 'paper_aa' || parentObj.frameName == 'paper_ab' || parentObj.frameName == 'paper_ba' || parentObj.frameName == 'paper_bb'){
       return;
    }
  
  let parts = ['a','b']
  let specialEffect = parseInt(1+Math.random()*3)
  
  for(part of parts){
  let obj = good_objects.getFirstDead();
  if(obj){
    obj.tint = 0xffffff;
    //var paper_scale = paper_width/560
    //['normal_paper_a','normal_paper_b']
    
    //obj.scale.setTo(scaleX, scaleY);
    //objA.reset(parentObj.x+(Math.random()*(paper_width)-Math.random()*(paper_width)),parentObj.y+(Math.random()*(paper_width)-Math.random()*(paper_width)))
    if(part == 'a'){
      obj.reset(parentObj.x-(paper_width*0.025),parentObj.y-(paper_width*0.025))
    }else{
      obj.reset(parentObj.x+(paper_width*1.05)/2,parentObj.y+(paper_width*1.05)/2)
    }
    
    
    if(parentObj.frameName == 'paper'){
      obj.loadTexture(paperAtlas,'paper_'+part)
      obj.alpha = 0.75
    }else if(parentObj.frameName == 'paper_a' || parentObj.frameName == 'paper_b'){
      obj.loadTexture(paperAtlas,parentObj.frameName+part)
      obj.alpha = 0.60
    }else{
      return
    }
    //console.log(obj)
    obj.rotation =parentObj.rotation
    
    obj.scale.setTo(paper_scale, paper_scale);
    obj.body.allowGravity = true
    
    obj.body.angularAcceleration = parentObj.body.angularAcceleration
    //objB.body.angularAcceleration = -parentObj.body.angularAcceleration
    //obj.tintFill = true
    
    // && !isLightningMode
    if(isSpecialEffect){
      
      //function showLabel(position,text,timeout,fillColor=specials_color,outline=specials_highlight_color,fontSizeScale=2){
      switch(specialEffect){
          case(1)://freeze blade
            //showLabel(obj,'FREEZE')
            playSound(freeze_effect)
            obj.body.allowGravity = false
            obj.body.angularAcceleration = 1//Math.random()*100
            obj.tint = 0xbb5b6ee1;
            setTimeout(()=>{
              obj.body.allowGravity = true
              obj.tint = 0xffffff;
            },2000)
            break
          case(2): //wind blade
            playSound(wind_effect)
            //showLabel(obj,'WIND')
            obj.tint = 0xbb99e550;
            let wMod = (Math.random()*(w/4))-(Math.random()*(w/4))
            let windForce = parentObj.y< (h*3/5)?parentObj.y:parentObj.y*3/5
            game.physics.arcade.moveToXY(obj, parentObj.x+wMod,0, windForce);
            setTimeout(()=>{
              obj.tint = 0xffffff;
            },500)
            break
          case(3): //time blade blade
          
            if(!isLightningMode){
              playSound(lightning_effect)
              //showLabel(obj,'LIGHTNING')
              lightningObj = parentObj
              obj.tint = 0xbb5ee3ff;
              isLightningMode = true
              lightningBolts = 7
              good_objects.forEachAlive(lightningEffect)
              setTimeout(()=>{
                lightningObj = null
                lightningBolts = 0
                isLightningMode=false
                obj.tint = 0xffffff;
              },1000)
            }
            break
          case(4): //lightning blade
                       if(game.time.slowMotion !=1){
              break
            }
            showLabel(obj,'THE WORLD')
            game.time.slowMotion = 10;
            //setTimeout(()=>{game.time.slowMotion = 1.0},5000)
            game.add.tween(game.time).to({slowMotion:1.0}, 1000, Phaser.Easing.Linear.None, true,5000)
            //.onComplete.add(()=>{pointsLbl.destroy(true)});
            //its back
            break
          case(5): //fire / explosive blade
            break
          case(6): //phaser blade
            break
        default:
          //we will see

      }

      //obj.tint = Phaser.Color.hexToColor('#aaaaff11')
      //game.physics.arcade.moveToXY(obj, (w/2)+wMod,0, parentObj.y);
      //obj.body.gravity.y = 1 //(parentObj.body.gravity.y/10>10)?(parentObj.body.gravity.y/10):10;
    }
    
    //obj.reset(game.world.centerX + Math.random()*(w/4) -Math.random()*(w/4) , (h*9)/10);
    

    //game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, (h*9)/10);
    //let wMod = (Math.random()*(w/4) )-(Math.random()*(w/4))
    //game.physics.arcade.moveToXY(obj, parentObj.x+(Math.random()*100 -Math.random()*100),parentObj.y+(Math.random()*100-Math.random()*100), ((h*3)/5));
  }else{
       emitter.x = parentObj.x;
       emitter.y = parentObj.y;
       emitter.start(true, 2500, null, 2);
       throwGoodObject()
  }
  }
}
function throwBadObject() {
  if(isMatrixTime || isSafe || isGameOver || game.paused == true){
    return
  }
  playSound(glass_throw_effect)
  setTimeout(()=>{
      let obj = bad_objects.getFirstDead();
      if(obj){
        let xpos = game.world.centerX + Math.random()*(w/3) -Math.random()*(w/3) 
        let ypos = h// ((h*2)/3) + parseInt(Math.random()*(h/3))
        obj.reset(xpos,ypos);
        obj.scale.setTo(paper_scale, paper_scale);
        //obj.gravity = (h*10* Math.random());
        obj.body.gravity.y = 5
        obj.anchor.setTo(0.5, 0.5);
        obj.alpha = 0.8
        obj.body.angularAcceleration = Math.random()*200;
        let wMod = (Math.random()*(w/4) )-(Math.random()*(w/4))
        game.physics.arcade.moveToXY(obj, (w/2)+wMod,0, ((h*3)/5));
      }
   },500)
}


function getLength(pointA,pointB){
  let deltaX = Math.abs(pointA.x - pointB.x)
  let deltaY = Math.abs(pointA.y - pointB.y)
  return Math.ceil(Math.sqrt(deltaX^2+deltaY^2))
}

function resizeGame() {
  return
  var height = window.innerHeight;
  var width = window.innerWidth;

  game.width = width;
  game.height = height;
  game.stage.bounds.width = width;
  game.stage.bounds.height = height;
  game.camera.setSize(width, height);

  /*if (game.renderType === Phaser.WEBGL) {
    game.renderer.resize(width, height);
    Phaser.Canvas.setSmoothingEnabled(game.context, false);
  }*/
}



function checkIntersects(fruit, callback) {
  
  if(isMatrixTime && fruit.parent == bad_objects){
    fruit.kill()
    return
  }
   if(isSafe && fruit.parent == bad_objects){
    return
  }
  if(!game.input.x || !game.input.y){
    return
  }
  
  //https://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.6/phaser.min.js
    /*
  if(Phaser.Line.intersectsRectangle(line,fruit)){
    killFruit(fruit);
  }
*/
  
  /*
    var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
      l2.angle = 90;
      
  x = right-width
  y = bottom - hieght
  
      (r-w,b-h) ___l1__ (r,b-h)
               |       |
            l4 |       | l2
               |       |
       (r-w,b) |_______| (r,b)
                   l3
  
  */
  
  
/*
  var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom - fruit.height);
  var l2 = new Phaser.Line(fruit.body.right, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l3 = new Phaser.Line(fruit.body.right, fruit.body.bottom, fruit.body.right - fruit.width, fruit.body.bottom);
  var l4 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right - fruit.width, fruit.body.bottom - fruit.height);
  var l5 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l6 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
  l6.angle = 90;
*/
  
//   fruit.x, fruit.y
//   fruit._bounds.topLeft.x, fruit._bounds.topLeft.y
//   fruit._bounds.bottomRight.x, fruit._bounds.bottomRight.y
  /*
  var l7 = new Phaser.Line(fruit._bounds.topLeft.x, fruit._bounds.topLeft.y,fruit._bounds.bottomRight.x, fruit._bounds.bottomRight.y)
  var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom - fruit.height);
  var l2 = new Phaser.Line(fruit.body.right, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l3 = new Phaser.Line(fruit.body.right, fruit.body.bottom, fruit.body.right - fruit.width, fruit.body.bottom);
  var l4 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right - fruit.width, fruit.body.bottom - fruit.height);
  var l5 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l6 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
   l1.angle = 45; //fruit.angle;
  l2.angle = 45; //fruit.angle;
  l3.angle = 45; //fruit.angle;
  l4.angle = 45; //fruit.angle;
  l5.angle = 45; //fruit.angle;
  l6.angle = 90+45; //fruit.angle;
 
*/
  
  
    //fruit.anchor.set(0,0);
    var bx1 = fruit.left;
    var by1 = fruit.top;
    var bx2 = fruit.right;
    var by2 = fruit.bottom;
    //fruit.anchor.set(0.5,0.5);
  
    var outlines = [
        new Phaser.Line(bx1, by1, bx2, by1),
        new Phaser.Line(bx1, by2, bx2, by2),
        new Phaser.Line(bx1, by1, bx1, by2),
        new Phaser.Line(bx2, by1, bx2, by2)
    ]
    
    /*
      Phaser.Line.intersects(line, outlines[0], true)||
     Phaser.Line.intersects(line, outlines[0], true)
    */
    //lines.forEach(line=>line.rotateAround(line.end.x,line.end.y,rect.angle,true))
    
    outlines[0].rotateAround(fruit.x,fruit.y,fruit.angle,true)
    outlines[3].rotateAround(fruit.x,fruit.y,fruit.angle,true)
    outlines[2].rotateAround(fruit.x,fruit.y,fruit.angle,true)
    outlines[1].rotateAround(fruit.x,fruit.y,fruit.angle,true)
  
  
      outlines.push(new Phaser.Line((outlines[0].start.x+outlines[0].end.x)/2,(outlines[0].start.y+outlines[0].end.y)/2,(outlines[1].start.x+outlines[1].end.x)/2,(outlines[1].start.y+outlines[1].end.y)/2))
    
    outlines.push(new Phaser.Line((outlines[2].start.x+outlines[2].end.x)/2,(outlines[2].start.y+outlines[2].end.y)/2,(outlines[3].start.x+outlines[3].end.x)/2,(outlines[3].start.y+outlines[3].end.y)/2))
  
  if(Phaser.Line.intersects(line, outlines[0], true) ||
     Phaser.Line.intersects(line, outlines[1], true)||
     Phaser.Line.intersects(line, outlines[2], true)||
     Phaser.Line.intersects(line, outlines[3], true)||
     Phaser.Line.intersects(line, outlines[4], true)||
     Phaser.Line.intersects(line, outlines[5], true)
   ) {
    //console.log("CUT")
    killFruit(fruit);
  
  
  
  /*
    game.debug.geom(l1)
    game.debug.geom(l2)
     game.debug.geom(l3)
    game.debug.geom(l4)
     game.debug.geom(l5)
    game.debug.geom(l6)
    */
    //console.log(fruit)
    // setTimeout(()=>{
    //   l1.destroy(true)
    //   l2.destroy(true)
    // },5000)
  }
 // outlines.forEach(line=>game.debug.geom(line))
  
}

function resetScore() {
  if(isGameOver){
    return
  }
  slashes.clear();
  isGameOver = true
  var highscore = Math.max(score, localStorage.getItem("highscore"));
  localStorage.setItem("highscore", highscore);
  localStorage.setItem("score", 0);
  let pointsLbl = game.add.text(w/2,h/2,'GAME OVER!!!\nYour Max Score was: '+maxScore+'\nHigh Score: '+highscore);
  //pointsLbl.blendMode = Phaser.blendModes.ADD
  pointsLbl.font=game_font
  pointsLbl.fill = gameover_color;
  pointsLbl.fontSize = font_size_mod*4 //24
  pointsLbl.depth = 10
  pointsLbl.fontWeight = 'bold';
  pointsLbl.stroke = gameover_highlight_color;
  pointsLbl.strokeThickness = 3;
  pointsLbl.anchor.set(0.5);
  pointsLbl.align = 'center';
  
  comboTimeout = 0
  stopMusic()
  playSound(yoooo_effect)
  
 
  
  setTimeout(()=>{
    paperAtlas = "paperAtlas_"+parseInt(Math.random()*paper_normal_texture_path.length)
    pointsLbl.destroy(true);
    setupEmitters()
    background_dojo.forEach((d,index)=>{background_dojo[index].visible = false})
    background_dojo[parseInt(Math.random()*background_dojo.length)].visible = true
    isGameOver=false
    isMatrixTime = false
    score = 0;
    maxScore = 0;
    current_blades = 6;
    punishment = 1;
    scoreLabel.text = 'Score: ' + score;
    game.state.start("levelSelect")
    //playMusic();
  },10000) 
  scoreLabel.text = 'Slash the papers!';

  //reseting 
  good_objects.forEachExists(killFruit);
  bad_objects.forEachExists(killFruit);
  

  // Retrieve
}



function killFruit(fruit,callback=null) {
  //console.log( game.input.activePointer)
  //console.log(game.input)
  scoreLevel = Math.floor( Math.sqrt((((score/100)*8)+1)/2)-0.5)+1|| 1
  scorePoints = parseInt((scoreLevel+(slashLength*(1+comboMultiplier/10))/10))
  scorePoints = scorePoints + parseInt(scorePoints*(comboMultiplier/100)*(1-phase_rate))
  let isCritical = false

  if (!isGameOver && fruit.parent == good_objects) {
    
    if(Math.random()<=0.01 && !isMatrixTime && fruit.frameName == 'paper'){
            showLabel(fruit,'COMBO SHOWTIME!!!')
            isMatrixTime=true
            comboLbl.fontSize = font_size_mod*4 //48
            comboLbl.stroke = matrixtime_color;
            comboLbl.strokeThickness = 15;
      
            for(let i=0;i<50;i++){
              setTimeout(()=>throwGoodObject(),parseInt(Math.random()*5000))
            }
            
            setTimeout(()=>{
              isMatrixTime=false
              comboLbl.stroke = combo_highlight_color;
              comboLbl.strokeThickness = 5;  
              isSafe=true
              setTimeout(()=>{isSafe=false},1500)
             },8000)
            throwGoodObject()
    }
    let scalerMod = 1.0
    
    if(fruit.frameName == 'paper'){
      scalerMod = 1.0
   
    }
    
    if(fruit.frameName == 'paper_a' || fruit.frameName == 'paper_b'){
      scalerMod = 0.7
    }
    
    if(fruit.frameName == 'paper_aa' || fruit.frameName == 'paper_ab' || fruit.frameName == 'paper_ba' ||fruit.frameName == 'paper_bb'){
      scalerMod = 0.5
    }
    
       //console.log(scalerMod," => ",fruit.frameName) 
    
    
    let critModifier = ((slashLength/44)*0.05)>0.05?0.05:((slashLength/44)*0.05)
    isCritical = (Math.random() <= (0.05+critModifier) && fruit.frameName == 'paper')
    if (isCritical){
     //console.log("critical")
      if(sword_slash.isPlaying){
        sword_slash.stop()
      }
      critical_hit.play()
      scorePoints = parseInt((scorePoints) * 10) 
      let pointsLbl = game.add.text(fruit.x,fruit.y,"CRITICAL\n+"+scorePoints);
      pointsLbl.font=game_font
      //pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = critical_color;
      pointsLbl.fontSize = font_size_mod * 2.5 //32
      pointsLbl.alpha = 0.95
      pointsLbl.depth = 100
      //pointsLbl.anchor.set(0.5);
      pointsLbl.align = 'center';
      pointsLbl.fontWeight = 'bold';
      pointsLbl.stroke = critical_highlight_color;
      pointsLbl.strokeThickness = 2;
      game.add.tween(pointsLbl).to({ fontSize:(font_size_mod),alpha:0.25 }, 500, Phaser.Easing.Linear.None, true,2000).onComplete.add(()=>{pointsLbl.destroy(true)});
      
      let pointsLbl2 = game.add.text(fruit.x,fruit.y,"+"+scorePoints);
      pointsLbl.font=game_font
      //pointsLbl2.blendMode = Phaser.blendModes.ADD
      pointsLbl2.fill = critical_color;
      pointsLbl2.fontSize = font_size_mod * 2.5 //32
      
      pointsLbl.alpha = 0.95
      pointsLbl2.depth = 90
      //pointsLbl.anchor.set(0.5);
      pointsLbl2.align = 'center';
      pointsLbl2.fontWeight = 'bold';
      pointsLbl2.stroke = critical_highlight_color;
      pointsLbl2.strokeThickness = font_size_mod/5;
      game.add.tween(pointsLbl2).to({ y: 10,x:10,alpha:0.25 }, 500, Phaser.Easing.Linear.None, true,500).onComplete.add(()=>{pointsLbl2.destroy(true)});
      //punishment -= 1
    }else{
      paper_cut()
       if(fruit.frameName != 'paper'){
        scorePoints = Math.ceil(scorePoints * 0.1)
      }
      //scorePoints = parseInt(scorePoints * (1-phase_rate))
      let pointsLbl = game.add.text(fruit.x,fruit.y,"+"+scorePoints);
      pointsLbl.font=game_font
      //pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = goodpoints_color;
      pointsLbl.fontSize = font_size_mod*2.5 * scalerMod //32
      pointsLbl.alpha = 0.95 * scalerMod
      pointsLbl.depth = 10 - (10 * scalerMod)
      pointsLbl.fontWeight = 'bold';
      pointsLbl.stroke = "#000000"//goodpoints_highlight_color; //#90ee90
      pointsLbl.strokeThickness = 2;
      
      //var pointsObj = game.add.sprite(fruit.x,fruit.x, null);
      
      
      //game.physics.arcade.moveToXY(pointsObj,scoreLabel.x,scoreLabel.y, getLength(scoreLabel,fruit));
      //to(properties, duration, ease, autoStart, delay, repeat, yoyo) 
      game.add.tween(pointsLbl).to({ y: 10,x:80,alpha:0.5 }, 500, Phaser.Easing.Linear.None, true,500).onComplete.add(()=>{pointsLbl.destroy(true)});
      
      /*
      setTimeout(()=>{
        game.add.tween(pointsLbl).to({ y: 10,x:10,alpha:0.5 }, 500, Phaser.Easing.Linear.None, true);  
        setTimeout(()=>{pointsLbl.destroy(true)},600) 
                     },500)  
    */
   }
   

//fruit.scale.x>=0.5 && 
    if(fruit.frameName.length < 8){
      if(isCritical){
        comboTimeout += maxComboTimeout*2
        if(fruit.frameName == 'paper'){
          comboMultiplier += 5
        }
      }else{
        comboTimeout = maxComboTimeout
        if(fruit.frameName == 'paper'){
          comboMultiplier++
        }
      }
      let combo = comboMultiplier>1?"X"+comboMultiplier:''
      comboLbl.text =''
      if(comboMultiplier>1){
        comboLbl.text = combo +' Combo';
        comboLbl.fontSize = font_size_mod *3 //36
      }
      let isSpecialEffect = (Math.random()<=specialsRate)
      
      cutGoodObject(fruit,isSpecialEffect)
     
      comboTimeout += slashLength
      
      let comboModx = (0.25*(comboMultiplier/10))<0.25?(0.25*(comboMultiplier/10)):0.25
      if(Math.random()<= 0.05+comboModx){
        //setTimeout(()=>throwGoodObject(),parseInt(Math.random()*1000))
      }
      if(Math.random()<= 0.05+comboModx){
        //setTimeout(()=>throwBadObject(),parseInt(Math.random()*1000))
      }

    }else{
      //console.log("KEY",fruit.key)
      comboTimeout = maxComboTimeout
      comboLbl.fontSize = font_size_mod*3 //36
      emitter.x = fruit.x;
      emitter.y = fruit.y;
      //emitter.scale.x = 0.25
      emitter.start(true, 2500, null, 2);
    }
    
  }
  if (!isGameOver && fruit.parent == bad_objects) {
    
    if(Math.random()>=(1-phase_rate)){
      let pointsLbl = game.add.text(fruit.x,fruit.y,"||PHASED||");
      pointsLbl.font=game_font
      //pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = phaser_color;
      pointsLbl.fontSize = font_size_mod*2 //32
      pointsLbl.depth = 10
      pointsLbl.fontWeight = 'bold';
      pointsLbl.stroke = phaser_highlight_color;
      pointsLbl.strokeThickness = 2;
      game.add.tween(pointsLbl).to({ fontSize:font_size_mod,alpha:0.25 }, 500, Phaser.Easing.Linear.None, true,800).onComplete.add(()=>{pointsLbl.destroy(true)});
      //sword_slash.stop()
      sword_phase.play()
      fruit.kill();
      return;
    }
    current_blades -= 1
    sword_slash.stop()
    glass_break.play()
    scorePoints = 0//parseInt(scorePoints * 20 * (-1*(punishment+1)))
    comboTimeout = 0
    comboMultiplier =  1
    let pointsLbl = game.add.text(fruit.x,fruit.y,"[BROKEN]");
    pointsLbl.font=game_font
    //pointsLbl.blendMode = Phaser.blendModes.ADD
    pointsLbl.fill = badpoints_color;
    pointsLbl.fontSize = font_size_mod * 2 //30
    pointsLbl.depth = 10
    pointsLbl.fontWeight = 'bold';
    pointsLbl.stroke = badpoints_highlight_color;
    pointsLbl.strokeThickness = 2;
    game.add.tween(pointsLbl).to({ y:h,fontSize:font_size_mod,alpha:0.15 }, 800, Phaser.Easing.Linear.None, true,1000).onComplete.add(()=>{pointsLbl.destroy(true)});
    //game.add.tween(pointsLbl2).to({ y: 10,x:10,alpha:0.25 }, 500, Phaser.Easing.Linear.None, true,500).onComplete.add(()=>{pointsLbl2.destroy(true)});
    
    emitter2.x = fruit.x;
    emitter2.y = fruit.y;
    emitter2.start(true, 2500, null, 4);
    
    isSafe=true
    setTimeout(()=>{isSafe=false},1500)
  
  } 
  fruit.kill();
  points = [];
  score += scorePoints;
  maxScore = Math.max(score,maxScore)
  localStorage.setItem("score", score);
  if(!isNaN(score)){
    scoreLabel.text = 'Score: ' + score // + ' : ' +w+'/'+h// + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  }
  if(isCritical){
    setTimeout(()=>throwGoodObject(),parseInt(Math.random()*3000))
    setTimeout(()=>throwGoodObject(),parseInt(Math.random()*3000))
    //good_objects.forEachExists(killFruit);
  }
  //score<=0 || 
  if (current_blades < 0){
    resetScore()
  }


}
}

//UYILITY FUNCTIONS
{
    function scaleToGameWidth(obj,amount,minWidth=0){
       let scaleAmount = (game.width*amount)/obj.width
      
       obj.scale.y = scaleAmount
       obj.scale.x = scaleAmount
      
      if(obj.width < minWidth){
         let scaleMode =  minWidth/obj.width
         obj.scale.y = scaleAmount * scaleMode
         obj.scale.x = scaleAmount * scaleMode
      }
   }
  
  function  alignToGameWidth(obj,amount){
    obj.x = game.width * amount
  }
  
   function alignToGameHeight(obj,amount){
     obj.y = game.height * amount
   }
  
}

// ALIGN GRID
class AlignGrid extends Phaser.Group {
    constructor(cols = 3, rows = 3, par = null) {
        super(game);
        //if not parent is passed then use the game
        if (par == null) {
            par = game;
        }
        //console.log(par.width,par.height)
        //cw cell width is the parent width divided by the number of columns
        this.cw = par.width / cols;
        //ch cell height is the parent height divided the number of rows
        this.ch = par.height / rows;
        //promote to a class variable
        this.par = par;
        //console.log(this.cw,this.ch,this.par.width,this.cw*cols)
    }
    //place an object in relation to the grid
    placeAt(xx, yy, obj) {
        //calculate the center of the cell
        //by adding half of the height and width
        //to the x and y of the coordinates
        let x2 = this.cw * xx + this.cw / 2;
        let y2 = this.ch * yy + this.ch / 2;
        obj.x = x2;
        obj.y = y2;
    }
    //mostly for planning and debugging this will
    //create a visual representation of the grid
    show() {
        //game.scale.refresh();
        this.graphics = game.add.graphics();
        this.graphics.lineStyle(3, 0xff0000, 1);
        //
        //
        for (var i = 0; i < this.par.width; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.par.height);
        }
        for (var i = 0; i < this.par.height; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.par.width, i);
        }
      //this.graphics.moveTo(0, 0);
      //this.graphics.lineTo(this.par.width, this.par.height);
                           
      //console.log(this.par.width,this.par.height)
    }
}
// BOOTING
class BootState extends Phaser.State {
  constructor(){
    super()
  }
  
  preload(){
        game.load.crossOrigin = 'anonymous';
        game.pixelArt = true
        game.antialias = false

        game.canvas.style.cursor = 'url('+ cursor_path +'), default';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = h/4;

        //game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        //game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        //game.scale.parentIsWindow = true;
        
        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.input.onUp.add(onReleased)
        game.input.onDown.add(onPressed)
        game.onBlur.add(()=>{game.pause=true})
        game.onFocus.add(()=>{game.pause=false})
    
       //Preload assets
       game.load.image("preloadbar","https://leokamwathi.github.io/PixelNinja/assets/images/ui/Preloadbar_0.png")
       game.load.image("logo","https://leokamwathi.github.io/PixelNinja/assets/images/title/title_logo_2.png")
       game.load.audio("intro_music","https://leokamwathi.github.io/PixelNinja/assets/sounds/start_menu.mp3")
    
       //FONTS
       game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    
  }
  create(){
    
    this.sound.stopAll();
    this.state.start('loading')
  }
  update(){
     if(this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  }
  render(){
    
  }
}
// LOADING 
class LoadingState extends Phaser.State {
  constructor(){
    super()
    this.playingMusic = false
  }
  
  preload() {

    //game.load.image("preloadbar","https://leokamwathi.github.io/PixelNinja/assets/images/ui/Preloadbar_0.png")

   
  //PRELOAD PROGRESS
    
    intro_music = game.sound.add("intro_music")
    
    
    
    this.preloadbar = game.add.sprite((w/2)-200,(h/2)+25,"preloadbar")
    this.preloadbar.anchor.setTo(0)
    //this.preloadbar.filters=[glowFilter];
    scaleToGameWidth(this.preloadbar,0.75,200)
    let centerScale = ((game.width - this.preloadbar.width)/2)/game.width
    alignToGameWidth(this.preloadbar,centerScale)
    alignToGameHeight(this.preloadbar,0.50)
    
    game.time.advancedTiming=true
    game.load.setPreloadSprite(this.preloadbar)
    
  
  //game.stage.backgroundColor = "#00ccff";//87ceeb
  
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_01.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_02.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_03.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_04.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_05.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_06.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_07.jpg')
  
  
  //paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_2.png')
  //paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_3.png')
  //paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_4.png')
   paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_5.png')
   paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_6.png')
   paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_7.png')
   paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_8.png')
   paper_normal_texture_path.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_9.png')
  
  
  //paper_normal_texture_path = 'https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper.png'
  
  paper_normal_json_path = 'https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper.json'
  
  //Normal Paper
  
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper.png?')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_a.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_b.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_aa.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_ab.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_ba.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_bb.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_aaa.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_aab.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_aaa_25.png')
  paper_normal_texture_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper_aab_25.png')
  
  //Glass
  
  var glass_texture_path = 'https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/glass.png?'
  
  //Mask
  var mask_aaa_texture_path = 'https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/mask_aaa.png?'
  
  //Blade [HP]
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_0.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_1.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_2.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_3.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_4.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_5.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_6.png")
  
    
    //UI BUTTONS
    var play_button_path = "https://leokamwathi.github.io/PixelNinja/assets/images/ui/Play_Button_2_a.png"
    var level_button_0_star_path = "https://leokamwathi.github.io/PixelNinja/assets/images/ui/level_button_0_star.png"
    var level_button_1_star_path = "https://leokamwathi.github.io/PixelNinja/assets/images/ui/level_button_1_star.png"
    var level_button_2_star_path = "https://leokamwathi.github.io/PixelNinja/assets/images/ui/level_button_2_star.png"
    var level_button_3_star_path = "https://leokamwathi.github.io/PixelNinja/assets/images/ui/level_button_3_star.png"
  
  
  blades_path.forEach((path,index)=>{
    //console.log("path:>>",path,index)
    game.load.image("blade_"+index,path)
    //blades_cartridge.push(game.add.sprite(10,60,"blade_"+index))
    //if (index != current_blades){
     // blades_cartridge[index].visible = false
    //}
    //var s = game.add.sprite(80, 0, 'einstein');
  })
  
  game.load.image("ui_element",blades_path[6])
  
  music_paths.push('https://leokamwathi.github.io/PixelNinja/assets/music/music_001.mp3')
  music_paths.push('https://leokamwathi.github.io/PixelNinja/assets/music/music_002.mp3')
  music_paths.push('https://leokamwathi.github.io/PixelNinja/assets/music/music_003.mp3')
  music_paths.push('https://leokamwathi.github.io/PixelNinja/assets/music/music_004.mp3')
  music_paths.push('https://leokamwathi.github.io/PixelNinja/assets/music/music_005.mp3')
  music_paths.push('https://leokamwathi.github.io/PixelNinja/assets/music/music_006.mp3')
  
  
   
  var sword_phase_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/phase_sfx_001.mp3"
  var sword_slash_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/sword_sfx.mp3"
  var glass_break_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/glass_sfx.mp3"
  var critical_hit_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/sword_epic_002.mp3"
  //paper_throw_sfx_001.mp3
  var glass_throw_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/glass_throw_sfx_001.mp3"
  var paper_throw_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/paper_throw_sfx_002.mp3"
  var freeze_effect_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/freeze_sfx_001.mp3"
  var wind_effect_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/wind_sfx_001.mp3"
  var lightning_effect_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/lightning_sfx_001.mp3"
  
  
  var yoooo_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/Japanese_Yoooo_sfx.mp3"
  

  var paper_cut_path_001 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_001_sfx.mp3"
  var paper_cut_path_002 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_002_sfx.mp3"
  var paper_cut_path_003 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_003_sfx.mp3"
  var paper_cut_path_004 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_004_sfx.mp3"
  var paper_cut_path_005 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_005_sfx.mp3"
  //var paper_cut_path_006 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_006_sfx.mp3"
  //var paper_cut_path_007 = "https://leokamwathi.github.io/PixelNinja/assets/sounds/cut_007_sfx.mp3"
  
  background_dojo_paths.forEach((path,index)=>{game.load.image("background_dojo_"+index,path)})
  
  
  //load normal paper  paper_normal_texture_path[parseInt(Math.random()*paper_normal_texture_path.length)]
  //paperAtlas = "paperAtlas_"+parseInt(Math.random()*paper_normal_texture_path.length)
  
  paper_normal_texture_path.forEach((path,index)=>game.load.atlasJSONHash("paperAtlas_"+index, path, paper_normal_json_path))
  

  //game.load.image("normal_paper_aaa_25",paper_normal_texture_paths[9])
  //game.load.image("normal_paper_aab_25",paper_normal_texture_paths[10])
  game.load.image("glass_texture",glass_texture_path)
  game.load.image("mask_aaa_texture",mask_aaa_texture_path)
    
  game.load.image("play_button",play_button_path)
  game.load.image("level_button_0_star",level_button_0_star_path)
  game.load.image("level_button_1_star",level_button_1_star_path)
  game.load.image("level_button_2_star",level_button_2_star_path)
  game.load.image("level_button_3_star",level_button_3_star_path)
    
  game.load.audio("sword_phase",sword_phase_path)
  game.load.audio("sword_slash",sword_slash_path)
  game.load.audio("glass_break",glass_break_path)
  game.load.audio("critical_hit",critical_hit_path)
  
   game.load.audio("glass_throw_effect",glass_throw_path)
   game.load.audio("paper_throw_effect",paper_throw_path)
   game.load.audio("freeze_effect",freeze_effect_path)
   game.load.audio("wind_effect",wind_effect_path)
   game.load.audio("lightning_effect",lightning_effect_path)
   game.load.audio("yoooo_effect",yoooo_path) 
  game.load.audio("paper_cut_001",paper_cut_path_001)
  game.load.audio("paper_cut_002",paper_cut_path_002)
  game.load.audio("paper_cut_003",paper_cut_path_003)
  game.load.audio("paper_cut_004",paper_cut_path_004)
  game.load.audio("paper_cut_005",paper_cut_path_005)
  music_paths.forEach((path,index)=>{game.load.audio('music_'+index,path)})
  if(w>h){
    paper_width = parseInt(h/5)
    glass_width = parseInt(paper_width/2)
   //font_size_mod = parseInt(w/85)
  }else{
    paper_width = parseInt(w/5)
    glass_width = parseInt(paper_width/2)
    //font_size_mod = parseInt(h/85)
  }
  font_size_mod = parseInt(paper_width/8.5)
  paper_scale = paper_width/560
}
  
  playGame(){
    game.state.start("levelSelect")
  }
  create(){
      this.sound.stopAll();
      this.preloadbar.visible = false
      game.stage.backgroundColor = '#182d3b';
      this.logo = game.add.sprite((w/2),200,"logo")
      this.logo.scale.x = 0.4
      this.logo.scale.y = 0.4
      this.logo.alpha = 0 
      this.logo.anchor.setTo(0.5)
      game.add.tween(this.logo).to({ alpha:1  }, 2000, Phaser.Easing.Linear.None, true,100).onComplete.add(()=>{
        this.playbutton = game.add.button((w/2) - 100, h/2+70, 'play_button', this.playGame)
        this.playbutton.alpha = 0
        game.add.tween(this.playbutton).to({ alpha:1 }, 500, Phaser.Easing.Linear.None, true)
        intro_music.volume = 0.6
        intro_music.play()
        this.playingMusic = true
      });
    //background = game.add.tileSprite(0, 0, 800, 600, 'background');

    
  }
  update(){
     if(this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
    if(!intro_music.isPlaying && this.playingMusic){
      intro_music.play()
    }
    //glowFilter.update()
  }
  render(){
    
  }
}
// MAIN GAME
class MainGameState extends Phaser.State {
  constructor(){
    super()
  }
  
  preload(){

  }

 create() {
 this.sound.stopAll();
 //game.input.setDefaultCursor('url('+ cursor_path +'), pointer');

  //game.input.onDown.add(onPressed)
  //game.on('pointermove',onMoved)
   // game.input.on('pointermove', onMoved);
  //document.body.addEventListener('mousemove',(e)=>{e.preventDefault(); onMoved(e)},true)
  
  background_dojo_paths.forEach((d,index)=>{
    background_dojo.push(game.add.image(0, 0, 'background_dojo_'+index))
    //let bg_scale = h/background_dojo[index].height
    background_dojo[index].height = h // background_dojo[index].height * bg_scale
    background_dojo[index].width = w // background_dojo[index].width * bg_scale
    background_dojo[index].visible = false
    background_dojo[index].depth = -100
    //game.load.image("background_dojo_"+index,path)
  })
  
  //game.add.tileSprite(0, 0, 1000, 600, 'background');
 
  background_dojo.forEach((d,index)=>{background_dojo[index].visible = false})
  background_dojo[parseInt(Math.random()*background_dojo.length)].visible = true
  
   sword_phase = game.sound.add("sword_phase")
  sword_slash = game.sound.add("sword_slash")
  glass_break = game.sound.add("glass_break")
  critical_hit = game.sound.add("critical_hit")
  
   glass_throw_effect = game.sound.add("glass_throw_effect")
   paper_throw_effect = game.sound.add("paper_throw_effect")
   wind_effect = game.sound.add("wind_effect")
   freeze_effect = game.sound.add("freeze_effect")
   lightning_effect = game.sound.add("lightning_effect")
  yoooo_effect = game.sound.add("yoooo_effect")
   
   wind_effect.volume = 0.4
   lightning_effect.volume = 0.3
   paper_throw_effect.volume=0.3
  
  
  music_paths.forEach((p,index)=>{music.push(game.sound.add('music_'+index))}) 
  paperAtlas = "paperAtlas_"+parseInt(Math.random()*paper_normal_texture_path.length)
  
  paper_cuts.push(game.sound.add("paper_cut_001"))
  paper_cuts.push(game.sound.add("paper_cut_002"))
  paper_cuts.push(game.sound.add("paper_cut_003"))
  paper_cuts.push(game.sound.add("paper_cut_004"))
  paper_cuts.push(game.sound.add("paper_cut_005"))
  // paper_cuts.push(game.sound.add("paper_cut_006"))
  //paper_cuts.push(game.sound.add("paper_cut_007"))

  //game.sound.context.resume();
  //sdfsf
  
  //ui = game.add.sprite(10,120,"ui_element")
  
  
    var shade_amoumt = 95
    critical_highlight_color = critical_color //shadeColor(critical_color,shade_amoumt)
    critical_color = shadeColor(critical_color,shade_amoumt)
    goodpoints_highlight_color = shadeColor(goodpoints_color,-50) //shadeColor(goodpoints_color,shade_amoumt)
    goodpoints_color = shadeColor("#FFA500",30)//combo_highlight_color //shadeColor(goodpoints_color,-40)
  
    badpoints_highlight_color = shadeColor(badpoints_color,shade_amoumt)
    score_highlight_color = shadeColor(score_color,shade_amoumt)
    //gameover_highlight_color = shadeColor(gameover_color,shade_amoumt)
    phaser_highlight_color = shadeColor(phaser_color,shade_amoumt)
    specials_highlight_color = shadeColor(specials_color,shade_amoumt)
    //combo_highlight_color = shadeColor(combo_color,shade_amoumt)
  
  blades_path.forEach((path,index)=>{
    blades_cartridge.push(game.add.sprite(10,font_size_mod*6,"blade_"+index))
    //blades_cartridge[index].anchor.setTo(0.5, 0.5);
    let blade_scale = (paper_width/120)
    blades_cartridge[index].scale.setTo(blade_scale,blade_scale)
    if (index != current_blades){
      blades_cartridge[index].visible = false
    }
  })
  
  blades_cartridge.forEach((b,i)=>{
    if (i != current_blades){
      blades_cartridge[i].visible = false
    }
  })
  /*
  Phaser.ScaleManager.RESIZE;
  game.scale.scaleMode = Phaser.Scale.ScaleManager.RESIZE;
  game.scale.parentIsWindow = true;
 */

  //good_objects = createGroup(total_good_objects, game.cache.getBitmapData('good'));
  //var normal_paper = game.add.sprite(0,0,'normal_paper')
  good_objects = createGroup(total_good_objects, 'normal_paper');
  bad_objects = createGroup(total_bad_objects, 'glass_texture');
  //bad_objects.filters=[glowFilter];
  //good_objects.filters=[glowFilter];
  slashes = game.add.graphics(0, 0);
  //slashes.filters=[glowFilter];
  //slashes.fill = 'red';
  scoreLabel = game.add.text(10,10,'Slash the papers!!');
  scoreLabel.font = game_font;
  scoreLabel.fill = score_color;
  scoreLabel.fontSize = font_size_mod * 2 //24;
  comboLbl = game.add.text((w/2),35, '');
  comboLbl.font = game_font;
  comboLbl.fill=combo_color
  comboLbl.anchor.set(0.5,0.5);
  comboLbl.align = 'center';
  comboLbl.fontWeight = 'bold';
  comboLbl.stroke = combo_highlight_color;
  comboLbl.strokeThickness = 5;
  comboLbl.depth = 100  
  setupEmitters();
  throwObject();
}
render() { 
  if(isGameOver || game.pause==true){
    slashes.clear();
    return
  }
  
  throwObject();
  var isMusic = false
  music.forEach((song)=>{
    isMusic = (isMusic || song.isPlaying)
  })
  
  if(!isMusic && !isGameOver){
    playMusic()
  }
  if(w != window.innerWidth){
    w = window.innerWidth;
    h = window.innerHeight;
    game.physics.arcade.gravity.y = h/4;
    resizeGame()

  }

  inputTimeout = (inputTimeout>0)?inputTimeout-1:0
    if(!isMatrixTime){
      comboTimeout = (comboTimeout>0)?comboTimeout-1:0
    }else{
      comboLbl.fontSize = font_size_mod*4 //48
      comboLbl.stroke = matrixtime_color;
      comboLbl.strokeThickness = 15;
    }
  if(comboTimeout <= 0){
    comboLbl.text =''
    comboMultiplier = 1 
  }else{
    if(!isMatrixTime){
      comboLbl.fontSize = (15 + 25*(comboTimeout/maxComboTimeout))<48?(15 + 25*(comboTimeout/maxComboTimeout)):48
    }
  }
  if(!isNaN(score) && score>0){
    scoreLabel.text = 'Score: ' + score//
  }else{
    score=0
  }
}
update() {

  
  
if(isGameOver || game.pause==true){
  sword_slash.stop() 
  slashes.clear();
  return
}
  
  game.debug.text("Mouse\n"+game.input.x + ","+game.input.y+"\n"+game.input.activePointer.leftButton.isDown,w-300,100)
  
  
  
  if(game.sound.context.state === 'suspended') {
    game.sound.context.resume();
  }
  
    blades_cartridge.forEach((b,i)=>{
      blades_cartridge[i].visible = false
  })
  current_blades = (current_blades<0)?0:current_blades<blades_cartridge.length?current_blades:blades_cartridge.length-1
  blades_cartridge[current_blades].visible = true
  //comboTimeout = comboTimeout-1
  //comboTimeout = (comboTimeout>0)?comboTimeout-1:0
  //throwObject();
  
  
  if(!isPressed && game.input.activePointer.leftButton.isDown){
    isPressed= true
  }else{
    //sword_slash.stop() 
     slashes.clear();
    isPressed = false
  }
  
  if(!isPressed){
     slashes.clear();
    //sword_slash.stop() 
    return
  }
  
  if(lastX == game.input.x && lastY == game.input.y){
     slashes.clear();
    points = [] ; //points.splice(points.length-1, points.length);
    return
  }
  

  

  if(inputTimeout <= 0){
    // points = [] ; //points.splice(points.length-1, points.length);
  }
  inputTimeout = 1

  lastX = game.input.x
  lastY = game.input.y
  points.push({ 
    x: game.input.x,
    y: game.input.y
  });

  if(points.length>1 && getLength(points[points.length-2],points[points.length-1])>20){
    points = []; //points.splice(points.length-1, points.length);
  }
  //let lengthPoints = points.splice(points.length-30, points.length);
  points = points.splice(points.length-15, points.length);
  //lengthPoints = points
  //points
  if (points.length<1 || points[0].x==0) {
    return;
  }

  
   slashes.clear();
  slashes.beginFill(0xaaff0000);
  slashes.lineStyle(5, 0xaaffffff, 1);
  slashes.alpha = .8;
  slashes.moveTo(points[0].x, points[0].y);
  for (var i=1; i<points.length; i++) {
    slashes.lineTo(points[i].x, points[i].y);
  } 
  
  slashes.endFill(0xaaff0000);
  
  /*
  slashes.clear();
  //slash_color
  //Phaser.Color.hexToColor("#ff00ff77")
  //slashes.beginFill(0x77ff0000);
  slashes.lineStyle(20, 0xffffff, 1);
  //slashes.lineStroke = 5;
  slashes.alpha = .7;
  slashes.moveTo(points[0].x, points[0].y);
  for (var i=1; i<points.length; i++) {
    slashes.lineTo(points[i].x, points[i].y);
  } 
  slashes.endFill(0x77ff00ff);
*/


  slashLength = getLength(points[0],points[points.length-1])

  ///
  if(slashLength>5){
    if(!sword_slash.isPlaying){
      sword_slash.play()  
    }else{
      //console.log("MEEE ",slashLength)
      //sword_slash.stop()
      //sword_slash.play()
    }
  }

  for(var i = 1; i< points.length; i++) {
    line = new Phaser.Line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
    
    //line.filters=[glowFilter];
    //game.debug.geom(line);

    good_objects.forEachExists(checkIntersects);
    bad_objects.forEachExists(checkIntersects);
  }
  //glowFilter.update();
}
}
// LEADERBOARDS
class LeaderboardsState extends Phaser.State {
  constructor(){
    super()
  }
  
  preload(){

  }
  create(){
    this.sound.stopAll();
  }
  update(){
     if(this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  }
  render(){
    
  }
}
// LEVEL SELECT
class levelSelectState extends Phaser.State {
  constructor(){
    super()
  }
  
  preload(){
    //game.width = game.width/2
    //game.height = game.height/2
    //game.scale.refresh();
  }
  levelSelect(index){
    //console.log("You selected level "+index)
    //console.log("You selected level bind "+this.index)
    //set level to xxxx
    if(index == 14){
      game.state.start("loading")
      return
    }
    currentGameLevel = index
    game.state.start("mainGame")
  }
  create(){
    this.sound.stopAll();
        //make an align grid
        // (cols,rows)
    this.cols = 7
    this.rows = 5
        if(game.width<game.height){
          this.cols = 5
          this.rows = 7
       }
        this.grid = new AlignGrid(this.cols, this.rows,game);
       
        //turn on the lines for testing
        //and layout
        this.grid.show();
        this.levelButtons = []
        this.randButtons = ['level_button_0_star','level_button_1_star','level_button_2_star','level_button_3_star']
        for(let row=1; row<(this.rows-1);row++){
            for(let col=1; col<(this.cols-1);col++){
              //;
              let index = this.levelButtons.length
              let rndBtn = parseInt(Math.random() * (this.randButtons.length))
              this.levelButtons.push(game.add.button(0,0, this.randButtons[rndBtn],this.levelSelect.bind(this, index),this))
              scaleToGameWidth(this.levelButtons[index],1/14,50)
              //this.levelButtons[index].scale.x = 0.5
              //this.levelButtons[index].scale.y = 0.5
              this.levelButtons[index].anchor.setTo(0.5)
              if(rndBtn == 3){
                this.levelButtons[index].filters=[glowFilter];
              } 
              this.grid.placeAt(col,row, this.levelButtons[index]);
            }
        }
  }
  update(){
     if(this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
    if(!intro_music.isPlaying){
      intro_music.play()
    }
    //glowFilter.update();
  }
  render(){
    
  }
}
// GAME SETTINGS
class gameSettingState extends Phaser.State {
  constructor(){
    super()
  }
  
  preload(){

  }
  create(){
    this.sound.stopAll();
  }
  update(){
     if(this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  }
  render(){
    
  }
}
// SAMURAI STATS / INVENTORY
class samuraiStatsState extends Phaser.State {
  constructor(){
    super()
  }
  
  preload(){

  }
  create(){
    this.sound.stopAll();
  }
  update(){
     if(this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  }
  render(){
    
  }
}
// GAME
class Game extends Phaser.Game {
  constructor(){
    super(window.innerWidth,window.innerHeight,Phaser.AUTO,'game')
    //var game = new Phaser.Game(w, h, Phaser.AUTO, 'game',{ preload: preload, create: create, update: update, render: render },false,false);
    //this.width = window.innerWidth;
    //this.height = window.innerHeight;
    
    
    //filters
    glowFilter=new Phaser.Filter.Glow(this);
    glowFilterLevel =new Phaser.Filter.Glow(this,2.5); 
    
    setInterval(()=>{
      glowFilterLevel.update()
      glowFilter.update()
    },300)
    
    //game states
    this.state.add('boot', new BootState)
    this.state.add('loading', new LoadingState)
    this.state.add('levelSelect',new levelSelectState)
    this.state.add('gamesetting',new gameSettingState)
    this.state.add('samuraiStats',new samuraiStatsState)
    this.state.add('mainGame',new MainGameState)
    this.state.add('leaderboard',new LeaderboardsState)
    this.state.start('boot')
    
  }
}


let game = new Game()