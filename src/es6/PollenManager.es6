import {PollenMask} from './PollenMask.es6'

const pollenColors = ['red','yellow','black','green','magenta','violet','acuablue'];

class PollenManager{

  constructor(container,field,particleModel,windModel,ttl = 100){

    this.field         = field;
    this.container     = container;
    this.particleModel = particleModel;
    this.windModel     = windModel;
    this.distribution  = new Array(); //previus distribution
    this.particlePool  = new Array();
    this.windAngle;
    this.windSpeed;
    this.ttl           = ttl;
    this.pollenMasks   = new Array();
    this.date;

    //deberia ir en parametros
    for(let genusId=0;genusId<this.particleModel.genusNames.length;genusId++){
        let pollenMask = new PollenMask(document.getElementById('genus'+genusId),1024,1024);
        this.pollenMasks.push(pollenMask);
        this.distribution.push(0);
        this.particlePool.push(new Array());
    }

  }

  clear(){

    this.container.removeAllChildren();
    this.particlePool = new Array();

  }

  setDate(date){
    this.date = date;
    let distribution = this.particleModel.getPollenCount(this.date);
    let wind = this.windModel.getWind(date);
    this.windAngle = wind[0];
    this.windSpeed = wind[1];
    this.setPollenDistribution(distribution);
  }

  setPollenDistribution(distribution){
    //marcar las particulas que sobran para que no se reciclen en update
    for(let genusId=0;genusId<distribution.length;genusId++){
      let difference = distribution[genusId] - this.distribution[genusId];
      let particlePool = this.particlePool[genusId];
      if(difference<0){
        for(let i=0;i<Math.abs(difference);i++){
          particlePool[i].alive=false;
        }
      }else{
        for(let i=0;i<difference;i++){

          let particle = new PollenParticle(genusId,this.ttl);
          let position = this.pollenMasks[genusId].getPollenPosition();

          particle.x = position[0];
          particle.y = position[1];
          particle.ttl = Math.round(Math.random()*this.ttl);

          particlePool.push(particle);
          this.container.addChild(particle);
        }
      }
    }
    this.distribution = distribution;
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

  update(){

    this.setWind(this.windAngle,this.windSpeed/400);
    this.field.update();

    var fieldWidth  = this.field.width;
    var fieldHeight = this.field.height;

    for(let genusId=0;genusId<this.distribution.length;genusId++){
      let particlePool = this.particlePool[genusId];

      for(let i = particlePool.length - 1 ; i>=0 ; i--){

        let particle = particlePool[i];
        let pos  = this.field.getFieldPosition(particle.x,particle.y);
        let velx = this.field.getXVelocity(pos[0],pos[1]);
        let vely = this.field.getYVelocity(pos[0],pos[1]);

        particle.x += velx*this.field.screenWidth/this.field.width;
        particle.y += vely*this.field.screenHeight/this.field.height;
        particle.ttl --;
        let tween = particle.ttl/this.ttl;
        if(tween>.9){
          tween = (1-tween)/.1*.9;
        }
        particle.alpha = tween;

        if(particle.ttl <= 0 || particle.x<0 || particle.x>this.container.width ||
          particle.y<0 || particle.y > this.container.height){

            if(particle.alive){
              //get the coordinates of another pollen particle
              let position = this.pollenMasks[particle.genusId].getPollenPosition();
              particle.ttl = 100;
              particle.x = position[0];
              particle.y = position[1];
            }else{
              particlePool.splice(i,1);
              this.container.removeChild(particle);
            }
        }
      }
    }

  }


}


class PollenParticle extends createjs.Shape{

  constructor(genusId,ttl){
    super();
    this.alive = true; //to know if the particle has to be removed from pool
    this.genusId = genusId;
    this.graphics.beginFill(pollenColors[this.genusId]);
    let radius = 3;
    this.graphics.drawRect(-radius, -radius
                          ,radius*2,radius*2);

    this.ttl = ttl;
  }
}

export {PollenManager,PollenParticle};
