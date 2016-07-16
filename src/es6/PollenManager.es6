
class PollenManager{

  constructor(container,field,particleModel,ttl = 100){

    this.field         = field;
    this.container     = container;
    this.particleModel = particleModel;
    this.particlePool  = new Array();
    this.ttl           = ttl;

  }

  clear(){

    this.container.removeAllChildren();
    this.particlePool = new Array();

  }

  populatePollen(pollenCount){

    for(let i=0;i<pollenCount;i++){
      let particle = this.particleModel.getPollen();
      particle.ttl = Math.random()*100;
      this.particlePool.push(particle);
      this.container.addChild(particle);
    }
    this.particleCount = pollenCount;

  }

  update(){

    var fieldWidth  = this.field.width;
    var fieldHeight = this.field.height;

    for(let i = 0;i<this.particleCount;i++){

      let particle = this.particlePool[i];
      let pos  = this.field.getFieldPosition(particle.x,particle.y);
      let velx = this.field.getXVelocity(pos[0],pos[1]);
      let vely = this.field.getYVelocity(pos[0],pos[1]);
      particle.x += velx*16;
      particle.y += vely*16;
      particle.ttl --;
      let life = particle.ttl/this.ttl;
      if(life>.7){
        life = (1-life)/.3*.7;
      }
      particle.alpha = life;
      if(particle.ttl <= 0 || particle.x<0 || particle.x>this.container.width ||
        particle.y<0 || particle.y > this.container.height){
        let p2 = this.particleModel.getPollen();
        particle.ttl = 100;
        particle.x = p2.x;
        particle.y = p2.y;
        //particle.ttl = this.ttl;
      }
    }
  }
}


class PollenParticle extends createjs.Shape{

  constructor(color = 'yellow' ,position = new createjs.Point(0,0)){
    super();
    this.graphics.beginFill(color);
    let radius = 3;
    this.graphics.drawRect(-radius, -radius
                          ,radius*2,radius*2);
    this.position = position;
    this.ttl = 100;
  }
}

export {PollenManager,PollenParticle};
