precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform mat4 inverseModel;
uniform mat4 inverseView;
uniform mat4 inverseProjection;

uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 lightDirection;

varying vec4 vColor;


void main() {
  gl_Position = projection*view*model*vec4(position, 1);

  vec4 inverseNormal = vec4(normal, 0)*inverseModel*inverseView;

 	float brightness = dot(normalize(inverseNormal.xyz), normalize(lightDirection));
	vec3 color = ambient + diffuse * max(brightness, 0.0);
	vColor = vec4(color, 1);
}


