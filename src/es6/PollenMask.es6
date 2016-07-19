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
//load an image and inexes all pixels so it can return
class PollenMask{
  constructor(img,screenWidth,screenHeight){
    //check if it is url or Image object

    //http://stackoverflow.com/a/1977898/2205297
    //check if it loaded
    this.img = img;
    this.ratiox = 1;
    this.ratioy = 1;


    if(screenWidth != undefined || screenHeight != undefined){
      this.ratiox = screenWidth  / this.img.width;
      this.ratioy = screenHeight / this.img.height;
    }


    this.xpositions = new Array();
    this.ypositions = new Array();

    this.analyze();
  }

  analyze(){
    //http://stackoverflow.com/a/8751659/2205297
    var canvas = document.createElement('canvas');
    var ctx    = canvas.getContext('2d')

    canvas.width  = this.img.width;
    canvas.height = this.img.height;

    ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
    for(let j=0;j<canvas.height;j++){
        let pixelData = ctx.getImageData(0,j, canvas.width, 1).data;
        for(let i=0;i<canvas.width;i++){
          let pixel = pixelData[i*4];
          if(pixel != 0){
            this.xpositions.push(i*this.ratiox);
            this.ypositions.push(j*this.ratioy);
          }
        }
    }
  }
  getPollenPosition(){
    let index = Math.floor(Math.random()*this.xpositions.length);
    return [this.xpositions[index],this.ypositions[index]];
  }
}
export {PollenMask};
