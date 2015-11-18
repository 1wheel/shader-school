mat2 matrixPower(highp mat2 m1, int n) {
  
  //Raise the matrix m to nth power


  // For example:
  //
  //  matrixPower(m, 2) = m * m
  //
  mat2 rv = mat2(1.0);
  for(int i=0; i<=16; ++i) {
  	rv = rv*m1;
  	if (i > n - 2){ break; }
	}

  return rv;  
}

//Do not change this line or the name of the above function
#pragma glslify: export(matrixPower)