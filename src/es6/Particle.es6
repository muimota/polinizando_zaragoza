class Particle extends createjs.Shape{

  constructor(color = 'black',radius = 10 ,speed = new createjs.Point(0,0)){
    super();
    this.graphics.beginFill(color);
    this.radius = radius;
    this.graphics.drawRect(-this.radius, -this.radius
                          ,this.radius*2,this.radius*2);
    this.speed = speed;
    this.angularSpeed = Math.random() * 360 - 180;
  }
}

class ParticleManager extends createjs.Container{

  constructor(width,height,particlesCount = 100,backgroundColor='blue'){
    super();

    var background = new createjs.Shape();
    background.graphics.beginFill(backgroundColor);
    background.graphics.drawRect(0,0,width,height);
    this.addChild(background);

    this.area = new createjs.Rectangle(0,0,width,height);
    this.gravity = new createjs.Point(0,height/40);
    this.particles = [];

    //particle init

    for(var i=0;i<particlesCount;i++){

      var particle = new Particle('black',width / 50);

      particle.alpha = 0.05;

      this.particles.push(particle);

      particle.x = Math.random() * width;
      particle.y = Math.random() * height;

      var speedAngle = Math.random() * Math.PI * 2;
      var speedMagnitude = Math.random() * 10 + 30;
      var speedVector = new createjs.Point(Math.cos(speedAngle)*speedMagnitude,
                                           Math.sin(speedAngle)*speedMagnitude);

      particle.speed = speedVector;
      particle.angularSpeed = 360 * (1 * Math.random() -  .5);
      this.addChild(particle);
    }
    this.netShape = new createjs.Shape();
    this.addChild(this.netShape);
  }

  //sqdist
  getDistSq(x0,y0,x1,y1){
    var xdist = (x0 - x1);
    var ydist = (y0 - y1);
    return xdist * xdist + ydist * ydist;
  }
  //dibujar a los mas cercanos
  getCloseParticles(particle,otherParticles,minDistSq,startingIndex = 0){

    var closeParticles = new Map();

    for(var i=startingIndex;i<otherParticles.length;i++){

      var otherParticle = otherParticles[i]
      if(particle == otherParticle){
        continue;
      }

      var distSq = this.getDistSq( particle.x,particle.y,
                              otherParticle.x,otherParticle.y);
      if(distSq < minDistSq){
        closeParticles.set(otherParticle,distSq);
        if(closeParticles.size >= 4){
          break;
        }
      }
    }
    return closeParticles;
  }

  //dibujar a los mas cercanos
  getClosest(particle,otherParticles){

    var minDistSq = 9000000;
    var closestParticle = null;

    for(var otherParticle of otherParticles){

      if(particle == otherParticle){
        continue;
      }

      var distSq = this.getDistSq( particle.x,particle.y,
                              otherParticle.x,otherParticle.y);
      if(distSq < minDistSq){
        minDistSq = distSq;
        closestParticle = otherParticle;
      }

    }

    return closestParticle;

  }

  updateNetwork(){

    var g = this.netShape.graphics;
    g.clear();
    g.setStrokeStyle(this.area.width/2000);

    var lineCounter = 0;
    var maxDistSQ   = Math.pow(this.area.width/10,2);

    for(var i=0;i<this.particles.length;i++){

      var particle = this.particles[i];
      var closeParticles = this.getCloseParticles(particle,this.particles,maxDistSQ,i);

      for(var [closeParticle, distSq] of closeParticles){

        //line from particle to closestParticle
        var colorStr = 'rgba(0,0,0,'+ (1 - distSq / maxDistSQ)+')';
        g.beginStroke(colorStr);
        g.moveTo(particle.x,particle.y);
        g.lineTo(closeParticle.x,closeParticle.y);
        //g.endStroke();

        lineCounter ++;

      }
    }

  }

  update(event){

    var delta = event.delta/1000;

    for(var particle of this.particles){
      //if particle is outside the view
      if( (particle.x + particle.radius < 0 ||
        particle.x - particle.radius > this.area.width) ||
          (particle.y > this.area.height + particle.radius)){

        var speedAngle = Math.random() * 1 - 0.5 + Math.PI / 2;
        var speedMagnitude = Math.random() * this.area.height / 4 ;

        particle.speed.x = Math.cos(speedAngle)*speedMagnitude;
        particle.speed.y = Math.sin(speedAngle)*speedMagnitude;

        particle.y = this.area.height + particle.radius;
        particle.x = this.area.width * Math.random();


      }

      particle.rotation += particle.angularSpeed * delta ;

      particle.speed.x += this.gravity.x * delta;
      particle.speed.y -= this.gravity.y * delta;

      particle.x += particle.speed.x * delta;
      particle.y -= particle.speed.y * delta;

    }

    this.updateNetwork();

  }
}

class NetworkScene extends ParticleManager{
  update(event){

    var delta = event.delta/1000;

    for(var particle of this.particles){

      if(particle.x < 0){
        particle.x = this.area.width;
      }
      if(particle.x > this.area.width){
        particle.x = 0;
      }
      if(particle.y < 0){
        particle.y = this.area.height;
      }
      if(particle.y > this.area.height){
        particle.y = 0;
      }


      particle.rotation += particle.angularSpeed * delta;

      particle.x += particle.speed.x * delta;
      particle.y += particle.speed.y * delta;

    }

    this.updateNetwork();

  }

}

export {ParticleManager,NetworkScene};
