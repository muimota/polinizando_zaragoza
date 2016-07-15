import {FluidField} from './FluidField.es6'
import {PollenStation} from './PollenStation.es6'
import {PollenModel} from './PollenModel.es6'

class FluidScene extends createjs.Container{

  constructor(width,height){

    super();

    this.width = width;
    this.height = height;
    //init vector field
    this.field = new FluidField(32,32,1024,1024);
    this.fieldShape = new createjs.Shape();
    this.addChild(this.fieldShape);

    //init data
    var data = document.getElementById('pollenData').textContent;
    this.pm = new PollenModel(data);
    console.log(this.pm.getGenusName(2));
    console.log(this.pm.getPollenCount('20160511'));


    this.stations = new  Array();
    let colors=['red','yellow','black','green','magenta','violet','acuablue'];
    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        if((i+j)% 2 == 0){
          this.stations.push(new PollenStation(128*i,128*j,this,this.field,colors[(i+j)%colors.length]))
        }
      }
    }


  }

  update(event){

    var delta = event.delta/1000;
    //this.field.setVelocity(16,0,1,1);
    this.setWind(45,5)
    this.field.update();
    this.drawField();
    for(let station of this.stations){
      station.update();
    }
  }

  setWind(angle,speed){

    let radian = angle*Math.PI/180;

    let windX = Math.cos(radian);
    let windY = Math.sin(radian);
    let i,j;

    if(angle<45 || angle > 225){
      i = this.field.width  - 1;
      j = this.field.height - 1;
    }else{
      i = j = 0;
    }
    this.field.setVelocity(i,j,windX,windY);


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
