//Class to handle load and access pollen info
import {PollenParticle} from './PollenManager.es6'

class PollenModel{

  //csv is text in csv format
  constructor(pollenCsv){

    this.initPollen(pollenCsv);
    this.dates;
    this.gemusNames;
    this.pollenDistribution; //total distribution
    this.pollenCount; //total number of particles
  
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

  getGenusName(genusId){
    return this.genusNames[genusId];
  }

//returns pollen count on a date.
//if ganusId is defined will just return pollenCount of that genus

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


export {PollenModel};
