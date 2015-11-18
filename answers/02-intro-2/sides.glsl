void sideLengths(
  highp float hypotenuse, 
  highp float angleInDegrees, 
  out highp float opposite, 
  out highp float adjacent) {

  float angle = radians(angleInDegrees);
  opposite = hypotenuse * sin(angle);
  adjacent = hypotenuse * cos(angle);


  //TODO: Calculate side lengths here
  //opposite = hypotenuse*sin(radians(angleInDegress))
  //adjacent = hypotenuse*cos(radians(angleInDegress))
}

//Do not change this line
#pragma glslify: export(sideLengths)