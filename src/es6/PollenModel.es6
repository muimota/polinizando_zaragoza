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
