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
    paper_cuts=[],
    blades_cartridge = [],
    blades_path = [],
    current_blades=6,
    critical_hit,
    lastX=0,
    lastY=0,
    ui
/*
#ffff99 //highlight

#9b1000 //dark red
#a40079 //dark pink/magenta
#3f0055 //dark purple
#3f0055 //dark blue
#a44200 //dark orange
#005500 //dark green
#007097 //dark cyan
#7a0e17 //dark brown

*/

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

/*
var critical_color = '#f63cac',
    goodpoints_color='#fbf236',
    badpoints_color='#9b1000',
    score_color='#43dfff',
    gameover_color='#9b1000',
    phaser_color='#5188ff',
    specials_color='#ff4b1b',
    combo_color='#3f0055'
//#ffff99
var slash_color='#a800e3',
    critical_highlight_color = '#7d0980',
    goodpoints_highlight_color='#df7126',
    badpoints_highlight_color='#ffff99',
    score_highlight_color='#045b6d',
    gameover_highlight_color='#ffff99',
    phaser_highlight_color='#022a80',
    specials_highlight_color='#696a6a',
    combo_highlight_color='#ffff99'
*/
var game_font='Righteous'
var minCutLevels = 4
var phase_rate=0.8 //chance to miss cutting glass and instead teleport it to the void.
var total_good_objects = 50
var total_bad_objects = 20
var isMatrixTime = false
var paper_scale = 0.5

var fireRate = 1000;
var nextFire = 0;
var background_dojo_paths = []
var background_dojo = []
var isSafe = false


var paper_normal_texture_paths = []
var paper_normal_texture_path = ''
var paper_normal_json_path = ''

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
                           { preload: preload, create: create, update: update, render: render },false,false);
var glowFilter=new Phaser.Filter.Glow(game);


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
function preload() {
  if (game && game.scale && game.scale.compatibility && game.scale.compatibility.supportsFullScreen) {
    game.scale.startFullscreen();
  }
  
   game.load.crossOrigin = 'anonymous';
   game.pixelArt = true
   game.antialias = false
   
  //BLADES
  
  //FONTS
  game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  game.stage.backgroundColor = "#00ccff";//87ceeb
  
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_01.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_02.jpg')
  background_dojo_paths.push('https://leokamwathi.github.io/PixelNinja/assets/images/dojos/dojo_03.jpg')
  
  
  paper_normal_texture_path = 'https://leokamwathi.github.io/PixelNinja/assets/images/papers/normal/paper.png'
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
  
  
  //Blade [HP]
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_0.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_1.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_2.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_3.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_4.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_5.png")
  blades_path.push("https://leokamwathi.github.io/PixelNinja/assets/images/blades/hd_blades_6.png")
  
  
  
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
  
  
   
  var sword_phase_path = "https://leokamwathi.github.io/PixelNinja/assets/sounds/phase_sfx_001.mp3"
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
  
  background_dojo_paths.forEach((path,index)=>{game.load.image("background_dojo_"+index,path)})
  
  
  //load normal paper
  game.load.atlasJSONHash("paperAtlas", paper_normal_texture_path, paper_normal_json_path);
  /*
  game.load.image("normal_paper",paper_normal_texture_paths[0])
  game.load.image("normal_paper_a",paper_normal_texture_paths[1])
  game.load.image("normal_paper_b",paper_normal_texture_paths[2])
  game.load.image("normal_paper_aa",paper_normal_texture_paths[3])
  game.load.image("normal_paper_ab",paper_normal_texture_paths[4])
  game.load.image("normal_paper_ba",paper_normal_texture_paths[5])
  game.load.image("normal_paper_bb",paper_normal_texture_paths[6])
  game.load.image("normal_paper_aaa",paper_normal_texture_paths[7])
  game.load.image("normal_paper_aab",paper_normal_texture_paths[8])
  */
  game.load.image("normal_paper_aaa_25",paper_normal_texture_paths[9])
  game.load.image("normal_paper_aab_25",paper_normal_texture_paths[10])
  

  game.load.audio("sword_phase",sword_phase_path)
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
  
  
  
  
  //game.cache.addImage("good",paper_normal_texture_paths[0])
  
  //normal image
  //game.cache.addImage('normal_paper_', bmd);
  
  
  /*
  var bmd = game.add.bitmapData(paper_width,paper_width);

  var grd = bmd.ctx.createLinearGradient(0, 0, paper_width, paper_width); 

  grd.addColorStop(0, '#fcebc5');
  grd.addColorStop(1, shadeColor('#fcebc5',-40));
  //#e0d3a
  bmd.ctx.fillStyle = grd; //'#00ffff88';
  bmd.ctx.strokeStyle = '#654321';
  bmd.ctx.fillRect(0, 0,paper_width,paper_width)
  bmd.ctx.strokeRect(0, 0,paper_width,paper_width);
  //bmd.ctx.fill();
  
  
  game.cache.addBitmapData('good', bmd);
*/
  
  var bmd = game.add.bitmapData(glass_width,glass_width);
  var grd = bmd.ctx.createLinearGradient(0, 0, glass_width, glass_width);  
   //grd.addColorStop(0, '#33689e77');
  //grd.addColorStop(1, '#12afd877');
  
  grd.addColorStop(0, '#00ccff99');
  grd.addColorStop(1, shadeColor('#00ccff',-40)+"99");
  bmd.ctx.fillStyle = grd; //'#ff00ff';
  bmd.ctx.strokeStyle = shadeColor('#33689e',-80)
  bmd.ctx.strokeRect(0, 0,glass_width,glass_width);
  //bmd.ctx.strokeStyle = '#33689e';
  //bmd.ctx.alpha = 0.75;
  bmd.ctx.fillRect(0, 0,glass_width,glass_width)
  game.cache.addBitmapData('bad', bmd);
  //game.stage
}

