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

import {FluidField} from './FluidField.es6'
import {PollenManager,PollenParticle} from './PollenManager.es6'
import {PollenModel} from './PollenModel.es6'
import {WindModel} from './WindModel.es6'


class FluidScene extends createjs.Container{

  constructor(width,height){

    super();

    this.width = width;
    this.height = height;
    //init vector field
    this.field = new FluidField(32,32,1024,1024);
    //vector field
    this.fieldShape = new createjs.Shape();
    this.addChild(this.fieldShape);

    //init Wind data
    var windData = document.getElementById('windData').textContent;
    this.wm = new WindModel(windData);

    //init Pollen data
    var pollenData   = document.getElementById('pollenData').textContent;

    this.pm = new PollenModel(pollenData);

    //vector field
    let pollenContainer = new createjs.Container();
    this.addChild(pollenContainer);

    //pollen Manager
    this.pmgr = new PollenManager(pollenContainer,this.field,this.pm,this.wm);

    this.timeline = this.pm.dates;
    this.dateIndex = 0;
    this.timer = 0;

    this.setDate(this.timeline[this.dateIndex]);
  }

  update(event){

    this.timer += event.delta;
    if(this.timer > 5000){
      this.timer = 0;
      this.dateIndex  = (this.dateIndex + 1) % this.timeline.length;
      let date = this.timeline[this.dateIndex];
      this.setDate(date)
    }
    this.drawField();
    this.pmgr.update();
  }

  setDate(date){
    this.pmgr.setDate(date)
    let year  = date.substring(0,4);
    let month = date.substring(4,6);
    let day   = date.substring(6,8);
    document.getElementById("date").innerHTML = `${day}/${month}/${year}`;
  }
  setWind(angle,speed){

    angle = (angle + 270) % 360;

    let radian = angle*Math.PI/180;

    let windX = Math.cos(radian)*speed;
    let windY = Math.sin(radian)*speed;
    let fieldSize = this.field.width;

    for(let i=1;i<fieldSize-2;i++){
      this.field.setVelocity(i,0,windX,windY);
      this.field.setVelocity(i,fieldSize-1,windX,windY);
    }
    for(let j=0;j<fieldSize-1;j++){
      this.field.setVelocity(0,j,windX,windY);
      this.field.setVelocity(fieldSize-1,j,windX,windY);
    }

  }



  drawField(){
    var g = this.fieldShape.graphics;
    g.clear();
    for(let i=0;i<this.field.width;i++){
      for(let j=0;j<this.field.height;j++){
        let vector = new createjs.Point();
        let orig   = new createjs.Point();

        vector.x = this.field.getXVelocity(i,j)*64;
        vector.y = this.field.getYVelocity(i,j)*64;

        orig.x = this.width / this.field.width * i;
        orig.y = this.height / this.field.height * j;

        g.beginStroke('white');
        g.moveTo(orig.x,orig.y);
        g.lineTo(orig.x+vector.x,orig.y+vector.y);
      }
    }
  }
}

export {FluidScene};
