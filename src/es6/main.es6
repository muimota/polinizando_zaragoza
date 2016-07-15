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
/*  var scene2 = new ParticleManager(canvas.width,canvas.height,200,'#EEE');
  var sceneNames = ['scene1','scene2'];
  var sceneIndex = 0;
*/
  var sm = new SceneManager(stage);

  sm.addScene('scene1',scene1);
//  sm.addScene('scene2',scene2);
  sm.gotoScene('scene1');
/*
  stage.on("click", function(evt) {
    sceneIndex = (sceneIndex + 1) % sceneNames.length;
    sm.gotoScene(sceneNames[sceneIndex]);
  });
*/
}


//export function to the global scope
window.init = init;
