

class PollenStation{

  constructor(x,y,container,field,color='yellow',particleCount = 200,ttl = 100){

    this.pos = new createjs.Point(x,y);
    this.field = field;
    this.container = container;
    this.particleCount = particleCount;
    this.particlePool = new Array();
    this.ttl = ttl;
    this.radius = 50;
    for(let i=0;i<particleCount;i++){
      let particle = new PollenParticle(color)
      particle.x = this.pos.x+Math.random()*this.radius-this.radius/2;
      particle.y = this.pos.y+Math.random()*this.radius-this.radius/2;
      particle.ttl = i%this.ttl;
      container.addChild(particle);
      this.particlePool.push(particle);
    }
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
        particle.x = this.pos.x+Math.random()*this.radius-this.radius/2;
        particle.y = this.pos.y+Math.random()*this.radius-this.radius/2;
        particle.ttl = this.ttl;
        particle.alpha = 0;

      }

    }
  }
}

class PollenParticle extends createjs.Shape{

  constructor(color = 'yellow' ,position = new createjs.Point(0,0)){
    super();
    this.graphics.beginFill(color);
    let radius = 2;
    this.graphics.drawRect(-radius, -radius
                          ,radius*2,radius*2);
    this.position = position;
    this.ttl;
  }
}

export {PollenStation};
