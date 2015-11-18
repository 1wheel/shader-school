precision mediump float;
#define CIRCLE_COLOR  =  vec4(1.0, 1.0, 1.0, 1.0)

void main() {

  //TODO: Replace this with a function that draws a checkerboard
  vec2 ptile = step(0.5, fract(0.5 * gl_FragCoord.xy / 16.0));
  if (ptile.x != ptile.y){
  	discard;  	
  }
  gl_FragColor = CIRCLE_COLOR;

}