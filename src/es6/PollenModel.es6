class PollenModel{
  //csv is text in csv format
  constructor(csv){
    var lines = csv.split('\n');
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
      this.data.push(chunks);
    }
  }

  getGenusName(genusId){
    return this.genusNames[genusId];
  }

  //returns all pollen data ordered by genusNames
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
