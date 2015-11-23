precision highp float;

uniform sampler2D prevState;
uniform vec2 stateSize;

float state(vec2 coord) {
  return texture2D(prevState, fract(coord / stateSize)).r;
}

void main() {
  float n = 0.0;
  vec2 c = gl_FragCoord.xy;

  for (float i = -1.0; i <= 1.0; i++)
  for (float j = -1.0; j <= 1.0; j++) {
    n += state(vec2(c.x + i, c.y + j));
  }

  float isOn = state(c);

  // float s = n > 3.1 ? 0.0 : n == 3.0 ? 1.0 : n == 2.0 && isOn == 1.0 ? 1.0 : 0.0;
  
	float s = n > 3.0 + isOn || n < 3.0 ? 0.0 : 1.0;
  gl_FragColor = vec4(s,s,s, 1.0);
}
