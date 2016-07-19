/**
 * Copyright (c) 2016 Martin Nadal (http://muimota.net)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
import {SceneManager} from './SceneManager.es6'
import {FluidScene} from './FluidScene.es6'

function init(){

  var canvas = document.getElementById("game");

  var canvasWidth  = canvas.getAttribute('width');
  var canvasHeight = canvas.getAttribute('height');

  var stage = new createjs.Stage('game');

  createjs.Ticker.setFPS(30);

  var scene1 = new FluidScene(canvas.width,canvas.height);
  var sm = new SceneManager(stage);

  sm.addScene('scene1',scene1);
  sm.gotoScene('scene1');
}


//export function to the global scope
window.init = init;
