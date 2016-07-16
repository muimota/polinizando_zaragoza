//Class to handle load and access pollen info
import {PollenParticle} from './PollenManager.es6'

class PollenModel{

  //csv is text in csv format
  constructor(pollenCsv,emittersCsv){

    this.initPollen(pollenCsv);
    this.emitters = [];
    this.initEmitters(emittersCsv);
    //[0[st0,st1],1:[st0,st2]]
    this.pollenDistribution; //total distribution
    this.pollenCount; //total number of particles
    this.pollenColors = ['red','yellow','black','green','magenta','violet','acuablue'];

  }

  //init emitters
  initEmitters(emittersCsv){

    var lines = emittersCsv.split('\n');
    //remove titles line
    let titleLine = lines.splice(0,1);
    //calculate number of genus based in the title line
    //all the elements minus x,y,radius
    let genusCount = titleLine[0].split(',').length-3;

    for(let i=0;i<genusCount;i++){
      this.emitters.push(new Array());
    }

    for(let line of lines){

      let chunks = line.split(',');

      if(chunks[0] == ''){
        continue;
      }

      let [x,y,radius] = chunks.splice(0,3);
      x = Number(x);
      y = Number(y);
      radius = Number(radius);

      let genusIds = [];
      for(let i = 0;i<chunks.length;i++){

        if(chunks[i]=='x'){
          genusIds.push(i);
        }
      }
      let emitter = new PollenEmitter(x,y,radius,genusIds);

      for(let genusId of genusIds){
        this.emitters[genusId].push(emitter);
      }

      //console.log(`${x} ${y}`);
      //console.log(genusIds);
    }
    //console.log(this.emitters);
  }

  //loads Pollen Data
  initPollen(pollenCsv){
    var lines = pollenCsv.split('\n');
    this.dates = lines[0].split(',');
    //erase first element
    this.dates.splice(0,1);
    //erase first lines
    lines.splice(0,1);
    this.genusNames = new Array();
    this.data = new Array();

    for(let line of lines){

      let chunks = line.split(',');

      this.genusNames.push(chunks.splice(0,1)[0]);
      for(let i=0;i<chunks.length;i++){
        chunks[i] = parseInt(chunks[i]);
      }
      this.data.push(chunks);
    }
  }

  setPollenDistribution(date){

    this.pollenDistribution = this.getPollenCount(date);
    this.pollenCount = 0;
    for(let pollenCount of this.pollenDistribution){
      this.pollenCount += pollenCount;
    }
    return this.pollenDistribution;
  }

  //returns a pollen particle based in the distribution

  getPollen(){
    //para sacar bien la distribución
    let typeIndex = Math.floor(Math.random()*this.pollenCount);
    let genusId,sum=0;

    for(genusId = 0;sum < typeIndex && genusId<this.pollenDistribution.length;genusId++){
      sum += this.pollenDistribution[genusId]
    }
    //random
    genusId = Math.floor(Math.random()*7);
    let color = this.pollenColors[genusId];
    let [posx,posy] = this.getPollenPosition(genusId);
    let pollenParticle = new PollenParticle(this.pollenColors[genusId]);
    pollenParticle.x = posx;
    pollenParticle.y = posy;

    return pollenParticle;
  }

  //pick pollen Particle based on genusId
  getPollenPosition(genusId){
    //console.log(genusId);

    let emitters = this.emitters[genusId];
    //se pilla random deberia afectar el tamaño de los parques
    let emitterIndex = Math.floor(Math.random()*emitters.length);
    let pollenPosition =  emitters[emitterIndex].getPollenPosition()
    pollenPosition[0] *= 2;
    pollenPosition[1] *= 2;
    return pollenPosition;
  }

  getGenusName(genusId){
    return this.genusNames[genusId];
  }

  getPollenCount(date,genusId = null){

    let dateIndex = this.dates.indexOf(date);

    if(dateIndex == -1){
      return null
    }
    if(genusId == null){
      var dateData = new Array();
      for(let genusData of this.data){
          dateData.push(genusData[dateIndex]);
      }
      return dateData
    }else{
      return this.data[genusId,date];
    }
  }
}

class PollenEmitter{

  constructor(x,y,radius,genusIds=[]){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.genusIds = genusIds;
  }
  getPollenPosition(){
    let angle  = Math.random()*Math.PI*2;
    let radius = Math.random()*this.radius;
    let x = this.x + Math.cos(angle)*radius;
    let y = this.y + Math.sin(angle)*radius;
    return [x,y];
  }

}

export {PollenModel};
