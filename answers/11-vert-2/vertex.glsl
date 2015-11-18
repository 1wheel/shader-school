precision highp float;

attribute vec4 position;
attribute vec3 color;

varying vec4 vColor;

void main() {
  gl_Position = position;
  if (position.y > .4){
  	vColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else if (position.x < .4){
  	vColor = vec4(0.0, 1.0, 0.0, 1.0); 	
  } else{
  	vColor = vec4(0.0, 0.0, 1.0, 1.0); 	
  }

}
