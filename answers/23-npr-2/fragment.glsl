precision mediump float;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform mat4 inverseModel;
uniform mat4 inverseView;
uniform mat4 inverseProjection;

uniform vec3 warm;
uniform vec3 cool;
uniform vec3 lightDirection;

varying vec3 fragNormal;


void main() {
  gl_FragColor = vec4(1,1,1,1);

  float lambertWeight = max(dot(normalize(fragNormal), normalize(lightDirection)), 0.0);
  vec3 lightColor = vec3(1,1,1) * lambertWeight;


  float goochWeight = 0.5 * (1.0 + dot(fragNormal, lightDirection));
  vec3 goochColor = (1.0 - goochWeight) * cool + goochWeight * warm;
  gl_FragColor = vec4(goochColor, 1);
}