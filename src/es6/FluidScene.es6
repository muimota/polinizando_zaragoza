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

    //init Pollen data
    var pollenData   = document.getElementById('pollenData').textContent;
    var emittersData = document.getElementById('emittersData').textContent;

    this.pm = new PollenModel(pollenData,emittersData);
    //pollen Manager
    this.pmgr = new PollenManager(this,this.field,this.pm);
    this.pm.setPollenDistribution('20160511');
    this.pmgr.populatePollen(1000);

    //init Wind data
    var windData = document.getElementById('windData').textContent;
    this.wm = new WindModel(windData);
    console.log(this.wm.getWind('20160511'));

/*
    this.stations = new  Array();
    let colors=['red','yellow','black','green','magenta','violet','acuablue'];
    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        if((i+j)% 2 == 0){
          this.stations.push(new PollenStation(128*i,128*j,this,this.field,colors[(i+j)%colors.length]))
        }
      }
    }
*/

  }

  update(event){

    var delta = event.delta/1000;
    this.setWind(45,.5)
    this.field.update();
    this.drawField();
    /*
    for(let station of this.stations){
      station.update();
    }*/
    this.pmgr.update();
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


    /*
    this.field.setVelocity(fieldSize/2,2,windX,windY);
    this.field.setVelocity(fieldSize-2,fieldSize/2,windX,windY);
    this.field.setVelocity(fieldSize/2,fieldSize-2,windX,windY);
    this.field.setVelocity(2,fieldSize/2,windX,windY);
    */

  }

  drawField(){
    var g = this.fieldShape.graphics;
    g.clear();
    for(let i=0;i<this.field.width;i++){
      for(let j=0;j<this.field.height;j++){
        let vector = new createjs.Point();
        let orig   = new createjs.Point();

        vector.x = this.field.getXVelocity(i,j)*16;
        vector.y = this.field.getYVelocity(i,j)*16;

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
