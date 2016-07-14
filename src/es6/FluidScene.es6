import {FluidField} from './FluidField.es6'

class FluidScene extends createjs.Container{

  constructor(width,height){

    super();

    this.width = width;
    this.height = height;
    this.field = new FluidField(32,32,1024,1024);
    this.fieldShape = new createjs.Shape();
    this.addChild(this.fieldShape);

    this.stations = new  Array();
    let colors=['red','yellow','black','green','magenta','violet','acuablue'];
    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        this.stations.push(new PolenStation(128*i,128*j,this,this.field,colors[(i+j)%colors.length]))
      }
    }
  }

  update(event){

    var delta = event.delta/1000;
    //this.field.setVelocity(16,0,0,.5);
    this.setWind(45,.5)
    this.field.update();
    this.drawField();
    for(let station of this.stations){
      station.update();
    }
  }

  setWind(angle,speed){

    let radian = angle*Math.PI/180;

    let windX = Math.cos(radian) * 0.1;
    let windY = Math.sin(radian) * 0.1;
    let i = Math.floor(Math.random()*this.field.width);
    let j = Math.floor(Math.random()*this.field.height);
    for(let i=0;i<20;i++){
      this.field.setVelocity(i,j,windX,windY);
    }

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

class Particle extends createjs.Shape{

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

class PolenStation{

  constructor(x,y,container,field,color='yellow',particleCount = 100,ttl = 100){

    this.pos = new createjs.Point(x,y);
    this.field = field;
    this.container = container;
    this.particleCount = particleCount;
    this.particlePool = new Array();
    this.ttl = ttl;
    this.radius = 128;
    for(let i=0;i<particleCount;i++){
      let particle = new Particle(color)
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

export {FluidScene};
