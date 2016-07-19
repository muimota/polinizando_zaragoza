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
 
//Class to handle load and access wind info

class WindModel{
  //csv is text in csv format
  constructor(csv){
    var lines = csv.split('\n');
  	this.dates = lines[0].split(',');
    this.windDirections = lines[1].split(',');
    this.windSpeeds = lines[2].split(',');

    for(let i=0;i<this.windDirections.length;i++){
      this.windDirections[i] = Number(this.windDirections[i]);
      this.windSpeeds[i] = Number(this.windSpeeds[i]);

    }
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
