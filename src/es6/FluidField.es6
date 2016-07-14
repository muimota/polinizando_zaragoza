class FluidField{

  constructor(width = 64,height=64,screenWidth=1024,screenHeight=1024,iterations = 10){

    this.iterations = iterations;
    this.visc = 0.5;
    this.dt = 0.025;
    this.dens;
    this.dens_prev;
    this.u;
    this.u_prev;
    this.v;
    this.v_prev;
    this.width;
    this.height;
    this.rowSize;
    this.size;

    this.screenWidth  = screenWidth;
    this.screenHeight = screenHeight;

    this.setResolution(width, height);
  }

  addFields(x, s, dt){

      for (var i=0; i<this.size ; i++ ) x[i] += dt*s[i];
  }

  set_bnd(b, x){
    /*
      if (b===1) {
          for (var i = 1; i <= this.width; i++) {
              x[i] =  x[i + this.rowSize];
              x[i + (height+1) *rowSize] = x[i + this.height * this.rowSize];
          }

          for (var j = 1; i <= this.height; i++) {
              x[j * this.rowSize] = -x[1 + j * this.rowSize];
              x[(width + 1) + j * this.rowSize] = -x[width + j * this.rowSize];
          }
      } else if (b === 2) {
          for (var i = 1; i <= this.width; i++) {
              x[i] = -x[i + this.rowSize];
              x[i + (height + 1) * this.rowSize] = -x[i + this.height * this.rowSize];
          }

          for (var j = 1; j <= this.height; j++) {
              x[j * this.rowSize] =  x[1 + j * this.rowSize];
              x[(width + 1) + j * this.rowSize] =  x[width + j * this.rowSize];
          }
      } else {
          for (var i = 1; i <= this.width; i++) {
              x[i] =  x[i + this.rowSize];
              x[i + (height + 1) * this.rowSize] = x[i + this.height * this.rowSize];
          }

          for (var j = 1; j <= this.height; j++) {
              x[j * this.rowSize] =  x[1 + j * this.rowSize];
              x[(width + 1) + j * this.rowSize] =  x[width + j * this.rowSize];
          }
      }
      var maxEdge = (height + 1) * this.rowSize;
      x[0]                 = 0.5 * (x[1] + x[rowSize]);
      x[maxEdge]           = 0.5 * (x[1 + maxEdge] + x[height * this.rowSize]);
      x[(width+1)]         = 0.5 * (x[width] + x[(width + 1) + this.rowSize]);
      x[(width+1)+maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + this.height * this.rowSize]);
  */}

  lin_solve(b, x, x0, a, c){

      if (a === 0 && c === 1) {
          for (var j=1 ; j<=this.height; j++) {
              var currentRow = j * this.rowSize;
              ++currentRow;
              for (var i = 0; i < this.width; i++) {
                  x[currentRow] = x0[currentRow];
                  ++currentRow;
              }
          }
          this.set_bnd(b, x);
      } else {
          var invC = 1 / c;
          for (var k=0 ; k<this.iterations; k++) {
              for (var j=1 ; j<=this.height; j++) {
                  var lastRow = (j - 1) * this.rowSize;
                  var currentRow = j * this.rowSize;
                  var nextRow = (j + 1) * this.rowSize;
                  var lastX = x[currentRow];
                  ++currentRow;
                  for (var i=1; i<=this.width; i++)
                      lastX = x[currentRow] = (x0[currentRow] + a*(lastX+x[++currentRow]+x[++lastRow]+x[++nextRow])) * invC;
              }
              this.set_bnd(b, x);
          }
      }
  }

  diffuse(b, x, x0, dt){
      var a = 0;
      this.lin_solve(b, x, x0, a, 1 + 4*a);
  }

  lin_solve2(x, x0, y, y0, a, c){

      if (a === 0 && c === 1) {
          for (var j=1 ; j <= this.height; j++) {
              var currentRow = j * this.rowSize;
              ++currentRow;
              for (var i = 0; i < this.width; i++) {
                  x[currentRow] = x0[currentRow];
                  y[currentRow] = y0[currentRow];
                  ++currentRow;
              }
          }
          this.set_bnd(1, x);
          this.set_bnd(2, y);
      } else {
          var invC = 1/c;
          for (var k=0 ; k<this.iterations; k++) {
              for (var j=1 ; j <= this.height; j++) {
                  var lastRow = (j - 1) * this.rowSize;
                  var currentRow = j * this.rowSize;
                  var nextRow = (j + 1) * this.rowSize;
                  var lastX = x[currentRow];
                  var lastY = y[currentRow];
                  ++currentRow;
                  for (var i = 1; i <= this.width; i++) {
                      lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
                      lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
                  }
              }
              this.set_bnd(1, x);
              this.set_bnd(2, y);
          }
      }
  }

  diffuse2(x, x0, y, y0, dt){
      var a = 0;
      this.lin_solve2(x, x0, y, y0, a, 1 + 4 * a);
  }

  advect(b, d, d0, u, v, dt){

      var Wdt0 = dt * this.width;
      var Hdt0 = dt * this.height;
      var Wp5 = this.width + 0.5;
      var Hp5 = this.height + 0.5;
      for (var j = 1; j<= this.height; j++) {
          var pos = j * this.rowSize;
          for (var i = 1; i <= this.width; i++) {
              var x = i - Wdt0 * u[++pos];
              var y = j - Hdt0 * v[pos];
              if (x < 0.5)
                  x = 0.5;
              else if (x > Wp5)
                  x = Wp5;
              var i0 = x | 0;
              var i1 = i0 + 1;
              if (y < 0.5)
                  y = 0.5;
              else if (y > Hp5)
                  y = Hp5;
              var j0 = y | 0;
              var j1 = j0 + 1;
              var s1 = x - i0;
              var s0 = 1 - s1;
              var t1 = y - j0;
              var t0 = 1 - t1;
              var row1 = j0 * this.rowSize;
              var row2 = j1 * this.rowSize;
              d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
          }
      }
      this.set_bnd(b, d);
  }

  project(u, v, p, div){

      var h = -0.5 / Math.sqrt(this.width * this.height);
      for (var j = 1 ; j <= this.height; j++ ) {
          var row = j * this.rowSize;
          var previousRow = (j - 1) * this.rowSize;
          var prevValue = row - 1;
          var currentRow = row;
          var nextValue = row + 1;
          var nextRow = (j + 1) * this.rowSize;
          for (var i = 1; i <= this.width; i++ ) {
              div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++previousRow]);
              p[currentRow] = 0;
          }
      }
      this.set_bnd(0, div);
      this.set_bnd(0, p);

      this.lin_solve(0, p, div, 1, 4 );
      var wScale = 0.5 * this.width;
      var hScale = 0.5 * this.height;
      for (var j = 1; j<= this.height; j++ ) {
          var prevPos = j * this.rowSize - 1;
          var currentPos = j * this.rowSize;
          var nextPos = j * this.rowSize + 1;
          var prevRow = (j - 1) * this.rowSize;
          var currentRow = j * this.rowSize;
          var nextRow = (j + 1) * this.rowSize;

          for (var i = 1; i<= this.width; i++) {
              u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
              v[currentPos]   -= hScale * (p[++nextRow] - p[++prevRow]);
          }
      }
      this.set_bnd(1, u);
      this.set_bnd(2, v);
  }

  dens_step(x, x0, u, v, dt){

      this.addFields(x, x0, dt);
      this.diffuse(0, x0, x, dt );
      this.advect(0, x, x0, u, v, dt );
  }

  vel_step(u, v, u0, v0, dt){

      this.addFields(u, u0, dt );
      this.addFields(v, v0, dt );
      var temp = u0; u0 = u; u = temp;
      var temp = v0; v0 = v; v = temp;
      this.diffuse2(u,u0,v,v0, dt);
      this.project(u, v, u0, v0);
      var temp = u0; u0 = u; u = temp;
      var temp = v0; v0 = v; v = temp;
      this.advect(1, u, u0, u0, v0, dt);
      this.advect(2, v, v0, u0, v0, dt);
      this.project(u, v, u0, v0 );
  }

  setDensity(x, y, d) {
    this.dens[(x + 1) + (y + 1) * this.rowSize] = d;
  }
  getDensity(x, y) {
    return this.dens[(x + 1) + (y + 1) * this.rowSize];
  }
  setVelocity(x, y, xv, yv) {
    this.u[(x + 1) + (y + 1) * this.rowSize] = xv;
    this.v[(x + 1) + (y + 1) * this.rowSize] = yv;
  }
  getFieldPosition(x,y){
    let sx = Math.round(x/this.screenWidth  * this.width);
    let sy = Math.round(y/this.screenHeight * this.height);
    return [sx,sy];
  }
  getXVelocity(x, y) {
    return this.u[(x + 1) + (y + 1) * this.rowSize];
  }
  getYVelocity(x, y) {
    return this.v[(x + 1) + (y + 1) * this.rowSize];
  }
  update() {
      this.vel_step(this.u, this.v, this.u_prev, this.v_prev, this.dt);
      //this.dens_step(this.dens, this.dens_prev, this.u, this.v, this.dt);
  }

  reset(){

    this.rowSize = this.width + 2;
    this.size = (this.width+2)*(this.height+2);
    this.dens = new Array(this.size);
    this.dens_prev = new Array(this.size);
    this.u = new Array(this.size);
    this.u_prev = new Array(this.size);
    this.v = new Array(this.size);
    this.v_prev = new Array(this.size);
    for (var i = 0; i < this.size; i++)
      this.dens_prev[i] = this.u_prev[i] = this.v_prev[i] = this.dens[i] = this.u[i] = this.v[i] = 0;
  }
  setResolution(hRes, wRes){

      var res = wRes * hRes;
      if (res > 0 && res < 1000000 && (wRes != this.width || hRes != this.height)) {
          this.width = wRes;
          this.height = hRes;
          this.reset();
          return true;
      }
      return false;
  }

}
export {FluidField};