function stopSoundEffects(){
    //game.sound.mute = true;
    for (let i=0; i< paper_cuts.length-1;i++){
      if(paper_cuts[i].isPlaying){
        paper_cuts[i].stop()
      }
    }
    if(sword_slash.isPlaying){
      sword_slash.stop()
    }
    if(sword_slash.isPlaying){
      sword_slash.stop()
    }
    
}

function playSound(sound_effect){
  stopSoundEffects()
  sound_effect.play()
}

function paper_cut(){
  playSound(paper_cuts[Math.ceil(Math.random()*(paper_cuts.length-1))])
}





function onReleased(){
  if(points && points.length>0){
    points = [] ; //points.splice(points.length, points.length);
  }
}

function onPressed(){
  if(points && points.length>0){
    points = [] ; //points.splice(points.length-1, points.length);
  }
}


function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = h/4;

  game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.parentIsWindow = true;

  game.input.onUp.add(onReleased)
  game.input.onDown.add(onPressed)
  
 
  
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
    goodpoints_color = combo_highlight_color //shadeColor(goodpoints_color,-40)
  
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
  bad_objects = createGroup(total_bad_objects, game.cache.getBitmapData('bad'));
  //bad_objects.filters=[glowFilter];
  //good_objects.filters=[glowFilter];
  slashes = game.add.graphics(0, 0);
  slashes.filters=[glowFilter];
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


  //scoreLabel.filters=[glowFilter]

  //pointsLabel = game.add.text(-10,-10,'+1');
  //pointsLabel.blendMode = Phaser.blendModes.ADD
  //pointsLabel.fill = 'yellow';
  //pointsLabel.fontSize = 32
  //pointsLabel.setScale(2.0)
  //pointsLabel.filters=[glowFilter]


  
  
  //var paper_shreded = game.add.image('normal_paper_aaa')
 // paper_shreded.setScale(paper_scale,paper_scale)
  emitter = game.add.emitter(0, 0, 300);
  //emitter.makeParticles('normal_paper_aaa');
  //['normal_paper_aaa','normal_paper_aab']
  
  
  //emitter.makeParticles(paper_shreded);
  //emitter.setScale(1, 0.0015, 1, 0.0015,100)
  
  emitter.makeParticles(['normal_paper_aaa_25','normal_paper_aab_25']);
  emitter.setScale(1, paper_scale, 1, paper_scale,100)
  //emitter.setScale(1, 0.0015*paper_scale*0.5, 1, 0.0015*paper_scale*0.5,100)
  
  
  //emitter.blendMode = Phaser.blendModes.ADD
  //setScale(minX, maxX, minY, maxY, rate, ease, yoyo)
  //emitter.setScale(1, 0.25, 1, 0.25, 100)
  //emitter.setScale(0.0015, 0.0015, 1, 0.0015,100)
  
   //emitter.setScale(0.0000025, 0.0000025, 0.0000025, 0.0000025,100)
  emitter.setAlpha(0.25)
  emitter.gravity = 300;
  emitter.setYSpeed(-400,200);

  emitter2 = game.add.emitter(0, 0, 300);
  emitter2.makeParticles(game.cache.getBitmapData('bad'));
  //emitter2.blendMode = Phaser.blendModes.ADD
  emitter2.setScale(1, 0.25, 1, 0.25, 100)
  emitter2.gravity = 300;
  emitter2.setYSpeed(-400,200);


  //let fullscreen = this.add.image(w-60,h-60,game.cache.getBitmapData('bad')).setInteractive()
  //fullscreen.on('onclick',()=>{alert("hi"); window['game']['canvas'][game.device.fullscreen.request]();})
  //score = localStorage.getItem("score")||0;
  //score = (isNaN(score)||score<0)?0:score
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
    nextFire = game.time.now + parseInt((fireRate/2)*(1-funModifier)) +(fireRate*funModifier);
     if (Math.random()>0.2) {
      throwGoodObject();
    }
    let comboModx = (0.1*(comboMultiplier/10))<0.10?(0.1*(comboMultiplier/10)):0.1
    if(Math.random()<= 0.05+comboModx){
      //setTimeout(()=>throwGoodObject(),parseInt(Math.random()*1000))
    }
    if (Math.random()>0.7) {
      throwBadObject();
      if (Math.random()> (0.5+(0.5*funModifier))) {
        //throwBadObject();
      }
      if(Math.random()<= 0.1+comboModx){
        //throwBadObject();
      }
    }
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
  var obj = good_objects.getFirstDead();
  if(obj){
    
    obj.loadTexture('paperAtlas','paper')
    
    obj.reset(game.world.centerX + Math.random()*(w/4) -Math.random()*(w/4) , (h*9)/10);
    obj.anchor.setTo(0.5, 0.5);
    obj.scale.setTo(paper_scale, paper_scale);
    //obj.body.gravity.y = game.physics.arcade.gravity.y/10
    obj.body.allowGravity = true
    //obj.tint = Phaser.Color.hexToColor('#fcebc5')
    obj.body.angularAcceleration = Math.random()*100;
    //game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, (h*9)/10);
    let wMod = (Math.random()*(w/4) )-(Math.random()*(w/4))
    game.physics.arcade.moveToXY(obj, (w/2)+wMod,0, ((h*3)/5));
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
  
  for(part of parts){
  let obj = good_objects.getFirstDead();
  if(obj){
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
      obj.loadTexture('paperAtlas','paper_'+part)
    }else if(parentObj.frameName == 'paper_a' || parentObj.frameName == 'paper_b'){
      obj.loadTexture('paperAtlas',parentObj.frameName+part)
    }else{
      return
    }
    console.log(obj)
    obj.rotation =parentObj.rotation
    
    obj.scale.setTo(paper_scale, paper_scale);
    obj.body.allowGravity = true

    obj.body.angularAcceleration = parentObj.body.angularAcceleration
    //objB.body.angularAcceleration = -parentObj.body.angularAcceleration
    //obj.tintFill = true
    if(isSpecialEffect){
      let specialEffect = parseInt(1+Math.random()*2)
      //function showLabel(position,text,timeout,fillColor=specials_color,outline=specials_highlight_color,fontSizeScale=2){
      switch(specialEffect){
          case(1)://freeze blade
            showLabel(obj,'FREEZE')
            //playSound(freeze_blade_effect)
            obj.body.allowGravity = false
            obj.body.angularAcceleration = 1//Math.random()*100
            setTimeout(()=>{obj.body.allowGravity = true},2000)
            break
          case(2): //wind blade
            //playSound(wind_blade_effect)
            showLabel(obj,'WIND')
            let wMod = (Math.random()*(w/4))-(Math.random()*(w/4))
            let windForce = parentObj.y< (h*3/5)?parentObj.y:parentObj.y*3/5
            game.physics.arcade.moveToXY(obj, parentObj.x+wMod,0, windForce);
            break
          case(3): //time blade blade
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
  }
  }
}
function throwBadObject() {
  if(isMatrixTime || isSafe){
    return
  }
  var obj = bad_objects.getFirstDead();
  if(obj){
    obj.reset(game.world.centerX + Math.random()*(w/3) -Math.random()*(w/3) , ((h*2)/3) + parseInt(Math.random()*(h/3)));
    //obj.gravity = h*10;
    obj.anchor.setTo(0.5, 0.5);
    obj.body.angularAcceleration = Math.random()*100;
    let wMod = (Math.random()*(w/4) )-(Math.random()*(w/4))
    game.physics.arcade.moveToXY(obj, (w/2)+wMod,0, ((h*3)/5));
  }
}

function render() {
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
    scoreLabel.text = 'Score: ' + score + '\nHighest : ' + maxScore // + ' : ' +w+'/'+h// + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  }else{
    score=0
  }
  //scoreLabel.text = 'Score: ' + score + ' / Current Highest : ' + maxScore + ' Combo : ' + comboTimeout +"/"+game.time.now;
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

function update() {

if(isGameOver){
  return
}
  if(game.sound.context.state === 'suspended') {
    game.sound.context.resume();
  }

  
    blades_cartridge.forEach((b,i)=>{
      blades_cartridge[i].visible = false
  })
  current_blades = (current_blades<0)?0:current_blades
  blades_cartridge[current_blades].visible = true
  //comboTimeout = comboTimeout-1
  //comboTimeout = (comboTimeout>0)?comboTimeout-1:0

  throwObject();

  if(lastX == game.input.x && lastY == game.input.y){
    // points = [] ; //points.splice(points.length-1, points.length);
    //return
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
  slashes.beginFill(slash_color);
  slashes.lineStroke = 5;
  slashes.alpha = .3;
  slashes.moveTo(points[0].x, points[0].y);
  for (var i=1; i<points.length; i++) {
    slashes.lineTo(points[i].x, points[i].y);
  } 
  slashes.endFill();



  slashLength = getLength(points[0],points[points.length-1])

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
  
  if(isMatrixTime && fruit.parent == bad_objects){
    fruit.kill()
    return
  }
  if(!game.input.x || !game.input.y){
    return
  }
  var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
  var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
  l2.angle = 90; 

  if(Phaser.Line.intersects(line, l1, true) ||
     Phaser.Line.intersects(line, l2, true)) {
    //console.log("CUT")
    killFruit(fruit);
  }
  
}

function resetScore() {
  if(isGameOver){
    return
  }
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
  setTimeout(()=>{
    
    pointsLbl.destroy(true);
    background_dojo.forEach((d,index)=>{background_dojo[index].visible = false})
    background_dojo[parseInt(Math.random()*background_dojo.length)].visible = true
    isGameOver=false
    isMatrixTime = false
    score = 0;
    maxScore = 0;
    current_blades = 6;
    punishment = 1;
    scoreLabel.text = 'Score: ' + score + '\Highest : ' + maxScore
  },10000) 
  scoreLabel.text = 'Slash the papers!';

  //reseting 
  good_objects.forEachExists(killFruit);
  bad_objects.forEachExists(killFruit);
  

  // Retrieve
}



function killFruit(fruit) {
  scoreLevel = Math.floor( Math.sqrt((((score/10)*8)+1)/2)-0.5)+1|| 1
  scorePoints = scoreLevel
  let isCritical = false
  //let scorePoints = parseInt(score/100)+1
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
    //paper_cut.play()
    //sword_slash.play()
    punishment = (punishment<1)?0:punishment
    let magneticPull = (maxScore>score)?parseInt((maxScore-score)*0.01) + parseInt(0.05*(parseInt(scorePoints * (punishment+1)))):0
    scorePoints = ((scoreLevel+parseInt(slashLength)) * comboMultiplier)+magneticPull

    //console.log(fruit.scale.x,paper_scale)
    //setTimeout(()=>comboLbl.text ='',2000) 
    let critModifier = ((slashLength/44)*0.05)>0.05?0.05:((slashLength/44)*0.05)
    isCritical = (Math.random() <= (0.05+critModifier) && fruit.frameName == 'paper')
    if (isCritical){
     //console.log("critical")
      if(sword_slash.isPlaying){
        sword_slash.stop()
      }
      critical_hit.play()
      punishment = (punishment<1)?0:punishment
      scorePoints = parseInt(((scorePoints) * 3)+slashLength*5)  //+ (scorePoints*0.2 *(punishment+1)))
      let pointsLbl = game.add.text(fruit.x,fruit.y,"CRITICAL\n+"+scorePoints);
      pointsLbl.font=game_font
      //pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = critical_color;
      pointsLbl.fontSize = font_size_mod * 2.5 //32
      pointsLbl.alpha = 0.95
      pointsLbl.depth = 50
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
      pointsLbl2.depth = 50
      //pointsLbl.anchor.set(0.5);
      pointsLbl2.align = 'center';
      pointsLbl2.fontWeight = 'bold';
      pointsLbl2.stroke = critical_highlight_color;
      pointsLbl2.strokeThickness = 2;
      game.add.tween(pointsLbl2).to({ y: 10,x:10,alpha:0.25 }, 500, Phaser.Easing.Linear.None, true,500).onComplete.add(()=>{pointsLbl2.destroy(true)});
      //punishment -= 1
    }else{
      paper_cut()
       if(fruit.frameName != 'paper'){
        scorePoints = Math.ceil(scorePoints * 0.05 * (1-phase_rate))
      }
      //scorePoints = parseInt(scorePoints * (1-phase_rate))
      let pointsLbl = game.add.text(fruit.x,fruit.y,"+"+scorePoints);
      pointsLbl.font=game_font
      //pointsLbl.blendMode = Phaser.blendModes.ADD
      pointsLbl.fill = goodpoints_color;
      pointsLbl.fontSize = font_size_mod*2.5 //32
      pointsLbl.alpha = 0.95
      pointsLbl.depth = 10
      pointsLbl.fontWeight = 'bold';
      pointsLbl.stroke = goodpoints_highlight_color; //#90ee90
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
    if(fruit.frameName == 'paper' || fruit.frameName == 'paper_a'){
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
      let isSpecialEffect = (Math.random()<=0.25)
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

      sword_slash.stop()
      sword_phase.play()
      fruit.kill();
      return;
    }
    current_blades -= 1
    punishment = (punishment<1)?1:punishment
    sword_slash.stop()
    glass_break.play()
    scorePoints = 0//parseInt(scorePoints * 20 * (-1*(punishment+1)))
    punishment++
    comboTimeout = 0
    comboMultiplier =  1
    let pointsLbl = game.add.text(fruit.x,fruit.y,"~[BROKEN]~");
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
  } 
  fruit.kill();
  points = [];
  score += scorePoints;
  maxScore = Math.max(score,maxScore)
  localStorage.setItem("score", score);
  if(!isNaN(score)){
    scoreLabel.text = 'Score: ' + score + '\Highest : ' + maxScore // + ' : ' +w+'/'+h// + ' Combo : X' + comboMultiplier +" / "+comboTimeout;
  }
  if(isCritical){
    setTimeout(()=>throwGoodObject(),parseInt(Math.random()*2000))
    setTimeout(()=>throwGoodObject(),parseInt(Math.random()*2000))
    //good_objects.forEachExists(killFruit);
  }
  //score<=0 || 
  if (current_blades < 0){
    resetScore()
  }


}
