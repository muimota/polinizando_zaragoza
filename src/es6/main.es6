import {ParticleManager,NetworkScene} from './Particle.es6'
import {SceneManager} from './SceneManager.es6'
import {FluidScene} from './FluidScene.es6'

function init(){

  var canvas = document.getElementById("game");

  var canvasWidth  = canvas.getAttribute('width');
  var canvasHeight = canvas.getAttribute('height');

  //resizeCanvas(canvas,canvasWidth,canvasHeight);
  
  var stage = new createjs.Stage('game');

  createjs.Ticker.setFPS(30);

  var scene1 = new FluidScene(canvas.width,canvas.height);
  var scene2 = new ParticleManager(canvas.width,canvas.height,200,'#EEE');
  var sceneNames = ['scene1','scene2'];
  var sceneIndex = 0;

  var sm = new SceneManager(stage);
  sm.addScene('scene1',scene1);
  sm.addScene('scene2',scene2);
  sm.gotoScene(sceneNames[sceneIndex]);

  stage.on("click", function(evt) {
    sceneIndex = (sceneIndex + 1) % sceneNames.length;
    sm.gotoScene(sceneNames[sceneIndex]);
  });
/*
  window.addEventListener('resize', function(){
    resizeCanvas(canvas,300,300);
  });
  */
}

function resizeCanvas(canvas,maxWidth,maxHeight){

  let windowWidth  = window.innerWidth;
  let windowHeight = window.innerHeight;


  //apaisado
  if(windowWidth > windowHeight){
    let canvasHeight = windowHeight/windowWidth * maxWidth;
    canvas.setAttribute('width',maxWidth);
    canvas.setAttribute('height',canvasHeight);
  }else{
    let canvasWidth  = windowWidth/windowHeight * maxHeight;
    canvas.setAttribute('width',canvasWidth);
    canvas.setAttribute('height',maxHeight);
  }

  let canvasWidth  = canvas.getAttribute('width');
  let canvasHeight = canvas.getAttribute('height');

  let spanInfo = document.getElementById("canvasSize");
  spanInfo.innerHTML = "("+canvasWidth+"x"+canvasHeight+")";
}

//export function to the global scope
window.init = init;
