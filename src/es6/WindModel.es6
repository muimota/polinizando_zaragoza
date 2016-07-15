//Class to handle all

class WindModel{
  //csv is text in csv format
  constructor(csv){
    var lines = csv.split('\n');
  	this.dates = lines[0].split(',');
    this.windDirections = lines[1].split(',');
    this.windSpeeds = lines[2].split(',');
  }

  //returns [windDir,windSpeed]
  getWind(date){

    let dateIndex = this.dates.indexOf(date);

    if(dateIndex == -1){
      return null
    }
    let windDirection = this.windDirections[dateIndex];
    let windSpeed     = this.windSpeeds[dateIndex];

    return [windDirection,windSpeed];

  }
}

export {WindModel};
