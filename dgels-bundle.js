(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// VARIABLES //

var M = 7;


// MAIN //

/**
* Copies a vector x to a vector y.
*
* @private
* @param {PositiveInteger} N - number of indexed elements
* @param {Float64Array} x - input array
* @param {integer} strideX - `x` stride length
* @param {NonNegativeInteger} offsetX - starting `x` index
* @param {Float64Array} y - output array
* @param {integer} strideY - `y` stride length
* @param {NonNegativeInteger} offsetY - starting `y` index
* @returns {Float64Array} `y`
*/
function dcopy( N, x, strideX, offsetX, y, strideY, offsetY ) {
	var ix;
	var iy;
	var m;
	var i;

	if ( N <= 0 ) {
		return y;
	}
	ix = offsetX;
	iy = offsetY;

	// Use unrolled loops if both strides are equal to 1...
	if ( strideX === 1 && strideY === 1 ) {
		m = N % M;
		if ( m > 0 ) {
			for ( i = 0; i < m; i++ ) {
				y[ iy ] = x[ ix ];
				ix += 1;
				iy += 1;
			}
		}
		if ( N < M ) {
			return y;
		}
		for ( i = m; i < N; i += M ) {
			y[iy] = x[ix];
			y[iy+1] = x[ix+1];
			y[iy+2] = x[ix+2];
			y[iy+3] = x[ix+3];
			y[iy+4] = x[ix+4];
			y[iy+5] = x[ix+5];
			y[iy+6] = x[ix+6];
			ix += M;
			iy += M;
		}
		return y;
	}
	for ( i = 0; i < N; i++ ) {
		y[ iy ] = x[ ix ];
		ix += strideX;
		iy += strideY;
	}
	return y;
}


// EXPORTS //

module.exports = dcopy;

},{}],2:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params, max-statements */

'use strict';

// MAIN //

/**
* Performs one of the matrix-matrix operations:.
* C := alpha_op(A)_op(B) + beta*C
* where op(X) is one of X or X**T.
*
* @private
* @param {string} transa - specifies op(A): `'no-transpose'` or `'transpose'`
* @param {string} transb - `'no-transpose'` or `'transpose'`
* @param {NonNegativeInteger} M - number of rows of op(A) and C
* @param {NonNegativeInteger} N - number of columns of op(B) and C
* @param {NonNegativeInteger} K - number of columns of op(A) / rows of op(B)
* @param {number} alpha - scalar multiplier for op(A)*op(B)
* @param {Float64Array} A - first input matrix
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - index offset for A
* @param {Float64Array} B - second input matrix
* @param {integer} strideB1 - stride of the first dimension of B
* @param {integer} strideB2 - stride of the second dimension of B
* @param {NonNegativeInteger} offsetB - index offset for B
* @param {number} beta - scalar multiplier for C
* @param {Float64Array} C - input/output matrix
* @param {integer} strideC1 - stride of the first dimension of C
* @param {integer} strideC2 - stride of the second dimension of C
* @param {NonNegativeInteger} offsetC - index offset for C
* @returns {Float64Array} `C`
*/
function dgemm( transa, transb, M, N, K, alpha, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB, beta, C, strideC1, strideC2, offsetC ) {
	var nota;
	var notb;
	var temp;
	var sa1;
	var sa2;
	var sb1;
	var sb2;
	var sc1;
	var sc2;
	var ia;
	var ib;
	var ic;
	var i;
	var j;
	var l;

	nota = ( transa === 'no-transpose' );
	notb = ( transb === 'no-transpose' );

	if ( M === 0 || N === 0 || ( ( alpha === 0.0 || K === 0 ) && beta === 1.0 ) ) {
		return C;
	}

	sa1 = strideA1;
	sa2 = strideA2;
	sb1 = strideB1;
	sb2 = strideB2;
	sc1 = strideC1;
	sc2 = strideC2;

	// When alpha is zero, just scale C by beta
	if ( alpha === 0.0 ) {
		if ( beta === 0.0 ) {
			for ( j = 0; j < N; j++ ) {
				ic = offsetC + (j * sc2);
				for ( i = 0; i < M; i++ ) {
					C[ ic ] = 0.0;
					ic += sc1;
				}
			}
		} else {
			for ( j = 0; j < N; j++ ) {
				ic = offsetC + (j * sc2);
				for ( i = 0; i < M; i++ ) {
					C[ ic ] *= beta;
					ic += sc1;
				}
			}
		}
		return C;
	}

	// Start the operations
	if ( notb ) {
		if ( nota ) {
			// C := alpha*A*B + beta*C
			for ( j = 0; j < N; j++ ) {
				if ( beta === 0.0 ) {
					ic = offsetC + (j * sc2);
					for ( i = 0; i < M; i++ ) {
						C[ ic ] = 0.0;
						ic += sc1;
					}
				} else if ( beta !== 1.0 ) {
					ic = offsetC + (j * sc2);
					for ( i = 0; i < M; i++ ) {
						C[ ic ] *= beta;
						ic += sc1;
					}
				}
				for ( l = 0; l < K; l++ ) {
					temp = alpha * B[ offsetB + (l * sb1) + (j * sb2) ];
					ia = offsetA + (l * sa2);
					ic = offsetC + (j * sc2);
					for ( i = 0; i < M; i++ ) {
						C[ ic ] += temp * A[ ia ];
						ia += sa1;
						ic += sc1;
					}
				}
			}
		} else {
			// C := alpha*A^T*B + beta*C
			for ( j = 0; j < N; j++ ) {
				for ( i = 0; i < M; i++ ) {
					temp = 0.0;
					ia = offsetA + (i * sa2);
					ib = offsetB + (j * sb2);
					for ( l = 0; l < K; l++ ) {
						temp += A[ ia ] * B[ ib ];
						ia += sa1;
						ib += sb1;
					}
					ic = offsetC + (i * sc1) + (j * sc2);
					if ( beta === 0.0 ) {
						C[ ic ] = alpha * temp;
					} else {
						C[ ic ] = (alpha * temp) + (beta * C[ ic ]);
					}
				}
			}
		}
	} else if ( nota ) {
		// C := alpha*A*B^T + beta*C
		for ( j = 0; j < N; j++ ) {
			if ( beta === 0.0 ) {
				ic = offsetC + (j * sc2);
				for ( i = 0; i < M; i++ ) {
					C[ ic ] = 0.0;
					ic += sc1;
				}
			} else if ( beta !== 1.0 ) {
				ic = offsetC + (j * sc2);
				for ( i = 0; i < M; i++ ) {
					C[ ic ] *= beta;
					ic += sc1;
				}
			}
			for ( l = 0; l < K; l++ ) {
				temp = alpha * B[ offsetB + (j * sb1) + (l * sb2) ];
				ia = offsetA + (l * sa2);
				ic = offsetC + (j * sc2);
				for ( i = 0; i < M; i++ ) {
					C[ ic ] += temp * A[ ia ];
					ia += sa1;
					ic += sc1;
				}
			}
		}
	} else {
		// C := alpha*A^T*B^T + beta*C
		for ( j = 0; j < N; j++ ) {
			for ( i = 0; i < M; i++ ) {
				temp = 0.0;
				ia = offsetA + (i * sa2);
				ib = offsetB + (j * sb1);
				for ( l = 0; l < K; l++ ) {
					temp += A[ ia ] * B[ ib ];
					ia += sa1;
					ib += sb2;
				}
				ic = offsetC + (i * sc1) + (j * sc2);
				if ( beta === 0.0 ) {
					C[ ic ] = alpha * temp;
				} else {
					C[ ic ] = (alpha * temp) + (beta * C[ ic ]);
				}
			}
		}
	}
	return C;
}


// EXPORTS //

module.exports = dgemm;

},{}],3:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MAIN //

/**
* Performs one of the matrix-vector operations:.
* y := alpha_A_x + beta_y,   or   y := alpha_A^T_x + beta_y
*
* @private
* @param {string} trans - `'no-transpose'` or `'transpose'`
* @param {NonNegativeInteger} M - number of rows of A
* @param {NonNegativeInteger} N - number of columns of A
* @param {number} alpha - scalar multiplier for A*x
* @param {Float64Array} A - input matrix
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - index offset for A
* @param {Float64Array} x - input vector
* @param {integer} strideX - `x` stride length
* @param {NonNegativeInteger} offsetX - starting `x` index
* @param {number} beta - scalar multiplier for y
* @param {Float64Array} y - input/output vector
* @param {integer} strideY - `y` stride length
* @param {NonNegativeInteger} offsetY - starting `y` index
* @returns {Float64Array} `y`
*/
function dgemv( trans, M, N, alpha, A, strideA1, strideA2, offsetA, x, strideX, offsetX, beta, y, strideY, offsetY ) {
	var noTrans;
	var temp;
	var leny;
	var sa1;
	var sa2;
	var ia;
	var ix;
	var iy;
	var jx;
	var jy;
	var i;
	var j;

	noTrans = ( trans === 'no-transpose' );

	// Quick return if possible
	if ( M === 0 || N === 0 || ( alpha === 0.0 && beta === 1.0 ) ) {
		return y;
	}

	sa1 = strideA1;
	sa2 = strideA2;

	if ( noTrans ) {
		leny = M;
	} else {
		leny = N;
	}

	// First form y := beta*y
	if ( beta !== 1.0 ) {
		iy = offsetY;
		if ( beta === 0.0 ) {
			for ( i = 0; i < leny; i++ ) {
				y[ iy ] = 0.0;
				iy += strideY;
			}
		} else {
			for ( i = 0; i < leny; i++ ) {
				y[ iy ] *= beta;
				iy += strideY;
			}
		}
	}
	if ( alpha === 0.0 ) {
		return y;
	}

	if ( noTrans ) {
		// Form y := alpha*A*x + y
		jx = offsetX;
		for ( j = 0; j < N; j++ ) {
			temp = alpha * x[ jx ];
			iy = offsetY;
			ia = offsetA + (j * sa2);
			for ( i = 0; i < M; i++ ) {
				y[ iy ] += temp * A[ ia ];
				iy += strideY;
				ia += sa1;
			}
			jx += strideX;
		}
	} else {
		// Form y := alpha*A^T*x + y
		jy = offsetY;
		for ( j = 0; j < N; j++ ) {
			temp = 0.0;
			ix = offsetX;
			ia = offsetA + (j * sa2);
			for ( i = 0; i < M; i++ ) {
				temp += A[ ia ] * x[ ix ];
				ix += strideX;
				ia += sa1;
			}
			y[ jy ] += alpha * temp;
			jy += strideY;
		}
	}
	return y;
}


// EXPORTS //

module.exports = dgemv;

},{}],4:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MAIN //

/**
* Performs the rank 1 operation A := alpha_x_y**T + A.
*
* @private
* @param {NonNegativeInteger} M - number of rows of A
* @param {NonNegativeInteger} N - number of columns of A
* @param {number} alpha - scalar multiplier
* @param {Float64Array} x - first input vector
* @param {integer} strideX - stride for x
* @param {NonNegativeInteger} offsetX - starting index for x
* @param {Float64Array} y - second input vector
* @param {integer} strideY - stride for y
* @param {NonNegativeInteger} offsetY - starting index for y
* @param {Float64Array} A - input/output matrix
* @param {integer} strideA1 - stride of first dimension of A
* @param {integer} strideA2 - stride of second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @returns {Float64Array} A
*/
function dger( M, N, alpha, x, strideX, offsetX, y, strideY, offsetY, A, strideA1, strideA2, offsetA ) {
	var temp;
	var ix;
	var jy;
	var i;
	var j;

	if ( M === 0 || N === 0 || alpha === 0.0 ) {
		return A;
	}

	jy = offsetY;
	for ( j = 0; j < N; j++ ) {
		if ( y[ jy ] !== 0.0 ) {
			temp = alpha * y[ jy ];
			ix = offsetX;
			for ( i = 0; i < M; i++ ) {
				A[ offsetA + (i * strideA1) + (j * strideA2) ] += x[ ix ] * temp;
				ix += strideX;
			}
		}
		jy += strideY;
	}
	return A;
}


// EXPORTS //

module.exports = dger;

},{}],5:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

// Blue's scaling constants for IEEE 754 double precision:
var TSML = 1.4916681462400413e-154;  // 2^ceil((emin-1)/2) = 2^-511
var TBIG = 1.9979190722022350e+146;  // 2^floor((emax-digits+1)/2) = 2^486
var SSML = 4.4989137945431964e+161;  // 2^(-floor((emin-digits)/2)) = 2^537
var SBIG = 1.1113793747425387e-162;  // 2^(-ceil((emax+digits-1)/2)) = 2^-538


// MAIN //

/**
* Computes the Euclidean norm of a real double-precision vector.
*
* Uses the "blue" algorithm for overflow/underflow-safe computation.
*
* @private
* @param {NonNegativeInteger} N - number of indexed elements
* @param {Float64Array} x - input array
* @param {integer} stride - stride length
* @param {NonNegativeInteger} offset - starting index
* @returns {number} Euclidean norm
*/
function dnrm2( N, x, stride, offset ) {
	var notbig;
	var sumsq;
	var abig;
	var amed;
	var asml;
	var ymin;
	var ymax;
	var scl;
	var ax;
	var ix;
	var i;

	if ( N <= 0 ) {
		return 0.0;
	}

	scl = 1.0;
	sumsq = 0.0;
	notbig = true;
	asml = 0.0;
	amed = 0.0;
	abig = 0.0;

	ix = offset;
	for ( i = 0; i < N; i++ ) {
		ax = Math.abs( x[ ix ] );
		if ( ax > TBIG ) {
			abig += ( ax * SBIG ) * ( ax * SBIG );
			notbig = false;
		} else if ( ax < TSML ) {
			if ( notbig ) {
				asml += ( ax * SSML ) * ( ax * SSML );
			}
		} else {
			amed += ax * ax;
		}
		ix += stride;
	}

	// Combine the partial sums:
	if ( abig > 0.0 ) {
		if ( amed > 0.0 || amed !== amed ) {
			abig += ( amed * SBIG ) * SBIG;
		}
		scl = 1.0 / SBIG;
		sumsq = abig;
	} else if ( asml > 0.0 ) {
		if ( amed > 0.0 || amed !== amed ) {
			amed = Math.sqrt( amed );
			asml = Math.sqrt( asml ) / SSML;
			if ( asml > amed ) {
				ymin = amed;
				ymax = asml;
			} else {
				ymin = asml;
				ymax = amed;
			}
			scl = 1.0;
			sumsq = ymax * ymax * ( 1.0 + (( ymin / ymax ) * ( ymin / ymax )) );
		} else {
			scl = 1.0 / SSML;
			sumsq = asml;
		}
	} else {
		scl = 1.0;
		sumsq = amed;
	}
	return scl * Math.sqrt( sumsq );
}


// EXPORTS //

module.exports = dnrm2;

},{}],6:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var M = 5;


// MAIN //

/**
* Scales a vector by a constant.
*
* @private
* @param {PositiveInteger} N - number of indexed elements
* @param {number} da - scalar
* @param {Float64Array} x - input array
* @param {integer} strideX - `x` stride length
* @param {NonNegativeInteger} offsetX - starting `x` index
* @returns {Float64Array} input array
*/
function dscal( N, da, x, strideX, offsetX ) {
	var ix;
	var m;
	var i;

	if ( N <= 0 ) {
		return x;
	}
	ix = offsetX;

	// Use unrolled loops if stride is 1...
	if ( strideX === 1 ) {
		m = N % M;
		if ( m > 0 ) {
			for ( i = 0; i < m; i++ ) {
				x[ ix ] *= da;
				ix += 1;
			}
		}
		if ( N < M ) {
			return x;
		}
		for ( i = m; i < N; i += M ) {
			x[ix] *= da;
			x[ix+1] *= da;
			x[ix+2] *= da;
			x[ix+3] *= da;
			x[ix+4] *= da;
			ix += M;
		}
		return x;
	}
	for ( i = 0; i < N; i++ ) {
		x[ ix ] *= da;
		ix += strideX;
	}
	return x;
}


// EXPORTS //

module.exports = dscal;

},{}],7:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-depth, max-len, max-params, max-statements */

'use strict';

// MAIN //

/**
* Performs one of the matrix-matrix operations.
* B := alpha_op(A)_B,  or  B := alpha_B_op(A)
*
* where alpha is a scalar, B is an M-by-N matrix, A is a unit or
* non-unit, upper or lower triangular matrix, and op(A) is A or A**T.
*
* @private
* @param {string} side - `'left'` or `'right'`
* @param {string} uplo - `'upper'` or `'lower'`
* @param {string} transa - `'no-transpose'` or `'transpose'`
* @param {string} diag - `'unit'` or `'non-unit'`
* @param {NonNegativeInteger} M - number of rows of B
* @param {NonNegativeInteger} N - number of columns of B
* @param {number} alpha - scalar multiplier
* @param {Float64Array} A - triangular matrix
* @param {integer} strideA1 - stride of first dim of A
* @param {integer} strideA2 - stride of second dim of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} B - matrix, modified in-place
* @param {integer} strideB1 - stride of first dim of B
* @param {integer} strideB2 - stride of second dim of B
* @param {NonNegativeInteger} offsetB - starting index for B
* @returns {Float64Array} B
*/
function dtrmm( side, uplo, transa, diag, M, N, alpha, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB ) {
	var nounit;
	var lside;
	var upper;
	var temp;
	var sa1;
	var sa2;
	var sb1;
	var sb2;
	var ia;
	var ib;
	var i;
	var j;
	var k;

	if ( M === 0 || N === 0 ) {
		return B;
	}

	lside = ( side === 'left' );
	upper = ( uplo === 'upper' );
	nounit = ( diag === 'non-unit' );

	sa1 = strideA1;
	sa2 = strideA2;
	sb1 = strideB1;
	sb2 = strideB2;

	// When alpha is zero, set B to zero
	if ( alpha === 0.0 ) {
		for ( j = 0; j < N; j++ ) {
			ib = offsetB + (j * sb2);
			for ( i = 0; i < M; i++ ) {
				B[ ib ] = 0.0;
				ib += sb1;
			}
		}
		return B;
	}

	if ( lside ) {
		if ( transa === 'no-transpose' ) {
			// B := alpha*A*B
			if ( upper ) {
				for ( j = 0; j < N; j++ ) {
					for ( k = 0; k < M; k++ ) {
						ib = offsetB + (k * sb1) + (j * sb2);
						if ( B[ ib ] !== 0.0 ) {
							temp = alpha * B[ ib ];
							ia = offsetA + (k * sa2);
							for ( i = 0; i < k; i++ ) {
								B[ offsetB + (i * sb1) + (j * sb2) ] += temp * A[ ia ];
								ia += sa1;
							}
							if ( nounit ) {
								B[ ib ] = temp * A[ offsetA + (k * sa1) + (k * sa2) ];
							} else {
								B[ ib ] = temp;
							}
						}
					}
				}
			} else {
				// Lower
				for ( j = 0; j < N; j++ ) {
					for ( k = M - 1; k >= 0; k-- ) {
						ib = offsetB + (k * sb1) + (j * sb2);
						if ( B[ ib ] !== 0.0 ) {
							temp = alpha * B[ ib ];
							B[ ib ] = temp;
							if ( nounit ) {
								B[ ib ] = temp * A[ offsetA + (k * sa1) + (k * sa2) ];
							}
							ia = offsetA + (( k + 1 ) * sa1) + (k * sa2);
							for ( i = k + 1; i < M; i++ ) {
								B[ offsetB + (i * sb1) + (j * sb2) ] += temp * A[ ia ];
								ia += sa1;
							}
						}
					}
				}
			}
		} else if ( upper ) {
			// B := alpha*A**T*B, upper
			for ( j = 0; j < N; j++ ) {
				for ( i = M - 1; i >= 0; i-- ) {
					temp = B[ offsetB + (i * sb1) + (j * sb2) ];
					if ( nounit ) {
						temp *= A[ offsetA + (i * sa1) + (i * sa2) ];
					}
					ia = offsetA + (i * sa2);
					for ( k = 0; k < i; k++ ) {
						temp += A[ ia ] * B[ offsetB + (k * sb1) + (j * sb2) ];
						ia += sa1;
					}
					B[ offsetB + (i * sb1) + (j * sb2) ] = alpha * temp;
				}
			}
		} else {
			// B := alpha*A**T*B, lower
			for ( j = 0; j < N; j++ ) {
				for ( i = 0; i < M; i++ ) {
					temp = B[ offsetB + (i * sb1) + (j * sb2) ];
					if ( nounit ) {
						temp *= A[ offsetA + (i * sa1) + (i * sa2) ];
					}
					for ( k = i + 1; k < M; k++ ) {
						temp += A[ offsetA + (k * sa1) + (i * sa2) ] * B[ offsetB + (k * sb1) + (j * sb2) ];
					}
					B[ offsetB + (i * sb1) + (j * sb2) ] = alpha * temp;
				}
			}
		}
	} else if ( transa === 'no-transpose' ) {
		// Right side: B := alpha*B*A
		if ( upper ) {
			for ( j = N - 1; j >= 0; j-- ) {
				temp = alpha;
				if ( nounit ) {
					temp *= A[ offsetA + (j * sa1) + (j * sa2) ];
				}
				ib = offsetB + (j * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= temp;
					ib += sb1;
				}
				for ( k = 0; k < j; k++ ) {
					if ( A[ offsetA + (k * sa1) + (j * sa2) ] !== 0.0 ) {
						temp = alpha * A[ offsetA + (k * sa1) + (j * sa2) ];
						for ( i = 0; i < M; i++ ) {
							B[ offsetB + (i * sb1) + (j * sb2) ] += temp * B[ offsetB + (i * sb1) + (k * sb2) ];
						}
					}
				}
			}
		} else {
			// Lower
			for ( j = 0; j < N; j++ ) {
				temp = alpha;
				if ( nounit ) {
					temp *= A[ offsetA + (j * sa1) + (j * sa2) ];
				}
				ib = offsetB + (j * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= temp;
					ib += sb1;
				}
				for ( k = j + 1; k < N; k++ ) {
					if ( A[ offsetA + (k * sa1) + (j * sa2) ] !== 0.0 ) {
						temp = alpha * A[ offsetA + (k * sa1) + (j * sa2) ];
						for ( i = 0; i < M; i++ ) {
							B[ offsetB + (i * sb1) + (j * sb2) ] += temp * B[ offsetB + (i * sb1) + (k * sb2) ];
						}
					}
				}
			}
		}
	} else if ( upper ) {
		// B := alpha*B*A**T, upper
		for ( k = 0; k < N; k++ ) {
			for ( j = 0; j < k; j++ ) {
				if ( A[ offsetA + (j * sa1) + (k * sa2) ] !== 0.0 ) {
					temp = alpha * A[ offsetA + (j * sa1) + (k * sa2) ];
					for ( i = 0; i < M; i++ ) {
						B[ offsetB + (i * sb1) + (j * sb2) ] += temp * B[ offsetB + (i * sb1) + (k * sb2) ];
					}
				}
			}
			temp = alpha;
			if ( nounit ) {
				temp *= A[ offsetA + (k * sa1) + (k * sa2) ];
			}
			if ( temp !== 1.0 ) {
				ib = offsetB + (k * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= temp;
					ib += sb1;
				}
			}
		}
	} else {
		// B := alpha*B*A**T, lower
		for ( k = N - 1; k >= 0; k-- ) {
			for ( j = k + 1; j < N; j++ ) {
				if ( A[ offsetA + (j * sa1) + (k * sa2) ] !== 0.0 ) {
					temp = alpha * A[ offsetA + (j * sa1) + (k * sa2) ];
					for ( i = 0; i < M; i++ ) {
						B[ offsetB + (i * sb1) + (j * sb2) ] += temp * B[ offsetB + (i * sb1) + (k * sb2) ];
					}
				}
			}
			temp = alpha;
			if ( nounit ) {
				temp *= A[ offsetA + (k * sa1) + (k * sa2) ];
			}
			if ( temp !== 1.0 ) {
				ib = offsetB + (k * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= temp;
					ib += sb1;
				}
			}
		}
	}
	return B;
}


// EXPORTS //

module.exports = dtrmm;

},{}],8:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MAIN //

/**
* Performs one of the matrix-vector operations:.
* x := A_x,  or  x := A__T_x
* where x is an N element vector and A is an N by N unit or non-unit,
* upper or lower triangular matrix.
*
* @private
* @param {string} uplo - `'upper'` or `'lower'`
* @param {string} trans - `'no-transpose'` or `'transpose'`
* @param {string} diag - `'unit'` or `'non-unit'`
* @param {NonNegativeInteger} N - order of the matrix
* @param {Float64Array} A - triangular matrix
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} x - vector
* @param {integer} strideX - stride for x
* @param {NonNegativeInteger} offsetX - starting index for x
* @returns {Float64Array} `x`
*/
function dtrmv( uplo, trans, diag, N, A, strideA1, strideA2, offsetA, x, strideX, offsetX ) {
	var nounit;
	var temp;
	var sa1;
	var sa2;
	var ix;
	var jx;
	var ia;
	var i;
	var j;

	if ( N <= 0 ) {
		return x;
	}

	nounit = ( diag === 'non-unit' );
	sa1 = strideA1;
	sa2 = strideA2;

	if ( trans === 'no-transpose' ) {
		// Form x := A*x
		if ( uplo === 'upper' ) {
			// Upper triangular
			jx = offsetX;
			for ( j = 0; j < N; j++ ) {
				if ( x[ jx ] !== 0.0 ) {
					temp = x[ jx ];
					ix = offsetX;
					ia = offsetA + (j * sa2);
					for ( i = 0; i < j; i++ ) {
						x[ ix ] += temp * A[ ia ];
						ix += strideX;
						ia += sa1;
					}
					if ( nounit ) {
						x[ jx ] *= A[ offsetA + (j * sa1) + (j * sa2) ];
					}
				}
				jx += strideX;
			}
		} else {
			// Lower triangular
			jx = offsetX + (( N - 1 ) * strideX);
			for ( j = N - 1; j >= 0; j-- ) {
				if ( x[ jx ] !== 0.0 ) {
					temp = x[ jx ];
					ix = offsetX + (( N - 1 ) * strideX);
					ia = offsetA + (( N - 1 ) * sa1) + (j * sa2);
					for ( i = N - 1; i > j; i-- ) {
						x[ ix ] += temp * A[ ia ];
						ix -= strideX;
						ia -= sa1;
					}
					if ( nounit ) {
						x[ jx ] *= A[ offsetA + (j * sa1) + (j * sa2) ];
					}
				}
				jx -= strideX;
			}
		}
	} else if ( uplo === 'upper' ) {
		// Form x := A**T*x, upper triangular, transpose
		jx = offsetX + (( N - 1 ) * strideX);
		for ( j = N - 1; j >= 0; j-- ) {
			temp = x[ jx ];
			if ( nounit ) {
				temp *= A[ offsetA + (j * sa1) + (j * sa2) ];
			}
			ix = offsetX + (( j - 1 ) * strideX);
			ia = offsetA + (( j - 1 ) * sa1) + (j * sa2);
			for ( i = j - 1; i >= 0; i-- ) {
				temp += A[ ia ] * x[ ix ];
				ix -= strideX;
				ia -= sa1;
			}
			x[ jx ] = temp;
			jx -= strideX;
		}
	} else {
		// Form x := A**T*x, lower triangular, transpose
		jx = offsetX;
		for ( j = 0; j < N; j++ ) {
			temp = x[ jx ];
			if ( nounit ) {
				temp *= A[ offsetA + (j * sa1) + (j * sa2) ];
			}
			ix = offsetX + (( j + 1 ) * strideX);
			ia = offsetA + (( j + 1 ) * sa1) + (j * sa2);
			for ( i = j + 1; i < N; i++ ) {
				temp += A[ ia ] * x[ ix ];
				ix += strideX;
				ia += sa1;
			}
			x[ jx ] = temp;
			jx += strideX;
		}
	}
	return x;
}


// EXPORTS //

module.exports = dtrmv;

},{}],9:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-depth, max-len, max-lines-per-function, max-params, max-statements */

'use strict';

// MAIN //

/**
* Solves one of the matrix equations:.
* op(A)_X = alpha_B,  or  X_op(A) = alpha_B
* where alpha is a scalar, X and B are M-by-N matrices, A is a unit or
* non-unit, upper or lower triangular matrix, and op(A) is A or A**T.
* The matrix X is overwritten on B.
*
* @private
* @param {string} side - `'left'` or `'right'`
* @param {string} uplo - `'upper'` or `'lower'` (upper or lower triangular)
* @param {string} transa - `'no-transpose'` or `'transpose'`
* @param {string} diag - `'unit'` or `'non-unit'`
* @param {NonNegativeInteger} M - number of rows of B
* @param {NonNegativeInteger} N - number of columns of B
* @param {number} alpha - scalar multiplier for B
* @param {Float64Array} A - triangular matrix
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - index offset for A
* @param {Float64Array} B - input/output matrix (overwritten with X)
* @param {integer} strideB1 - stride of the first dimension of B
* @param {integer} strideB2 - stride of the second dimension of B
* @param {NonNegativeInteger} offsetB - index offset for B
* @returns {Float64Array} `B`
*/
function dtrsm( side, uplo, transa, diag, M, N, alpha, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB ) {
	var nounit;
	var lside;
	var upper;
	var temp;
	var sa1;
	var sa2;
	var sb1;
	var sb2;
	var ia;
	var ib;
	var i;
	var j;
	var k;

	lside = ( side === 'left' );
	nounit = ( diag === 'non-unit' );
	upper = ( uplo === 'upper' );

	if ( M === 0 || N === 0 ) {
		return B;
	}

	sa1 = strideA1;
	sa2 = strideA2;
	sb1 = strideB1;
	sb2 = strideB2;

	// When alpha is zero, set B to zero
	if ( alpha === 0.0 ) {
		for ( j = 0; j < N; j++ ) {
			ib = offsetB + (j * sb2);
			for ( i = 0; i < M; i++ ) {
				B[ ib ] = 0.0;
				ib += sb1;
			}
		}
		return B;
	}

	if ( lside ) {
		if ( transa === 'no-transpose' ) {
			// Solve A*X = alpha*B
			if ( upper ) {
				// Left, Upper, No-transpose
				for ( j = 0; j < N; j++ ) {
					if ( alpha !== 1.0 ) {
						ib = offsetB + (j * sb2);
						for ( i = 0; i < M; i++ ) {
							B[ ib ] *= alpha;
							ib += sb1;
						}
					}
					for ( k = M - 1; k >= 0; k-- ) {
						ib = offsetB + (k * sb1) + (j * sb2);
						if ( B[ ib ] !== 0.0 ) {
							if ( nounit ) {
								B[ ib ] /= A[ offsetA + (k * sa1) + (k * sa2) ];
							}
							ia = offsetA + (k * sa2);
							for ( i = 0; i < k; i++ ) {
								B[ offsetB + (i * sb1) + (j * sb2) ] -= B[ ib ] * A[ ia ];
								ia += sa1;
							}
						}
					}
				}
			} else {
				// Left, Lower, No-transpose
				for ( j = 0; j < N; j++ ) {
					if ( alpha !== 1.0 ) {
						ib = offsetB + (j * sb2);
						for ( i = 0; i < M; i++ ) {
							B[ ib ] *= alpha;
							ib += sb1;
						}
					}
					for ( k = 0; k < M; k++ ) {
						ib = offsetB + (k * sb1) + (j * sb2);
						if ( B[ ib ] !== 0.0 ) {
							if ( nounit ) {
								B[ ib ] /= A[ offsetA + (k * sa1) + (k * sa2) ];
							}
							for ( i = k + 1; i < M; i++ ) {
								B[ offsetB + (i * sb1) + (j * sb2) ] -= B[ ib ] * A[ offsetA + (i * sa1) + (k * sa2) ];
							}
						}
					}
				}
			}
		} else if ( upper ) {
			// Solve A^T*X = alpha*B, Left, Upper, Transpose
			for ( j = 0; j < N; j++ ) {
				for ( i = 0; i < M; i++ ) {
					temp = alpha * B[ offsetB + (i * sb1) + (j * sb2) ];
					ia = offsetA + (i * sa2);
					for ( k = 0; k < i; k++ ) {
						temp -= A[ ia ] * B[ offsetB + (k * sb1) + (j * sb2) ];
						ia += sa1;
					}
					if ( nounit ) {
						temp /= A[ offsetA + (i * sa1) + (i * sa2) ];
					}
					B[ offsetB + (i * sb1) + (j * sb2) ] = temp;
				}
			}
		} else {
			// Solve A^T*X = alpha*B, Left, Lower, Transpose
			for ( j = 0; j < N; j++ ) {
				for ( i = M - 1; i >= 0; i-- ) {
					temp = alpha * B[ offsetB + (i * sb1) + (j * sb2) ];
					for ( k = i + 1; k < M; k++ ) {
						temp -= A[ offsetA + (k * sa1) + (i * sa2) ] * B[ offsetB + (k * sb1) + (j * sb2) ];
					}
					if ( nounit ) {
						temp /= A[ offsetA + (i * sa1) + (i * sa2) ];
					}
					B[ offsetB + (i * sb1) + (j * sb2) ] = temp;
				}
			}
		}
	} else if ( transa === 'no-transpose' ) {
		// Solve X*A = alpha*B
		if ( upper ) {
			// Right, Upper, No-transpose
			for ( j = 0; j < N; j++ ) {
				if ( alpha !== 1.0 ) {
					ib = offsetB + (j * sb2);
					for ( i = 0; i < M; i++ ) {
						B[ ib ] *= alpha;
						ib += sb1;
					}
				}
				for ( k = 0; k < j; k++ ) {
					if ( A[ offsetA + (k * sa1) + (j * sa2) ] !== 0.0 ) {
						for ( i = 0; i < M; i++ ) {
							B[ offsetB + (i * sb1) + (j * sb2) ] -= A[ offsetA + (k * sa1) + (j * sa2) ] * B[ offsetB + (i * sb1) + (k * sb2) ];
						}
					}
				}
				if ( nounit ) {
					temp = 1.0 / A[ offsetA + (j * sa1) + (j * sa2) ];
					ib = offsetB + (j * sb2);
					for ( i = 0; i < M; i++ ) {
						B[ ib ] *= temp;
						ib += sb1;
					}
				}
			}
		} else {
			// Right, Lower, No-transpose
			for ( j = N - 1; j >= 0; j-- ) {
				if ( alpha !== 1.0 ) {
					ib = offsetB + (j * sb2);
					for ( i = 0; i < M; i++ ) {
						B[ ib ] *= alpha;
						ib += sb1;
					}
				}
				for ( k = j + 1; k < N; k++ ) {
					if ( A[ offsetA + (k * sa1) + (j * sa2) ] !== 0.0 ) {
						for ( i = 0; i < M; i++ ) {
							B[ offsetB + (i * sb1) + (j * sb2) ] -= A[ offsetA + (k * sa1) + (j * sa2) ] * B[ offsetB + (i * sb1) + (k * sb2) ];
						}
					}
				}
				if ( nounit ) {
					temp = 1.0 / A[ offsetA + (j * sa1) + (j * sa2) ];
					ib = offsetB + (j * sb2);
					for ( i = 0; i < M; i++ ) {
						B[ ib ] *= temp;
						ib += sb1;
					}
				}
			}
		}
	} else if ( upper ) {
		// Solve X*A^T = alpha*B, Right, Upper, Transpose
		for ( k = N - 1; k >= 0; k-- ) {
			if ( nounit ) {
				temp = 1.0 / A[ offsetA + (k * sa1) + (k * sa2) ];
				ib = offsetB + (k * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= temp;
					ib += sb1;
				}
			}
			for ( j = 0; j < k; j++ ) {
				if ( A[ offsetA + (j * sa1) + (k * sa2) ] !== 0.0 ) {
					temp = A[ offsetA + (j * sa1) + (k * sa2) ];
					for ( i = 0; i < M; i++ ) {
						B[ offsetB + (i * sb1) + (j * sb2) ] -= temp * B[ offsetB + (i * sb1) + (k * sb2) ];
					}
				}
			}
			if ( alpha !== 1.0 ) {
				ib = offsetB + (k * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= alpha;
					ib += sb1;
				}
			}
		}
	} else {
		// Solve X*A^T = alpha*B, Right, Lower, Transpose
		for ( k = 0; k < N; k++ ) {
			if ( nounit ) {
				temp = 1.0 / A[ offsetA + (k * sa1) + (k * sa2) ];
				ib = offsetB + (k * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= temp;
					ib += sb1;
				}
			}
			for ( j = k + 1; j < N; j++ ) {
				if ( A[ offsetA + (j * sa1) + (k * sa2) ] !== 0.0 ) {
					temp = A[ offsetA + (j * sa1) + (k * sa2) ];
					for ( i = 0; i < M; i++ ) {
						B[ offsetB + (i * sb1) + (j * sb2) ] -= temp * B[ offsetB + (i * sb1) + (k * sb2) ];
					}
				}
			}
			if ( alpha !== 1.0 ) {
				ib = offsetB + (k * sb2);
				for ( i = 0; i < M; i++ ) {
					B[ ib ] *= alpha;
					ib += sb1;
				}
			}
		}
	}
	return B;
}


// EXPORTS //

module.exports = dtrsm;

},{}],10:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params, no-var */

'use strict';

// MODULES //

var dlarfg = require( '../../dlarfg/lib/base.js' );
var dlarf = require( '../../dlarf/lib/base.js' );


// MAIN //

/**
* Computes an LQ factorization of a real M-by-N matrix A = L * Q.
* using Householder reflections (unblocked algorithm).
*
* On exit, the elements on and below the diagonal of A contain the
* M-by-min(M,N) lower trapezoidal matrix L; the elements above the
* diagonal, with the array TAU, represent the orthogonal matrix Q as
* a product of elementary reflectors.
*
* @private
* @param {NonNegativeInteger} M - number of rows in A
* @param {NonNegativeInteger} N - number of columns in A
* @param {Float64Array} A - input/output matrix (column-major)
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - output array of scalar factors (length min(M,N))
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} WORK - workspace array (length >= M)
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dgelq2( M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK ) {
	var save;
	var aii;
	var K;
	var i;

	K = Math.min( M, N );

	for ( i = 0; i < K; i++ ) {
		// Index of A(i,i) in the flat array
		aii = offsetA + (i * strideA1) + (i * strideA2);

		// Generate elementary reflector H(i) to annihilate A(i, i+1:N-1)

		// dlarfg( N-i, alpha(array,offset), x, strideX, offsetX, tau, offsetTau )

		// Alpha = A(i,i), x = A(i, min(i+1, N-1)), stride along columns = strideA2
		dlarfg(N - i, A, aii, A, strideA2, offsetA + (i * strideA1) + (Math.min( i + 1, N - 1 ) * strideA2), TAU, offsetTAU + (i * strideTAU));

		if ( i < M - 1 ) {
			// Save A(i,i) and set it to 1 for the reflector application
			save = A[ aii ];
			A[ aii ] = 1.0;

			// Apply H(i) to A(i+1:M-1, i:N-1) from the right

			// dlarf( side, M, N, v, strideV, offsetV, tau, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK )
			dlarf('right', M - i - 1,          // number of rows of sub-matrix
				N - i,              // number of columns of sub-matrix
				A, strideA2, aii,   // v = row i from col i onward, stride along columns
				TAU[ offsetTAU + (i * strideTAU) ], // tau is a plain scalar for dlarf
				A, strideA1, strideA2, offsetA + (( i + 1 ) * strideA1) + (i * strideA2), // C = A(i+1, i)
				WORK, strideWORK, offsetWORK);

			// Restore A(i,i)
			A[ aii ] = save;
		}
	}
	return 0;
}


// EXPORTS //

module.exports = dgelq2;

},{"../../dlarf/lib/base.js":22,"../../dlarfg/lib/base.js":24}],11:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var Float64Array = require( '@stdlib/array/float64' );
var dgelq2 = require( '../../dgelq2/lib/base.js' );
var dlarfb = require( '../../dlarfb/lib/base.js' );
var dlarft = require( '../../dlarft/lib/base.js' );


// VARIABLES //

var DEFAULT_NB = 32;


// MAIN //

/**
* Computes an LQ factorization of a real M-by-N matrix A = L * Q.
* using blocked Householder reflections.
*
* On exit, the elements on and below the diagonal of A contain the
* M-by-min(M,N) lower trapezoidal matrix L; the elements above the
* diagonal, with the array TAU, represent the orthogonal matrix Q as
* a product of elementary reflectors.
*
* @private
* @param {NonNegativeInteger} M - number of rows in A
* @param {NonNegativeInteger} N - number of columns in A
* @param {Float64Array} A - input/output matrix (column-major)
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - output array of scalar factors (length min(M,N))
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} WORK - workspace array
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dgelqf( M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK ) {
	var ldwork;
	var nbmin;
	var iws;
	var ib;
	var nb;
	var nx;
	var T;
	var K;
	var i;

	K = Math.min( M, N );

	// Quick return if possible
	if ( K === 0 ) {
		return 0;
	}

	nb = DEFAULT_NB;
	nbmin = 2;
	nx = 0;
	iws = M;

	if ( nb > 1 && nb < K ) {
		// Determine crossover point NX (below which unblocked is faster)
		nx = 0;
		if ( nx < K ) {
			ldwork = M;
			iws = ldwork * nb;
		}
	}

	// Allocate the T matrix for block reflectors (NB x NB)
	T = new Float64Array( nb * nb );

	ldwork = M;

	if ( nb >= nbmin && nb < K && nx < K ) {
		// Use blocked code
		i = 0;
		while ( i <= K - 1 - nx ) {
			ib = Math.min( K - i, nb );

			// Compute the LQ factorization of the current panel A(i:i+ib-1, i:N-1)
			dgelq2(ib, N - i, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), WORK, strideWORK, offsetWORK);

			if ( i + ib < M ) {
				// Form the triangular factor of the block reflector
				// H = H(i) H(i+1) ... H(i+ib-1)
				dlarft('forward', 'rowwise', N - i, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), T, 1, nb, 0);

				// Apply H to A(i+ib:M-1, i:N-1) from the right
				dlarfb('right', 'no-transpose', 'forward', 'rowwise', M - i - ib, N - i, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), T, 1, nb, 0, A, strideA1, strideA2, offsetA + (( i + ib ) * strideA1) + (i * strideA2), WORK, 1, ldwork, offsetWORK);
			}
			i += nb;
		}
	} else {
		i = 0;
	}

	// Use unblocked code to factor the last or only block
	if ( i <= K - 1 ) {
		dgelq2(M - i, N - i, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), WORK, strideWORK, offsetWORK);
	}

	return 0;
}


// EXPORTS //

module.exports = dgelqf;

},{"../../dgelq2/lib/base.js":10,"../../dlarfb/lib/base.js":23,"../../dlarft/lib/base.js":25,"@stdlib/array/float64":72}],12:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var Float64Array = require( '@stdlib/array/float64' );
var dgeqrf = require( '../../dgeqrf/lib/base.js' );
var dgelqf = require( '../../dgelqf/lib/base.js' );
var dormqr = require( '../../dormqr/lib/base.js' );
var dormlq = require( '../../dormlq/lib/base.js' );
var dlange = require( '../../dlange/lib/base.js' );
var dlascl = require( '../../dlascl/lib/base.js' );
var dlaset = require( '../../dlaset/lib/base.js' );
var dlamch = require( '../../dlamch/lib/base.js' );
var dtrtrs = require( '../../dtrtrs/lib/base.js' );


// VARIABLES //

var NB = 32; // Hardcoded block size (replaces ILAENV queries)


// MAIN //

/**
* Solves overdetermined or underdetermined real linear systems involving an.
* M-by-N matrix A, or its transpose, using a QR or LQ factorization of A.
*
* It is assumed that A has full rank.
*
* The following options are provided:
*
* 1.  If TRANS = 'N' and M >= N: find the least squares solution of an
*     overdetermined system, i.e., solve the least squares problem:
*     minimize || B - A*X ||
*
* 2.  If TRANS = 'N' and M < N: find the minimum norm solution of an
*     underdetermined system A * X = B.
*
* 3.  If TRANS = 'T' and M >= N: find the minimum norm solution of an
*     underdetermined system A^T * X = B.
*
* 4.  If TRANS = 'T' and M < N: find the least squares solution of an
*     overdetermined system, i.e., solve the least squares problem:
*     minimize || B - A^T * X ||
*
* Several right hand side vectors b and solution vectors x can be handled
* in a single call; they are stored as columns of the M-by-NRHS right
* hand side matrix B and the N-by-NRHS solution matrix X.
*
* @private
* @param {string} trans - `'no-transpose'` or `'transpose'`
* @param {NonNegativeInteger} M - number of rows of A
* @param {NonNegativeInteger} N - number of columns of A
* @param {NonNegativeInteger} nrhs - number of right hand sides (columns of B)
* @param {Float64Array} A - M-by-N matrix, overwritten with factorization on exit
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} B - on entry, M-by-NRHS (or N-by-NRHS) RHS matrix; on exit, solution
* @param {integer} strideB1 - stride of the first dimension of B
* @param {integer} strideB2 - stride of the second dimension of B
* @param {NonNegativeInteger} offsetB - starting index for B
* @returns {integer} info - 0 if successful, >0 if the i-th diagonal element of the triangular factor is zero (matrix not full rank)
*/
function dgels( trans, M, N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB ) {
	var scllen;
	var bignum;
	var smlnum;
	var iascl;
	var ibscl;
	var wsize;
	var brow;
	var anrm;
	var bnrm;
	var tpsd;
	var info;
	var WORK;
	var TAU;
	var MN;
	var bi;
	var i;
	var j;

	MN = Math.min( M, N );

	tpsd = ( trans === 'transpose' );

	// Quick return if dimensions are zero
	if ( MN === 0 || nrhs === 0 ) {
		dlaset( 'full', Math.max( M, N ), nrhs, 0.0, 0.0, B, strideB1, strideB2, offsetB );
		return 0;
	}

	// Allocate TAU array (length MN)
	TAU = new Float64Array( MN );

	// Compute workspace size: MN + max(MN, NRHS) * NB
	wsize = MN + ( Math.max( MN, nrhs ) * NB );
	wsize = Math.max( 1, wsize );
	WORK = new Float64Array( wsize );

	// Get machine parameters
	smlnum = dlamch( 'safe-minimum' ) / dlamch( 'precision' );
	bignum = 1.0 / smlnum;

	// Scale A if max element is outside [smlnum, bignum]
	anrm = dlange( 'max', M, N, A, strideA1, strideA2, offsetA, WORK, 1, 0 );
	iascl = 0;
	if ( anrm > 0.0 && anrm < smlnum ) {
		// Scale matrix norm up to smlnum
		dlascl( 'general', 0, 0, anrm, smlnum, M, N, A, strideA1, strideA2, offsetA );
		iascl = 1;
	} else if ( anrm > bignum ) {
		// Scale matrix norm down to bignum
		dlascl( 'general', 0, 0, anrm, bignum, M, N, A, strideA1, strideA2, offsetA );
		iascl = 2;
	} else if ( anrm === 0.0 ) {
		// Matrix all zero. Return zero solution.
		dlaset( 'full', Math.max( M, N ), nrhs, 0.0, 0.0, B, strideB1, strideB2, offsetB );
		return 0;
	}

	// Scale B
	brow = ( tpsd ) ? N : M;
	bnrm = dlange( 'max', brow, nrhs, B, strideB1, strideB2, offsetB, WORK, 1, 0 );
	ibscl = 0;
	if ( bnrm > 0.0 && bnrm < smlnum ) {
		// Scale matrix norm up to smlnum
		dlascl( 'general', 0, 0, bnrm, smlnum, brow, nrhs, B, strideB1, strideB2, offsetB );
		ibscl = 1;
	} else if ( bnrm > bignum ) {
		// Scale matrix norm down to bignum
		dlascl( 'general', 0, 0, bnrm, bignum, brow, nrhs, B, strideB1, strideB2, offsetB );
		ibscl = 2;
	}

	if ( M >= N ) {
		// M >= N: QR factorization of A
		// A = Q * R
		dgeqrf( M, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, WORK, 1, 0 );

		if ( tpsd ) {
			// Minimum norm problem: min || X || s.t. A^T * X = B

			// Solve R^T * Y = B(1:N,1:NRHS)
			info = dtrtrs( 'upper', 'transpose', 'non-unit', N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB );
			if ( info > 0 ) {
				return info;
			}

			// Zero out B(N+1:M,1:NRHS)
			for ( j = 0; j < nrhs; j++ ) {
				bi = offsetB + (j * strideB2) + (N * strideB1);
				for ( i = N; i < M; i++ ) {
					B[ bi ] = 0.0;
					bi += strideB1;
				}
			}

			// B(1:M,1:NRHS) := Q * B(1:M,1:NRHS)
			dormqr('left', 'no-transpose', M, nrhs, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0 );

			scllen = M;
		} else {
			// Least squares problem: minimize || b - A*x ||

			// B(1:M,1:NRHS) := Q^T * B(1:M,1:NRHS)
			dormqr('left', 'transpose', M, nrhs, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0 );

			// Solve R*X = B(1:N,1:NRHS)
			info = dtrtrs( 'upper', 'no-transpose', 'non-unit', N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB );
			if ( info > 0 ) {
				return info;
			}

			scllen = N;
		}
	} else {
		// M < N: LQ factorization of A
		// A = L * Q
		dgelqf(M, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, WORK, 1 );

		if ( tpsd ) {
			// Least squares problem: minimize || b - A^T*x ||

			// B(1:N,1:NRHS) := Q * B(1:N,1:NRHS)
			dormlq('left', 'no-transpose', N, nrhs, M, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0 );

			// Solve L^T * X = B(1:M,1:NRHS)
			info = dtrtrs( 'lower', 'transpose', 'non-unit', M, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB );
			if ( info > 0 ) {
				return info;
			}

			scllen = M;
		} else {
			// Minimum norm problem: min || X || s.t. A * X = B

			// Solve L * Y = B(1:M,1:NRHS)
			info = dtrtrs( 'lower', 'no-transpose', 'non-unit', M, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB );
			if ( info > 0 ) {
				return info;
			}

			// Zero out B(M+1:N,1:NRHS)
			for ( j = 0; j < nrhs; j++ ) {
				bi = offsetB + (j * strideB2) + (M * strideB1);
				for ( i = M; i < N; i++ ) {
					B[ bi ] = 0.0;
					bi += strideB1;
				}
			}

			// B(1:N,1:NRHS) := Q^T * B(1:N,1:NRHS)
			dormlq('left', 'transpose', N, nrhs, M, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0 );

			scllen = N;
		}
	}

	// Undo scaling
	if ( iascl === 1 ) {
		dlascl( 'general', 0, 0, anrm, smlnum, scllen, nrhs, B, strideB1, strideB2, offsetB );
	} else if ( iascl === 2 ) {
		dlascl( 'general', 0, 0, anrm, bignum, scllen, nrhs, B, strideB1, strideB2, offsetB );
	}
	if ( ibscl === 1 ) {
		dlascl( 'general', 0, 0, smlnum, bnrm, scllen, nrhs, B, strideB1, strideB2, offsetB );
	} else if ( ibscl === 2 ) {
		dlascl( 'general', 0, 0, bignum, bnrm, scllen, nrhs, B, strideB1, strideB2, offsetB );
	}

	return 0;
}


// EXPORTS //

module.exports = dgels;

},{"../../dgelqf/lib/base.js":11,"../../dgeqrf/lib/base.js":18,"../../dlamch/lib/base.js":19,"../../dlange/lib/base.js":20,"../../dlascl/lib/base.js":26,"../../dlaset/lib/base.js":27,"../../dormlq/lib/base.js":31,"../../dormqr/lib/base.js":32,"../../dtrtrs/lib/base.js":33,"@stdlib/array/float64":72}],13:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var isLayout = require( '@stdlib/blas/base/assert/is-layout' );
var format = require( '@stdlib/string/format' );
var isMatrixTranspose = require( '@stdlib/blas/base/assert/is-transpose-operation' );
var max = require( '@stdlib/math/base/special/fast/max' );
var base = require( './base.js' );


// MAIN //

/**
* Solves overdetermined or underdetermined real linear systems involving an.
*
* @param {string} order - storage layout ('row-major' or 'column-major')
* @param {string} trans - `'no-transpose'` or `'transpose'`
* @param {NonNegativeInteger} M - number of rows of A
* @param {NonNegativeInteger} N - number of columns of A
* @param {NonNegativeInteger} nrhs - number of right hand sides (columns of B)
* @param {Float64Array} A - input matrix
* @param {PositiveInteger} LDA - leading dimension of `A`
* @param {Float64Array} B - input matrix
* @param {PositiveInteger} LDB - leading dimension of `B`
* @throws {TypeError} first argument must be a valid order
* @returns {integer} info status code
*/
function dgels( order, trans, M, N, nrhs, A, LDA, B, LDB ) {
	var sa1;
	var sa2;
	var sb1;
	var sb2;

	if ( !isLayout( order ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a valid order. Value: `%s`.', order ) );
	}
	if ( !isMatrixTranspose( trans ) ) {
		throw new TypeError( format( 'invalid argument. Second argument must be a valid transpose operation. Value: `%s`.', trans ) );
	}
	if ( M < 0 ) {
		throw new RangeError( format( 'invalid argument. Third argument must be a nonnegative integer. Value: `%d`.', M ) );
	}
	if ( N < 0 ) {
		throw new RangeError( format( 'invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.', N ) );
	}
	if ( nrhs < 0 ) {
		throw new RangeError( format( 'invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.', nrhs ) );
	}
	if ( order === 'row-major' && LDB < max( 1, N ) ) {
		throw new RangeError( format( 'invalid argument. Ninth argument must be greater than or equal to max(1,N). Value: `%d`.', LDB ) );
	}
	if ( order === 'column-major' && LDB < max( 1, M ) ) {
		throw new RangeError( format( 'invalid argument. Ninth argument must be greater than or equal to max(1,M). Value: `%d`.', LDB ) );
	}
	if ( order === 'row-major' && LDA < max( 1, N ) ) {
		throw new RangeError( format( 'invalid argument. Seventh argument must be greater than or equal to max(1,N). Value: `%d`.', LDA ) );
	}
	if ( order === 'column-major' && LDA < max( 1, M ) ) {
		throw new RangeError( format( 'invalid argument. Seventh argument must be greater than or equal to max(1,M). Value: `%d`.', LDA ) );
	}
	if ( order === 'column-major' ) {
		sa1 = 1;
		sa2 = LDA;
		sb1 = 1;
		sb2 = LDB;
	} else {
		sa1 = LDA;
		sa2 = 1;
		sb1 = LDB;
		sb2 = 1;
	}
	return base( trans, M, N, nrhs, A, sa1, sa2, 0, B, sb1, sb2, 0 );
}


// EXPORTS //

module.exports = dgels;

},{"./base.js":12,"@stdlib/blas/base/assert/is-layout":199,"@stdlib/blas/base/assert/is-transpose-operation":201,"@stdlib/math/base/special/fast/max":246,"@stdlib/string/format":274}],14:[function(require,module,exports){
(function (__dirname){(function (){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Solve overdetermined or underdetermined real linear systems using QR or LQ factorization.
*
* @module @stdlib/lapack/base/dgels
*
* @example
* var Float64Array = require( '@stdlib/array/float64' );
* var dgels = require( '@stdlib/lapack/base/dgels' );
*
* var A = new Float64Array( [ 1.0, 2.0, 3.0, 4.0 ] );
* var B = new Float64Array( [ 1.0, 2.0, 3.0, 4.0 ] );
*
* dgels( 'row-major', 'no-transpose', 2, 2, 1, A, 2, B, 2 );
*
* @example
* var Float64Array = require( '@stdlib/array/float64' );
* var dgels = require( '@stdlib/lapack/base/dgels' );
*
* var A = new Float64Array( [ 1.0, 2.0, 3.0, 4.0 ] );
* var B = new Float64Array( [ 1.0, 2.0, 3.0, 4.0 ] );
*
* dgels.ndarray( 'no-transpose', 2, 2, 1, A, 1, 2, 0, B, 1, 2, 0 );
*/


// MODULES //

var join = require( 'path' ).join;
var tryRequire = require( '@stdlib/utils/try-require' );
var isError = require( '@stdlib/assert/is-error' );
var main = require( './main.js' );


// MAIN //

var dgels;
var tmp = tryRequire( join( __dirname, './native.js' ) );
if ( isError( tmp ) ) {
	dgels = main;
} else {
	dgels = tmp;
}


// EXPORTS //

module.exports = dgels;

// exports: { "ndarray": "dgels.ndarray" }

}).call(this)}).call(this,"/node_modules/blapack/lib/lapack/base/dgels/lib")
},{"./main.js":15,"@stdlib/assert/is-error":149,"@stdlib/utils/try-require":308,"path":339}],15:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var dgels = require( './dgels.js' );
var ndarray = require( './ndarray.js' );


// MAIN //

setReadOnly( dgels, 'ndarray', ndarray );


// EXPORTS //

module.exports = dgels;

},{"./dgels.js":13,"./ndarray.js":16,"@stdlib/utils/define-nonenumerable-read-only-property":285}],16:[function(require,module,exports){
/**
 * Solves overdetermined or underdetermined real linear systems involving an.
 * M-by-N matrix A, or its transpose, using a QR or LQ factorization of A.
 *
 * It is assumed that A has full rank.
 *
 * The following options are provided:
 *
 * 1.  If TRANS = 'N' and M >= N: find the least squares solution of an
 *     overdetermined system, i.e., solve the least squares problem:
 *     minimize || B - A*X ||
 *
 * 2.  If TRANS = 'N' and M < N: find the minimum norm solution of an
 *     underdetermined system A * X = B.
 *
 * 3.  If TRANS = 'T' and M >= N: find the minimum norm solution of an
 *     underdetermined system A^T * X = B.
 *
 * 4.  If TRANS = 'T' and M < N: find the least squares solution of an
 *     overdetermined system, i.e., solve the least squares problem:
 *     minimize || B - A^T * X ||
 *
 * Several right hand side vectors b and solution vectors x can be handled
 * in a single call; they are stored as columns of the M-by-NRHS right
 * hand side matrix B and the N-by-NRHS solution matrix X.
 *
 *
 * @param {string} trans - `'no-transpose'` or `'transpose'`
 * @param {NonNegativeInteger} M - number of rows of A
 * @param {NonNegativeInteger} N - number of columns of A
 * @param {NonNegativeInteger} nrhs - number of right hand sides (columns of B)
 * @param {Float64Array} A - M-by-N matrix, overwritten with factorization on exit
 * @param {integer} strideA1 - stride of the first dimension of A
 * @param {integer} strideA2 - stride of the second dimension of A
 * @param {NonNegativeInteger} offsetA - starting index for A
 * @param {Float64Array} B - on entry, M-by-NRHS (or N-by-NRHS) RHS matrix; on exit, solution
 * @param {integer} strideB1 - stride of the first dimension of B
 * @param {integer} strideB2 - stride of the second dimension of B
 * @param {NonNegativeInteger} offsetB - starting index for B
 * @throws {TypeError} First argument must be a valid transpose operation
 * @returns {integer} info - 0 if successful, >0 if the i-th diagonal element of the triangular factor is zero (matrix not full rank)
 */

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var isMatrixTranspose = require( '@stdlib/blas/base/assert/is-transpose-operation' );
var format = require( '@stdlib/string/format' );
var isTransposeOperation = require( '@stdlib/blas/base/assert/is-transpose-operation' );
var base = require( './base.js' );


// MAIN //

/**
* Solves overdetermined or underdetermined real linear systems involving an.
* M-by-N matrix A, or its transpose, using a QR or LQ factorization of A.
*
* @param {string} trans - 'no-transpose' or 'transpose'
* @param {NonNegativeInteger} M - number of rows of A
* @param {NonNegativeInteger} N - number of columns of A
* @param {NonNegativeInteger} nrhs - number of right hand sides (columns of B)
* @param {Float64Array} A - M-by-N matrix, overwritten with factorization on exit
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} B - on entry, RHS matrix; on exit, the solution
* @param {integer} strideB1 - stride of the first dimension of B
* @param {integer} strideB2 - stride of the second dimension of B
* @param {NonNegativeInteger} offsetB - starting index for B
* @throws {TypeError} first argument must be a valid transpose operation
* @throws {RangeError} second argument must be a nonnegative integer
* @throws {RangeError} third argument must be a nonnegative integer
* @returns {integer} info - 0 if successful, >0 if rank-deficient
*
* @example
* var Float64Array = require( '@stdlib/array/float64' );
*
* var A = new Float64Array( [ 1.0, 0.0, 0.0, 1.0 ] );
* var B = new Float64Array( [ 1.0, 2.0 ] );
*
* var info = dgels( 'no-transpose', 2, 2, 1, A, 1, 2, 0, B, 1, 2, 0 );
* // info => 0
*/
function dgels( trans, M, N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB ) {
	if ( !isMatrixTranspose( trans ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a valid transpose operation. Value: `%s`.', trans ) );
	}
	if ( M < 0 ) {
		throw new RangeError( format( 'invalid argument. Second argument must be a nonnegative integer. Value: `%d`.', M ) );
	}
	if ( N < 0 ) {
		throw new RangeError( format( 'invalid argument. Third argument must be a nonnegative integer. Value: `%d`.', N ) );
	}
	if ( nrhs < 0 ) {
		throw new RangeError( format( 'invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.', nrhs ) );
	}
	return base( trans, M, N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB );
}


// EXPORTS //

module.exports = dgels;

},{"./base.js":12,"@stdlib/blas/base/assert/is-transpose-operation":201,"@stdlib/string/format":274}],17:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params, no-var */

'use strict';

// MODULES //

var dlarfg = require( '../../dlarfg/lib/base.js' );
var dlarf = require( '../../dlarf/lib/base.js' );


// MAIN //

/**
* Computes a QR factorization of a real M-by-N matrix A = Q * R.
* using Householder reflections (unblocked algorithm).
*
* @private
* @param {NonNegativeInteger} M - number of rows in A
* @param {NonNegativeInteger} N - number of columns in A
* @param {Float64Array} A - input/output matrix (column-major)
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - output array of scalar factors
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} WORK - workspace array (length >= N)
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dgeqr2( M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK ) {
	var alpha;
	var aii;
	var K;
	var i;

	K = Math.min( M, N );

	for ( i = 0; i < K; i++ ) {
		// Generate elementary reflector H(i) to annihilate A(i+1:M-1, i)
		aii = offsetA + (i * strideA1) + (i * strideA2);

		dlarfg( M - i, A, aii, A, strideA1, offsetA + (Math.min( i + 1, M - 1 ) * strideA1) + (i * strideA2), TAU, offsetTAU + (i * strideTAU) );

		if ( i < N - 1 ) {
			// Save A(i,i) and set to 1 for the reflector application
			alpha = A[ aii ];
			A[ aii ] = 1.0;

			// Apply H(i) to A(i:M-1, i+1:N-1) from the left
			dlarf( 'left', M - i, N - i - 1, A, strideA1, aii, TAU[ offsetTAU + (i * strideTAU) ], A, strideA1, strideA2, offsetA + (i * strideA1) + (( i + 1 ) * strideA2), WORK, strideWORK, offsetWORK );

			// Restore A(i,i)
			A[ aii ] = alpha;
		}
	}
	return 0;
}


// EXPORTS //

module.exports = dgeqr2;

},{"../../dlarf/lib/base.js":22,"../../dlarfg/lib/base.js":24}],18:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params, no-var */

'use strict';

// MODULES //

var dgeqr2 = require( '../../dgeqr2/lib/base.js' );
var dlarfb = require( '../../dlarfb/lib/base.js' );
var dlarft = require( '../../dlarft/lib/base.js' );


// VARIABLES //

var DEFAULT_NB = 32;


// MAIN //

/**
* Computes a QR factorization of a real M-by-N matrix A = Q * R.
* using blocked Householder reflections.
*
* The caller must supply WORK as a `Float64Array` of size at least
* `N*NB + NB*NB` elements (with `NB = 32`) when the blocked path is taken
* (i.e., `min(M,N) > NB`). The buffer is partitioned so that
* `WORK[offsetWORK .. offsetWORK + N*NB - 1]` holds the `dlarfb` block
* update workspace (logical leading dimension `N`) and
* `WORK[offsetWORK + N*NB .. offsetWORK + N*NB + NB*NB - 1]` holds the
* `NB`-by-`NB` block-reflector `T` factor. For the unblocked path
* (`min(M,N) <= NB`), only `N` elements are required.
*
* @private
* @param {NonNegativeInteger} M - number of rows
* @param {NonNegativeInteger} N - number of columns
* @param {Float64Array} A - input matrix (column-major)
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - output array of scalar factors
* @param {integer} strideTAU - stride length for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} WORK - caller-provided workspace (see size formula above)
* @param {integer} strideWORK - stride length for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} status code (0 = success)
*/
function dgeqrf( M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK ) {
	var offsetT;
	var ldwork;
	var nbmin;
	var iws;
	var ib;
	var nb;
	var nx;
	var T;
	var K;
	var i;

	K = Math.min( M, N );
	if ( K === 0 ) {
		return 0;
	}
	nb = DEFAULT_NB;
	nbmin = 2;
	nx = 0;
	iws = N;
	ldwork = N;
	T = WORK;

	if ( nb > 1 && nb < K ) {
		iws = ldwork * nb;
	}
	offsetT = offsetWORK + iws;

	if ( nb >= nbmin && nb < K && nx < K ) {
		// Use blocked code
		i = 0;
		while ( i <= K - 1 - nx ) {
			ib = Math.min( K - i, nb );

			// Compute the QR factorization of the current panel A(i:M-1, i:i+ib-1)
			dgeqr2(M - i, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), WORK, strideWORK, offsetWORK);

			if ( i + ib < N ) {
				// Form the triangular factor of the block reflector
				// H = H(i) H(i+1) ... H(i+ib-1)
				dlarft('forward', 'columnwise', M - i, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), T, 1, nb, offsetT);

				// Apply H**T to A(i:M-1, i+ib:N-1) from the left
				dlarfb('left', 'transpose', 'forward', 'columnwise', M - i, N - i - ib, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), T, 1, nb, offsetT, A, strideA1, strideA2, offsetA + (i * strideA1) + (( i + ib ) * strideA2), WORK, 1, ldwork, offsetWORK);
			}
			i += nb;
		}
	} else {
		i = 0;
	}

	// Use unblocked code to factor the last or only block
	if ( i <= K - 1 ) {
		dgeqr2(M - i, N - i, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), WORK, strideWORK, offsetWORK);
	}

	return 0;
}


// EXPORTS //

module.exports = dgeqrf;

},{"../../dgeqr2/lib/base.js":17,"../../dlarfb/lib/base.js":23,"../../dlarft/lib/base.js":25}],19:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

// IEEE 754 double-precision constants:
var EPS = 1.1102230246251565e-16;          // 2^-53 (half of Number.EPSILON)
var SFMIN = 2.2250738585072014e-308;       // Number.MIN_VALUE (normalized)
var BASE = 2;                              // radix
var PREC = EPS * BASE;                     // eps * radix
var DIGITS = 53;                           // significand bits
var RND = 1.0;                             // 1.0 for IEEE rounding
var EMIN = -1021;                          // min exponent
var RMIN = 2.2250738585072014e-308;        // tiny = 2^emin (same as sfmin for IEEE)
var EMAX = 1024;                           // max exponent
var RMAX = 1.7976931348623157e+308;        // Number.MAX_VALUE


// MAIN //

var TABLE = {
	'epsilon': EPS,
	'Epsilon': EPS,
	'safe-minimum': SFMIN,
	'Safe minimum': SFMIN,
	'base': BASE,
	'Base': BASE,
	'precision': PREC,
	'Precision': PREC,
	'digits': DIGITS,
	'rounding': RND,
	'min-exponent': EMIN,
	'underflow': RMIN,
	'max-exponent': EMAX,
	'overflow': RMAX,
	'scale': SFMIN,
	'E': EPS,
	'e': EPS,
	'S': SFMIN,
	's': SFMIN,
	'B': BASE,
	'b': BASE,
	'P': PREC,
	'p': PREC,
	'N': DIGITS,
	'n': DIGITS,
	'R': RND,
	'r': RND,
	'M': EMIN,
	'm': EMIN,
	'U': RMIN,
	'u': RMIN,
	'L': EMAX,
	'l': EMAX,
	'O': RMAX,
	'o': RMAX
};

/**
* Determines double-precision machine parameters.
*
* @private
* @param {string} cmach - specifies the machine parameter (long-form preferred)
* @returns {number} machine parameter value
*/
function dlamch( cmach ) {
	var v = TABLE[ cmach ];
	if ( v !== void 0 ) {
		return v;
	}
	return 0.0;
}


// EXPORTS //

module.exports = dlamch;

},{}],20:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dlassq = require( '../../dlassq/lib/base.js' );


// MAIN //

/**
* Computes the value of the one norm, Frobenius norm, infinity norm, or.
* largest absolute value of a real matrix.
*
* @private
* @param {string} norm - `'max'`, `'one-norm'`, `'inf-norm'`, or `'frobenius'`
* @param {NonNegativeInteger} M - number of rows
* @param {NonNegativeInteger} N - number of columns
* @param {Float64Array} A - input matrix
* @param {integer} strideA1 - stride of the first dimension of `A`
* @param {integer} strideA2 - stride of the second dimension of `A`
* @param {NonNegativeInteger} offsetA - starting index for `A`
* @param {Float64Array} WORK - workspace array (length >= M for `'inf-norm'`)
* @param {integer} strideWORK - stride length for `WORK`
* @param {NonNegativeInteger} offsetWORK - starting index for `WORK`
* @returns {number} norm value
*/
function dlange( norm, M, N, A, strideA1, strideA2, offsetA, WORK, strideWORK, offsetWORK ) {
	var value;
	var scale;
	var temp;
	var sum;
	var out;
	var ai;
	var wi;
	var i;
	var j;

	if ( M === 0 || N === 0 ) {
		return 0.0;
	}

	if ( norm === 'max' ) {
		// Max absolute value
		value = 0.0;
		for ( j = 0; j < N; j++ ) {
			ai = offsetA + (j * strideA2);
			for ( i = 0; i < M; i++ ) {
				temp = Math.abs( A[ ai ] );
				if ( value < temp || temp !== temp ) {
					value = temp;
				}
				ai += strideA1;
			}
		}
	} else if ( norm === 'one-norm' ) {
		// One-norm: maximum column sum of absolute values
		value = 0.0;
		for ( j = 0; j < N; j++ ) {
			sum = 0.0;
			ai = offsetA + (j * strideA2);
			for ( i = 0; i < M; i++ ) {
				sum += Math.abs( A[ ai ] );
				ai += strideA1;
			}
			if ( value < sum || sum !== sum ) {
				value = sum;
			}
		}
	} else if ( norm === 'inf-norm' ) {
		// Infinity-norm: maximum row sum of absolute values
		for ( i = 0; i < M; i++ ) {
			wi = offsetWORK + (i * strideWORK);
			WORK[ wi ] = 0.0;
		}
		for ( j = 0; j < N; j++ ) {
			ai = offsetA + (j * strideA2);
			wi = offsetWORK;
			for ( i = 0; i < M; i++ ) {
				WORK[ wi ] += Math.abs( A[ ai ] );
				ai += strideA1;
				wi += strideWORK;
			}
		}
		value = 0.0;
		for ( i = 0; i < M; i++ ) {
			wi = offsetWORK + (i * strideWORK);
			temp = WORK[ wi ];
			if ( value < temp || temp !== temp ) {
				value = temp;
			}
		}
	} else if ( norm === 'frobenius' ) {
		// Frobenius norm: scale * sqrt(sumsq) using dlassq per column
		scale = 0.0;
		sum = 1.0;
		for ( j = 0; j < N; j++ ) {
			out = dlassq( M, A, strideA1, offsetA + (j * strideA2), scale, sum );
			scale = out.scl;
			sum = out.sumsq;
		}
		value = scale * Math.sqrt( sum );
	} else {
		value = 0.0;
	}

	return value;
}


// EXPORTS //

module.exports = dlange;

},{"../../dlassq/lib/base.js":28}],21:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns sqrt(x**2 + y**2), taking care not to cause unnecessary.
* overflow and unnecessary underflow.
*
* @private
* @param {number} x - first value
* @param {number} y - second value
* @returns {number} sqrt(x**2 + y**2)
*/
function dlapy2( x, y ) {
	var xabs;
	var yabs;
	var w;
	var z;

	// Handle NaN
	if ( x !== x ) {
		return x;
	}
	if ( y !== y ) {
		return y;
	}

	xabs = Math.abs( x );
	yabs = Math.abs( y );
	w = Math.max( xabs, yabs );
	z = Math.min( xabs, yabs );

	if ( z === 0.0 || w > 1.7976931348623157e+308 ) {
		return w;
	}
	return w * Math.sqrt( 1.0 + (( z / w ) * ( z / w )) );
}


// EXPORTS //

module.exports = dlapy2;

},{}],22:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dgemv = require( '../../../../blas/base/dgemv/lib/base.js' );
var dger = require( '../../../../blas/base/dger/lib/base.js' );
var iladlr = require( '../../iladlr/lib/base.js' );
var iladlc = require( '../../iladlc/lib/base.js' );


// MAIN //

/**
* Applies a real elementary reflector H to a real M-by-N matrix C.
* from either the left or the right.
*
* `H = I - tau*v*v**T`
*
* @private
* @param {string} side - `'left'` or `'right'`
* @param {NonNegativeInteger} M - number of rows of C
* @param {NonNegativeInteger} N - number of columns of C
* @param {Float64Array} v - reflector vector
* @param {integer} strideV - stride for v
* @param {NonNegativeInteger} offsetV - starting index for v
* @param {number} tau - scalar factor
* @param {Float64Array} C - matrix, modified in-place
* @param {integer} strideC1 - stride of first dimension of C
* @param {integer} strideC2 - stride of second dimension of C
* @param {NonNegativeInteger} offsetC - starting index for C
* @param {Float64Array} WORK - workspace array
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
*/
function dlarf( side, M, N, v, strideV, offsetV, tau, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK ) {
	var applyLeft;
	var lastv;
	var lastc;
	var ix;

	applyLeft = ( side === 'left' );
	lastv = 0;
	lastc = 0;

	if ( tau !== 0.0 ) {
		if ( applyLeft ) {
			lastv = M;
		} else {
			lastv = N;
		}
		if ( strideV > 0 ) {
			ix = offsetV + (( lastv - 1 ) * strideV);
		} else {
			ix = offsetV;
		}

		// Look for the last non-zero element in V
		while ( lastv > 0 && v[ ix ] === 0.0 ) {
			lastv -= 1;
			ix -= strideV;
		}

		if ( applyLeft ) {
			lastc = iladlc( lastv, N, C, strideC1, strideC2, offsetC ) + 1;
		} else {
			lastc = iladlr( M, lastv, C, strideC1, strideC2, offsetC ) + 1;
		}
	}

	if ( applyLeft ) {
		// Form H * C
		if ( lastv > 0 ) {
			// w(1:lastc) := C(1:lastv, 1:lastc)**T * v(1:lastv)
			dgemv( 'transpose', lastv, lastc, 1.0, C, strideC1, strideC2, offsetC, v, strideV, offsetV, 0.0, WORK, strideWORK, offsetWORK );

			// C(1:lastv, 1:lastc) := C(...) - tau * v(1:lastv) * w(1:lastc)**T
			dger( lastv, lastc, -tau, v, strideV, offsetV, WORK, strideWORK, offsetWORK, C, strideC1, strideC2, offsetC );
		}
	} else if ( lastv > 0 ) {
		// Form C * H

		// w(1:lastc) := C(1:lastc, 1:lastv) * v(1:lastv)
		dgemv( 'no-transpose', lastc, lastv, 1.0, C, strideC1, strideC2, offsetC, v, strideV, offsetV, 0.0, WORK, strideWORK, offsetWORK );

		// C(1:lastc, 1:lastv) := C(...) - tau * w(1:lastc) * v(1:lastv)**T
		dger( lastc, lastv, -tau, WORK, strideWORK, offsetWORK, v, strideV, offsetV, C, strideC1, strideC2, offsetC );
	}
}


// EXPORTS //

module.exports = dlarf;

},{"../../../../blas/base/dgemv/lib/base.js":3,"../../../../blas/base/dger/lib/base.js":4,"../../iladlc/lib/base.js":34,"../../iladlr/lib/base.js":35}],23:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dcopy = require( '../../../../blas/base/dcopy/lib/base.js' );
var dgemm = require( '../../../../blas/base/dgemm/lib/base.js' );
var dtrmm = require( '../../../../blas/base/dtrmm/lib/base.js' );


// MAIN //

/**
* Applies a real block reflector H or its transpose H**T to a.
* real M-by-N matrix C, from either the left or the right.
*
* `H = I - V*T*V**T  (for STOREV='C')`
* `H = I - V**T*T*V  (for STOREV='R')`
*
* Supports both STOREV='C' (columnwise) and STOREV='R' (rowwise).
*
* @private
* @param {string} side - `'left'` or `'right'`
* @param {string} trans - `'no-transpose'` or `'transpose'`
* @param {string} direct - `'forward'` or `'backward'`
* @param {string} storev - `'columnwise'` or `'rowwise'`
* @param {NonNegativeInteger} M - rows of C
* @param {NonNegativeInteger} N - columns of C
* @param {NonNegativeInteger} K - number of elementary reflectors
* @param {Float64Array} V - matrix of reflector vectors
* @param {integer} strideV1 - first dim stride of V
* @param {integer} strideV2 - second dim stride of V
* @param {NonNegativeInteger} offsetV - starting index for V
* @param {Float64Array} T - triangular factor
* @param {integer} strideT1 - first dim stride of T
* @param {integer} strideT2 - second dim stride of T
* @param {NonNegativeInteger} offsetT - starting index for T
* @param {Float64Array} C - matrix, modified in-place
* @param {integer} strideC1 - first dim stride of C
* @param {integer} strideC2 - second dim stride of C
* @param {NonNegativeInteger} offsetC - starting index for C
* @param {Float64Array} WORK - workspace
* @param {integer} strideWORK1 - first dim stride of WORK
* @param {integer} strideWORK2 - second dim stride of WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
*/
function dlarfb( side, trans, direct, storev, M, N, K, V, strideV1, strideV2, offsetV, T, strideT1, strideT2, offsetT, C, strideC1, strideC2, offsetC, WORK, strideWORK1, strideWORK2, offsetWORK ) {
	var transt;
	var i;
	var j;

	if ( M <= 0 || N <= 0 ) {
		return;
	}

	if ( trans === 'no-transpose' ) {
		transt = 'transpose';
	} else {
		transt = 'no-transpose';
	}

	if ( storev === 'columnwise' ) {
		if ( direct === 'forward' ) {
			// V = (V1)  first K rows, V1 is unit lower triangular
			//     (V2)
			if ( side === 'left' ) {
				// Form H*C or H**T*C where C = (C1)
				//                               (C2)
				// W := C1**T
				for ( j = 0; j < K; j++ ) {
					dcopy( N, C, strideC2, offsetC + (j * strideC1), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
				}
				// W := W * V1
				dtrmm( 'right', 'lower', 'no-transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );
				if ( M > K ) {
					// W := W + C2**T * V2
					dgemm( 'transpose', 'no-transpose', N, K, M - K, 1.0, C, strideC1, strideC2, offsetC + (K * strideC1), V, strideV1, strideV2, offsetV + (K * strideV1), 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
				}
				// W := W * T**T or W * T
				dtrmm( 'right', 'upper', transt, 'non-unit', N, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );

				// C := C - V * W**T
				if ( M > K ) {
					dgemm( 'no-transpose', 'transpose', M - K, N, K, -1.0, V, strideV1, strideV2, offsetV + (K * strideV1), WORK, strideWORK1, strideWORK2, offsetWORK, 1.0, C, strideC1, strideC2, offsetC + (K * strideC1) );
				}
				// W := W * V1**T
				dtrmm( 'right', 'lower', 'transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );

				// C1 := C1 - W**T
				for ( j = 0; j < K; j++ ) {
					for ( i = 0; i < N; i++ ) {
						C[ offsetC + (j * strideC1) + (i * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
					}
				}
			} else if ( side === 'right' ) {
				// Form C*H or C*H**T where C = (C1 C2)
				// W := C1
				for ( j = 0; j < K; j++ ) {
					dcopy( M, C, strideC1, offsetC + (j * strideC2), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
				}
				// W := W * V1
				dtrmm( 'right', 'lower', 'no-transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );
				if ( N > K ) {
					// W := W + C2 * V2
					dgemm( 'no-transpose', 'no-transpose', M, K, N - K, 1.0, C, strideC1, strideC2, offsetC + (K * strideC2), V, strideV1, strideV2, offsetV + (K * strideV1), 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
				}
				// W := W * T or W * T**T
				dtrmm( 'right', 'upper', trans, 'non-unit', M, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );

				// C := C - W * V**T
				if ( N > K ) {
					dgemm( 'no-transpose', 'transpose', M, N - K, K, -1.0, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV + (K * strideV1), 1.0, C, strideC1, strideC2, offsetC + (K * strideC2) );
				}
				// W := W * V1**T
				dtrmm( 'right', 'lower', 'transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );

				// C1 := C1 - W
				for ( j = 0; j < K; j++ ) {
					for ( i = 0; i < M; i++ ) {
						C[ offsetC + (i * strideC1) + (j * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
					}
				}
			}
		// Backward: V = (V1)
		//               (V2)  last K rows, V2 is unit upper triangular
		} else if ( side === 'left' ) {
			// W := C2**T
			for ( j = 0; j < K; j++ ) {
				dcopy( N, C, strideC2, offsetC + (( M - K + j ) * strideC1), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
			}
			// W := W * V2
			dtrmm( 'right', 'upper', 'no-transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV + (( M - K ) * strideV1), WORK, strideWORK1, strideWORK2, offsetWORK );
			if ( M > K ) {
				dgemm( 'transpose', 'no-transpose', N, K, M - K, 1.0, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
			}
			// W := W * T**T or W * T
			dtrmm( 'right', 'lower', transt, 'non-unit', N, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );
			if ( M > K ) {
				dgemm( 'no-transpose', 'transpose', M - K, N, K, -1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK, 1.0, C, strideC1, strideC2, offsetC );
			}
			dtrmm( 'right', 'upper', 'transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV + (( M - K ) * strideV1), WORK, strideWORK1, strideWORK2, offsetWORK );
			for ( j = 0; j < K; j++ ) {
				for ( i = 0; i < N; i++ ) {
					C[ offsetC + (( M - K + j ) * strideC1) + (i * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
				}
			}
		} else if ( side === 'right' ) {
			// W := C2
			for ( j = 0; j < K; j++ ) {
				dcopy( M, C, strideC1, offsetC + (( N - K + j ) * strideC2), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
			}
			dtrmm( 'right', 'upper', 'no-transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV + (( N - K ) * strideV1), WORK, strideWORK1, strideWORK2, offsetWORK );
			if ( N > K ) {
				dgemm( 'no-transpose', 'no-transpose', M, K, N - K, 1.0, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
			}
			dtrmm( 'right', 'lower', trans, 'non-unit', M, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );
			if ( N > K ) {
				dgemm( 'no-transpose', 'transpose', M, N - K, K, -1.0, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV, 1.0, C, strideC1, strideC2, offsetC );
			}
			dtrmm( 'right', 'upper', 'transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV + (( N - K ) * strideV1), WORK, strideWORK1, strideWORK2, offsetWORK );
			for ( j = 0; j < K; j++ ) {
				for ( i = 0; i < M; i++ ) {
					C[ offsetC + (i * strideC1) + (( N - K + j ) * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
				}
			}
		}
	// STOREV = 'R': reflectors stored rowwise
	// H = I - V**T * T * V (for STOREV='R')
	} else if ( direct === 'forward' ) {
		// V = (V1 V2)  first K columns, V1 is unit upper triangular
		if ( side === 'left' ) {
			// Form H*C or H**T*C where C = (C1)
			//                               (C2)
			// W := C**T * V**T = (C1**T*V1**T + C2**T*V2**T)
			// W := C1**T
			for ( j = 0; j < K; j++ ) {
				dcopy( N, C, strideC2, offsetC + (j * strideC1), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
			}
			// W := W * V1**T (V1 is stored in rows of V: upper triangular)
			dtrmm( 'right', 'upper', 'transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );
			if ( M > K ) {
				// W := W + C2**T * V2**T
				dgemm( 'transpose', 'transpose', N, K, M - K, 1.0, C, strideC1, strideC2, offsetC + (K * strideC1), V, strideV1, strideV2, offsetV + (K * strideV2), 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
			}
			// W := W * T**T or W * T
			dtrmm( 'right', 'upper', transt, 'non-unit', N, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );

			// C := C - V**T * W**T
			if ( M > K ) {
				// C2 := C2 - V2**T * W**T
				dgemm( 'transpose', 'transpose', M - K, N, K, -1.0, V, strideV1, strideV2, offsetV + (K * strideV2), WORK, strideWORK1, strideWORK2, offsetWORK, 1.0, C, strideC1, strideC2, offsetC + (K * strideC1) );
			}
			// W := W * V1
			dtrmm( 'right', 'upper', 'no-transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );

			// C1 := C1 - W**T
			for ( j = 0; j < K; j++ ) {
				for ( i = 0; i < N; i++ ) {
					C[ offsetC + (j * strideC1) + (i * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
				}
			}
		} else if ( side === 'right' ) {
			// Form C*H or C*H**T where C = (C1 C2)
			// W := C * V**T = (C1*V1**T + C2*V2**T)
			// W := C1
			for ( j = 0; j < K; j++ ) {
				dcopy( M, C, strideC1, offsetC + (j * strideC2), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
			}
			// W := W * V1**T
			dtrmm( 'right', 'upper', 'transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );
			if ( N > K ) {
				// W := W + C2 * V2**T
				dgemm( 'no-transpose', 'transpose', M, K, N - K, 1.0, C, strideC1, strideC2, offsetC + (K * strideC2), V, strideV1, strideV2, offsetV + (K * strideV2), 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
			}
			// W := W * T or W * T**T
			dtrmm( 'right', 'upper', trans, 'non-unit', M, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );

			// C := C - W * V
			if ( N > K ) {
				// C2 := C2 - W * V2
				dgemm( 'no-transpose', 'no-transpose', M, N - K, K, -1.0, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV + (K * strideV2), 1.0, C, strideC1, strideC2, offsetC + (K * strideC2) );
			}
			// W := W * V1
			dtrmm( 'right', 'upper', 'no-transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK );

			// C1 := C1 - W
			for ( j = 0; j < K; j++ ) {
				for ( i = 0; i < M; i++ ) {
					C[ offsetC + (i * strideC1) + (j * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
				}
			}
		}
	// Backward: V = (V1 V2), last K columns, V2 is unit lower triangular
	} else if ( side === 'left' ) {
		// Form H*C or H**T*C where C = (C1)
		//                               (C2)
		// W := C**T * V**T
		// W := C2**T
		for ( j = 0; j < K; j++ ) {
			dcopy( N, C, strideC2, offsetC + (( M - K + j ) * strideC1), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
		}
		// W := W * V2**T
		dtrmm( 'right', 'lower', 'transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV + (( M - K ) * strideV2), WORK, strideWORK1, strideWORK2, offsetWORK );
		if ( M > K ) {
			// W := W + C1**T * V1**T
			dgemm( 'transpose', 'transpose', N, K, M - K, 1.0, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
		}
		// W := W * T**T or W * T
		dtrmm( 'right', 'lower', transt, 'non-unit', N, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );

		// C := C - V**T * W**T
		if ( M > K ) {
			// C1 := C1 - V1**T * W**T
			dgemm( 'transpose', 'transpose', M - K, N, K, -1.0, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK, 1.0, C, strideC1, strideC2, offsetC );
		}
		// W := W * V2
		dtrmm( 'right', 'lower', 'no-transpose', 'unit', N, K, 1.0, V, strideV1, strideV2, offsetV + (( M - K ) * strideV2), WORK, strideWORK1, strideWORK2, offsetWORK );

		// C2 := C2 - W**T
		for ( j = 0; j < K; j++ ) {
			for ( i = 0; i < N; i++ ) {
				C[ offsetC + (( M - K + j ) * strideC1) + (i * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
			}
		}
	} else if ( side === 'right' ) {
		// Form C*H or C*H**T where C = (C1 C2)
		// W := C * V**T
		// W := C2
		for ( j = 0; j < K; j++ ) {
			dcopy( M, C, strideC1, offsetC + (( N - K + j ) * strideC2), WORK, strideWORK1, offsetWORK + (j * strideWORK2) );
		}
		// W := W * V2**T
		dtrmm( 'right', 'lower', 'transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV + (( N - K ) * strideV2), WORK, strideWORK1, strideWORK2, offsetWORK );
		if ( N > K ) {
			// W := W + C1 * V1**T
			dgemm( 'no-transpose', 'transpose', M, K, N - K, 1.0, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1.0, WORK, strideWORK1, strideWORK2, offsetWORK );
		}
		// W := W * T or W * T**T
		dtrmm( 'right', 'lower', trans, 'non-unit', M, K, 1.0, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK );

		// C := C - W * V
		if ( N > K ) {
			// C1 := C1 - W * V1
			dgemm( 'no-transpose', 'no-transpose', M, N - K, K, -1.0, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV, 1.0, C, strideC1, strideC2, offsetC );
		}
		// W := W * V2
		dtrmm( 'right', 'lower', 'no-transpose', 'unit', M, K, 1.0, V, strideV1, strideV2, offsetV + (( N - K ) * strideV2), WORK, strideWORK1, strideWORK2, offsetWORK );

		// C2 := C2 - W
		for ( j = 0; j < K; j++ ) {
			for ( i = 0; i < M; i++ ) {
				C[ offsetC + (i * strideC1) + (( N - K + j ) * strideC2) ] -= WORK[ offsetWORK + (i * strideWORK1) + (j * strideWORK2) ];
			}
		}
	}
}


// EXPORTS //

module.exports = dlarfb;

},{"../../../../blas/base/dcopy/lib/base.js":1,"../../../../blas/base/dgemm/lib/base.js":2,"../../../../blas/base/dtrmm/lib/base.js":7}],24:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var dnrm2 = require( '../../../../blas/base/dnrm2/lib/base.js' );
var dscal = require( '../../../../blas/base/dscal/lib/base.js' );
var dlamch = require( '../../dlamch/lib/base.js' );
var dlapy2 = require( '../../dlapy2/lib/base.js' );


// MAIN //

/**
* Generates a real elementary reflector H of order N, such that.
*
* `H*( alpha ) = ( beta )`,   `H__T*H = I`.
* (   x   )   (   0  )
*
* `H = I - tau*( 1 )*( 1 v**T )`
* ( v )
*
* @private
* @param {NonNegativeInteger} N - order of the reflector
* @param {Float64Array} alpha - scalar, overwritten with beta on exit
* @param {NonNegativeInteger} offsetAlpha - index into alpha array
* @param {Float64Array} x - vector, overwritten with v on exit
* @param {integer} strideX - stride for x
* @param {NonNegativeInteger} offsetX - starting index for x
* @param {Float64Array} tau - output scalar
* @param {NonNegativeInteger} offsetTau - index into tau array
*/
function dlarfg( N, alpha, offsetAlpha, x, strideX, offsetX, tau, offsetTau ) {
	var rsafmn;
	var safmin;
	var xnorm;
	var sign;
	var beta;
	var knt;
	var j;

	if ( N <= 1 ) {
		tau[ offsetTau ] = 0.0;
		return;
	}

	xnorm = dnrm2( N - 1, x, strideX, offsetX );

	if ( xnorm === 0.0 ) {
		// H = I
		tau[ offsetTau ] = 0.0;
	} else {
		// General case; Fortran SIGN(A,B): |A| * sign(B)
		sign = Math.sign( alpha[ offsetAlpha ] ) || 1.0;
		beta = -sign * dlapy2( alpha[ offsetAlpha ], xnorm );
		safmin = dlamch( 'safe-minimum' ) / dlamch( 'epsilon' );
		knt = 0;

		if ( Math.abs( beta ) < safmin ) {
			// XNORM, BETA may be inaccurate; scale X and recompute:
			rsafmn = 1.0 / safmin;
			do {
				knt += 1;
				dscal( N - 1, rsafmn, x, strideX, offsetX );
				beta *= rsafmn;
				alpha[ offsetAlpha ] *= rsafmn;
			} while ( Math.abs( beta ) < safmin && knt < 20 );

			// New BETA is at most 1, at least SAFMIN:
			xnorm = dnrm2( N - 1, x, strideX, offsetX );
			sign = Math.sign( alpha[ offsetAlpha ] ) || 1.0;
			beta = -sign * dlapy2( alpha[ offsetAlpha ], xnorm );
		}
		tau[ offsetTau ] = ( beta - alpha[ offsetAlpha ] ) / beta;
		dscal( N - 1, 1.0 / ( alpha[ offsetAlpha ] - beta ), x, strideX, offsetX ); // eslint-disable-line max-len

		// If ALPHA is subnormal, it may lose relative accuracy
		for ( j = 0; j < knt; j++ ) {
			beta *= safmin;
		}
		alpha[ offsetAlpha ] = beta;
	}
}


// EXPORTS //

module.exports = dlarfg;

},{"../../../../blas/base/dnrm2/lib/base.js":5,"../../../../blas/base/dscal/lib/base.js":6,"../../dlamch/lib/base.js":19,"../../dlapy2/lib/base.js":21}],25:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dgemv = require( '../../../../blas/base/dgemv/lib/base.js' );
var dtrmv = require( '../../../../blas/base/dtrmv/lib/base.js' );


// MAIN //

/**
* Forms the triangular factor T of a real block reflector H of order N.
* which is defined as a product of K elementary reflectors.
*
* If DIRECT = 'F', H = H(1) H(2) ... H(k) and T is upper triangular.
* If DIRECT = 'B', H = H(k) ... H(2) H(1) and T is lower triangular.
*
* @private
* @param {string} direct - `'forward'` or `'backward'`
* @param {string} storev - `'columnwise'` or `'rowwise'`
* @param {NonNegativeInteger} N - order of the block reflector
* @param {NonNegativeInteger} K - number of elementary reflectors
* @param {Float64Array} V - matrix of reflector vectors
* @param {integer} strideV1 - stride of first dim of V
* @param {integer} strideV2 - stride of second dim of V
* @param {NonNegativeInteger} offsetV - starting index for V
* @param {Float64Array} TAU - array of scalar factors
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} T - output triangular matrix
* @param {integer} strideT1 - stride of first dim of T
* @param {integer} strideT2 - stride of second dim of T
* @param {NonNegativeInteger} offsetT - starting index for T
*/
function dlarft( direct, storev, N, K, V, strideV1, strideV2, offsetV, TAU, strideTAU, offsetTAU, T, strideT1, strideT2, offsetT ) {
	var prevlastv;
	var lastv;
	var jj;
	var i;
	var j;

	if ( N === 0 ) {
		return;
	}

	if ( direct === 'forward' ) {
		prevlastv = N;
		for ( i = 0; i < K; i++ ) {
			prevlastv = Math.max( prevlastv, i );
			if ( TAU[ offsetTAU + (i * strideTAU) ] === 0.0 ) {
				// H(i) = I
				for ( j = 0; j <= i; j++ ) {
					T[ offsetT + (j * strideT1) + (i * strideT2) ] = 0.0;
				}
			} else {
				if ( storev === 'columnwise' ) {
					// Skip trailing zeros in V(:,i)
					lastv = N;
					for ( jj = N - 1; jj > i; jj-- ) {
						if ( V[ offsetV + (jj * strideV1) + (i * strideV2) ] !== 0.0 ) {
							break;
						}
						lastv = jj;
					}

					// T(0:i-1, i) = -tau(i) * V(i, 0:i-1)
					for ( j = 0; j < i; j++ ) {
						T[ offsetT + (j * strideT1) + (i * strideT2) ] = -(TAU[ offsetTAU + (i * strideTAU) ] * V[ offsetV + (i * strideV1) + (j * strideV2) ]);
					}
					jj = Math.min( lastv, prevlastv );

					// T(0:i-1, i) += -tau(i) * V(i+1:jj-1, 0:i-1)**T * V(i+1:jj-1, i)
					if ( jj - i - 1 > 0 ) {
						dgemv( 'transpose', jj - i - 1, i, -TAU[ offsetTAU + (i * strideTAU) ], V, strideV1, strideV2, offsetV + (( i + 1 ) * strideV1), V, strideV1, offsetV + (( i + 1 ) * strideV1) + (i * strideV2), 1.0, T, strideT1, offsetT + (i * strideT2) );
					}
				} else {
					// Row-wise storage
					lastv = N;
					for ( jj = N - 1; jj > i; jj-- ) {
						if ( V[ offsetV + (i * strideV1) + (jj * strideV2) ] !== 0.0 ) {
							break;
						}
						lastv = jj;
					}

					// T(0:i-1, i) = -tau(i) * V(0:i-1, i)
					for ( j = 0; j < i; j++ ) {
						T[ offsetT + (j * strideT1) + (i * strideT2) ] = -(TAU[ offsetTAU + (i * strideTAU) ] * V[ offsetV + (j * strideV1) + (i * strideV2) ]);
					}
					jj = Math.min( lastv, prevlastv );

					// T(0:i-1, i) += -tau(i) * V(0:i-1, i+1:jj-1) * V(i, i+1:jj-1)**T
					if ( jj - i - 1 > 0 ) {
						dgemv( 'no-transpose', i, jj - i - 1, -TAU[ offsetTAU + (i * strideTAU) ], V, strideV1, strideV2, offsetV + (( i + 1 ) * strideV2), V, strideV2, offsetV + (i * strideV1) + (( i + 1 ) * strideV2), 1.0, T, strideT1, offsetT + (i * strideT2) );
					}
				}

				// T(0:i-1, i) := T(0:i-1, 0:i-1) * T(0:i-1, i)
				if ( i > 0 ) {
					dtrmv( 'upper', 'no-transpose', 'non-unit', i, T, strideT1, strideT2, offsetT, T, strideT1, offsetT + (i * strideT2) );
				}
				T[ offsetT + (i * strideT1) + (i * strideT2) ] = TAU[ offsetTAU + (i * strideTAU) ];

				if ( i > 0 ) {
					prevlastv = Math.max( prevlastv, lastv );
				} else {
					prevlastv = lastv;
				}
			}
		}
	} else {
		// Backward: T is lower triangular
		prevlastv = 0;
		for ( i = K - 1; i >= 0; i-- ) {
			if ( TAU[ offsetTAU + (i * strideTAU) ] === 0.0 ) {
				for ( j = i; j < K; j++ ) {
					T[ offsetT + (j * strideT1) + (i * strideT2) ] = 0.0;
				}
			} else {
				if ( i < K - 1 ) {
					if ( storev === 'columnwise' ) {
						// Skip leading zeros in V(:,i)
						lastv = 0;
						for ( jj = 0; jj < i; jj++ ) {
							if ( V[ offsetV + (jj * strideV1) + (i * strideV2) ] !== 0.0 ) {
								break;
							}
							lastv = jj + 1;
						}

						for ( j = i + 1; j < K; j++ ) {
							T[ offsetT + (j * strideT1) + (i * strideT2) ] = -(TAU[ offsetTAU + (i * strideTAU) ] * V[ offsetV + (( N - K + i ) * strideV1) + (j * strideV2) ]);
						}
						jj = Math.max( lastv, prevlastv );

						if ( N - K + i - jj > 0 ) {
							dgemv( 'transpose', N - K + i - jj, K - i - 1, -TAU[ offsetTAU + (i * strideTAU) ], V, strideV1, strideV2, offsetV + (jj * strideV1) + (( i + 1 ) * strideV2), V, strideV1, offsetV + (jj * strideV1) + (i * strideV2), 1.0, T, strideT1, offsetT + (( i + 1 ) * strideT1) + (i * strideT2) );
						}
					} else {
						// Row-wise storage
						lastv = 0;
						for ( jj = 0; jj < i; jj++ ) {
							if ( V[ offsetV + (i * strideV1) + (jj * strideV2) ] !== 0.0 ) {
								break;
							}
							lastv = jj + 1;
						}

						for ( j = i + 1; j < K; j++ ) {
							T[ offsetT + (j * strideT1) + (i * strideT2) ] = -(TAU[ offsetTAU + (i * strideTAU) ] * V[ offsetV + (j * strideV1) + (( N - K + i ) * strideV2) ]);
						}
						jj = Math.max( lastv, prevlastv );

						if ( N - K + i - jj > 0 ) {
							dgemv( 'no-transpose', K - i - 1, N - K + i - jj, -TAU[ offsetTAU + (i * strideTAU) ], V, strideV1, strideV2, offsetV + (( i + 1 ) * strideV1) + (jj * strideV2), V, strideV2, offsetV + (i * strideV1) + (jj * strideV2), 1.0, T, strideT1, offsetT + (( i + 1 ) * strideT1) + (i * strideT2) );
						}
					}

					dtrmv( 'lower', 'no-transpose', 'non-unit', K - i - 1, T, strideT1, strideT2, offsetT + (( i + 1 ) * strideT1) + (( i + 1 ) * strideT2), T, strideT1, offsetT + (( i + 1 ) * strideT1) + (i * strideT2) );
					if ( i > 0 ) {
						prevlastv = Math.min( prevlastv, lastv );
					} else {
						prevlastv = lastv;
					}
				}
				T[ offsetT + (i * strideT1) + (i * strideT2) ] = TAU[ offsetTAU + (i * strideTAU) ];
			}
		}
	}
}


// EXPORTS //

module.exports = dlarft;

},{"../../../../blas/base/dgemv/lib/base.js":3,"../../../../blas/base/dtrmv/lib/base.js":8}],26:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dlamch = require( '../../dlamch/lib/base.js' );


// MAIN //

/**
* Multiplies a real M-by-N matrix A by the real scalar CTO/CFROM, doing.
* the multiplication safely with respect to overflow and underflow via
* iterative scaling.
*
* TYPE specifies which matrix elements are accessed:
* 'G' - general full matrix
* 'L' - lower triangular
* 'U' - upper triangular
* 'H' - upper Hessenberg
* 'B' - lower half of symmetric band (kl+1 rows, N cols)
* 'Q' - upper half of symmetric band (ku+1 rows, N cols)
* 'Z' - band matrix (2*kl+ku+1 rows, N cols)
*
* @private
* @param {string} type - `'general'`, `'lower'`, `'upper'`, `'upper-hessenberg'`, `'lower-band'`, `'upper-band'`, or `'band'`
* @param {integer} kl - lower bandwidth (for banded types)
* @param {integer} ku - upper bandwidth (for banded types)
* @param {number} cfrom - scale denominator (must be nonzero)
* @param {number} cto - scale numerator
* @param {NonNegativeInteger} M - rows
* @param {NonNegativeInteger} N - columns
* @param {Float64Array} A - matrix
* @param {integer} strideA1 - first dimension stride
* @param {integer} strideA2 - second dimension stride
* @param {NonNegativeInteger} offsetA - starting index for A
* @returns {integer} 0 on success
*/
function dlascl( type, kl, ku, cfrom, cto, M, N, A, strideA1, strideA2, offsetA ) {
	var smlnum;
	var bignum;
	var cfromc;
	var cfrom1;
	var itype;
	var ctoc;
	var cto1;
	var done;
	var iMax;
	var iMin;
	var mul;
	var k1;
	var k2;
	var k3;
	var k4;
	var ai;
	var i;
	var j;

	// Determine itype
	if ( type === 'general' ) {
		itype = 0;
	} else if ( type === 'lower' ) {
		itype = 1;
	} else if ( type === 'upper' ) {
		itype = 2;
	} else if ( type === 'upper-hessenberg' ) {
		itype = 3;
	} else if ( type === 'lower-band' ) {
		itype = 4;
	} else if ( type === 'upper-band' ) {
		itype = 5;
	} else if ( type === 'band' ) {
		itype = 6;
	} else {
		return -1;
	}

	// Quick return
	if ( N === 0 || M === 0 ) {
		return 0;
	}

	// Get machine parameters
	smlnum = dlamch( 'safe-minimum' );
	bignum = 1.0 / smlnum;

	cfromc = cfrom;
	ctoc = cto;

	// Iterative scaling loop (while-loop pattern from GO TO 10)
	done = false;
	while ( !done ) {
		cfrom1 = cfromc * smlnum;
		if ( cfrom1 === cfromc ) {
			// cfromc is an inf
			mul = ctoc / cfromc;
			done = true;
		} else {
			cto1 = ctoc / bignum;
			if ( cto1 === ctoc ) {
				// ctoc is either 0 or an inf
				mul = ctoc;
				done = true;
				cfromc = 1.0;
			} else if ( Math.abs( cfrom1 ) > Math.abs( ctoc ) && ctoc !== 0.0 ) {
				mul = smlnum;
				done = false;
				cfromc = cfrom1;
			} else if ( Math.abs( cto1 ) > Math.abs( cfromc ) ) {
				mul = bignum;
				done = false;
				ctoc = cto1;
			} else {
				mul = ctoc / cfromc;
				done = true;
				if ( mul === 1.0 ) {
					return 0;
				}
			}
		}

		if ( itype === 0 ) {
			// Full matrix
			for ( j = 0; j < N; j++ ) {
				for ( i = 0; i < M; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		} else if ( itype === 1 ) {
			// Lower triangular
			for ( j = 0; j < N; j++ ) {
				for ( i = j; i < M; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		} else if ( itype === 2 ) {
			// Upper triangular
			for ( j = 0; j < N; j++ ) {
				iMax = Math.min( j + 1, M );
				for ( i = 0; i < iMax; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		} else if ( itype === 3 ) {
			// Upper Hessenberg
			for ( j = 0; j < N; j++ ) {
				iMax = Math.min( j + 2, M );
				for ( i = 0; i < iMax; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		} else if ( itype === 4 ) {
			// Lower half of a symmetric band matrix
			k3 = kl + 1;
			k4 = N + 1;
			for ( j = 0; j < N; j++ ) {
				iMax = Math.min( k3, k4 - j - 1 );
				for ( i = 0; i < iMax; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		} else if ( itype === 5 ) {
			// Upper half of a symmetric band matrix
			k1 = ku + 2;
			k3 = ku + 1;
			for ( j = 0; j < N; j++ ) {
				iMin = Math.max( k1 - j - 2, 0 );
				for ( i = iMin; i < k3; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		} else if ( itype === 6 ) {
			// Band matrix
			k1 = kl + ku + 2;
			k2 = kl + 1;
			k3 = (2 * kl) + ku + 1;
			k4 = kl + ku + 1 + M;
			for ( j = 0; j < N; j++ ) {
				iMin = Math.max( k1 - j - 2, k2 - 1 );
				iMax = Math.min( k3, k4 - j - 1 );
				for ( i = iMin; i < iMax; i++ ) {
					ai = offsetA + (i * strideA1) + (j * strideA2);
					A[ ai ] *= mul;
				}
			}
		}
	}

	return 0;
}


// EXPORTS //

module.exports = dlascl;

},{"../../dlamch/lib/base.js":19}],27:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MAIN //

/**
* Initializes an M-by-N matrix A to BETA on the diagonal and ALPHA on the.
* off-diagonals.
*
* @private
* @param {string} uplo - `'upper'` or `'lower'`, otherwise full matrix
* @param {NonNegativeInteger} M - number of rows
* @param {NonNegativeInteger} N - number of columns
* @param {number} alpha - off-diagonal value
* @param {number} beta - diagonal value
* @param {Float64Array} A - input/output matrix
* @param {integer} strideA1 - stride of the first dimension of `A`
* @param {integer} strideA2 - stride of the second dimension of `A`
* @param {NonNegativeInteger} offsetA - starting index for `A`
* @returns {Float64Array} A
*/
function dlaset( uplo, M, N, alpha, beta, A, strideA1, strideA2, offsetA ) {
	var idx;
	var mn;
	var i;
	var j;

	mn = Math.min( M, N );

	if ( uplo === 'upper' ) {
		// Set the strictly upper triangular part to ALPHA.
		for ( j = 1; j < N; j++ ) {
			idx = offsetA + (j * strideA2);
			for ( i = 0; i < Math.min( j, M ); i++ ) {
				A[ idx ] = alpha;
				idx += strideA1;
			}
		}
	} else if ( uplo === 'lower' ) {
		// Set the strictly lower triangular part to ALPHA.
		for ( j = 0; j < mn; j++ ) {
			idx = offsetA + (( j + 1 ) * strideA1) + (j * strideA2);
			for ( i = j + 1; i < M; i++ ) {
				A[ idx ] = alpha;
				idx += strideA1;
			}
		}
	} else {
		// Set the full matrix to ALPHA.
		for ( j = 0; j < N; j++ ) {
			idx = offsetA + (j * strideA2);
			for ( i = 0; i < M; i++ ) {
				A[ idx ] = alpha;
				idx += strideA1;
			}
		}
	}

	// Set the diagonal to BETA.
	idx = offsetA;
	for ( i = 0; i < mn; i++ ) {
		A[ idx ] = beta;
		idx += strideA1 + strideA2;
	}

	return A;
}


// EXPORTS //

module.exports = dlaset;

},{}],28:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

// Blue's scaling constants for double precision (IEEE 754):

//   radix=2, minexponent=-1021, maxexponent=1024, digits=53
var TSML = Math.pow( 2, -511 );  // threshold: values smaller than this are "small"
var TBIG = Math.pow( 2, 486 );   // threshold: values bigger than this are "big"
var SSML = Math.pow( 2, 537 );   // scale-up multiplier for small values
var SBIG = Math.pow( 2, -538 );  // scale-down multiplier for big values


// MAIN //

/**
* Returns updated scale and sum-of-squares in scaled form.
*
* The return value satisfies:
* `scale_out^2*sumsq_out = x(1)^2 + ... + x(n)^2 + scale_in^2*sumsq_in`
*
* Uses Blue's safe-scaling algorithm to avoid overflow/underflow.
*
* @private
* @param {NonNegativeInteger} N - number of elements
* @param {Float64Array} x - input array
* @param {integer} stride - stride length for `x`
* @param {NonNegativeInteger} offset - starting index for `x`
* @param {number} scale - input scale
* @param {number} sumsq - input sum of squares
* @returns {Object} object with `scl` and `sumsq` properties
*/
function dlassq( N, x, stride, offset, scale, sumsq ) {
	var notbig;
	var abig;
	var amed;
	var asml;
	var ymax;
	var ymin;
	var ax;
	var ix;
	var i;

	// Quick return if NaN
	if ( scale !== scale || sumsq !== sumsq ) {
		return {
			'scl': scale,
			'sumsq': sumsq
		};
	}
	if ( sumsq === 0.0 ) {
		scale = 1.0;
	}
	if ( scale === 0.0 ) {
		scale = 1.0;
		sumsq = 0.0;
	}
	if ( N <= 0 ) {
		return {
			'scl': scale,
			'sumsq': sumsq
		};
	}

	// Compute the sum of squares in 3 accumulators:
	//   abig -- sums of squares scaled down to avoid overflow
	//   asml -- sums of squares scaled up to avoid underflow
	//   amed -- sums of squares that do not require scaling
	notbig = true;
	asml = 0.0;
	amed = 0.0;
	abig = 0.0;

	ix = offset;
	if ( stride < 0 ) {
		ix = offset - (( N - 1 ) * stride);
	}

	for ( i = 0; i < N; i++ ) {
		ax = Math.abs( x[ ix ] );
		if ( ax > TBIG ) {
			abig += ( ax * SBIG ) * ( ax * SBIG );
			notbig = false;
		} else if ( ax < TSML ) {
			if ( notbig ) {
				asml += ( ax * SSML ) * ( ax * SSML );
			}
		} else {
			amed += ax * ax;
		}
		ix += stride;
	}

	// Put the existing sum of squares into one of the accumulators
	if ( sumsq > 0.0 ) {
		ax = scale * Math.sqrt( sumsq );
		if ( ax > TBIG ) {
			if ( scale > 1.0 ) {
				scale *= SBIG;
				abig += scale * ( scale * sumsq );
			} else {
				// sumsq > tbig^2 => (sbig * (sbig * sumsq)) is representable
				abig += scale * ( scale * ( SBIG * ( SBIG * sumsq ) ) );
			}
		} else if ( ax < TSML ) {
			if ( notbig ) {
				if ( scale < 1.0 ) {
					scale *= SSML;
					asml += scale * ( scale * sumsq );
				} else {
					// sumsq < tsml^2 => (ssml * (ssml * sumsq)) is representable
					asml += scale * ( scale * ( SSML * ( SSML * sumsq ) ) );
				}
			}
		} else {
			amed += scale * ( scale * sumsq );
		}
	}

	// Combine accumulators
	if ( abig > 0.0 ) {
		// Combine abig and amed
		if ( amed > 0.0 || amed !== amed ) {
			abig += ( amed * SBIG ) * SBIG;
		}
		scale = 1.0 / SBIG;
		sumsq = abig;
	} else if ( asml > 0.0 ) {
		// Combine amed and asml
		if ( amed > 0.0 || amed !== amed ) {
			amed = Math.sqrt( amed );
			asml = Math.sqrt( asml ) / SSML;
			if ( asml > amed ) {
				ymin = amed;
				ymax = asml;
			} else {
				ymin = asml;
				ymax = amed;
			}
			scale = 1.0;
			sumsq = (ymax * ymax) * ( 1.0 + (( ymin / ymax ) * ( ymin / ymax )) );
		} else {
			scale = 1.0 / SSML;
			sumsq = asml;
		}
	} else {
		// All values are mid-range or zero
		scale = 1.0;
		sumsq = amed;
	}

	return {
		'scl': scale,
		'sumsq': sumsq
	};
}


// EXPORTS //

module.exports = dlassq;

},{}],29:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dlarf = require( '../../dlarf/lib/base.js' );


// MAIN //

/**
* Overwrites the M-by-N matrix C with Q_C, Q__T_C, C_Q, or `C_Q*_T`.
* where Q is a real orthogonal matrix defined as the product of K
* elementary reflectors `Q = H(1)*H(2)*...*H(k)` as returned
* by DGEQR2.
*
* @private
* @param {string} side - `'left'` to apply Q from left, `'right'` from right
* @param {string} trans - `'no-transpose'` for Q, `'transpose'` for Q^T
* @param {NonNegativeInteger} M - number of rows of C
* @param {NonNegativeInteger} N - number of columns of C
* @param {NonNegativeInteger} K - number of elementary reflectors
* @param {Float64Array} A - reflector vectors from DGEQR2
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - scalar factors of reflectors
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} C - input/output matrix
* @param {integer} strideC1 - stride of the first dimension of C
* @param {integer} strideC2 - stride of the second dimension of C
* @param {NonNegativeInteger} offsetC - starting index for C
* @param {Float64Array} WORK - workspace array
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dorm2r( side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK ) {
	var notran;
	var left;
	var idxA;
	var aii;
	var mi;
	var ni;
	var ic;
	var jc;
	var i1;
	var i2;
	var i3;
	var i;

	if ( M === 0 || N === 0 || K === 0 ) {
		return 0;
	}

	left = ( side === 'left' );
	notran = ( trans === 'no-transpose' );

	// Determine iteration direction:

	// For left+trans or right+notran: iterate forward (i = 0, 1, ..., K-1)

	// For left+notran or right+trans: iterate backward (i = K-1, ..., 1, 0)
	if ( ( left && !notran ) || ( !left && notran ) ) {
		i1 = 0;
		i2 = K;
		i3 = 1;
	} else {
		i1 = K - 1;
		i2 = -1;
		i3 = -1;
	}

	if ( left ) {
		ni = N;
		jc = 0;
	} else {
		mi = M;
		ic = 0;
	}

	for ( i = i1; i !== i2; i += i3 ) {
		if ( left ) {
			// H(i) is applied to C(i:M-1, 0:N-1)
			mi = M - i;
			ic = i;
		} else {
			// H(i) is applied to C(0:M-1, i:N-1)
			ni = N - i;
			jc = i;
		}

		// Save A(i,i) and set it to 1.0
		idxA = offsetA + (i * strideA1) + (i * strideA2);
		aii = A[ idxA ];
		A[ idxA ] = 1.0;

		// Apply H(i) to C(ic:ic+mi-1, jc:jc+ni-1) from the left or right

		// Dlarf expects: side, M, N, v, strideV, offsetV, tau, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK
		dlarf(side, mi, ni, A, strideA1, offsetA + (i * strideA1) + (i * strideA2), TAU[ offsetTAU + (i * strideTAU) ], C, strideC1, strideC2, offsetC + (ic * strideC1) + (jc * strideC2), WORK, strideWORK, offsetWORK);

		// Restore A(i,i)
		A[ idxA ] = aii;
	}

	return 0;
}


// EXPORTS //

module.exports = dorm2r;

},{"../../dlarf/lib/base.js":22}],30:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dlarf = require( '../../dlarf/lib/base.js' );


// MAIN //

/**
* Overwrites the M-by-N matrix C with Q_C, Q^T_C, C_Q, or C_Q^T.
* where Q is a real orthogonal matrix defined as the product of K
* elementary reflectors (from an LQ factorization):
*
* Q = H(k) ... H(2) H(1)
*
* as returned by DGELQ2. This is the unblocked algorithm.
*
* @private
* @param {string} side - `'left'` to apply Q from left, `'right'` from right
* @param {string} trans - `'no-transpose'` for Q, `'transpose'` for Q^T
* @param {NonNegativeInteger} M - number of rows of C
* @param {NonNegativeInteger} N - number of columns of C
* @param {NonNegativeInteger} K - number of elementary reflectors
* @param {Float64Array} A - reflector vectors from DGELQ2 (stored rowwise)
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - scalar factors of reflectors
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} C - input/output matrix
* @param {integer} strideC1 - stride of the first dimension of C
* @param {integer} strideC2 - stride of the second dimension of C
* @param {NonNegativeInteger} offsetC - starting index for C
* @param {Float64Array} WORK - workspace array
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dorml2( side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK ) {
	var notran;
	var left;
	var aii;
	var mi;
	var ni;
	var ic;
	var jc;
	var i1;
	var i2;
	var i3;
	var i;

	if ( M === 0 || N === 0 || K === 0 ) {
		return 0;
	}

	left = ( side === 'left' );
	notran = ( trans === 'no-transpose' );

	// Determine iteration direction:

	// Forward (i=0..K-1) when (LEFT && NOTRAN) or (!LEFT && !NOTRAN)

	// Backward (i=K-1..0) otherwise
	if ( ( left && notran ) || ( !left && !notran ) ) {
		i1 = 0;
		i2 = K;
		i3 = 1;
	} else {
		i1 = K - 1;
		i2 = -1;
		i3 = -1;
	}

	if ( left ) {
		ni = N;
		jc = 0;
	} else {
		mi = M;
		ic = 0;
	}

	for ( i = i1; ( i3 > 0 ) ? ( i < i2 ) : ( i > i2 ); i += i3 ) {
		if ( left ) {
			// Apply H(i) to C(i:M-1, 0:N-1)
			mi = M - i;
			ic = i;
		} else {
			// Apply H(i) to C(0:M-1, i:N-1)
			ni = N - i;
			jc = i;
		}

		// Save A(i,i) and set it to ONE
		aii = A[ offsetA + (i * strideA1) + (i * strideA2) ];
		A[ offsetA + (i * strideA1) + (i * strideA2) ] = 1.0;

		// Apply H(i): the reflector vector is row i of A starting at column i,

		// So v = A(i, i:nq-1), stored with stride strideA2
		dlarf( side, mi, ni, A, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU[ offsetTAU + (i * strideTAU) ], C, strideC1, strideC2, offsetC + (ic * strideC1) + (jc * strideC2), WORK, strideWORK, offsetWORK);

		// Restore A(i,i)
		A[ offsetA + (i * strideA1) + (i * strideA2) ] = aii;
	}

	return 0;
}


// EXPORTS //

module.exports = dorml2;

},{"../../dlarf/lib/base.js":22}],31:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dlarfb = require( '../../dlarfb/lib/base.js' );
var dlarft = require( '../../dlarft/lib/base.js' );
var dorml2 = require( '../../dorml2/lib/base.js' );


// VARIABLES //

var NB = 32; // Hardcoded block size


// MAIN //

/**
* Overwrites the M-by-N matrix C with Q_C, Q^T_C, C_Q, or C_Q^T.
* where Q is a real orthogonal matrix defined as the product of K
* elementary reflectors (from an LQ factorization):
*
* Q = H(k) ... H(2) H(1)
*
* as returned by DGELQF. Uses a blocked algorithm with block size NB=32.
*
* @private
* @param {string} side - `'left'` to apply Q from left, `'right'` from right
* @param {string} trans - `'no-transpose'` for Q, `'transpose'` for Q^T
* @param {NonNegativeInteger} M - number of rows of C
* @param {NonNegativeInteger} N - number of columns of C
* @param {NonNegativeInteger} K - number of elementary reflectors
* @param {Float64Array} A - reflector vectors from DGELQF (stored rowwise)
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - scalar factors of reflectors
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} C - input/output matrix
* @param {integer} strideC1 - stride of the first dimension of C
* @param {integer} strideC2 - stride of the second dimension of C
* @param {NonNegativeInteger} offsetC - starting index for C
* @param {Float64Array} WORK - caller-provided workspace; size must be at least `(ldwork * nb) + (ldt * nb)` elements, where `nb = min(32, K)`, `ldt = nb + 1`, and `ldwork = max(1, N)` for `side = 'left'` or `max(1, M)` for `side = 'right'`. WORK is partitioned: `WORK[offsetWORK .. offsetWORK + ldwork*nb)` is the main scratch passed to DLARFB; `WORK[offsetWORK + ldwork*nb .. offsetWORK + ldwork*nb + ldt*nb)` holds the block-reflector triangular factor T (column-major with leading dimension `ldt`).
* @param {integer} strideWORK - stride for WORK (must be 1)
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dormlq( side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK ) {
	var offsetT;
	var notran;
	var transt;
	var ldwork;
	var left;
	var ldt;
	var nw;
	var nb;
	var nq;
	var mi;
	var ni;
	var ic;
	var jc;
	var ib;
	var i1;
	var i2;
	var i3;
	var T;
	var i;

	if ( M === 0 || N === 0 || K === 0 ) {
		return 0;
	}

	left = ( side === 'left' );
	notran = ( trans === 'no-transpose' );

	if ( left ) {
		nq = M;
		nw = Math.max( 1, N );
	} else {
		nq = N;
		nw = Math.max( 1, M );
	}

	nb = NB;
	if ( nb > K ) {
		nb = K;
	}

	// If block size is too small or equals K, use unblocked algorithm
	if ( nb < 2 || nb >= K ) {
		return dorml2( side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK );
	}

	ldwork = nw;
	ldt = nb + 1;

	// Partition caller-provided WORK: main scratch occupies the first `ldwork*nb` slots; the block-reflector triangular factor T occupies the next `ldt*nb` slots.
	T = WORK;
	offsetT = offsetWORK + ( ldwork * nb );

	// Determine iteration direction. Forward when (LEFT && NOTRAN) or (!LEFT && !NOTRAN).
	if ( ( left && notran ) || ( !left && !notran ) ) {
		i1 = 0;
		i2 = K;
		i3 = nb;
	} else {
		i1 = Math.floor( ( K - 1 ) / nb ) * nb;
		i2 = -1;
		i3 = -nb;
	}

	if ( left ) {
		ni = N;
		jc = 0;
	} else {
		mi = M;
		ic = 0;
	}

	// For LQ reflectors, the transpose relationship is inverted:
	// Q = H(k)...H(1), so applying Q^T uses forward H, applying Q uses H^T
	if ( notran ) {
		transt = 'transpose';
	} else {
		transt = 'no-transpose';
	}

	for ( i = i1; ( i3 > 0 ) ? ( i < i2 ) : ( i > i2 ); i += i3 ) {
		ib = Math.min( nb, K - i );

		// Form the triangular factor of the block reflector

		// H = H(i) H(i+1) ... H(i+ib-1)
		dlarft('forward', 'rowwise', nq - i, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), T, 1, ldt, offsetT);

		if ( left ) {
			mi = M - i;
			ic = i;
		} else {
			ni = N - i;
			jc = i;
		}

		// Apply H or H^T to C(ic:ic+mi, jc:jc+ni)
		dlarfb(side, transt, 'forward', 'rowwise', mi, ni, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), T, 1, ldt, offsetT, C, strideC1, strideC2, offsetC + (ic * strideC1) + (jc * strideC2), WORK, 1, ldwork, offsetWORK);
	}

	return 0;
}


// EXPORTS //

module.exports = dormlq;

},{"../../dlarfb/lib/base.js":23,"../../dlarft/lib/base.js":25,"../../dorml2/lib/base.js":30}],32:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params, no-var */

'use strict';

// MODULES //

var dlarfb = require( '../../dlarfb/lib/base.js' );
var dlarft = require( '../../dlarft/lib/base.js' );
var dorm2r = require( '../../dorm2r/lib/base.js' );


// VARIABLES //

var NB = 32; // Hardcoded block size


// MAIN //

/**
* Overwrites the M-by-N real matrix C with Q_C, Q^T_C, C_Q, or C_Q^T.
* where Q is a real orthogonal matrix defined as the product of K
* elementary reflectors `Q = H(1)*H(2)*... * H(k)` as returned
* by DGEQRF. Uses a blocked algorithm with block size NB=32.
*
* The caller-provided WORK buffer must have at least `(ldwork*NB) + ((NB+1)*NB)`
* elements available starting at `offsetWORK`, where `ldwork = max(1,N)` for
* `side='left'` and `ldwork = max(1,M)` for `side='right'` (NB=32). The buffer
* is partitioned into two contiguous segments: the first `ldwork*NB` elements
* are used as dlarfb's WORK; the remaining `(NB+1)*NB` elements hold the block
* reflector T. WORK is accessed with `strideWORK=1` internally.
*
* @private
* @param {string} side - `'left'` to apply Q from left, `'right'` from right
* @param {string} trans - `'no-transpose'` for Q, `'transpose'` for Q^T
* @param {NonNegativeInteger} M - number of rows of C
* @param {NonNegativeInteger} N - number of columns of C
* @param {NonNegativeInteger} K - number of elementary reflectors
* @param {Float64Array} A - reflector vectors from DGEQRF
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @param {Float64Array} TAU - scalar factors of reflectors
* @param {integer} strideTAU - stride for TAU
* @param {NonNegativeInteger} offsetTAU - starting index for TAU
* @param {Float64Array} C - input/output matrix
* @param {integer} strideC1 - stride of the first dimension of C
* @param {integer} strideC2 - stride of the second dimension of C
* @param {NonNegativeInteger} offsetC - starting index for C
* @param {Float64Array} WORK - caller-provided workspace (see description for size)
* @param {integer} strideWORK - stride for WORK
* @param {NonNegativeInteger} offsetWORK - starting index for WORK
* @returns {integer} info - 0 if successful
*/
function dormqr( side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK ) {
	var offsetT;
	var notran;
	var ldwork;
	var left;
	var ldt;
	var nw;
	var nb;
	var nq;
	var mi;
	var ni;
	var ic;
	var jc;
	var ib;
	var i1;
	var i2;
	var i3;
	var T;
	var i;

	left = ( side === 'left' );
	notran = ( trans === 'no-transpose' );

	if ( left ) {
		nq = M;
		nw = Math.max( 1, N );
	} else {
		nq = N;
		nw = Math.max( 1, M );
	}

	// Quick return
	if ( M === 0 || N === 0 || K === 0 ) {
		return 0;
	}

	nb = NB;
	ldwork = nw;
	ldt = nb + 1;
	T = WORK;
	offsetT = offsetWORK + (nw * nb);

	// If nb >= K, use unblocked code
	if ( nb >= K ) {
		dorm2r( side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK );
		return 0;
	}

	// Determine iteration direction
	if ( ( left && !notran ) || ( !left && notran ) ) {
		i1 = 0;
		i2 = K;
		i3 = nb;
	} else {
		i1 = Math.floor( ( K - 1 ) / nb ) * nb;
		i2 = -1;
		i3 = -nb;
	}

	if ( left ) {
		ni = N;
		jc = 0;
	} else {
		mi = M;
		ic = 0;
	}

	for ( i = i1; ( i3 > 0 ) ? ( i < i2 ) : ( i > i2 ); i += i3 ) {
		ib = Math.min( nb, K - i );

		// Form the triangular factor of the block reflector

		// H = H(i) H(i+1) ... H(i+ib-1)
		dlarft('forward', 'columnwise', nq - i, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), TAU, strideTAU, offsetTAU + (i * strideTAU), T, 1, ldt, offsetT);

		if ( left ) {
			mi = M - i;
			ic = i;
		} else {
			ni = N - i;
			jc = i;
		}

		// Apply H or H^T to C(ic:ic+mi, jc:jc+ni)
		dlarfb(side, trans, 'forward', 'columnwise', mi, ni, ib, A, strideA1, strideA2, offsetA + (i * strideA1) + (i * strideA2), T, 1, ldt, offsetT, C, strideC1, strideC2, offsetC + (ic * strideC1) + (jc * strideC2), WORK, 1, ldwork, offsetWORK);
	}

	return 0;
}


// EXPORTS //

module.exports = dormqr;

},{"../../dlarfb/lib/base.js":23,"../../dlarft/lib/base.js":25,"../../dorm2r/lib/base.js":29}],33:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-len, max-params */

'use strict';

// MODULES //

var dtrsm = require( '../../../../blas/base/dtrsm/lib/base.js' );


// MAIN //

/**
* Solves a triangular system of the form:.
* `A*X = B`,  `A^T*X = B`,  or  `A^H * X = B`
* where A is a triangular matrix of order N, and B is an N-by-NRHS matrix.
* A check is made to verify that A is nonsingular.
*
* @private
* @param {string} uplo - `'upper'` or `'lower'`
* @param {string} trans - `'no-transpose'` or `'transpose'`
* @param {string} diag - `'unit'` or `'non-unit'`
* @param {NonNegativeInteger} N - order of matrix A
* @param {NonNegativeInteger} nrhs - number of right-hand side columns
* @param {Float64Array} A - triangular matrix A
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - index offset for A
* @param {Float64Array} B - right-hand side matrix, overwritten with solution
* @param {integer} strideB1 - stride of the first dimension of B
* @param {integer} strideB2 - stride of the second dimension of B
* @param {NonNegativeInteger} offsetB - index offset for B
* @returns {integer} info - 0 if successful, k if A(k-1,k-1) is zero
*/
function dtrtrs( uplo, trans, diag, N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB ) {
	var nounit;
	var sa1;
	var sa2;
	var i;

	nounit = ( diag === 'non-unit' );

	if ( N === 0 ) {
		return 0;
	}

	sa1 = strideA1;
	sa2 = strideA2;

	// Check for singularity.
	if ( nounit ) {
		for ( i = 0; i < N; i++ ) {
			if ( A[ offsetA + (i * sa1) + (i * sa2) ] === 0.0 ) {
				return i + 1;
			}
		}
	}

	// Solve A * X = B, A^T * X = B, or A^H * X = B.
	dtrsm( 'left', uplo, trans, diag, N, nrhs, 1.0, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB);

	return 0;
}


// EXPORTS //

module.exports = dtrtrs;

},{"../../../../blas/base/dtrsm/lib/base.js":9}],34:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Scans a real matrix for its last non-zero column.
*
* @private
* @param {NonNegativeInteger} M - number of rows
* @param {NonNegativeInteger} N - number of columns
* @param {Float64Array} A - input matrix
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @returns {integer} 0-based index of last non-zero column, or -1 if none
*/
function iladlc( M, N, A, strideA1, strideA2, offsetA ) {
	var i;
	var j;

	if ( N === 0 ) {
		return -1;
	}

	// Quick test for the common case where one corner is non-zero.
	if ( A[ offsetA + (( N - 1 ) * strideA2) ] !== 0.0 ||
		A[ offsetA + (( M - 1 ) * strideA1) + (( N - 1 ) * strideA2) ] !== 0.0 ) {
		return N - 1;
	}

	// Scan each column from the end, returning with the first non-zero.
	for ( j = N - 1; j >= 0; j-- ) {
		for ( i = 0; i < M; i++ ) {
			if ( A[ offsetA + (i * strideA1) + (j * strideA2) ] !== 0.0 ) {
				return j;
			}
		}
	}
	return -1;
}


// EXPORTS //

module.exports = iladlc;

},{}],35:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Scans a real matrix for its last non-zero row.
*
* @private
* @param {NonNegativeInteger} M - number of rows
* @param {NonNegativeInteger} N - number of columns
* @param {Float64Array} A - input matrix
* @param {integer} strideA1 - stride of the first dimension of A
* @param {integer} strideA2 - stride of the second dimension of A
* @param {NonNegativeInteger} offsetA - starting index for A
* @returns {integer} 0-based index of last non-zero row, or -1 if none
*/
function iladlr( M, N, A, strideA1, strideA2, offsetA ) {
	var result;
	var i;
	var j;

	if ( M === 0 ) {
		return -1;
	}

	// Quick test for the common case where one corner is non-zero.
	if ( A[ offsetA + (( M - 1 ) * strideA1) ] !== 0.0 ||
		A[ offsetA + (( M - 1 ) * strideA1) + (( N - 1 ) * strideA2) ] !== 0.0 ) {
		return M - 1;
	}

	// Scan up each column tracking the last non-zero row seen.
	result = -1;
	for ( j = 0; j < N; j++ ) {
		i = M - 1;
		while ( i >= 0 && A[ offsetA + (i * strideA1) + (j * strideA2) ] === 0.0 ) {
			i -= 1;
		}
		if ( i > result ) {
			result = i;
		}
	}
	return result;
}


// EXPORTS //

module.exports = iladlr;

},{}],36:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return an accessor function for retrieving an element from an array-like object supporting the get/set protocol.
*
* @module @stdlib/array/base/accessor-getter
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var dtype = require( '@stdlib/array/dtype' );
* var getter = require( '@stdlib/array/base/accessor-getter' );
*
* var arr = new Complex64Array( [ 1, 2, 3, 4 ] );
*
* var get = getter( dtype( arr ) );
* var v = get( arr, 1 );
* // returns <Complex64>
*
* var re = realf( v );
* // returns 3.0
*
* var im = imagf( v );
* // returns 4.0
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":37}],37:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var GETTERS = {
	'complex128': getComplex128,
	'complex64': getComplex64,
	'default': getArrayLike
};


// FUNCTIONS //

/**
* Returns an element from a `Complex128Array`.
*
* @private
* @param {Complex128Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( [ 1, 2, 3, 4 ] );
*
* var v = getComplex128( arr, 1 );
* // returns <Complex128>
*
* var re = real( v );
* // returns 3.0
*
* var im = imag( v );
* // returns 4.0
*/
function getComplex128( arr, idx ) {
	return arr.get( idx );
}

/**
* Returns an element from a `Complex64Array`.
*
* @private
* @param {Complex64Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( [ 1, 2, 3, 4 ] );
*
* var v = getComplex64( arr, 1 );
* // returns <Complex64>
*
* var re = realf( v );
* // returns 3.0
*
* var im = imagf( v );
* // returns 4.0
*/
function getComplex64( arr, idx ) {
	return arr.get( idx );
}

/**
* Returns an element from an array-like object supporting the get/set protocol.
*
* @private
* @param {Collection} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {*} element value
*
* @example
* var arr = [ 1, 2, 3, 4 ];
*
* function get( idx ) {
*    return arr[ idx ];
* }
*
* function set( value, idx ) {
*    arr[ idx ] = value;
* }
*
* arr.get = get;
* arr.set = set;
*
* var v = getArrayLike( arr, 2 );
* // returns 3
*/
function getArrayLike( arr, idx ) {
	return arr.get( idx );
}


// MAIN //

/**
* Returns an accessor function for retrieving an element from an array-like object supporting the get/set protocol.
*
* @param {string} dtype - array dtype
* @returns {Function} accessor
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var dtype = require( '@stdlib/array/dtype' );
*
* var arr = new Complex64Array( [ 1, 2, 3, 4 ] );
*
* var get = getter( dtype( arr ) );
* var v = get( arr, 1 );
* // returns <Complex64>
*
* var re = realf( v );
* // returns 3.0
*
* var im = imagf( v );
* // returns 4.0
*/
function getter( dtype ) {
	var f = GETTERS[ dtype ];
	if ( typeof f === 'function' ) {
		return f;
	}
	return GETTERS.default;
}


// EXPORTS //

module.exports = getter;

},{}],38:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2023 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isCollection = require( '@stdlib/assert/is-collection' );
var isAccessorArray = require( './../../../../base/assert/is-accessor-array' );
var accessorGetter = require( './../../../../base/accessor-getter' );
var dtype = require( './../../../../dtype' );
var format = require( '@stdlib/string/format' );


// MAIN //

/**
* Returns a function to tests if an array contains a provided search value.
*
* @param {Collection} x - input array
* @throws {TypeError} must provide an array-like object
* @returns {Function} function to test if an array contains a search value
*
* @example
* var contains = factory( [ 1, 2, 3 ] );
* // returns <Function>
*
* var bool = contains( 2 );
* // returns true
*/
function factory( x ) {
	var get;
	var len;
	var dt;

	if ( !isCollection( x ) ) {
		throw new TypeError( format( 'invalid argument. Must provide an array-like object. Value: `%s`.', x ) );
	}
	// Resolve the input array data type:
	dt = dtype( x );

	// Resolve an accessor for retrieving input array elements:
	if ( isAccessorArray( x ) ) {
		get = accessorGetter( dt );
	}
	// Get the number of elements over which to iterate:
	len = x.length;

	return ( get === void 0 ) ? contains : accessors;
	/**
	* Tests if an array contains a provided search value.
	*
	* @private
	* @param {*} value - search value
	* @returns {boolean} boolean indicating if an array contains a search value
	*
	* @example
	* var out = contains( [ 1, 2, 3 ], 2 );
	* // returns true
	*/
	function contains( value ) {
		var i;
		for ( i = 0; i < len; i++ ) {
			if ( x[ i ] === value ) {
				return true;
			}
		}
		return false;
	}
	/**
	* Tests if an array contains a provided search value.
	*
	* @private
	* @param {*} value - search value
	* @returns {boolean} boolean indicating if an array contains a search value
	*/
	function accessors( value ) {
		var i;
		for ( i = 0; i < len; i++ ) {
			if ( get( x, i ) === value ) {
				return true;
			}
		}
		return false;
	}
}


// EXPORTS //

module.exports = factory;

},{"./../../../../base/accessor-getter":36,"./../../../../base/assert/is-accessor-array":41,"./../../../../dtype":67,"@stdlib/assert/is-collection":145,"@stdlib/string/format":274}],39:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2023 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if an array contains a provided search value.
*
* @module @stdlib/array/base/assert/contains
*
* @example
* var contains = require( '@stdlib/array/base/assert/contains' );
*
* var out = contains( [ 1, 2, 3 ], 2 );
* // returns true
*/

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var factory = require( './factory.js' );


// MAIN //

setReadOnly( main, 'factory', factory );


// EXPORTS //

module.exports = main;

// exports: { "factory": "main.factory" }

},{"./factory.js":38,"./main.js":40,"@stdlib/utils/define-nonenumerable-read-only-property":285}],40:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2023 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isAccessorArray = require( './../../../../base/assert/is-accessor-array' );
var accessorGetter = require( './../../../../base/accessor-getter' );
var getter = require( './../../../../base/getter' );
var dtype = require( './../../../../dtype' );


// MAIN //

/**
* Tests if an array contains a provided search value.
*
* @param {Collection} x - input array
* @param {*} value - search value
* @returns {boolean} boolean indicating if an array contains a search value
*
* @example
* var out = contains( [ 1, 2, 3 ], 2 );
* // returns true
*/
function contains( x, value ) {
	var len;
	var get;
	var dt;
	var i;

	// Resolve the input array data type:
	dt = dtype( x );

	// Resolve an accessor for retrieving input array elements:
	if ( isAccessorArray( x ) ) {
		get = accessorGetter( dt );
	} else {
		get = getter( dt );
	}
	// Get the number of elements over which to iterate:
	len = x.length;

	// Loop over the elements...
	for ( i = 0; i < len; i++ ) {
		if ( get( x, i ) === value ) {
			return true;
		}
	}
	return false;
}


// EXPORTS //

module.exports = contains;

},{"./../../../../base/accessor-getter":36,"./../../../../base/assert/is-accessor-array":41,"./../../../../base/getter":47,"./../../../../dtype":67}],41:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if an array-like object supports the accessor (get/set) protocol.
*
* @module @stdlib/array/base/assert/is-accessor-array
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128array' );
* var isAccessorArray = require( '@stdlib/array/base/assert/is-accessor-array' );
*
* var bool = isAccessorArray( new Complex128Array( 10 ) );
* // returns true
*
* bool = isAccessorArray( [] );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":42}],42:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var TYPE = 'function';


// MAIN //

/**
* Tests if an array-like object supports the accessor (get/set) protocol.
*
* @param {Object} value - value to test
* @returns {boolean} boolean indicating whether a value is an accessor array
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var bool = isAccessorArray( new Complex128Array( 10 ) );
* // returns true
*
* @example
* var bool = isAccessorArray( [] );
* // returns false
*/
function isAccessorArray( value ) {
	return ( typeof value.get === TYPE && typeof value.set === TYPE ); // eslint-disable-line valid-typeof
}


// EXPORTS //

module.exports = isAccessorArray;

},{}],43:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a `Complex128Array`.
*
* @module @stdlib/array/base/assert/is-complex128array
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
* var isComplex128Array = require( '@stdlib/array/base/assert/is-complex128array' );
*
* var bool = isComplex128Array( new Complex128Array( 10 ) );
* // returns true
*
* bool = isComplex128Array( [] );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":44}],44:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var BYTES_PER_ELEMENT = 16; // 8 bytes per float64 x (1 real + 1 imag component)


// MAIN //

/**
* Returns a boolean indicating if a value is a `Complex128Array`.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a `Complex128Array`
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var bool = isComplex128Array( new Complex128Array( 10 ) );
* // returns true
*
* bool = isComplex128Array( [] );
* // returns false
*/
function isComplex128Array( value ) {
	// Note: the following is not robust and that is intentional. In this case, we are seeking a lower cost way to reasonably determine whether an input value is a `Complex128Array` in order to avoid walking the prototype chain and resolving constructors, which is necessary for robust identification of cross-realm instances. For more robust validation, see `@stdlib/assert/is-complex128array`.
	return (
		typeof value === 'object' &&
		value !== null &&
		value.constructor.name === 'Complex128Array' &&
		value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT
	);
}


// EXPORTS //

module.exports = isComplex128Array;

},{}],45:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a `Complex64Array`.
*
* @module @stdlib/array/base/assert/is-complex64array
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
* var isComplex64Array = require( '@stdlib/array/base/assert/is-complex64array' );
*
* var bool = isComplex64Array( new Complex64Array( 10 ) );
* // returns true
*
* bool = isComplex64Array( [] );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":46}],46:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var BYTES_PER_ELEMENT = 8; // 4 bytes per float32 x (1 real + 1 imag component)


// MAIN //

/**
* Returns a boolean indicating if a value is a `Complex64Array`.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a `Complex64Array`
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var bool = isComplex64Array( new Complex64Array( 10 ) );
* // returns true
*
* bool = isComplex64Array( [] );
* // returns false
*/
function isComplex64Array( value ) {
	// Note: the following is not robust and that is intentional. In this case, we are seeking a lower cost way to reasonably determine whether an input value is a `Complex64Array` in order to avoid walking the prototype chain and resolving constructors, which is necessary for robust identification of cross-realm instances. For more robust validation, see `@stdlib/assert/is-complex64array`.
	return (
		typeof value === 'object' &&
		value !== null &&
		value.constructor.name === 'Complex64Array' &&
		value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT
	);
}


// EXPORTS //

module.exports = isComplex64Array;

},{}],47:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return an accessor function for retrieving an element from an indexed array-like object.
*
* @module @stdlib/array/base/getter
*
* @example
* var dtype = require( '@stdlib/array/dtype' );
* var getter = require( '@stdlib/array/base/getter' );
*
* var arr = [ 1, 2, 3, 4 ];
*
* var get = getter( dtype( arr ) );
* var v = get( arr, 2 );
* // returns 3
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":48}],48:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var GETTERS = {
	'float64': getFloat64,
	'float32': getFloat32,
	'int32': getInt32,
	'int16': getInt16,
	'int8': getInt8,
	'uint32': getUint32,
	'uint16': getUint16,
	'uint8': getUint8,
	'uint8c': getUint8c,
	'generic': getGeneric,
	'default': getArrayLike
};


// FUNCTIONS //

/**
* Returns an element from a `Float64Array`.
*
* @private
* @param {Float64Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Float64Array = require( '@stdlib/array/float64' );
*
* var arr = new Float64Array( [ 1, 2, 3, 4 ] );
*
* var v = getFloat64( arr, 2 );
* // returns 3.0
*/
function getFloat64( arr, idx ) {
	return arr[ idx ];
}

/**
* Returns an element from a `Float32Array`.
*
* @private
* @param {Float32Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Float32Array = require( '@stdlib/array/float32' );
*
* var arr = new Float32Array( [ 1, 2, 3, 4 ] );
*
* var v = getFloat32( arr, 2 );
* // returns 3.0
*/
function getFloat32( arr, idx ) {
	return arr[ idx ];
}

/**
* Returns an element from an `Int32Array`.
*
* @private
* @param {Int32Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Int32Array = require( '@stdlib/array/int32' );
*
* var arr = new Int32Array( [ 1, 2, 3, 4 ] );
*
* var v = getInt32( arr, 2 );
* // returns 3
*/
function getInt32( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from an `Int16Array`.
*
* @private
* @param {Int16Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Int16Array = require( '@stdlib/array/int16' );
*
* var arr = new Int16Array( [ 1, 2, 3, 4 ] );
*
* var v = getInt16( arr, 2 );
* // returns 3
*/
function getInt16( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from an `Int8Array`.
*
* @private
* @param {Int8Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Int8Array = require( '@stdlib/array/int8' );
*
* var arr = new Int8Array( [ 1, 2, 3, 4 ] );
*
* var v = getInt8( arr, 2 );
* // returns 3
*/
function getInt8( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from a `Uint32Array`.
*
* @private
* @param {Uint32Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Uint32Array = require( '@stdlib/array/uint32' );
*
* var arr = new Uint32Array( [ 1, 2, 3, 4 ] );
*
* var v = getUint32( arr, 2 );
* // returns 3
*/
function getUint32( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from a `Uint16Array`.
*
* @private
* @param {Uint16Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Uint16Array = require( '@stdlib/array/uint16' );
*
* var arr = new Uint16Array( [ 1, 2, 3, 4 ] );
*
* var v = getUint16( arr, 2 );
* // returns 3
*/
function getUint16( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from a `Uint8Array`.
*
* @private
* @param {Uint8Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Uint8Array = require( '@stdlib/array/uint8' );
*
* var arr = new Uint8Array( [ 1, 2, 3, 4 ] );
*
* var v = getUint8( arr, 2 );
* // returns 3
*/
function getUint8( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from a `Uint8ClampedArray`.
*
* @private
* @param {Uint8ClampedArray} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {number} element value
*
* @example
* var Uint8ClampedArray = require( '@stdlib/array/uint8c' );
*
* var arr = new Uint8ClampedArray( [ 1, 2, 3, 4 ] );
*
* var v = getUint8c( arr, 2 );
* // returns 3
*/
function getUint8c( arr, idx ) { // eslint-disable-line stdlib/jsdoc-doctest-decimal-point
	return arr[ idx ];
}

/**
* Returns an element from a generic `Array`.
*
* @private
* @param {Array} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {*} element value
*
* @example
* var arr = [ 1, 2, 3, 4 ];
*
* var v = getGeneric( arr, 2 );
* // returns 3
*/
function getGeneric( arr, idx ) {
	return arr[ idx ];
}

/**
* Returns an element from an indexed array-like object.
*
* @private
* @param {Collection} arr - input array
* @param {NonNegativeInteger} idx - element index
* @returns {*} element value
*
* @example
* var arr = [ 1, 2, 3, 4 ];
*
* var v = getArrayLike( arr, 2 );
* // returns 3
*/
function getArrayLike( arr, idx ) {
	return arr[ idx ];
}


// MAIN //

/**
* Returns an accessor function for retrieving an element from an indexed array-like object.
*
* @param {string} dtype - array dtype
* @returns {Function} accessor
*
* @example
* var dtype = require( '@stdlib/array/dtype' );
*
* var arr = [ 1, 2, 3, 4 ];
*
* var get = getter( dtype( arr ) );
* var v = get( arr, 2 );
* // returns 3
*/
function getter( dtype ) {
	var f = GETTERS[ dtype ];
	if ( typeof f === 'function' ) {
		return f;
	}
	return GETTERS.default;
}


// EXPORTS //

module.exports = getter;

},{}],49:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Boolean = require( '@stdlib/boolean/ctor' );


// MAIN //

/**
* Fills an output array with "boolean" values.
*
* @private
* @param {Uint8Array} buf - output array
* @param {Array} arr - input array
* @returns {Uint8Array} output array
*/
function fromArray( buf, arr ) {
	var len;
	var i;

	len = arr.length;
	for ( i = 0; i < len; i++ ) {
		buf[ i ] = Boolean( arr[ i ] );
	}
	return buf;
}


// EXPORTS //

module.exports = fromArray;

},{"@stdlib/boolean/ctor":211}],50:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Boolean = require( '@stdlib/boolean/ctor' );


// MAIN //

/**
* Returns an array of iterated values.
*
* @private
* @param {Object} it - iterator
* @returns {Array} output array
*/
function fromIterator( it ) {
	var out;
	var v;

	out = [];
	while ( true ) {
		v = it.next();
		if ( v.done ) {
			break;
		}
		out.push( Boolean( v.value ) );
	}
	return out;
}


// EXPORTS //

module.exports = fromIterator;

},{"@stdlib/boolean/ctor":211}],51:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Boolean = require( '@stdlib/boolean/ctor' );


// MAIN //

/**
* Returns an array of iterated values.
*
* @private
* @param {Object} it - iterator
* @param {Function} clbk - callback to invoke for each iterated value
* @param {*} thisArg - invocation context
* @returns {Array} output array
*/
function fromIteratorMap( it, clbk, thisArg ) {
	var out;
	var v;
	var i;

	out = [];
	i = -1;
	while ( true ) {
		v = it.next();
		if ( v.done ) {
			break;
		}
		i += 1;
		out.push( Boolean( clbk.call( thisArg, v.value, i ) ) );
	}
	return out;
}


// EXPORTS //

module.exports = fromIteratorMap;

},{"@stdlib/boolean/ctor":211}],52:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Boolean array.
*
* @module @stdlib/array/bool
*
* @example
* var BooleanArray = require( '@stdlib/array/bool' );
*
* var arr = new BooleanArray();
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 0
*
* @example
* var BooleanArray = require( '@stdlib/array/bool' );
*
* var arr = new BooleanArray( 2 );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*
* @example
* var BooleanArray = require( '@stdlib/array/bool' );
*
* var arr = new BooleanArray( [ true, false ] );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var BooleanArray = require( '@stdlib/array/bool' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new BooleanArray( buf );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 16
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var BooleanArray = require( '@stdlib/array/bool' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new BooleanArray( buf, 8 );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 8
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var BooleanArray = require( '@stdlib/array/bool' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new BooleanArray( buf, 8, 2 );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":53}],53:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable no-restricted-syntax, no-invalid-this */

'use strict';

// MODULES //

var isNonNegativeInteger = require( '@stdlib/assert/is-nonnegative-integer' ).isPrimitive;
var isCollection = require( '@stdlib/assert/is-collection' );
var isArrayBuffer = require( '@stdlib/assert/is-arraybuffer' );
var isObject = require( '@stdlib/assert/is-object' );
var isFunction = require( '@stdlib/assert/is-function' );
var isBoolean = require( '@stdlib/assert/is-boolean' ).isPrimitive;
var isInteger = require( '@stdlib/assert/is-integer' ).isPrimitive;
var isString = require( '@stdlib/assert/is-string' ).isPrimitive;
var isStringArray = require( '@stdlib/assert/is-string-array' ).primitives;
var hasIteratorSymbolSupport = require( '@stdlib/assert/has-iterator-symbol-support' );
var ITERATOR_SYMBOL = require( '@stdlib/symbol/iterator' );
var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var setReadOnlyAccessor = require( '@stdlib/utils/define-nonenumerable-read-only-accessor' );
var Uint8Array = require( './../../uint8' );
var Boolean = require( '@stdlib/boolean/ctor' );
var getter = require( './../../base/getter' );
var floor = require( '@stdlib/math/base/special/floor' );
var accessorGetter = require( './../../base/accessor-getter' );
var format = require( '@stdlib/string/format' );
var fromIterator = require( './from_iterator.js' );
var fromIteratorMap = require( './from_iterator_map.js' );
var fromArray = require( './from_array.js' );


// VARIABLES //

var BYTES_PER_ELEMENT = Uint8Array.BYTES_PER_ELEMENT;
var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();


// FUNCTIONS //

/**
* Returns a boolean indicating if a value is a `BooleanArray`.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a `BooleanArray`
*/
function isBooleanArray( value ) {
	return (
		typeof value === 'object' &&
		value !== null &&
		value.constructor.name === 'BooleanArray' &&
		value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT
	);
}

/**
* Returns a boolean indicating if a value is a boolean typed array constructor.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a boolean typed array constructor
*/
function isBooleanArrayConstructor( value ) {
	return ( value === BooleanArray );
}


// MAIN //

/**
* Boolean array constructor.
*
* @constructor
* @param {(NonNegativeInteger|Collection|ArrayBuffer|Iterable)} [arg] - length, typed array, array-like object, buffer, or an iterable
* @param {NonNegativeInteger} [byteOffset=0] - byte offset
* @param {NonNegativeInteger} [length] - view length
* @throws {TypeError} if provided only a single argument, must provide a valid argument
* @throws {TypeError} byte offset must be a nonnegative integer
* @throws {RangeError} must provide sufficient memory to accommodate byte offset and view length requirements
* @returns {BooleanArray} boolean array
*
* @example
* var arr = new BooleanArray();
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 0
*
* @example
* var arr = new BooleanArray( 2 );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*
* @example
* var arr = new BooleanArray( [ true, false ] );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new BooleanArray( buf );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 16
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new BooleanArray( buf, 8 );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 8
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new BooleanArray( buf, 8, 2 );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*/
function BooleanArray() {
	var byteOffset;
	var nargs;
	var buf;
	var len;
	var arg;

	nargs = arguments.length;
	if ( !(this instanceof BooleanArray) ) {
		if ( nargs === 0 ) {
			return new BooleanArray();
		}
		if ( nargs === 1 ) {
			return new BooleanArray( arguments[0] );
		}
		if ( nargs === 2 ) {
			return new BooleanArray( arguments[0], arguments[1] );
		}
		return new BooleanArray( arguments[0], arguments[1], arguments[2] );
	}
	// Create the underlying data buffer...
	if ( nargs === 0 ) {
		buf = new Uint8Array( 0 ); // backward-compatibility
	} else if ( nargs === 1 ) {
		arg = arguments[ 0 ];
		if ( isNonNegativeInteger( arg ) ) {
			buf = new Uint8Array( arg );
		} else if ( isCollection( arg ) ) {
			buf = fromArray( new Uint8Array( arg.length ), arg );
		} else if ( isArrayBuffer( arg ) ) {
			buf = new Uint8Array( arg );
		} else if ( isObject( arg ) ) {
			if ( HAS_ITERATOR_SYMBOL === false ) {
				throw new TypeError( format( 'invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.', arg ) );
			}
			if ( !isFunction( arg[ ITERATOR_SYMBOL ] ) ) {
				throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', arg ) );
			}
			buf = arg[ ITERATOR_SYMBOL ]();
			if ( !isFunction( buf.next ) ) {
				throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', arg ) );
			}
			buf = new Uint8Array( fromIterator( buf ) );
		} else {
			throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', arg ) );
		}
	} else {
		buf = arguments[ 0 ];
		if ( !isArrayBuffer( buf ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an ArrayBuffer. Value: `%s`.', buf ) );
		}
		byteOffset = arguments[ 1 ];
		if ( !isNonNegativeInteger( byteOffset ) ) {
			throw new TypeError( format( 'invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.', byteOffset ) );
		}
		if ( nargs === 2 ) {
			buf = new Uint8Array( buf, byteOffset );
		} else {
			len = arguments[ 2 ];
			if ( !isNonNegativeInteger( len ) ) {
				throw new TypeError( format( 'invalid argument. Length must be a nonnegative integer. Value: `%s`.', len ) );
			}
			if ( (len*BYTES_PER_ELEMENT) > (buf.byteLength-byteOffset) ) {
				throw new RangeError( format( 'invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.', len*BYTES_PER_ELEMENT ) );
			}
			buf = new Uint8Array( buf, byteOffset, len );
		}
	}
	setReadOnly( this, '_buffer', buf );
	setReadOnly( this, '_length', buf.length );

	return this;
}

/**
* Size (in bytes) of each array element.
*
* @name BYTES_PER_ELEMENT
* @memberof BooleanArray
* @readonly
* @type {PositiveInteger}
* @default 1
*
* @example
* var nbytes = BooleanArray.BYTES_PER_ELEMENT;
* // returns 1
*/
setReadOnly( BooleanArray, 'BYTES_PER_ELEMENT', BYTES_PER_ELEMENT );

/**
* Constructor name.
*
* @name name
* @memberof BooleanArray
* @readonly
* @type {string}
* @default 'BooleanArray'
*
* @example
* var str = BooleanArray.name;
* // returns 'BooleanArray'
*/
setReadOnly( BooleanArray, 'name', 'BooleanArray' );

/**
* Creates a new boolean array from an array-like object or an iterable.
*
* @name from
* @memberof BooleanArray
* @type {Function}
* @param {(Collection|Iterable)} src - array-like object or iterable
* @param {Function} [clbk] - callback to invoke for each source element
* @param {*} [thisArg] - context
* @throws {TypeError} `this` context must be a constructor
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be an array-like object or an iterable
* @throws {TypeError} second argument must be a function
* @returns {BooleanArray} boolean array
*
* @example
* var arr = BooleanArray.from( [ true, false ] );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*
* @example
* function clbk( v ) {
*     return !v;
* }
*
* var arr = BooleanArray.from( [ true, false ], clbk );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 2
*/
setReadOnly( BooleanArray, 'from', function from( src ) {
	var thisArg;
	var nargs;
	var clbk;
	var out;
	var buf;
	var tmp;
	var get;
	var len;
	var i;
	if ( !isFunction( this ) ) {
		throw new TypeError( 'invalid invocation. `this` context must be a constructor.' );
	}
	if ( !isBooleanArrayConstructor( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	nargs = arguments.length;
	if ( nargs > 1 ) {
		clbk = arguments[ 1 ];
		if ( !isFunction( clbk ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be a function. Value: `%s`.', clbk ) );
		}
		if ( nargs > 2 ) {
			thisArg = arguments[ 2 ];
		}
	}
	if ( isCollection( src ) ) {
		if ( clbk ) {
			len = src.length;
			if ( src.get && src.set ) {
				get = accessorGetter( 'default' );
			} else {
				get = getter( 'default' );
			}
			out = new this( len );
			buf = out._buffer; // eslint-disable-line no-underscore-dangle
			for ( i = 0; i < len; i++ ) {
				buf[ i ] = Boolean( clbk.call( thisArg, get( src, i ), i ) );
			}
			return out;
		}
		return new this( src );
	}
	if ( isObject( src ) && HAS_ITERATOR_SYMBOL && isFunction( src[ ITERATOR_SYMBOL ] ) ) { // eslint-disable-line max-len
		buf = src[ ITERATOR_SYMBOL ]();
		if ( !isFunction( buf.next ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.', src ) );
		}
		if ( clbk ) {
			tmp = fromIteratorMap( buf, clbk, thisArg );
		} else {
			tmp = fromIterator( buf );
		}
		len = tmp.length;
		out = new this( len );
		buf = out._buffer; // eslint-disable-line no-underscore-dangle
		for ( i = 0; i < len; i++ ) {
			buf[ i ] = tmp[ i ];
		}
		return out;
	}
	throw new TypeError( format( 'invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.', src ) );
});

/**
* Creates a new boolean array from a variable number of arguments.
*
* @name of
* @memberof BooleanArray
* @type {Function}
* @param {...*} element - array elements
* @throws {TypeError} `this` context must be a constructor
* @throws {TypeError} `this` must be a boolean array
* @returns {BooleanArray} boolean array
*
* @example
* var arr = BooleanArray.of( true, true, true, true );
* // returns <BooleanArray>
*
* var len = arr.length;
* // returns 4
*/
setReadOnly( BooleanArray, 'of', function of() {
	var args;
	var i;
	if ( !isFunction( this ) ) {
		throw new TypeError( 'invalid invocation. `this` context must be a constructor.' );
	}
	if ( !isBooleanArrayConstructor( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	args = [];
	for ( i = 0; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}
	return new this( args );
});

/**
* Returns an array element located at integer position (index) `i`, with support for both nonnegative and negative integer indices.
*
* @name at
* @memberof BooleanArray.prototype
* @type {Function}
* @param {integer} idx - element index
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} must provide an integer
* @returns {(boolean|void)} array element
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var v = arr.at( 0 );
* // returns true
*
* v = arr.at( -1 );
* // returns true
*
* v = arr.at( 100 );
* // returns undefined
*/
setReadOnly( BooleanArray.prototype, 'at', function at( idx ) {
	var buf;
	var len;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isInteger( idx ) ) {
		throw new TypeError( format( 'invalid argument. Must provide an integer. Value: `%s`.', idx ) );
	}
	len = this._length;
	buf = this._buffer;
	if ( idx < 0 ) {
		idx += len;
	}
	if ( idx < 0 || idx >= len ) {
		return;
	}
	return Boolean( buf[ idx ] );
});

/**
* Pointer to the underlying data buffer.
*
* @name buffer
* @memberof BooleanArray.prototype
* @readonly
* @type {ArrayBuffer}
*
* @example
* var arr = new BooleanArray( 10 );
*
* var buf = arr.buffer;
* // returns <ArrayBuffer>
*/
setReadOnlyAccessor( BooleanArray.prototype, 'buffer', function get() {
	return this._buffer.buffer;
});

/**
* Size (in bytes) of the array.
*
* @name byteLength
* @memberof BooleanArray.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new BooleanArray( 10 );
*
* var byteLength = arr.byteLength;
* // returns 10
*/
setReadOnlyAccessor( BooleanArray.prototype, 'byteLength', function get() {
	return this._buffer.byteLength;
});

/**
* Offset (in bytes) of the array from the start of its underlying `ArrayBuffer`.
*
* @name byteOffset
* @memberof BooleanArray.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new BooleanArray( 10 );
*
* var byteOffset = arr.byteOffset;
* // returns 0
*/
setReadOnlyAccessor( BooleanArray.prototype, 'byteOffset', function get() {
	return this._buffer.byteOffset;
});

/**
* Size (in bytes) of each array element.
*
* @name BYTES_PER_ELEMENT
* @memberof BooleanArray.prototype
* @readonly
* @type {PositiveInteger}
* @default 1
*
* @example
* var arr = new BooleanArray( 10 );
*
* var nbytes = arr.BYTES_PER_ELEMENT;
* // returns 1
*/
setReadOnly( BooleanArray.prototype, 'BYTES_PER_ELEMENT', BooleanArray.BYTES_PER_ELEMENT );

/**
* Copies a sequence of elements within the array to the position starting at `target`.
*
* @name copyWithin
* @memberof BooleanArray.prototype
* @type {Function}
* @param {integer} target - index at which to start copying elements
* @param {integer} start - source index at which to copy elements from
* @param {integer} [end] - source index at which to stop copying elements from
* @throws {TypeError} `this` must be a boolean array
* @returns {BooleanArray} modified array
*
* @example
* var arr = new BooleanArray( 4 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( false, 2 );
* arr.set( true, 3 );
*
* // Copy the first two elements to the last two elements:
* arr.copyWithin( 2, 0, 2 );
*
* var v = arr.get( 2 );
* // returns true
*
* v = arr.get( 3 );
* // returns false
*/
setReadOnly( BooleanArray.prototype, 'copyWithin', function copyWithin( target, start ) {
	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	// FIXME: prefer a functional `copyWithin` implementation which addresses lack of universal browser support (e.g., IE11 and Safari) or ensure that typed arrays are polyfilled
	if ( arguments.length === 2 ) {
		this._buffer.copyWithin( target, start );
	} else {
		this._buffer.copyWithin( target, start, arguments[2] );
	}
	return this;
});

/**
* Returns an iterator for iterating over array key-value pairs.
*
* @name entries
* @memberof BooleanArray.prototype
* @type {Function}
* @throws {TypeError} `this` must be a boolean array
* @returns {Iterator} iterator
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var it = arr.entries();
*
* var v = it.next().value;
* // returns [ 0, true ]
*
* v = it.next().value;
* // returns [ 1, false ]
*
* v = it.next().value;
* // returns [ 2, true ]
*
* var bool = it.next().done;
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'entries', function entries() {
	var self;
	var iter;
	var len;
	var buf;
	var FLG;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	self = this;
	buf = this._buffer;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': [ i, Boolean( buf[ i ] ) ],
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.entries();
	}
});

/**
* Tests whether all elements in an array pass a test implemented by a predicate function.
*
* @name every
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - predicate function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {boolean} boolean indicating whether all elements pass a test
*
* @example
* function predicate( v ) {
*     return v === true;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( true, 1 );
* arr.set( true, 2 );
*
* var bool = arr.every( predicate );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'every', function every( predicate, thisArg ) {
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( !predicate.call( thisArg, Boolean( buf[ i ] ), i, this ) ) {
			return false;
		}
	}
	return true;
});

/**
* Returns a modified typed array filled with a fill value.
*
* @name fill
* @memberof BooleanArray.prototype
* @type {Function}
* @param {boolean} value - fill value
* @param {integer} [start=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a boolean
* @throws {TypeError} second argument must be an integer
* @throws {TypeError} third argument must be an integer
* @returns {BooleanArray} modified array
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.fill( true, 1 );
*
* var v = arr.get( 0 );
* // returns false
*
* v = arr.get( 1 );
* // returns true
*
* v = arr.get( 2 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'fill', function fill( value, start, end ) {
	var buf;
	var len;
	var val;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isBoolean( value ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a boolean. Value: `%s`.', value ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		if ( !isInteger( start ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', start ) );
		}
		if ( start < 0 ) {
			start += len;
			if ( start < 0 ) {
				start = 0;
			}
		}
		if ( arguments.length > 2 ) {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Third argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			}
			if ( end > len ) {
				end = len;
			}
		} else {
			end = len;
		}
	} else {
		start = 0;
		end = len;
	}
	if ( value ) {
		val = 1;
	} else {
		val = 0;
	}
	for ( i = start; i < end; i++ ) {
		buf[ i ] = val;
	}
	return this;
});

/**
* Returns a new array containing the elements of an array which pass a test implemented by a predicate function.
*
* @name filter
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {BooleanArray} boolean array
*
* @example
* function predicate( v ) {
*     return ( v === true );
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var out = arr.filter( predicate );
* // returns <BooleanArray>
*
* var len = out.length;
* // returns 2
*
* var v = out.get( 0 );
* // returns true
*
* v = out.get( 1 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'filter', function filter( predicate, thisArg ) {
	var buf;
	var out;
	var i;
	var v;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		v = Boolean( buf[ i ] );
		if ( predicate.call( thisArg, v, i, this ) ) {
			out.push( v );
		}
	}
	return new this.constructor( out );
});

/**
* Returns the first element in an array for which a predicate function returns a truthy value.
*
* @name find
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - predicate function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {(boolean|void)} array element or undefined
*
* @example
* function predicate( v ) {
*     return v === true;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var v = arr.find( predicate );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'find', function find( predicate, thisArg ) {
	var buf;
	var v;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		v = Boolean( buf[ i ] );
		if ( predicate.call( thisArg, v, i, this ) ) {
			return v;
		}
	}
});

/**
* Returns the index of the first element in an array for which a predicate function returns a truthy value.
*
* @name findIndex
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - predicate function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {integer} index or -1
*
* @example
* function predicate( v ) {
*     return v === true;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var v = arr.findIndex( predicate );
* // returns 0
*/
setReadOnly( BooleanArray.prototype, 'findIndex', function findIndex( predicate, thisArg ) {
	var buf;
	var v;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		v = Boolean( buf[ i ] );
		if ( predicate.call( thisArg, v, i, this ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns the last element in an array for which a predicate function returns a truthy value.
*
* @name findLast
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - predicate function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {(boolean|void)} array element or undefined
*
* @example
* function predicate( v ) {
*     return v === true;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var v = arr.findLast( predicate );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'findLast', function findLast( predicate, thisArg ) {
	var buf;
	var v;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = this._length-1; i >= 0; i-- ) {
		v = Boolean( buf[ i ] );
		if ( predicate.call( thisArg, v, i, this ) ) {
			return v;
		}
	}
});

/**
* Returns the index of the last element in an array for which a predicate function returns a truthy value.
*
* @name findLastIndex
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - predicate function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {integer} index or -1
*
* @example
* function predicate( v ) {
*     return v === true;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var v = arr.findLastIndex( predicate );
* // returns 2
*/
setReadOnly( BooleanArray.prototype, 'findLastIndex', function findLastIndex( predicate, thisArg ) {
	var buf;
	var v;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = this._length-1; i >= 0; i-- ) {
		v = Boolean( buf[ i ] );
		if ( predicate.call( thisArg, v, i, this ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Invokes a function once for each array element.
*
* @name forEach
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} fcn - function to invoke
* @param {*} [thisArg] - function invocation context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
*
* @example
* function log( v, i ) {
*     console.log( '%s: %s', i, v.toString() );
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* arr.forEach( log );
*/
setReadOnly( BooleanArray.prototype, 'forEach', function forEach( fcn, thisArg ) {
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( fcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', fcn ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		fcn.call( thisArg, Boolean( buf[ i ] ), i, this );
	}
});

/**
* Returns an array element.
*
* @name get
* @memberof BooleanArray.prototype
* @type {Function}
* @param {NonNegativeInteger} idx - element index
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} must provide a nonnegative integer
* @returns {(boolean|void)} array element
*
* @example
* var arr = new BooleanArray( 10 );
*
* var v = arr.get( 0 );
* // returns false
*
* arr.set( [ true, false ], 0 );
*
* v = arr.get( 0 );
* // returns true
*
* v = arr.get( 100 );
* // returns undefined
*/
setReadOnly( BooleanArray.prototype, 'get', function get( idx ) {
	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isNonNegativeInteger( idx ) ) {
		throw new TypeError( format( 'invalid argument. Must provide a nonnegative integer. Value: `%s`.', idx ) );
	}
	if ( idx >= this._length ) {
		return;
	}
	return Boolean( this._buffer[ idx ] );
});

/**
* Returns a boolean indicating whether an array includes a provided value.
*
* @name includes
* @memberof BooleanArray.prototype
* @type {Function}
* @param {boolean} searchElement - search element
* @param {integer} [fromIndex=0] - starting index (inclusive)
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a boolean value
* @throws {TypeError} second argument must be an integer
* @returns {boolean} boolean indicating whether an array includes a value
*
* @example
* var arr = new BooleanArray( 5 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
* arr.set( true, 3 );
* arr.set( true, 4 );
*
* var bool = arr.includes( true );
* // returns true
*
* bool = arr.includes( false, 2 );
* // returns false
*/
setReadOnly( BooleanArray.prototype, 'includes', function includes( searchElement, fromIndex ) {
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isBoolean( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a boolean. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex < 0 ) {
			fromIndex += this._length;
			if ( fromIndex < 0 ) {
				fromIndex = 0;
			}
		}
	} else {
		fromIndex = 0;
	}
	buf = this._buffer;
	for ( i = fromIndex; i < this._length; i++ ) {
		if ( searchElement === Boolean( buf[ i ] ) ) {
			return true;
		}
	}
	return false;
});

/**
* Returns the first index at which a given element can be found.
*
* @name indexOf
* @memberof BooleanArray.prototype
* @type {Function}
* @param {boolean} searchElement - element to find
* @param {integer} [fromIndex=0] - starting index (inclusive)
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a boolean value
* @throws {TypeError} second argument must be an integer
* @returns {integer} index or -1
*
* @example
* var arr = new BooleanArray( 5 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
* arr.set( true, 3 );
* arr.set( true, 4 );
*
* var idx = arr.indexOf( true );
* // returns 0
*
* idx = arr.indexOf( false, 2 );
* // returns -1
*
* idx = arr.indexOf( false, -3 );
* // returns -1
*/
setReadOnly( BooleanArray.prototype, 'indexOf', function indexOf( searchElement, fromIndex ) {
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isBoolean( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a boolean. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex < 0 ) {
			fromIndex += this._length;
			if ( fromIndex < 0 ) {
				fromIndex = 0;
			}
		}
	} else {
		fromIndex = 0;
	}
	buf = this._buffer;
	for ( i = fromIndex; i < this._length; i++ ) {
		if ( searchElement === Boolean( buf[ i ] ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns a new string by concatenating all array elements.
*
* @name join
* @memberof BooleanArray.prototype
* @type {Function}
* @param {string} [separator=','] - element separator
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a string
* @returns {string} string representation
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var str = arr.join();
* // returns 'true,false,true'
*
* str = arr.join( '|' );
* // returns 'true|false|true'
*/
setReadOnly( BooleanArray.prototype, 'join', function join( separator ) {
	var buf;
	var out;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( arguments.length > 0 ) {
		if ( !isString( separator ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be a string. Value: `%s`.', separator ) );
		}
	} else {
		separator = ',';
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		if ( buf[i] ) {
			out.push( 'true' );
		} else {
			out.push( 'false' );
		}
	}
	return out.join( separator );
});

/**
* Returns an iterator for iterating over each index key in a typed array.
*
* @name keys
* @memberof BooleanArray.prototype
* @type {Function}
* @throws {TypeError} `this` must be a boolean array
* @returns {Iterator} iterator
*
* @example
* var arr = new BooleanArray( 2 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
*
* var iter = arr.keys();
*
* var v = iter.next().value;
* // returns 0
*
* v = iter.next().value;
* // returns 1
*
* var bool = iter.next().done;
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'keys', function keys() {
	var self;
	var iter;
	var len;
	var FLG;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	self = this;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': i,
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.keys();
	}
});

/**
* Returns the last index at which a given element can be found.
*
* @name lastIndexOf
* @memberof BooleanArray.prototype
* @type {Function}
* @param {boolean} searchElement - element to find
* @param {integer} [fromIndex] - starting index (inclusive)
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a boolean value
* @throws {TypeError} second argument must be an integer
* @returns {integer} index or -1
*
* @example
* var arr = new BooleanArray( 5 );
*
* arr.set( true, 0 );
* arr.set( true, 1 );
* arr.set( true, 2 );
* arr.set( false, 3 );
* arr.set( true, 4 );
*
* var idx = arr.lastIndexOf( true );
* // returns 4
*
* idx = arr.lastIndexOf( false, 2 );
* // returns -1
*
* idx = arr.lastIndexOf( false, -3 );
* // returns -1
*/
setReadOnly( BooleanArray.prototype, 'lastIndexOf', function lastIndexOf( searchElement, fromIndex ) {
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isBoolean( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a boolean. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex >= this._length ) {
			fromIndex = this._length - 1;
		} else if ( fromIndex < 0 ) {
			fromIndex += this._length;
		}
	} else {
		fromIndex = this._length - 1;
	}
	buf = this._buffer;
	for ( i = fromIndex; i >= 0; i-- ) {
		if ( searchElement === Boolean( buf[ i ] ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Number of array elements.
*
* @name length
* @memberof BooleanArray.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new BooleanArray( 10 );
*
* var len = arr.length;
* // returns 10
*/
setReadOnlyAccessor( BooleanArray.prototype, 'length', function get() {
	return this._length;
});

/**
* Returns a new array with each element being the result of a provided callback function.
*
* @name map
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} fcn - callback function
* @param {*} [thisArg] - callback function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {BooleanArray} new boolean array
*
* @example
* function invert( v ) {
*     return !v;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var out = arr.map( invert );
* // returns <BooleanArray>
*
* var z = out.get( 0 );
* // returns false
*
* z = out.get( 1 );
* // returns true
*
* z = out.get( 2 );
* // returns false
*/
setReadOnly( BooleanArray.prototype, 'map', function map( fcn, thisArg ) {
	var outbuf;
	var out;
	var buf;
	var i;
	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( fcn ) ) {
		throw new TypeError( 'invalid argument. First argument must be a function. Value: `%s`.', fcn );
	}
	buf = this._buffer;
	out = new this.constructor( this._length );
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < this._length; i++ ) {
		outbuf[ i ] = Boolean( fcn.call( thisArg, Boolean( buf[ i ] ), i, this ) );
	}
	return out;
});

/**
* Applies a provided callback function to each element of the array, in order, passing in the return value from the calculation on the preceding element and returning the accumulated result upon completion.
*
* @name reduce
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} reducer - callback function
* @param {*} [initialValue] - initial value
* @throws {TypeError} `this` must be a boolean array
* @throws {Error} if not provided an initial value, the array must have at least one element
* @returns {*} accumulated result
*
* @example
* function reducer( acc, v ) {
*     if ( v ) {
*          return acc + 1;
*     }
*     return acc;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var out = arr.reduce( reducer, 0 );
* // returns 2
*/
setReadOnly( BooleanArray.prototype, 'reduce', function reduce( reducer, initialValue ) {
	var buf;
	var len;
	var acc;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( reducer ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', reducer ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		acc = initialValue;
		i = 0;
	} else {
		if ( len === 0 ) {
			throw new Error( 'invalid operation. If not provided an initial value, an array must contain at least one element.' );
		}
		acc = Boolean( buf[ 0 ] );
		i = 1;
	}
	for ( ; i < len; i++ ) {
		acc = reducer( acc, Boolean( buf[ i ] ), i, this );
	}
	return acc;
});

/**
* Applies a provided callback function to each element of the array, in reverse order, passing in the return value from the calculation on the preceding element and returning the accumulated result upon completion.
*
* @name reduceRight
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} reducer - callback function
* @param {*} [initialValue] - initial value
* @throws {TypeError} `this` must be a boolean array
* @throws {Error} if not provided an initial value, the array must have at least one element
* @returns {*} accumulated result
*
* @example
* function reducer( acc, v ) {
*     if ( v ) {
*          return acc + 1;
*     }
*     return acc;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var out = arr.reduceRight( reducer, 0 );
* // returns 2
*/
setReadOnly( BooleanArray.prototype, 'reduceRight', function reduceRight( reducer, initialValue ) {
	var buf;
	var len;
	var acc;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( reducer ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', reducer ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		acc = initialValue;
		i = len - 1;
	} else {
		if ( len === 0 ) {
			throw new Error( 'invalid operation. If not provided an initial value, an array must contain at least one element.' );
		}
		acc = Boolean( buf[ len-1 ] );
		i = len - 2;
	}
	for ( ; i >= 0; i-- ) {
		acc = reducer( acc, Boolean( buf[ i ] ), i, this );
	}
	return acc;
});

/**
* Reverses an array in-place.
*
* @name reverse
* @memberof BooleanArray.prototype
* @type {Function}
* @throws {TypeError} `this` must be a boolean array
* @returns {BooleanArray} reversed array
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( false, 2 );
*
* var out = arr.reverse();
* // returns <BooleanArray>
*
* var v = out.get( 0 );
* // returns false
*
* v = out.get( 1 );
* // returns false
*
* v = out.get( 2 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'reverse', function reverse() {
	var buf;
	var tmp;
	var len;
	var N;
	var i;
	var j;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	buf = this._buffer;
	len = this._length;
	N = floor( len / 2 );
	for ( i = 0; i < N; i++ ) {
		j = len - i - 1;
		tmp = buf[ i ];
		buf[ i ] = buf[ j ];
		buf[ j ] = tmp;
	}
	return this;
});

/**
* Sets an array element.
*
* ## Notes
*
* -   When provided a typed array, we must check whether the source array shares the same buffer as the target array and whether the underlying memory overlaps. In particular, we are concerned with the following scenario:
*
*     ```text
*     buf:                ---------------------
*     src: ---------------------
*     ```
*
*     In the above, as we copy values from `src`, we will overwrite values in the `src` view, resulting in duplicated values copied into the end of `buf`, which is not intended. Hence, to avoid overwriting source values, we must **copy** source values to a temporary array.
*
*     In the other overlapping scenario,
*
*     ```text
*     buf: ---------------------
*     src:                ---------------------
*     ```
*
*     by the time we begin copying into the overlapping region, we are copying from the end of `src`, a non-overlapping region, which means we don't run the risk of copying copied values, rather than the original `src` values, as intended.
*
* @name set
* @memberof BooleanArray.prototype
* @type {Function}
* @param {(Collection|BooleanArray|*)} value - value(s)
* @param {NonNegativeInteger} [i=0] - element index at which to start writing values
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} index argument must be a nonnegative integer
* @throws {RangeError} index argument is out-of-bounds
* @throws {RangeError} target array lacks sufficient storage to accommodate source values
* @returns {void}
*
* @example
* var arr = new BooleanArray( 10 );
*
* var v = arr.get( 0 );
* // returns false
*
* arr.set( [ true, false ], 0 );
*
* v = arr.get( 0 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'set', function set( value ) {
	var sbuf;
	var idx;
	var buf;
	var tmp;
	var N;
	var i;
	var j;
	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	buf = this._buffer;
	if ( arguments.length > 1 ) {
		idx = arguments[ 1 ];
		if ( !isNonNegativeInteger( idx ) ) {
			throw new TypeError( format( 'invalid argument. Index argument must be a nonnegative integer. Value: `%s`.', idx ) );
		}
	} else {
		idx = 0;
	}
	if ( isCollection( value ) ) {
		N = value.length;
		if ( idx+N > this._length ) {
			throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
		}
		if ( isBooleanArray( value ) ) {
			sbuf = value._buffer; // eslint-disable-line no-underscore-dangle
		} else {
			sbuf = value;
		}
		// Check for overlapping memory...
		j = buf.byteOffset + (idx*BYTES_PER_ELEMENT);
		if (
			sbuf.buffer === buf.buffer &&
			(
				sbuf.byteOffset < j &&
				sbuf.byteOffset+sbuf.byteLength > j
			)
		) {
			// We need to copy source values...
			tmp = new Uint8Array( sbuf.length );
			for ( i = 0; i < sbuf.length; i++ ) {
				tmp[ i ] = sbuf[ i ]; // TODO: handle accessor arrays
			}
			sbuf = tmp;
		}
		for ( i = 0; i < N; idx++, i++ ) {
			buf[ idx ] = ( sbuf[ i ] ) ? 1 : 0;
		}
		return;
	}
	if ( idx >= this._length ) {
		throw new RangeError( format( 'invalid argument. Index argument is out-of-bounds. Value: `%u`.', idx ) );
	}
	buf[ idx ] = ( value ) ? 1 : 0;
});

/**
* Copies a portion of a typed array to a new typed array.
*
* @name slice
* @memberof BooleanArray.prototype
* @type {Function}
* @param {integer} [begin] - start index (inclusive)
* @param {integer} [end] - end index (exclusive)
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be integer
* @throws {TypeError} second argument must be integer
* @returns {BooleanArray} boolean array
*
* @example
* var arr = new BooleanArray( 5 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
* arr.set( false, 3 );
* arr.set( true, 4 );
*
* var out = arr.slice();
* // returns <BooleanArray>
*
* var len = out.length;
* // returns 5
*
* var bool = out.get( 0 );
* // returns true
*
* bool = out.get( len-1 );
* // returns true
*
* out = arr.slice( 1, -2 );
* // returns <BooleanArray>
*
* len = out.length;
* // returns 2
*
* bool = out.get( 0 );
* // returns false
*
* bool = out.get( len-1 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'slice', function slice( begin, end ) {
	var outlen;
	var outbuf;
	var out;
	var buf;
	var len;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length === 0 ) {
		begin = 0;
		end = len;
	} else {
		if ( !isInteger( begin ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', begin ) );
		}
		if ( begin < 0 ) {
			begin += len;
			if ( begin < 0 ) {
				begin = 0;
			}
		}
		if ( arguments.length === 1 ) {
			end = len;
		} else {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			} else if ( end > len ) {
				end = len;
			}
		}
	}
	if ( begin < end ) {
		outlen = end - begin;
	} else {
		outlen = 0;
	}
	out = new this.constructor( outlen );
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < outlen; i++ ) {
		outbuf[ i ] = buf[ i+begin ];
	}
	return out;
});

/**
* Tests whether at least one element in an array passes a test implemented by a predicate function.
*
* @name some
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} predicate - predicate function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {boolean} boolean indicating whether at least one element passes a test
*
* @example
* function predicate( v ) {
*     return v === true;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( false, 0 );
* arr.set( true, 1 );
* arr.set( false, 2 );
*
* var bool = arr.some( predicate );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'some', function some( predicate, thisArg ) {
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( predicate.call( thisArg, Boolean( buf[ i ] ), i, this ) ) {
			return true;
		}
	}
	return false;
});

/**
* Sorts an array in-place.
*
* @name sort
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} [compareFcn] - comparison function
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {BooleanArray} sorted array
*
* @example
* function compare( a, b ) {
*    if ( a === false ) {
*        if ( b === false ) {
*            return 0;
*        }
*        return 1;
*    }
*    if ( b === true ) {
*        return 0;
*    }
*    return -1;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* arr.sort( compare );
*
* var v = arr.get( 0 );
* // returns true
*
* v = arr.get( 1 );
* // returns true
*
* v = arr.get( 2 );
* // returns false
*/
setReadOnly( BooleanArray.prototype, 'sort', function sort( compareFcn ) {
	var buf;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	buf = this._buffer;
	if ( arguments.length === 0 ) {
		buf.sort();
		return this;
	}
	if ( !isFunction( compareFcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', compareFcn ) );
	}
	buf.sort( compare );
	return this;

	/**
	* Comparison function for sorting.
	*
	* @private
	* @param {boolean} a - first boolean value for comparison
	* @param {boolean} b - second boolean value for comparison
	* @returns {number} comparison result
	*/
	function compare( a, b ) {
		return compareFcn( Boolean( a ), Boolean( b ) );
	}
});

/**
* Creates a new typed array view over the same underlying `ArrayBuffer` and with the same underlying data type as the host array.
*
* @name subarray
* @memberof BooleanArray.prototype
* @type {Function}
* @param {integer} [begin] - start index (inclusive)
* @param {integer} [end] - end index (exclusive)
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be an integer
* @throws {TypeError} second argument must be an integer
* @returns {BooleanArray} subarray
*
* @example
* var arr = new BooleanArray( 5 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
* arr.set( false, 3 );
* arr.set( true, 4 );
*
* var subarr = arr.subarray();
* // returns <BooleanArray>
*
* var len = subarr.length;
* // returns 5
*
* var bool = subarr.get( 0 );
* // returns true
*
* bool = subarr.get( len-1 );
* // returns true
*
* subarr = arr.subarray( 1, -2 );
* // returns <BooleanArray>
*
* len = subarr.length;
* // returns 2
*
* bool = subarr.get( 0 );
* // returns false
*
* bool = subarr.get( len-1 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'subarray', function subarray( begin, end ) {
	var offset;
	var buf;
	var len;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length === 0 ) {
		begin = 0;
		end = len;
	} else {
		if ( !isInteger( begin ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', begin ) );
		}
		if ( begin < 0 ) {
			begin += len;
			if ( begin < 0 ) {
				begin = 0;
			}
		}
		if ( arguments.length === 1 ) {
			end = len;
		} else {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			} else if ( end > len ) {
				end = len;
			}
		}
	}
	if ( begin >= len ) {
		len = 0;
		offset = buf.byteLength;
	} else if ( begin >= end ) {
		len = 0;
		offset = buf.byteOffset + ( begin*BYTES_PER_ELEMENT );
	} else {
		len = end - begin;
		offset = buf.byteOffset + ( begin*BYTES_PER_ELEMENT );
	}
	return new this.constructor( buf.buffer, offset, ( len < 0 ) ? 0 : len );
});

/**
* Serializes an array as a locale-specific string.
*
* @name toLocaleString
* @memberof BooleanArray.prototype
* @type {Function}
* @param {(string|Array<string>)} [locales] - locale identifier(s)
* @param {Object} [options] - configuration options
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a string or an array of strings
* @throws {TypeError} options argument must be an object
* @returns {string} string representation
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var str = arr.toLocaleString();
* // returns 'true,false,true'
*/
setReadOnly( BooleanArray.prototype, 'toLocaleString', function toLocaleString( locales, options ) {
	var opts;
	var loc;
	var out;
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( arguments.length === 0 ) {
		loc = [];
	} else if ( isString( locales ) || isStringArray( locales ) ) {
		loc = locales;
	} else {
		throw new TypeError( format( 'invalid argument. First argument must be a string or an array of strings. Value: `%s`.', locales ) );
	}
	if ( arguments.length < 2 ) {
		opts = {};
	} else if ( isObject( options ) ) {
		opts = options;
	} else {
		throw new TypeError( format( 'invalid argument. Options argument must be an object. Value: `%s`.', options ) );
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		out.push( Boolean( buf[ i ] ).toLocaleString( loc, opts ) );
	}
	return out.join( ',' );
});

/**
* Returns a new typed array containing the elements in reversed order.
*
* @name toReversed
* @memberof BooleanArray.prototype
* @type {Function}
* @throws {TypeError} `this` must be a boolean array
* @returns {BooleanArray} reversed array
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( false, 2 );
*
* var out = arr.toReversed();
* // returns <BooleanArray>
*
* var v = out.get( 0 );
* // returns false
*
* v = out.get( 1 );
* // returns false
*
* v = out.get( 2 );
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'toReversed', function toReversed() {
	var outbuf;
	var out;
	var len;
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	len = this._length;
	out = new this.constructor( len );
	buf = this._buffer;
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < len; i++ ) {
		outbuf[ i ] = buf[ len - i - 1 ];
	}
	return out;
});

/**
* Returns a new typed array containing the elements in sorted order.
*
* @name toSorted
* @memberof BooleanArray.prototype
* @type {Function}
* @param {Function} [compareFcn] - comparison function
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be a function
* @returns {BooleanArray} sorted array
*
* @example
* function compare( a, b ) {
*    if ( a === false ) {
*        if ( b === false ) {
*            return 0;
*        }
*        return 1;
*    }
*    if ( b === true ) {
*        return 0;
*    }
*    return -1;
* }
*
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var out = arr.sort( compare );
* // returns <BooleanArray>
*
* var v = out.get( 0 );
* // returns true
*
* v = out.get( 1 );
* // returns true
*
* v = out.get( 2 );
* // returns false
*/
setReadOnly( BooleanArray.prototype, 'toSorted', function toSorted( compareFcn ) {
	var outbuf;
	var out;
	var len;
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	len = this._length;
	out = new this.constructor( len );
	buf = this._buffer;
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < len; i++ ) {
		outbuf[ i ] = buf[ i ];
	}
	if ( arguments.length === 0 ) {
		outbuf.sort();
		return out;
	}
	if ( !isFunction( compareFcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', compareFcn ) );
	}
	outbuf.sort( compare );
	return out;

	/**
	* Comparison function for sorting.
	*
	* @private
	* @param {boolean} a - first boolean value for comparison
	* @param {boolean} b - second boolean value for comparison
	* @returns {number} comparison result
	*/
	function compare( a, b ) {
		return compareFcn( Boolean( a ), Boolean( b ) );
	}
});

/**
* Serializes an array as a string.
*
* @name toString
* @memberof BooleanArray.prototype
* @type {Function}
* @throws {TypeError} `this` must be a boolean array
* @returns {string} string representation
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var str = arr.toString();
* // returns 'true,false,true'
*/
setReadOnly( BooleanArray.prototype, 'toString', function toString() {
	var out;
	var buf;
	var i;
	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	out = [];
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( buf[i] ) {
			out.push( 'true' );
		} else {
			out.push( 'false' );
		}
	}
	return out.join( ',' );
});

/**
* Returns an iterator for iterating over each value in a typed array.
*
* @name values
* @memberof BooleanArray.prototype
* @type {Function}
* @throws {TypeError} `this` must be a boolean array
* @returns {Iterator} iterator
*
* @example
* var arr = new BooleanArray( 2 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
*
* var iter = arr.values();
*
* var v = iter.next().value;
* // returns true
*
* v = iter.next().value;
* // returns false
*
* var bool = iter.next().done;
* // returns true
*/
setReadOnly( BooleanArray.prototype, 'values', function values() {
	var iter;
	var self;
	var len;
	var FLG;
	var buf;
	var i;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	self = this;
	buf = this._buffer;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': Boolean( buf[ i ] ),
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.values();
	}
});

/**
* Returns a new typed array with the element at a provided index replaced with a provided value.
*
* @name with
* @memberof BooleanArray.prototype
* @type {Function}
* @param {integer} index - element index
* @param {boolean} value - new value
* @throws {TypeError} `this` must be a boolean array
* @throws {TypeError} first argument must be an integer
* @throws {RangeError} index argument is out-of-bounds
* @throws {TypeError} second argument must be a boolean
* @returns {BooleanArray} new typed array
*
* @example
* var arr = new BooleanArray( 3 );
*
* arr.set( true, 0 );
* arr.set( false, 1 );
* arr.set( true, 2 );
*
* var out = arr.with( 0, false );
* // returns <BooleanArray>
*
* var v = out.get( 0 );
* // returns false
*/
setReadOnly( BooleanArray.prototype, 'with', function copyWith( index, value ) {
	var buf;
	var out;
	var len;

	if ( !isBooleanArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a boolean array.' );
	}
	if ( !isInteger( index ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', index ) );
	}
	len = this._length;
	if ( index < 0 ) {
		index += len;
	}
	if ( index < 0 || index >= len ) {
		throw new RangeError( format( 'invalid argument. Index argument is out-of-bounds. Value: `%s`.', index ) );
	}
	if ( !isBoolean( value ) ) {
		throw new TypeError( format( 'invalid argument. Second argument must be a boolean. Value: `%s`.', value ) );
	}
	out = new this.constructor( this._buffer );
	buf = out._buffer; // eslint-disable-line no-underscore-dangle
	if ( value ) {
		buf[ index ] = 1;
	} else {
		buf[ index ] = 0;
	}
	return out;
});


// EXPORTS //

module.exports = BooleanArray;

},{"./../../base/accessor-getter":36,"./../../base/getter":47,"./../../uint8":90,"./from_array.js":49,"./from_iterator.js":50,"./from_iterator_map.js":51,"@stdlib/assert/has-iterator-symbol-support":111,"@stdlib/assert/is-arraybuffer":135,"@stdlib/assert/is-boolean":137,"@stdlib/assert/is-collection":145,"@stdlib/assert/is-function":155,"@stdlib/assert/is-integer":163,"@stdlib/assert/is-nonnegative-integer":168,"@stdlib/assert/is-object":180,"@stdlib/assert/is-string":183,"@stdlib/assert/is-string-array":182,"@stdlib/boolean/ctor":211,"@stdlib/math/base/special/floor":248,"@stdlib/string/format":274,"@stdlib/symbol/iterator":279,"@stdlib/utils/define-nonenumerable-read-only-accessor":283,"@stdlib/utils/define-nonenumerable-read-only-property":285}],54:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var real = require( '@stdlib/complex/float64/real' );
var imag = require( '@stdlib/complex/float64/imag' );


// MAIN //

/**
* Returns a strided array of real and imaginary components.
*
* @private
* @param {Float64Array} buf - output array
* @param {Array} arr - array containing complex numbers
* @returns {(Float64Array|null)} output array or null
*/
function fromArray( buf, arr ) {
	var len;
	var v;
	var i;
	var j;

	len = arr.length;
	j = 0;
	for ( i = 0; i < len; i++ ) {
		v = arr[ i ];
		if ( !isComplexLike( v ) ) {
			return null;
		}
		buf[ j ] = real( v );
		buf[ j+1 ] = imag( v );
		j += 2; // stride
	}
	return buf;
}


// EXPORTS //

module.exports = fromArray;

},{"@stdlib/assert/is-complex-like":147,"@stdlib/complex/float64/imag":225,"@stdlib/complex/float64/real":227}],55:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var format = require( '@stdlib/string/format' );
var real = require( '@stdlib/complex/float64/real' );
var imag = require( '@stdlib/complex/float64/imag' );


// MAIN //

/**
* Returns an array of iterated values.
*
* @private
* @param {Object} it - iterator
* @returns {(Array|TypeError)} array or an error
*/
function fromIterator( it ) {
	var out;
	var v;
	var z;

	out = [];
	while ( true ) {
		v = it.next();
		if ( v.done ) {
			break;
		}
		z = v.value;
		if ( isArrayLikeObject( z ) && z.length >= 2 ) {
			out.push( z[ 0 ], z[ 1 ] );
		} else if ( isComplexLike( z ) ) {
			out.push( real( z ), imag( z ) );
		} else {
			return new TypeError( format( 'invalid argument. An iterator must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', z ) );
		}
	}
	return out;
}


// EXPORTS //

module.exports = fromIterator;

},{"@stdlib/assert/is-array-like-object":131,"@stdlib/assert/is-complex-like":147,"@stdlib/complex/float64/imag":225,"@stdlib/complex/float64/real":227,"@stdlib/string/format":274}],56:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var format = require( '@stdlib/string/format' );
var real = require( '@stdlib/complex/float64/real' );
var imag = require( '@stdlib/complex/float64/imag' );


// MAIN //

/**
* Returns an array of iterated values.
*
* @private
* @param {Object} it - iterator
* @param {Function} clbk - callback to invoke for each iterated value
* @param {*} thisArg - invocation context
* @returns {(Array|TypeError)} array or an error
*/
function fromIteratorMap( it, clbk, thisArg ) {
	var out;
	var v;
	var z;
	var i;

	out = [];
	i = -1;
	while ( true ) {
		v = it.next();
		if ( v.done ) {
			break;
		}
		i += 1;
		z = clbk.call( thisArg, v.value, i );
		if ( isArrayLikeObject( z ) && z.length >= 2 ) {
			out.push( z[ 0 ], z[ 1 ] );
		} else if ( isComplexLike( z ) ) {
			out.push( real( z ), imag( z ) );
		} else {
			return new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', z ) );
		}
	}
	return out;
}


// EXPORTS //

module.exports = fromIteratorMap;

},{"@stdlib/assert/is-array-like-object":131,"@stdlib/assert/is-complex-like":147,"@stdlib/complex/float64/imag":225,"@stdlib/complex/float64/real":227,"@stdlib/string/format":274}],57:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* 128-bit complex number array.
*
* @module @stdlib/array/complex128
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var arr = new Complex128Array();
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 0
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var arr = new Complex128Array( 2 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var arr = new Complex128Array( [ 1.0, -1.0 ] );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new Complex128Array( buf );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new Complex128Array( buf, 16 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var buf = new ArrayBuffer( 64 );
* var arr = new Complex128Array( buf, 16, 2 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":58}],58:[function(require,module,exports){
/* eslint-disable no-restricted-syntax, max-lines, no-invalid-this */

/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNonNegativeInteger = require( '@stdlib/assert/is-nonnegative-integer' ).isPrimitive;
var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
var isCollection = require( '@stdlib/assert/is-collection' );
var isArrayBuffer = require( '@stdlib/assert/is-arraybuffer' );
var isObject = require( '@stdlib/assert/is-object' );
var isArray = require( '@stdlib/assert/is-array' );
var isStringArray = require( '@stdlib/assert/is-string-array' ).primitives;
var isString = require( '@stdlib/assert/is-string' );
var isFunction = require( '@stdlib/assert/is-function' );
var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var isEven = require( '@stdlib/math/base/assert/is-even' );
var isInteger = require( '@stdlib/math/base/assert/is-integer' );
var isComplex64Array = require( './../../base/assert/is-complex64array' );
var isComplex128Array = require( './../../base/assert/is-complex128array' );
var hasIteratorSymbolSupport = require( '@stdlib/assert/has-iterator-symbol-support' );
var ITERATOR_SYMBOL = require( '@stdlib/symbol/iterator' );
var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var setReadOnlyAccessor = require( '@stdlib/utils/define-nonenumerable-read-only-accessor' );
var Float64Array = require( './../../float64' );
var Complex128 = require( '@stdlib/complex/float64/ctor' );
var real = require( '@stdlib/complex/float64/real' );
var imag = require( '@stdlib/complex/float64/imag' );
var floor = require( '@stdlib/math/base/special/floor' );
var reinterpret64 = require( '@stdlib/strided/base/reinterpret-complex64' );
var reinterpret128 = require( '@stdlib/strided/base/reinterpret-complex128' );
var getter = require( './../../base/getter' );
var accessorGetter = require( './../../base/accessor-getter' );
var format = require( '@stdlib/string/format' );
var fromIterator = require( './from_iterator.js' );
var fromIteratorMap = require( './from_iterator_map.js' );
var fromArray = require( './from_array.js' );


// VARIABLES //

var BYTES_PER_ELEMENT = Float64Array.BYTES_PER_ELEMENT * 2;
var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();


// FUNCTIONS //

/**
* Returns a boolean indicating if a value is a complex typed array.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a complex typed array
*/
function isComplexArray( value ) {
	return (
		value instanceof Complex128Array ||
		(
			typeof value === 'object' &&
			value !== null &&
			(
				value.constructor.name === 'Complex64Array' ||
				value.constructor.name === 'Complex128Array'
			) &&
			typeof value._length === 'number' && // eslint-disable-line no-underscore-dangle

			// NOTE: we don't perform a more rigorous test here for a typed array for performance reasons, as robustly checking for a typed array instance could require walking the prototype tree and performing relatively expensive constructor checks...
			typeof value._buffer === 'object' // eslint-disable-line no-underscore-dangle
		)
	);
}

/**
* Returns a boolean indicating if a value is a complex typed array constructor.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a complex typed array constructor
*/
function isComplexArrayConstructor( value ) {
	return (
		value === Complex128Array ||

		// NOTE: weaker test in order to avoid a circular dependency with Complex64Array...
		value.name === 'Complex64Array'
	);
}

/**
* Retrieves a complex number from a complex number array buffer.
*
* @private
* @param {Float64Array} buf - array buffer
* @param {NonNegativeInteger} idx - element index
* @returns {Complex128} complex number
*/
function getComplex128( buf, idx ) {
	idx *= 2;
	return new Complex128( buf[ idx ], buf[ idx+1 ] );
}


// MAIN //

/**
* 128-bit complex number array constructor.
*
* @constructor
* @param {(NonNegativeInteger|Collection|ArrayBuffer|Iterable)} [arg] - length, typed array, array-like object, buffer, or iterable
* @param {NonNegativeInteger} [byteOffset=0] - byte offset
* @param {NonNegativeInteger} [length] - view length
* @throws {RangeError} ArrayBuffer byte length must be a multiple of `16`
* @throws {RangeError} array-like object and typed array input arguments must have a length which is a multiple of two
* @throws {TypeError} if provided only a single argument, must provide a valid argument
* @throws {TypeError} byte offset must be a nonnegative integer
* @throws {RangeError} byte offset must be a multiple of `16`
* @throws {TypeError} view length must be a positive multiple of `16`
* @throws {RangeError} must provide sufficient memory to accommodate byte offset and view length requirements
* @throws {TypeError} an iterator must return either a two element array containing real and imaginary components or a complex number
* @returns {Complex128Array} complex number array
*
* @example
* var arr = new Complex128Array();
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 0
*
* @example
* var arr = new Complex128Array( 2 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var arr = new Complex128Array( [ 1.0, -1.0 ] );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new Complex128Array( buf );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new Complex128Array( buf, 16 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 64 );
* var arr = new Complex128Array( buf, 16, 2 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*/
function Complex128Array() {
	var byteOffset;
	var nargs;
	var buf;
	var len;

	nargs = arguments.length;
	if ( !(this instanceof Complex128Array) ) {
		if ( nargs === 0 ) {
			return new Complex128Array();
		}
		if ( nargs === 1 ) {
			return new Complex128Array( arguments[0] );
		}
		if ( nargs === 2 ) {
			return new Complex128Array( arguments[0], arguments[1] );
		}
		return new Complex128Array( arguments[0], arguments[1], arguments[2] );
	}
	// Create the underlying data buffer...
	if ( nargs === 0 ) {
		buf = new Float64Array( 0 ); // backward-compatibility
	} else if ( nargs === 1 ) {
		if ( isNonNegativeInteger( arguments[0] ) ) {
			buf = new Float64Array( arguments[0]*2 );
		} else if ( isCollection( arguments[0] ) ) {
			buf = arguments[ 0 ];
			len = buf.length;

			// If provided a "generic" array, peak at the first value, and, if the value is a complex number, try to process as an array of complex numbers, falling back to "normal" typed array initialization if we fail and ensuring consistency if the first value had not been a complex number...
			if ( len && isArray( buf ) && isComplexLike( buf[0] ) ) {
				buf = fromArray( new Float64Array( len*2 ), buf );
				if ( buf === null ) {
					// We failed and we are now forced to allocate a new array :-(
					if ( !isEven( len ) ) {
						throw new RangeError( format( 'invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.', len ) );
					}
					// We failed, so fall back to directly setting values...
					buf = new Float64Array( arguments[0] );
				}
			} else {
				if ( isComplex64Array( buf ) ) {
					buf = reinterpret64( buf, 0 );
				} else if ( isComplex128Array( buf ) ) {
					buf = reinterpret128( buf, 0 );
				} else if ( !isEven( len ) ) {
					throw new RangeError( format( 'invalid argument. Array-like object and typed array arguments must have a length which is a multiple of two. Length: `%u`.', len ) );
				}
				buf = new Float64Array( buf );
			}
		} else if ( isArrayBuffer( arguments[0] ) ) {
			buf = arguments[ 0 ];
			if ( !isInteger( buf.byteLength/BYTES_PER_ELEMENT ) ) {
				throw new RangeError( format( 'invalid argument. ArrayBuffer byte length must be a multiple of %u. Byte length: `%u`.', BYTES_PER_ELEMENT, buf.byteLength ) );
			}
			buf = new Float64Array( buf );
		} else if ( isObject( arguments[0] ) ) {
			buf = arguments[ 0 ];
			if ( HAS_ITERATOR_SYMBOL === false ) {
				throw new TypeError( format( 'invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.', buf ) );
			}
			if ( !isFunction( buf[ ITERATOR_SYMBOL ] ) ) {
				throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', buf ) );
			}
			buf = buf[ ITERATOR_SYMBOL ]();
			if ( !isFunction( buf.next ) ) {
				throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', buf ) );
			}
			buf = fromIterator( buf );
			if ( buf instanceof Error ) {
				throw buf;
			}
			buf = new Float64Array( buf );
		} else {
			throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', arguments[0] ) );
		}
	} else {
		buf = arguments[ 0 ];
		if ( !isArrayBuffer( buf ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an ArrayBuffer. Value: `%s`.', buf ) );
		}
		byteOffset = arguments[ 1 ];
		if ( !isNonNegativeInteger( byteOffset ) ) {
			throw new TypeError( format( 'invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.', byteOffset ) );
		}
		if ( !isInteger( byteOffset/BYTES_PER_ELEMENT ) ) {
			throw new RangeError( format( 'invalid argument. Byte offset must be a multiple of %u. Value: `%u`.', BYTES_PER_ELEMENT, byteOffset ) );
		}
		if ( nargs === 2 ) {
			len = buf.byteLength - byteOffset;
			if ( !isInteger( len/BYTES_PER_ELEMENT ) ) {
				throw new RangeError( format( 'invalid arguments. ArrayBuffer view byte length must be a multiple of %u. View byte length: `%u`.', BYTES_PER_ELEMENT, len ) );
			}
			buf = new Float64Array( buf, byteOffset );
		} else {
			len = arguments[ 2 ];
			if ( !isNonNegativeInteger( len ) ) {
				throw new TypeError( format( 'invalid argument. Length must be a nonnegative integer. Value: `%s`.', len ) );
			}
			if ( (len*BYTES_PER_ELEMENT) > (buf.byteLength-byteOffset) ) {
				throw new RangeError( format( 'invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.', len*BYTES_PER_ELEMENT ) );
			}
			buf = new Float64Array( buf, byteOffset, len*2 );
		}
	}
	setReadOnly( this, '_buffer', buf );
	setReadOnly( this, '_length', buf.length/2 );

	return this;
}

/**
* Size (in bytes) of each array element.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex128Array
* @readonly
* @type {PositiveInteger}
* @default 16
*
* @example
* var nbytes = Complex128Array.BYTES_PER_ELEMENT;
* // returns 16
*/
setReadOnly( Complex128Array, 'BYTES_PER_ELEMENT', BYTES_PER_ELEMENT );

/**
* Constructor name.
*
* @name name
* @memberof Complex128Array
* @readonly
* @type {string}
* @default 'Complex128Array'
*
* @example
* var name = Complex128Array.name;
* // returns 'Complex128Array'
*/
setReadOnly( Complex128Array, 'name', 'Complex128Array' );

/**
* Creates a new 128-bit complex number array from an array-like object or an iterable.
*
* @name from
* @memberof Complex128Array
* @type {Function}
* @param {(Collection|Object)} src - array-like object or iterable
* @param {Function} [clbk] - callback to invoke for each source element
* @param {*} [thisArg] - context
* @throws {TypeError} `this` context must be a constructor
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an array-like object or an iterable
* @throws {TypeError} second argument must be a function
* @throws {RangeError} array-like objects must have a length which is a multiple of two
* @throws {TypeError} an iterator must return either a two element array containing real and imaginary components or a complex number
* @throws {TypeError} when provided an iterator, a callback must return either a two element array containing real and imaginary components or a complex number
* @returns {Complex128Array} 128-bit complex number array
*
* @example
* var arr = Complex128Array.from( [ 1.0, -1.0 ] );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var arr = Complex128Array.from( [ new Complex128( 1.0, 1.0 ) ] );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function clbk( v ) {
*     return new Complex128( real(v)*2.0, imag(v)*2.0 );
* }
*
* var arr = Complex128Array.from( [ new Complex128( 1.0, 1.0 ) ], clbk );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 1
*/
setReadOnly( Complex128Array, 'from', function from( src ) {
	var thisArg;
	var nargs;
	var clbk;
	var out;
	var buf;
	var tmp;
	var get;
	var len;
	var flg;
	var v;
	var i;
	var j;
	if ( !isFunction( this ) ) {
		throw new TypeError( 'invalid invocation. `this` context must be a constructor.' );
	}
	if ( !isComplexArrayConstructor( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	nargs = arguments.length;
	if ( nargs > 1 ) {
		clbk = arguments[ 1 ];
		if ( !isFunction( clbk ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be a function. Value: `%s`.', clbk ) );
		}
		if ( nargs > 2 ) {
			thisArg = arguments[ 2 ];
		}
	}
	if ( isComplexArray( src ) ) {
		len = src.length;
		if ( clbk ) {
			out = new this( len );
			buf = out._buffer; // eslint-disable-line no-underscore-dangle
			j = 0;
			for ( i = 0; i < len; i++ ) {
				v = clbk.call( thisArg, src.get( i ), i );
				if ( isComplexLike( v ) ) {
					buf[ j ] = real( v );
					buf[ j+1 ] = imag( v );
				} else if ( isArrayLikeObject( v ) && v.length >= 2 ) {
					buf[ j ] = v[ 0 ];
					buf[ j+1 ] = v[ 1 ];
				} else {
					throw new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', v ) );
				}
				j += 2; // stride
			}
			return out;
		}
		return new this( src );
	}
	if ( isCollection( src ) ) {
		if ( clbk ) {
			// Note: array contents affect how we iterate over a provided data source. If only complex number objects, we can extract real and imaginary components. Otherwise, for non-complex number arrays (e.g., `Float64Array`, etc), we assume a strided array where real and imaginary components are interleaved. In the former case, we expect a callback to return real and imaginary components (possibly as a complex number). In the latter case, we expect a callback to return *either* a real or imaginary component.

			len = src.length;
			if ( src.get && src.set ) {
				get = accessorGetter( 'default' );
			} else {
				get = getter( 'default' );
			}
			// Detect whether we've been provided an array which returns complex number objects...
			for ( i = 0; i < len; i++ ) {
				if ( !isComplexLike( get( src, i ) ) ) {
					flg = true;
					break;
				}
			}
			// If an array does not contain only complex number objects, then we assume interleaved real and imaginary components...
			if ( flg ) {
				if ( !isEven( len ) ) {
					throw new RangeError( format( 'invalid argument. First argument must have a length which is a multiple of two. Length: `%u`.', len ) );
				}
				out = new this( len/2 );
				buf = out._buffer; // eslint-disable-line no-underscore-dangle
				for ( i = 0; i < len; i++ ) {
					buf[ i ] = clbk.call( thisArg, get( src, i ), i );
				}
				return out;
			}
			// If an array contains only complex number objects, then we need to extract real and imaginary components...
			out = new this( len );
			buf = out._buffer; // eslint-disable-line no-underscore-dangle
			j = 0;
			for ( i = 0; i < len; i++ ) {
				v = clbk.call( thisArg, get( src, i ), i );
				if ( isComplexLike( v ) ) {
					buf[ j ] = real( v );
					buf[ j+1 ] = imag( v );
				} else if ( isArrayLikeObject( v ) && v.length >= 2 ) {
					buf[ j ] = v[ 0 ];
					buf[ j+1 ] = v[ 1 ];
				} else {
					throw new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', v ) );
				}
				j += 2; // stride
			}
			return out;
		}
		return new this( src );
	}
	if ( isObject( src ) && HAS_ITERATOR_SYMBOL && isFunction( src[ ITERATOR_SYMBOL ] ) ) { // eslint-disable-line max-len
		buf = src[ ITERATOR_SYMBOL ]();
		if ( !isFunction( buf.next ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.', src ) );
		}
		if ( clbk ) {
			tmp = fromIteratorMap( buf, clbk, thisArg );
		} else {
			tmp = fromIterator( buf );
		}
		if ( tmp instanceof Error ) {
			throw tmp;
		}
		len = tmp.length / 2;
		out = new this( len );
		buf = out._buffer; // eslint-disable-line no-underscore-dangle
		for ( i = 0; i < len; i++ ) {
			buf[ i ] = tmp[ i ];
		}
		return out;
	}
	throw new TypeError( format( 'invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.', src ) );
});

/**
* Creates a new 128-bit complex number array from a variable number of arguments.
*
* @name of
* @memberof Complex128Array
* @type {Function}
* @param {...*} element - array elements
* @throws {TypeError} `this` context must be a constructor
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex128Array} 128-bit complex number array
*
* @example
* var arr = Complex128Array.of( 1.0, 1.0, 1.0, 1.0 );
* // returns <Complex128Array>
*
* var len = arr.length;
* // returns 2
*/
setReadOnly( Complex128Array, 'of', function of() {
	var args;
	var i;
	if ( !isFunction( this ) ) {
		throw new TypeError( 'invalid invocation. `this` context must be a constructor.' );
	}
	if ( !isComplexArrayConstructor( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	args = [];
	for ( i = 0; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}
	return new this( args );
});

/**
* Returns an array element with support for both nonnegative and negative integer indices.
*
* @name at
* @memberof Complex128Array.prototype
* @type {Function}
* @param {integer} idx - element index
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} must provide an integer
* @returns {(Complex128|void)} array element
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 10 );
*
* var z = arr.at( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 0.0
*
* var im = imag( z );
* // returns 0.0
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 9.0, -9.0 ], 9 );
*
* z = arr.at( 0 );
* // returns <Complex128>
*
* re = real( z );
* // returns 1.0
*
* im = imag( z );
* // returns -1.0
*
* z = arr.at( -1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 9.0
*
* im = imag( z );
* // returns -9.0
*
* z = arr.at( 100 );
* // returns undefined
*
* z = arr.at( -100 );
* // returns undefined
*/
setReadOnly( Complex128Array.prototype, 'at', function at( idx ) {
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isInteger( idx ) ) {
		throw new TypeError( format( 'invalid argument. Must provide an integer. Value: `%s`.', idx ) );
	}
	if ( idx < 0 ) {
		idx += this._length;
	}
	if ( idx < 0 || idx >= this._length ) {
		return;
	}
	return getComplex128( this._buffer, idx );
});

/**
* Pointer to the underlying data buffer.
*
* @name buffer
* @memberof Complex128Array.prototype
* @readonly
* @type {ArrayBuffer}
*
* @example
* var arr = new Complex128Array( 10 );
*
* var buf = arr.buffer;
* // returns <ArrayBuffer>
*/
setReadOnlyAccessor( Complex128Array.prototype, 'buffer', function get() {
	return this._buffer.buffer;
});

/**
* Size (in bytes) of the array.
*
* @name byteLength
* @memberof Complex128Array.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new Complex128Array( 10 );
*
* var byteLength = arr.byteLength;
* // returns 160
*/
setReadOnlyAccessor( Complex128Array.prototype, 'byteLength', function get() {
	return this._buffer.byteLength;
});

/**
* Offset (in bytes) of the array from the start of its underlying `ArrayBuffer`.
*
* @name byteOffset
* @memberof Complex128Array.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new Complex128Array( 10 );
*
* var byteOffset = arr.byteOffset;
* // returns 0
*/
setReadOnlyAccessor( Complex128Array.prototype, 'byteOffset', function get() {
	return this._buffer.byteOffset;
});

/**
* Size (in bytes) of each array element.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex128Array.prototype
* @readonly
* @type {PositiveInteger}
* @default 16
*
* @example
* var arr = new Complex128Array( 10 );
*
* var nbytes = arr.BYTES_PER_ELEMENT;
* // returns 16
*/
setReadOnly( Complex128Array.prototype, 'BYTES_PER_ELEMENT', Complex128Array.BYTES_PER_ELEMENT );

/**
* Copies a sequence of elements within the array to the position starting at `target`.
*
* @name copyWithin
* @memberof Complex128Array.prototype
* @type {Function}
* @param {integer} target - index at which to start copying elements
* @param {integer} start - source index at which to copy elements from
* @param {integer} [end] - source index at which to stop copying elements from
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex128Array} modified array
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 4 );
*
* // Set the array elements:
* arr.set( new Complex128( 1.0, 1.0 ), 0 );
* arr.set( new Complex128( 2.0, 2.0 ), 1 );
* arr.set( new Complex128( 3.0, 3.0 ), 2 );
* arr.set( new Complex128( 4.0, 4.0 ), 3 );
*
* // Copy the first two elements to the last two elements:
* arr.copyWithin( 2, 0, 2 );
*
* // Get the last array element:
* var z = arr.get( 3 );
*
* var re = real( z );
* // returns 2.0
*
* var im = imag( z );
* // returns 2.0
*/
setReadOnly( Complex128Array.prototype, 'copyWithin', function copyWithin( target, start ) {
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	// FIXME: prefer a functional `copyWithin` implementation which addresses lack of universal browser support (e.g., IE11 and Safari) or ensure that typed arrays are polyfilled
	if ( arguments.length === 2 ) {
		this._buffer.copyWithin( target*2, start*2 );
	} else {
		this._buffer.copyWithin( target*2, start*2, arguments[2]*2 );
	}
	return this;
});

/**
* Returns an iterator for iterating over array key-value pairs.
*
* @name entries
* @memberof Complex128Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Iterator} iterator
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var arr = [
*     new Complex128( 1.0, 1.0 ),
*     new Complex128( 2.0, 2.0 ),
*     new Complex128( 3.0, 3.0 )
* ];
* arr = new Complex128Array( arr );
*
* // Create an iterator:
* var it = arr.entries();
*
* // Iterate over the key-value pairs...
* var v = it.next().value;
* // returns [ 0, <Complex128> ]
*
* v = it.next().value;
* // returns [ 1, <Complex128> ]
*
* v = it.next().value;
* // returns [ 2, <Complex128> ]
*
* var bool = it.next().done;
* // returns true
*/
setReadOnly( Complex128Array.prototype, 'entries', function entries() {
	var buffer;
	var self;
	var iter;
	var len;
	var FLG;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	self = this;
	buffer = this._buffer;
	len = this._length;

	// Initialize the iteration indices:
	i = -1;
	j = -2;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		var z;
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		j += 2;
		z = new Complex128( buffer[ j ], buffer[ j+1 ] );
		return {
			'value': [ i, z ],
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.entries();
	}
});

/**
* Tests whether all elements in an array pass a test implemented by a predicate function.
*
* @name every
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {boolean} boolean indicating whether all elements pass a test
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var bool = arr.every( predicate );
* // returns true
*/
setReadOnly( Complex128Array.prototype, 'every', function every( predicate, thisArg ) {
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( !predicate.call( thisArg, getComplex128( buf, i ), i, this ) ) {
			return false;
		}
	}
	return true;
});

/**
* Returns a modified typed array filled with a fill value.
*
* @name fill
* @memberof Complex128Array.prototype
* @type {Function}
* @param {ComplexLike} value - fill value
* @param {integer} [start=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @throws {TypeError} third argument must be an integer
* @returns {Complex128Array} modified array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 3 );
*
* arr.fill( new Complex128( 1.0, 1.0 ), 1 );
*
* var z = arr.get( 1 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 1.0
*
* var im = imag( z );
* // returns 1.0
*
* z = arr.get( 2 );
* // returns <Complex128>
*
* re = real( z );
* // returns 1.0
*
* im = imag( z );
* // returns 1.0
*/
setReadOnly( Complex128Array.prototype, 'fill', function fill( value, start, end ) {
	var buf;
	var len;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( value ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', value ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		if ( !isInteger( start ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', start ) );
		}
		if ( start < 0 ) {
			start += len;
			if ( start < 0 ) {
				start = 0;
			}
		}
		if ( arguments.length > 2 ) {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Third argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			}
			if ( end > len ) {
				end = len;
			}
		} else {
			end = len;
		}
	} else {
		start = 0;
		end = len;
	}
	re = real( value );
	im = imag( value );
	for ( i = start; i < end; i++ ) {
		idx = 2*i;
		buf[ idx ] = re;
		buf[ idx+1 ] = im;
	}
	return this;
});

/**
* Returns a new array containing the elements of an array which pass a test implemented by a predicate function.
*
* @name filter
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex128Array} complex number array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var out = arr.filter( predicate );
* // returns <Complex128Array>
*
* var len = out.length;
* // returns 1
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 2.0
*
* var im = imag( z );
* // returns 2.0
*/
setReadOnly( Complex128Array.prototype, 'filter', function filter( predicate, thisArg ) {
	var buf;
	var out;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex128( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			out.push( z );
		}
	}
	return new this.constructor( out );
});

/**
* Returns the first element in an array for which a predicate function returns a truthy value.
*
* @name find
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {(Complex128|void)} array element or undefined
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.find( predicate );
* // returns <Complex128>
*
* var re = real( z );
* // returns 1.0
*
* var im = imag( z );
* // returns 1.0
*/
setReadOnly( Complex128Array.prototype, 'find', function find( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex128( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return z;
		}
	}
});

/**
* Returns the index of the first element in an array for which a predicate function returns a truthy value.
*
* @name findIndex
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {integer} index or -1
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var idx = arr.findIndex( predicate );
* // returns 2
*/
setReadOnly( Complex128Array.prototype, 'findIndex', function findIndex( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex128( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns the last element in an array for which a predicate function returns a truthy value.
*
* @name findLast
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {(Complex128|void)} array element or undefined
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.findLast( predicate );
* // returns <Complex128>
*
* var re = real( z );
* // returns 3.0
*
* var im = imag( z );
* // returns 3.0
*/
setReadOnly( Complex128Array.prototype, 'findLast', function findLast( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = this._length-1; i >= 0; i-- ) {
		z = getComplex128( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return z;
		}
	}
});

/**
* Returns the index of the last element in an array for which a predicate function returns a truthy value.
*
* @name findLastIndex
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {integer} index or -1
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var idx = arr.findLastIndex( predicate );
* // returns 1
*/
setReadOnly( Complex128Array.prototype, 'findLastIndex', function findLastIndex( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = this._length-1; i >= 0; i-- ) {
		z = getComplex128( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Invokes a function once for each array element.
*
* @name forEach
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} fcn - function to invoke
* @param {*} [thisArg] - function invocation context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* function log( v, i ) {
*     console.log( '%s: %s', i, v.toString() );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* arr.forEach( log );
*/
setReadOnly( Complex128Array.prototype, 'forEach', function forEach( fcn, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( fcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', fcn ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex128( buf, i );
		fcn.call( thisArg, z, i, this );
	}
});

/**
* Returns an array element.
*
* @name get
* @memberof Complex128Array.prototype
* @type {Function}
* @param {NonNegativeInteger} idx - element index
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} must provide a nonnegative integer
* @returns {(Complex128|void)} array element
*
* @example
* var arr = new Complex128Array( 10 );
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var z = arr.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 0.0
*
* var im = imag( z );
* // returns 0.0
*
* arr.set( [ 1.0, -1.0 ], 0 );
*
* z = arr.get( 0 );
* // returns <Complex128>
*
* re = real( z );
* // returns 1.0
*
* im = imag( z );
* // returns -1.0
*
* z = arr.get( 100 );
* // returns undefined
*/
setReadOnly( Complex128Array.prototype, 'get', function get( idx ) {
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isNonNegativeInteger( idx ) ) {
		throw new TypeError( format( 'invalid argument. Must provide a nonnegative integer. Value: `%s`.', idx ) );
	}
	if ( idx >= this._length ) {
		return;
	}
	return getComplex128( this._buffer, idx );
});

/**
* Number of array elements.
*
* @name length
* @memberof Complex128Array.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new Complex128Array( 10 );
*
* var len = arr.length;
* // returns 10
*/
setReadOnlyAccessor( Complex128Array.prototype, 'length', function get() {
	return this._length;
});

/**
* Returns a boolean indicating whether an array includes a provided value.
*
* @name includes
* @memberof Complex128Array.prototype
* @type {Function}
* @param {ComplexLike} searchElement - search element
* @param {integer} [fromIndex=0] - starting index (inclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @returns {boolean} boolean indicating whether an array includes a provided value
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var arr = new Complex128Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var bool = arr.includes( new Complex128( 3.0, -3.0 ) );
* // returns true
*
* bool = arr.includes( new Complex128( 3.0, -3.0 ), 3 );
* // returns false
*
* bool = arr.includes( new Complex128( 4.0, -4.0 ), -3 );
* // returns true
*/
setReadOnly( Complex128Array.prototype, 'includes', function includes( searchElement, fromIndex ) {
	var buf;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex < 0 ) {
			fromIndex += this._length;
			if ( fromIndex < 0 ) {
				fromIndex = 0;
			}
		}
	} else {
		fromIndex = 0;
	}
	re = real( searchElement );
	im = imag( searchElement );
	buf = this._buffer;
	for ( i = fromIndex; i < this._length; i++ ) {
		idx = 2 * i;
		if ( re === buf[ idx ] && im === buf[ idx+1 ] ) {
			return true;
		}
	}
	return false;
});

/**
* Returns the first index at which a given element can be found.
*
* @name indexOf
* @memberof Complex128Array.prototype
* @type {Function}
* @param {ComplexLike} searchElement - element to find
* @param {integer} [fromIndex=0] - starting index (inclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @returns {integer} index or -1
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var arr = new Complex128Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var idx = arr.indexOf( new Complex128( 3.0, -3.0 ) );
* // returns 2
*
* idx = arr.indexOf( new Complex128( 3.0, -3.0 ), 3 );
* // returns -1
*
* idx = arr.indexOf( new Complex128( 4.0, -4.0 ), -3 );
* // returns 3
*/
setReadOnly( Complex128Array.prototype, 'indexOf', function indexOf( searchElement, fromIndex ) {
	var buf;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex < 0 ) {
			fromIndex += this._length;
			if ( fromIndex < 0 ) {
				fromIndex = 0;
			}
		}
	} else {
		fromIndex = 0;
	}
	re = real( searchElement );
	im = imag( searchElement );
	buf = this._buffer;
	for ( i = fromIndex; i < this._length; i++ ) {
		idx = 2 * i;
		if ( re === buf[ idx ] && im === buf[ idx+1 ] ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns a new string by concatenating all array elements.
*
* @name join
* @memberof Complex128Array.prototype
* @type {Function}
* @param {string} [separator=','] - element separator
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a string
* @returns {string} string representation
*
* @example
* var arr = new Complex128Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var str = arr.join();
* // returns '1 + 1i,2 + 2i'
*
* str = arr.join( '/' );
* // returns '1 + 1i/2 + 2i'
*/
setReadOnly( Complex128Array.prototype, 'join', function join( separator ) {
	var out;
	var buf;
	var sep;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( arguments.length === 0 ) {
		sep = ',';
	} else if ( isString( separator ) ) {
		sep = separator;
	} else {
		throw new TypeError( format( 'invalid argument. First argument must be a string. Value: `%s`.', separator ) );
	}
	out = [];
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		out.push( getComplex128( buf, i ).toString() );
	}
	return out.join( sep );
});

/**
* Returns an iterator for iterating over each index key in a typed array.
*
* @name keys
* @memberof Complex128Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Iterator} iterator
*
* @example
* var arr = new Complex128Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var iter = arr.keys();
*
* var v = iter.next().value;
* // returns 0
*
* v = iter.next().value;
* // returns 1
*
* var bool = iter.next().done;
* // returns true
*/
setReadOnly( Complex128Array.prototype, 'keys', function keys() {
	var self;
	var iter;
	var len;
	var FLG;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	self = this;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': i,
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.keys();
	}
});

/**
* Returns the last index at which a given element can be found.
*
* @name lastIndexOf
* @memberof Complex128Array.prototype
* @type {Function}
* @param {ComplexLike} searchElement - element to find
* @param {integer} [fromIndex] - index at which to start searching backward (inclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @returns {integer} index or -1
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var arr = new Complex128Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 3.0, -3.0 ], 4 );
*
* var idx = arr.lastIndexOf( new Complex128( 3.0, -3.0 ) );
* // returns 4
*
* idx = arr.lastIndexOf( new Complex128( 3.0, -3.0 ), 3 );
* // returns 2
*
* idx = arr.lastIndexOf( new Complex128( 5.0, -5.0 ), 3 );
* // returns -1
*
* idx = arr.lastIndexOf( new Complex128( 2.0, -2.0 ), -3 );
* // returns 1
*/
setReadOnly( Complex128Array.prototype, 'lastIndexOf', function lastIndexOf( searchElement, fromIndex ) {
	var buf;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex >= this._length ) {
			fromIndex = this._length - 1;
		} else if ( fromIndex < 0 ) {
			fromIndex += this._length;
		}
	} else {
		fromIndex = this._length - 1;
	}
	re = real( searchElement );
	im = imag( searchElement );
	buf = this._buffer;
	for ( i = fromIndex; i >= 0; i-- ) {
		idx = 2 * i;
		if ( re === buf[ idx ] && im === buf[ idx+1 ] ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns a new array with each element being the result of a provided callback function.
*
* @name map
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} fcn - callback function
* @param {*} [thisArg] - callback function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex128Array} complex number array
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function scale( v, i ) {
*     return new Complex128( 2.0*real( v ), 2.0*imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var out = arr.map( scale );
* // returns <Complex128Array>
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 2.0
*
* var im = imag( z );
* // returns -2.0
*/
setReadOnly( Complex128Array.prototype, 'map', function map( fcn, thisArg ) {
	var outbuf;
	var buf;
	var out;
	var i;
	var v;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( fcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', fcn ) );
	}
	buf = this._buffer;
	out = new this.constructor( this._length );
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < this._length; i++ ) {
		v = fcn.call( thisArg, getComplex128( buf, i ), i, this );
		if ( isComplexLike( v ) ) {
			outbuf[ 2*i ] = real( v );
			outbuf[ (2*i)+1 ] = imag( v );
		} else if ( isArrayLikeObject( v ) && v.length === 2 ) {
			outbuf[ 2*i ] = v[ 0 ];
			outbuf[ (2*i)+1 ] = v[ 1 ];
		} else {
			throw new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', v ) );
		}
	}
	return out;
});

/**
* Applies a provided callback function to each element of the array, in order, passing in the return value from the calculation on the preceding element and returning the accumulated result upon completion.
*
* @name reduce
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} reducer - callback function
* @param {*} [initialValue] - initial value
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @throws {Error} if not provided an initial value, the array must have at least one element
* @returns {*} accumulated result
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
* var cadd = require( '@stdlib/complex/float64/base/add' );
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.reduce( cadd );
* // returns <Complex128>
*
* var re = real( z );
* // returns 6.0
*
* var im = imag( z );
* // returns 6.0
*/
setReadOnly( Complex128Array.prototype, 'reduce', function reduce( reducer, initialValue ) {
	var buf;
	var acc;
	var len;
	var v;
	var i;

	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( reducer ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', reducer ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		acc = initialValue;
		i = 0;
	} else {
		if ( len === 0 ) {
			throw new Error( 'invalid operation. If not provided an initial value, an array must contain at least one element.' );
		}
		acc = getComplex128( buf, 0 );
		i = 1;
	}
	for ( ; i < len; i++ ) {
		v = getComplex128( buf, i );
		acc = reducer( acc, v, i, this );
	}
	return acc;
});

/**
* Applies a provided callback function to each element of the array, in reverse order, passing in the return value from the calculation on the preceding element and returning the accumulated result upon completion.
*
* @name reduceRight
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} reducer - callback function
* @param {*} [initialValue] - initial value
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @throws {Error} if not provided an initial value, the array must have at least one element
* @returns {*} accumulated result
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
* var cadd = require( '@stdlib/complex/float64/base/add' );
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.reduceRight( cadd );
* // returns <Complex128>
*
* var re = real( z );
* // returns 6.0
*
* var im = imag( z );
* // returns 6.0
*/
setReadOnly( Complex128Array.prototype, 'reduceRight', function reduceRight( reducer, initialValue ) {
	var buf;
	var acc;
	var len;
	var v;
	var i;

	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( reducer ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', reducer ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		acc = initialValue;
		i = len-1;
	} else {
		if ( len === 0 ) {
			throw new Error( 'invalid operation. If not provided an initial value, an array must contain at least one element.' );
		}
		acc = getComplex128( buf, len-1 );
		i = len-2;
	}
	for ( ; i >= 0; i-- ) {
		v = getComplex128( buf, i );
		acc = reducer( acc, v, i, this );
	}
	return acc;
});

/**
* Reverses an array in-place.
*
* @name reverse
* @memberof Complex128Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex128Array} reversed array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var out = arr.reverse();
* // returns <Complex128Array>
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 3.0
*
* var im = imag( z );
* // returns 3.0
*
* z = out.get( 1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 2.0
*
* im = imag( z );
* // returns 2.0
*
* z = out.get( 2 );
* // returns <Complex128>
*
* re = real( z );
* // returns 1.0
*
* im = imag( z );
* // returns 1.0
*/
setReadOnly( Complex128Array.prototype, 'reverse', function reverse() {
	var buf;
	var tmp;
	var len;
	var N;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	len = this._length;
	buf = this._buffer;
	N = floor( len / 2 );
	for ( i = 0; i < N; i++ ) {
		j = len - i - 1;
		tmp = buf[ (2*i) ];
		buf[ (2*i) ] = buf[ (2*j) ];
		buf[ (2*j) ] = tmp;
		tmp = buf[ (2*i)+1 ];
		buf[ (2*i)+1 ] = buf[ (2*j)+1 ];
		buf[ (2*j)+1 ] = tmp;
	}
	return this;
});

/**
* Sets an array element.
*
* ## Notes
*
* -   When provided a typed array, real or complex, we must check whether the source array shares the same buffer as the target array and whether the underlying memory overlaps. In particular, we are concerned with the following scenario:
*
*     ```text
*     buf:                ---------------------
*     src: ---------------------
*     ```
*
*     In the above, as we copy values from `src`, we will overwrite values in the `src` view, resulting in duplicated values copied into the end of `buf`, which is not intended. Hence, to avoid overwriting source values, we must **copy** source values to a temporary array.
*
*     In the other overlapping scenario,
*
*     ```text
*     buf: ---------------------
*     src:                ---------------------
*     ```
*
*     by the time we begin copying into the overlapping region, we are copying from the end of `src`, a non-overlapping region, which means we don't run the risk of copying copied values, rather than the original `src` values as intended.
*
* @name set
* @memberof Complex128Array.prototype
* @type {Function}
* @param {(Collection|Complex|ComplexArray)} value - value(s)
* @param {NonNegativeInteger} [i=0] - element index at which to start writing values
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be either a complex number, an array-like object, or a complex number array
* @throws {TypeError} index argument must be a nonnegative integer
* @throws {RangeError} array-like objects must have a length which is a multiple of two
* @throws {RangeError} index argument is out-of-bounds
* @throws {RangeError} target array lacks sufficient storage to accommodate source values
* @returns {void}
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 10 );
*
* var z = arr.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 0.0
*
* var im = imag( z );
* // returns 0.0
*
* arr.set( [ 1.0, -1.0 ], 0 );
*
* z = arr.get( 0 );
* // returns <Complex128>
*
* re = real( z );
* // returns 1.0
*
* im = imag( z );
* // returns -1.0
*/
setReadOnly( Complex128Array.prototype, 'set', function set( value ) {
	/* eslint-disable no-underscore-dangle */
	var sbuf;
	var idx;
	var buf;
	var tmp;
	var flg;
	var N;
	var v;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	buf = this._buffer;
	if ( arguments.length > 1 ) {
		idx = arguments[ 1 ];
		if ( !isNonNegativeInteger( idx ) ) {
			throw new TypeError( format( 'invalid argument. Index argument must be a nonnegative integer. Value: `%s`.', idx ) );
		}
	} else {
		idx = 0;
	}
	if ( isComplexLike( value ) ) {
		if ( idx >= this._length ) {
			throw new RangeError( format( 'invalid argument. Index argument is out-of-bounds. Value: `%u`.', idx ) );
		}
		idx *= 2;
		buf[ idx ] = real( value );
		buf[ idx+1 ] = imag( value );
		return;
	}
	if ( isComplexArray( value ) ) {
		N = value._length;
		if ( idx+N > this._length ) {
			throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
		}
		sbuf = value._buffer;

		// Check for overlapping memory...
		j = buf.byteOffset + (idx*BYTES_PER_ELEMENT);
		if (
			sbuf.buffer === buf.buffer &&
			(
				sbuf.byteOffset < j &&
				sbuf.byteOffset+sbuf.byteLength > j
			)
		) {
			// We need to copy source values...
			tmp = new Float64Array( sbuf.length );
			for ( i = 0; i < sbuf.length; i++ ) {
				tmp[ i ] = sbuf[ i ];
			}
			sbuf = tmp;
		}
		idx *= 2;
		j = 0;
		for ( i = 0; i < N; i++ ) {
			buf[ idx ] = sbuf[ j ];
			buf[ idx+1 ] = sbuf[ j+1 ];
			idx += 2; // stride
			j += 2; // stride
		}
		return;
	}
	if ( isCollection( value ) ) {
		// Detect whether we've been provided an array of complex numbers...
		N = value.length;
		for ( i = 0; i < N; i++ ) {
			if ( !isComplexLike( value[ i ] ) ) {
				flg = true;
				break;
			}
		}
		// If an array does not contain only complex numbers, then we assume interleaved real and imaginary components...
		if ( flg ) {
			if ( !isEven( N ) ) {
				throw new RangeError( format( 'invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.', N ) );
			}
			if ( idx+(N/2) > this._length ) {
				throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
			}
			sbuf = value;

			// Check for overlapping memory...
			j = buf.byteOffset + (idx*BYTES_PER_ELEMENT);
			if (
				sbuf.buffer === buf.buffer &&
				(
					sbuf.byteOffset < j &&
					sbuf.byteOffset+sbuf.byteLength > j
				)
			) {
				// We need to copy source values...
				tmp = new Float64Array( N );
				for ( i = 0; i < N; i++ ) {
					tmp[ i ] = sbuf[ i ];
				}
				sbuf = tmp;
			}
			idx *= 2;
			N /= 2;
			j = 0;
			for ( i = 0; i < N; i++ ) {
				buf[ idx ] = sbuf[ j ];
				buf[ idx+1 ] = sbuf[ j+1 ];
				idx += 2; // stride
				j += 2; // stride
			}
			return;
		}
		// If an array contains only complex numbers, then we need to extract real and imaginary components...
		if ( idx+N > this._length ) {
			throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
		}
		idx *= 2;
		for ( i = 0; i < N; i++ ) {
			v = value[ i ];
			buf[ idx ] = real( v );
			buf[ idx+1 ] = imag( v );
			idx += 2; // stride
		}
		return;
	}
	throw new TypeError( format( 'invalid argument. First argument must be either a complex number, an array-like object, or a complex number array. Value: `%s`.', value ) );

	/* eslint-enable no-underscore-dangle */
});

/**
* Copies a portion of a typed array to a new typed array.
*
* @name slice
* @memberof Complex128Array.prototype
* @type {Function}
* @param {integer} [start=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an integer
* @throws {TypeError} second argument must be an integer
* @returns {Complex128Array} complex number array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var out = arr.slice();
* // returns <Complex128Array>
*
* var len = out.length;
* // returns 5
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 1.0
*
* var im = imag( z );
* // returns -1.0
*
* z = out.get( len-1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 5.0
*
* im = imag( z );
* // returns -5.0
*
* out = arr.slice( 1, -2 );
* // returns <Complex128Array>
*
* len = out.length;
* // returns 2
*
* z = out.get( 0 );
* // returns <Complex128>
*
* re = real( z );
* // returns 2.0
*
* im = imag( z );
* // returns -2.0
*
* z = out.get( len-1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 3.0
*
* im = imag( z );
* // returns -3.0
*/
setReadOnly( Complex128Array.prototype, 'slice', function slice( start, end ) {
	var outlen;
	var outbuf;
	var out;
	var idx;
	var buf;
	var len;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length === 0 ) {
		start = 0;
		end = len;
	} else {
		if ( !isInteger( start ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', start ) );
		}
		if ( start < 0 ) {
			start += len;
			if ( start < 0 ) {
				start = 0;
			}
		}
		if ( arguments.length === 1 ) {
			end = len;
		} else {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			} else if ( end > len ) {
				end = len;
			}
		}
	}
	if ( start < end ) {
		outlen = end - start;
	} else {
		outlen = 0;
	}
	out = new this.constructor( outlen );
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < outlen; i++ ) {
		idx = 2*(i+start);
		outbuf[ 2*i ] = buf[ idx ];
		outbuf[ (2*i)+1 ] = buf[ idx+1 ];
	}
	return out;
});

/**
* Tests whether at least one element in an array passes a test implemented by a predicate function.
*
* @name some
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {boolean} boolean indicating whether at least one element passes a test
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function predicate( v ) {
*     return ( real( v ) === imag( v ) );
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var bool = arr.some( predicate );
* // returns true
*/
setReadOnly( Complex128Array.prototype, 'some', function some( predicate, thisArg ) {
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( predicate.call( thisArg, getComplex128( buf, i ), i, this ) ) {
			return true;
		}
	}
	return false;
});

/**
* Sorts an array in-place.
*
* @name sort
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} compareFcn - comparison function
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex128Array} sorted array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function compare( a, b ) {
*     var re1;
*     var re2;
*     var im1;
*     var im2;
*     re1 = real( a );
*     re2 = real( b );
*     if ( re1 < re2 ) {
*         return -1;
*     }
*     if ( re1 > re2 ) {
*         return 1;
*     }
*     im1 = imag( a );
*     im2 = imag( b );
*     if ( im1 < im2 ) {
*         return -1;
*     }
*     if ( im1 > im2 ) {
*         return 1;
*     }
*     return 0;
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 3.0, -3.0 ], 0 );
* arr.set( [ 1.0, -1.0 ], 1 );
* arr.set( [ 2.0, -2.0 ], 2 );
*
* var out = arr.sort( compare );
* // returns <Complex128Array>
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 1.0
*
* var im = imag( z );
* // returns -1.0
*
* z = out.get( 1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 2.0
*
* im = imag( z );
* // returns -2.0
*
* z = out.get( 2 );
* // returns <Complex128>
*
* re = real( z );
* // returns 3.0
*
* im = imag( z );
* // returns -3.0
*/
setReadOnly( Complex128Array.prototype, 'sort', function sort( compareFcn ) {
	var tmp;
	var buf;
	var len;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( compareFcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', compareFcn ) );
	}
	buf = this._buffer;
	len = this._length;
	tmp = [];
	for ( i = 0; i < len; i++ ) {
		tmp.push( getComplex128( buf, i ) );
	}
	tmp.sort( compareFcn );
	for ( i = 0; i < len; i++ ) {
		j = 2 * i;
		buf[ j ] = real( tmp[i] );
		buf[ j+1 ] = imag( tmp[i] );
	}
	return this;
});

/**
* Creates a new typed array view over the same underlying `ArrayBuffer` and with the same underlying data type as the host array.
*
* @name subarray
* @memberof Complex128Array.prototype
* @type {Function}
* @param {integer} [begin=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an integer
* @throws {TypeError} second argument must be an integer
* @returns {Complex64Array} subarray
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var subarr = arr.subarray();
* // returns <Complex128Array>
*
* var len = subarr.length;
* // returns 5
*
* var z = subarr.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 1.0
*
* var im = imag( z );
* // returns -1.0
*
* z = subarr.get( len-1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 5.0
*
* im = imag( z );
* // returns -5.0
*
* subarr = arr.subarray( 1, -2 );
* // returns <Complex128Array>
*
* len = subarr.length;
* // returns 2
*
* z = subarr.get( 0 );
* // returns <Complex128>
*
* re = real( z );
* // returns 2.0
*
* im = imag( z );
* // returns -2.0
*
* z = subarr.get( len-1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 3.0
*
* im = imag( z );
* // returns -3.0
*/
setReadOnly( Complex128Array.prototype, 'subarray', function subarray( begin, end ) {
	var offset;
	var buf;
	var len;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length === 0 ) {
		begin = 0;
		end = len;
	} else {
		if ( !isInteger( begin ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', begin ) );
		}
		if ( begin < 0 ) {
			begin += len;
			if ( begin < 0 ) {
				begin = 0;
			}
		}
		if ( arguments.length === 1 ) {
			end = len;
		} else {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			} else if ( end > len ) {
				end = len;
			}
		}
	}
	if ( begin >= len ) {
		len = 0;
		offset = buf.byteLength;
	} else if ( begin >= end ) {
		len = 0;
		offset = buf.byteOffset + ( begin*BYTES_PER_ELEMENT );
	} else {
		len = end - begin;
		offset = buf.byteOffset + ( begin*BYTES_PER_ELEMENT );
	}
	return new this.constructor( buf.buffer, offset, ( len < 0 ) ? 0 : len );
});

/**
* Serializes an array as a locale-specific string.
*
* @name toLocaleString
* @memberof Complex128Array.prototype
* @type {Function}
* @param {(string|Array<string>)} [locales] - locale identifier(s)
* @param {Object} [options] - configuration options
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a string or an array of strings
* @throws {TypeError} options argument must be an object
* @returns {string} string representation
*
* @example
* var arr = new Complex128Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var str = arr.toLocaleString();
* // returns '1 + 1i,2 + 2i'
*/
setReadOnly( Complex128Array.prototype, 'toLocaleString', function toLocaleString( locales, options ) {
	var opts;
	var loc;
	var out;
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( arguments.length === 0 ) {
		loc = [];
	} else if ( isString( locales ) || isStringArray( locales ) ) {
		loc = locales;
	} else {
		throw new TypeError( format( 'invalid argument. First argument must be a string or an array of strings. Value: `%s`.', locales ) );
	}
	if ( arguments.length < 2 ) {
		opts = {};
	} else if ( isObject( options ) ) {
		opts = options;
	} else {
		throw new TypeError( format( 'invalid argument. Options argument must be an object. Value: `%s`.', options ) );
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		out.push( getComplex128( buf, i ).toLocaleString( loc, opts ) );
	}
	return out.join( ',' );
});

/**
* Returns a new typed array containing the elements in reversed order.
*
* @name toReversed
* @memberof Complex128Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex128Array} reversed array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var out = arr.toReversed();
* // returns <Complex128Array>
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 3.0
*
* var im = imag( z );
* // returns 3.0
*
* z = out.get( 1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 2.0
*
* im = imag( z );
* // returns 2.0
*
* z = out.get( 2 );
* // returns <Complex128>
*
* re = real( z );
* // returns 1.0
*
* im = imag( z );
* // returns 1.0
*/
setReadOnly( Complex128Array.prototype, 'toReversed', function toReversed() {
	var outbuf;
	var out;
	var len;
	var buf;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	len = this._length;
	out = new this.constructor( len );
	buf = this._buffer;
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < len; i++ ) {
		j = len - i - 1;
		outbuf[ (2*i) ] = buf[ (2*j) ];
		outbuf[ (2*i)+1 ] = buf[ (2*j)+1 ];
	}
	return out;
});

/**
* Returns a new typed array containing the elements in sorted order.
*
* @name toSorted
* @memberof Complex128Array.prototype
* @type {Function}
* @param {Function} compareFcn - comparison function
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex128Array} sorted array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* function compare( a, b ) {
*     var re1;
*     var re2;
*     var im1;
*     var im2;
*     re1 = real( a );
*     re2 = real( b );
*     if ( re1 < re2 ) {
*         return -1;
*     }
*     if ( re1 > re2 ) {
*         return 1;
*     }
*     im1 = imag( a );
*     im2 = imag( b );
*     if ( im1 < im2 ) {
*         return -1;
*     }
*     if ( im1 > im2 ) {
*         return 1;
*     }
*     return 0;
* }
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 3.0, -3.0 ], 0 );
* arr.set( [ 1.0, -1.0 ], 1 );
* arr.set( [ 2.0, -2.0 ], 2 );
*
* var out = arr.sort( compare );
* // returns <Complex128Array>
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 1.0
*
* var im = imag( z );
* // returns -1.0
*
* z = out.get( 1 );
* // returns <Complex128>
*
* re = real( z );
* // returns 2.0
*
* im = imag( z );
* // returns -2.0
*
* z = out.get( 2 );
* // returns <Complex128>
*
* re = real( z );
* // returns 3.0
*
* im = imag( z );
* // returns -3.0
*/
setReadOnly( Complex128Array.prototype, 'toSorted', function toSorted( compareFcn ) {
	var tmp;
	var buf;
	var len;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( compareFcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', compareFcn ) );
	}
	buf = this._buffer;
	len = this._length;
	tmp = [];
	for ( i = 0; i < len; i++ ) {
		tmp.push( getComplex128( buf, i ) );
	}
	tmp.sort( compareFcn );
	return new Complex128Array( tmp );
});

/**
* Serializes an array as a string.
*
* @name toString
* @memberof Complex128Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {string} string representation
*
* @example
* var arr = new Complex128Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var str = arr.toString();
* // returns '1 + 1i,2 + 2i'
*/
setReadOnly( Complex128Array.prototype, 'toString', function toString() {
	var out;
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	out = [];
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		out.push( getComplex128( buf, i ).toString() );
	}
	return out.join( ',' );
});

/**
* Returns an iterator for iterating over each value in a typed array.
*
* @name values
* @memberof Complex128Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Iterator} iterator
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
* var arr = new Complex128Array( 2 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
*
* var iter = arr.values();
*
* var v = iter.next().value;
* // returns <Complex128>
*
* var re = real( v );
* // returns 1.0
*
* var im = imag( v );
* // returns -1.0
*
* v = iter.next().value;
* // returns <Complex128>
*
* re = real( v );
* // returns 2.0
*
* im = imag( v );
* // returns -2.0
*
* var bool = iter.next().done;
* // returns true
*/
setReadOnly( Complex128Array.prototype, 'values', function values() {
	var iter;
	var self;
	var len;
	var FLG;
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	self = this;
	buf = this._buffer;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': getComplex128( buf, i ),
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.values();
	}
});

/**
* Returns a new typed array with the element at a provided index replaced with a provided value.
*
* @name with
* @memberof Complex128Array.prototype
* @type {Function}
* @param {integer} index - element index
* @param {ComplexLike} value - new value
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an integer
* @throws {RangeError} index argument is out-of-bounds
* @throws {TypeError} second argument must be a complex number
* @returns {Complex128Array} new typed array
*
* @example
* var real = require( '@stdlib/complex/float64/real' );
* var imag = require( '@stdlib/complex/float64/imag' );
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var arr = new Complex128Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var out = arr.with( 0, new Complex128( 4.0, 4.0 ) );
* // returns <Complex128Array>
*
* var z = out.get( 0 );
* // returns <Complex128>
*
* var re = real( z );
* // returns 4.0
*
* var im = imag( z );
* // returns 4.0
*/
setReadOnly( Complex128Array.prototype, 'with', function copyWith( index, value ) {
	var buf;
	var out;
	var len;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isInteger( index ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', index ) );
	}
	len = this._length;
	if ( index < 0 ) {
		index += len;
	}
	if ( index < 0 || index >= len ) {
		throw new RangeError( format( 'invalid argument. Index argument is out-of-bounds. Value: `%s`.', index ) );
	}
	if ( !isComplexLike( value ) ) {
		throw new TypeError( format( 'invalid argument. Second argument must be a complex number. Value: `%s`.', value ) );
	}
	out = new this.constructor( this._buffer );
	buf = out._buffer; // eslint-disable-line no-underscore-dangle
	buf[ 2*index ] = real( value );
	buf[ (2*index)+1 ] = imag( value );
	return out;
});


// EXPORTS //

module.exports = Complex128Array;

},{"./../../base/accessor-getter":36,"./../../base/assert/is-complex128array":43,"./../../base/assert/is-complex64array":45,"./../../base/getter":47,"./../../float64":72,"./from_array.js":54,"./from_iterator.js":55,"./from_iterator_map.js":56,"@stdlib/assert/has-iterator-symbol-support":111,"@stdlib/assert/is-array":133,"@stdlib/assert/is-array-like-object":131,"@stdlib/assert/is-arraybuffer":135,"@stdlib/assert/is-collection":145,"@stdlib/assert/is-complex-like":147,"@stdlib/assert/is-function":155,"@stdlib/assert/is-nonnegative-integer":168,"@stdlib/assert/is-object":180,"@stdlib/assert/is-string":183,"@stdlib/assert/is-string-array":182,"@stdlib/complex/float64/ctor":221,"@stdlib/complex/float64/imag":225,"@stdlib/complex/float64/real":227,"@stdlib/math/base/assert/is-even":242,"@stdlib/math/base/assert/is-integer":244,"@stdlib/math/base/special/floor":248,"@stdlib/strided/base/reinterpret-complex128":260,"@stdlib/strided/base/reinterpret-complex64":262,"@stdlib/string/format":274,"@stdlib/symbol/iterator":279,"@stdlib/utils/define-nonenumerable-read-only-accessor":283,"@stdlib/utils/define-nonenumerable-read-only-property":285}],59:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var realf = require( '@stdlib/complex/float32/real' );
var imagf = require( '@stdlib/complex/float32/imag' );


// MAIN //

/**
* Returns a strided array of real and imaginary components.
*
* @private
* @param {Float32Array} buf - output array
* @param {Array} arr - array containing complex numbers
* @returns {(Float32Array|null)} output array or null
*/
function fromArray( buf, arr ) {
	var len;
	var v;
	var i;
	var j;

	len = arr.length;
	j = 0;
	for ( i = 0; i < len; i++ ) {
		v = arr[ i ];
		if ( !isComplexLike( v ) ) {
			return null;
		}
		buf[ j ] = realf( v );
		buf[ j+1 ] = imagf( v );
		j += 2; // stride
	}
	return buf;
}


// EXPORTS //

module.exports = fromArray;

},{"@stdlib/assert/is-complex-like":147,"@stdlib/complex/float32/imag":217,"@stdlib/complex/float32/real":219}],60:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var realf = require( '@stdlib/complex/float32/real' );
var imagf = require( '@stdlib/complex/float32/imag' );
var format = require( '@stdlib/string/format' );


// MAIN //

/**
* Returns an array of iterated values.
*
* @private
* @param {Object} it - iterator
* @returns {(Array|TypeError)} array or an error
*/
function fromIterator( it ) {
	var out;
	var v;
	var z;

	out = [];
	while ( true ) {
		v = it.next();
		if ( v.done ) {
			break;
		}
		z = v.value;
		if ( isArrayLikeObject( z ) && z.length >= 2 ) {
			out.push( z[ 0 ], z[ 1 ] );
		} else if ( isComplexLike( z ) ) {
			out.push( realf( z ), imagf( z ) );
		} else {
			return new TypeError( format( 'invalid argument. An iterator must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', z ) );
		}
	}
	return out;
}


// EXPORTS //

module.exports = fromIterator;

},{"@stdlib/assert/is-array-like-object":131,"@stdlib/assert/is-complex-like":147,"@stdlib/complex/float32/imag":217,"@stdlib/complex/float32/real":219,"@stdlib/string/format":274}],61:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var realf = require( '@stdlib/complex/float32/real' );
var imagf = require( '@stdlib/complex/float32/imag' );
var format = require( '@stdlib/string/format' );


// MAIN //

/**
* Returns an array of iterated values.
*
* @private
* @param {Object} it - iterator
* @param {Function} clbk - callback to invoke for each iterated value
* @param {*} thisArg - invocation context
* @returns {(Array|TypeError)} array or an error
*/
function fromIteratorMap( it, clbk, thisArg ) {
	var out;
	var v;
	var z;
	var i;

	out = [];
	i = -1;
	while ( true ) {
		v = it.next();
		if ( v.done ) {
			break;
		}
		i += 1;
		z = clbk.call( thisArg, v.value, i );
		if ( isArrayLikeObject( z ) && z.length >= 2 ) {
			out.push( z[ 0 ], z[ 1 ] );
		} else if ( isComplexLike( z ) ) {
			out.push( realf( z ), imagf( z ) );
		} else {
			return new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', z ) );
		}
	}
	return out;
}


// EXPORTS //

module.exports = fromIteratorMap;

},{"@stdlib/assert/is-array-like-object":131,"@stdlib/assert/is-complex-like":147,"@stdlib/complex/float32/imag":217,"@stdlib/complex/float32/real":219,"@stdlib/string/format":274}],62:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* 64-bit complex number array.
*
* @module @stdlib/array/complex64
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var arr = new Complex64Array();
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 0
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var arr = new Complex64Array( 2 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var arr = new Complex64Array( [ 1.0, -1.0 ] );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new Complex64Array( buf );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new Complex64Array( buf, 8 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new Complex64Array( buf, 8, 2 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":63}],63:[function(require,module,exports){
/* eslint-disable no-restricted-syntax, max-lines, no-invalid-this */

/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNonNegativeInteger = require( '@stdlib/assert/is-nonnegative-integer' ).isPrimitive;
var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
var isCollection = require( '@stdlib/assert/is-collection' );
var isArrayBuffer = require( '@stdlib/assert/is-arraybuffer' );
var isObject = require( '@stdlib/assert/is-object' );
var isArray = require( '@stdlib/assert/is-array' );
var isStringArray = require( '@stdlib/assert/is-string-array' ).primitives;
var isString = require( '@stdlib/assert/is-string' ).isPrimitive;
var isFunction = require( '@stdlib/assert/is-function' );
var isComplexLike = require( '@stdlib/assert/is-complex-like' );
var isEven = require( '@stdlib/math/base/assert/is-even' );
var isInteger = require( '@stdlib/math/base/assert/is-integer' );
var isComplex64Array = require( './../../base/assert/is-complex64array' );
var isComplex128Array = require( './../../base/assert/is-complex128array' );
var hasIteratorSymbolSupport = require( '@stdlib/assert/has-iterator-symbol-support' );
var ITERATOR_SYMBOL = require( '@stdlib/symbol/iterator' );
var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var setReadOnlyAccessor = require( '@stdlib/utils/define-nonenumerable-read-only-accessor' );
var Float32Array = require( './../../float32' );
var Complex64 = require( '@stdlib/complex/float32/ctor' );
var format = require( '@stdlib/string/format' );
var realf = require( '@stdlib/complex/float32/real' );
var imagf = require( '@stdlib/complex/float32/imag' );
var floor = require( '@stdlib/math/base/special/floor' );
var reinterpret64 = require( '@stdlib/strided/base/reinterpret-complex64' );
var reinterpret128 = require( '@stdlib/strided/base/reinterpret-complex128' );
var getter = require( './../../base/getter' );
var accessorGetter = require( './../../base/accessor-getter' );
var fromIterator = require( './from_iterator.js' );
var fromIteratorMap = require( './from_iterator_map.js' );
var fromArray = require( './from_array.js' );


// VARIABLES //

var BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT * 2;
var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();


// FUNCTIONS //

/**
* Returns a boolean indicating if a value is a complex typed array.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a complex typed array
*/
function isComplexArray( value ) {
	return (
		value instanceof Complex64Array ||
		(
			typeof value === 'object' &&
			value !== null &&
			(
				value.constructor.name === 'Complex64Array' ||
				value.constructor.name === 'Complex128Array'
			) &&
			typeof value._length === 'number' && // eslint-disable-line no-underscore-dangle

			// NOTE: we don't perform a more rigorous test here for a typed array for performance reasons, as robustly checking for a typed array instance could require walking the prototype tree and performing relatively expensive constructor checks...
			typeof value._buffer === 'object' // eslint-disable-line no-underscore-dangle
		)
	);
}

/**
* Returns a boolean indicating if a value is a complex typed array constructor.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a complex typed array constructor
*/
function isComplexArrayConstructor( value ) {
	return (
		value === Complex64Array ||

		// NOTE: weaker test in order to avoid a circular dependency with Complex128Array...
		value.name === 'Complex128Array'
	);
}

/**
* Retrieves a complex number from a complex number array buffer.
*
* @private
* @param {Float32Array} buf - array buffer
* @param {NonNegativeInteger} idx - element index
* @returns {Complex64} complex number
*/
function getComplex64( buf, idx ) {
	idx *= 2;
	return new Complex64( buf[ idx ], buf[ idx+1 ] );
}


// MAIN //

/**
* 64-bit complex number array constructor.
*
* @constructor
* @param {(NonNegativeInteger|Collection|ArrayBuffer|Iterable)} [arg] - length, typed array, array-like object, buffer, or an iterable
* @param {NonNegativeInteger} [byteOffset=0] - byte offset
* @param {NonNegativeInteger} [length] - view length
* @throws {RangeError} ArrayBuffer byte length must be a multiple of `8`
* @throws {RangeError} array-like object and typed array input arguments must have a length which is a multiple of two
* @throws {TypeError} if provided only a single argument, must provide a valid argument
* @throws {TypeError} byte offset must be a nonnegative integer
* @throws {RangeError} byte offset must be a multiple of `8`
* @throws {TypeError} view length must be a positive multiple of `8`
* @throws {RangeError} must provide sufficient memory to accommodate byte offset and view length requirements
* @throws {TypeError} an iterator must return either a two element array containing real and imaginary components or a complex number
* @returns {Complex64Array} complex number array
*
* @example
* var arr = new Complex64Array();
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 0
*
* @example
* var arr = new Complex64Array( 2 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var arr = new Complex64Array( [ 1.0, -1.0 ] );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new Complex64Array( buf );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 16 );
* var arr = new Complex64Array( buf, 8 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var buf = new ArrayBuffer( 32 );
* var arr = new Complex64Array( buf, 8, 2 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*/
function Complex64Array() {
	var byteOffset;
	var nargs;
	var buf;
	var len;

	nargs = arguments.length;
	if ( !(this instanceof Complex64Array) ) {
		if ( nargs === 0 ) {
			return new Complex64Array();
		}
		if ( nargs === 1 ) {
			return new Complex64Array( arguments[0] );
		}
		if ( nargs === 2 ) {
			return new Complex64Array( arguments[0], arguments[1] );
		}
		return new Complex64Array( arguments[0], arguments[1], arguments[2] );
	}
	// Create the underlying data buffer...
	if ( nargs === 0 ) {
		buf = new Float32Array( 0 ); // backward-compatibility
	} else if ( nargs === 1 ) {
		if ( isNonNegativeInteger( arguments[0] ) ) {
			buf = new Float32Array( arguments[0]*2 );
		} else if ( isCollection( arguments[0] ) ) {
			buf = arguments[ 0 ];
			len = buf.length;

			// If provided a "generic" array, peak at the first value, and, if the value is a complex number, try to process as an array of complex numbers, falling back to "normal" typed array initialization if we fail and ensuring consistency if the first value had not been a complex number...
			if ( len && isArray( buf ) && isComplexLike( buf[0] ) ) {
				buf = fromArray( new Float32Array( len*2 ), buf );
				if ( buf === null ) {
					// We failed and we are now forced to allocate a new array :-(
					if ( !isEven( len ) ) {
						throw new RangeError( format( 'invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.', len ) );
					}
					// We failed, so fall back to directly setting values...
					buf = new Float32Array( arguments[0] );
				}
			} else {
				if ( isComplex64Array( buf ) ) {
					buf = reinterpret64( buf, 0 );
				} else if ( isComplex128Array( buf ) ) {
					buf = reinterpret128( buf, 0 );
				} else if ( !isEven( len ) ) {
					throw new RangeError( format( 'invalid argument. Array-like object and typed array arguments must have a length which is a multiple of two. Length: `%u`.', len ) );
				}
				buf = new Float32Array( buf );
			}
		} else if ( isArrayBuffer( arguments[0] ) ) {
			buf = arguments[ 0 ];
			if ( !isInteger( buf.byteLength/BYTES_PER_ELEMENT ) ) {
				throw new RangeError( format( 'invalid argument. ArrayBuffer byte length must be a multiple of %u. Byte length: `%u`.', BYTES_PER_ELEMENT, buf.byteLength ) );
			}
			buf = new Float32Array( buf );
		} else if ( isObject( arguments[0] ) ) {
			buf = arguments[ 0 ];
			if ( HAS_ITERATOR_SYMBOL === false ) {
				throw new TypeError( format( 'invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.', buf ) );
			}
			if ( !isFunction( buf[ ITERATOR_SYMBOL ] ) ) {
				throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', buf ) );
			}
			buf = buf[ ITERATOR_SYMBOL ]();
			if ( !isFunction( buf.next ) ) {
				throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', buf ) ); // FIXME: `buf` is what is returned from above, NOT the original value
			}
			buf = fromIterator( buf );
			if ( buf instanceof Error ) {
				throw buf;
			}
			buf = new Float32Array( buf );
		} else {
			throw new TypeError( format( 'invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.', arguments[0] ) );
		}
	} else {
		buf = arguments[ 0 ];
		if ( !isArrayBuffer( buf ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an ArrayBuffer. Value: `%s`.', buf ) );
		}
		byteOffset = arguments[ 1 ];
		if ( !isNonNegativeInteger( byteOffset ) ) {
			throw new TypeError( format( 'invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.', byteOffset ) );
		}
		if ( !isInteger( byteOffset/BYTES_PER_ELEMENT ) ) {
			throw new RangeError( format( 'invalid argument. Byte offset must be a multiple of %u. Value: `%u`.', BYTES_PER_ELEMENT, byteOffset ) );
		}
		if ( nargs === 2 ) {
			len = buf.byteLength - byteOffset;
			if ( !isInteger( len/BYTES_PER_ELEMENT ) ) {
				throw new RangeError( format( 'invalid arguments. ArrayBuffer view byte length must be a multiple of %u. View byte length: `%u`.', BYTES_PER_ELEMENT, len ) );
			}
			buf = new Float32Array( buf, byteOffset );
		} else {
			len = arguments[ 2 ];
			if ( !isNonNegativeInteger( len ) ) {
				throw new TypeError( format( 'invalid argument. Length must be a nonnegative integer. Value: `%s`.', len ) );
			}
			if ( (len*BYTES_PER_ELEMENT) > (buf.byteLength-byteOffset) ) {
				throw new RangeError( format( 'invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.', len*BYTES_PER_ELEMENT ) );
			}
			buf = new Float32Array( buf, byteOffset, len*2 );
		}
	}
	setReadOnly( this, '_buffer', buf );
	setReadOnly( this, '_length', buf.length/2 );

	return this;
}

/**
* Size (in bytes) of each array element.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex64Array
* @readonly
* @type {PositiveInteger}
* @default 8
*
* @example
* var nbytes = Complex64Array.BYTES_PER_ELEMENT;
* // returns 8
*/
setReadOnly( Complex64Array, 'BYTES_PER_ELEMENT', BYTES_PER_ELEMENT );

/**
* Constructor name.
*
* @name name
* @memberof Complex64Array
* @readonly
* @type {string}
* @default 'Complex64Array'
*
* @example
* var str = Complex64Array.name;
* // returns 'Complex64Array'
*/
setReadOnly( Complex64Array, 'name', 'Complex64Array' );

/**
* Creates a new 64-bit complex number array from an array-like object or an iterable.
*
* @name from
* @memberof Complex64Array
* @type {Function}
* @param {(Collection|Iterable)} src - array-like object or iterable
* @param {Function} [clbk] - callback to invoke for each source element
* @param {*} [thisArg] - context
* @throws {TypeError} `this` context must be a constructor
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an array-like object or an iterable
* @throws {TypeError} second argument must be a function
* @throws {RangeError} array-like objects must have a length which is a multiple of two
* @throws {TypeError} an iterator must return either a two element array containing real and imaginary components or a complex number
* @throws {TypeError} when provided an iterator, a callback must return either a two element array containing real and imaginary components or a complex number
* @returns {Complex64Array} 64-bit complex number array
*
* @example
* var arr = Complex64Array.from( [ 1.0, -1.0 ] );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var arr = Complex64Array.from( [ new Complex64( 1.0, 1.0 ) ] );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function clbk( v ) {
*     return new Complex64( realf(v)*2.0, imagf(v)*2.0 );
* }
*
* var arr = Complex64Array.from( [ new Complex64( 1.0, 1.0 ) ], clbk );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 1
*/
setReadOnly( Complex64Array, 'from', function from( src ) {
	var thisArg;
	var nargs;
	var clbk;
	var out;
	var buf;
	var tmp;
	var get;
	var len;
	var flg;
	var v;
	var i;
	var j;
	if ( !isFunction( this ) ) {
		throw new TypeError( 'invalid invocation. `this` context must be a constructor.' );
	}
	if ( !isComplexArrayConstructor( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	nargs = arguments.length;
	if ( nargs > 1 ) {
		clbk = arguments[ 1 ];
		if ( !isFunction( clbk ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be a function. Value: `%s`.', clbk ) );
		}
		if ( nargs > 2 ) {
			thisArg = arguments[ 2 ];
		}
	}
	if ( isComplexArray( src ) ) {
		len = src.length;
		if ( clbk ) {
			out = new this( len );
			buf = out._buffer; // eslint-disable-line no-underscore-dangle
			j = 0;
			for ( i = 0; i < len; i++ ) {
				v = clbk.call( thisArg, src.get( i ), i );
				if ( isComplexLike( v ) ) {
					buf[ j ] = realf( v );
					buf[ j+1 ] = imagf( v );
				} else if ( isArrayLikeObject( v ) && v.length >= 2 ) {
					buf[ j ] = v[ 0 ];
					buf[ j+1 ] = v[ 1 ];
				} else {
					throw new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', v ) );
				}
				j += 2; // stride
			}
			return out;
		}
		return new this( src );
	}
	if ( isCollection( src ) ) {
		if ( clbk ) {
			// Note: array contents affect how we iterate over a provided data source. If only complex number objects, we can extract real and imaginary components. Otherwise, for non-complex number arrays (e.g., `Float64Array`, etc), we assume a strided array where real and imaginary components are interleaved. In the former case, we expect a callback to return real and imaginary components (possibly as a complex number). In the latter case, we expect a callback to return *either* a real or imaginary component.

			len = src.length;
			if ( src.get && src.set ) {
				get = accessorGetter( 'default' );
			} else {
				get = getter( 'default' );
			}
			// Detect whether we've been provided an array which returns complex number objects...
			for ( i = 0; i < len; i++ ) {
				if ( !isComplexLike( get( src, i ) ) ) {
					flg = true;
					break;
				}
			}
			// If an array does not contain only complex number objects, then we assume interleaved real and imaginary components...
			if ( flg ) {
				if ( !isEven( len ) ) {
					throw new RangeError( format( 'invalid argument. First argument must have a length which is a multiple of %u. Length: `%u`.', 2, len ) );
				}
				out = new this( len/2 );
				buf = out._buffer; // eslint-disable-line no-underscore-dangle
				for ( i = 0; i < len; i++ ) {
					buf[ i ] = clbk.call( thisArg, get( src, i ), i );
				}
				return out;
			}
			// If an array contains only complex number objects, then we need to extract real and imaginary components...
			out = new this( len );
			buf = out._buffer; // eslint-disable-line no-underscore-dangle
			j = 0;
			for ( i = 0; i < len; i++ ) {
				v = clbk.call( thisArg, get( src, i ), i );
				if ( isComplexLike( v ) ) {
					buf[ j ] = realf( v );
					buf[ j+1 ] = imagf( v );
				} else if ( isArrayLikeObject( v ) && v.length >= 2 ) {
					buf[ j ] = v[ 0 ];
					buf[ j+1 ] = v[ 1 ];
				} else {
					throw new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', v ) );
				}
				j += 2; // stride
			}
			return out;
		}
		return new this( src );
	}
	if ( isObject( src ) && HAS_ITERATOR_SYMBOL && isFunction( src[ ITERATOR_SYMBOL ] ) ) { // eslint-disable-line max-len
		buf = src[ ITERATOR_SYMBOL ]();
		if ( !isFunction( buf.next ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.', src ) );
		}
		if ( clbk ) {
			tmp = fromIteratorMap( buf, clbk, thisArg );
		} else {
			tmp = fromIterator( buf );
		}
		if ( tmp instanceof Error ) {
			throw tmp;
		}
		len = tmp.length / 2;
		out = new this( len );
		buf = out._buffer; // eslint-disable-line no-underscore-dangle
		for ( i = 0; i < len; i++ ) {
			buf[ i ] = tmp[ i ];
		}
		return out;
	}
	throw new TypeError( format( 'invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.', src ) );
});

/**
* Creates a new 64-bit complex number array from a variable number of arguments.
*
* @name of
* @memberof Complex64Array
* @type {Function}
* @param {...*} element - array elements
* @throws {TypeError} `this` context must be a constructor
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex64Array} 64-bit complex number array
*
* @example
* var arr = Complex64Array.of( 1.0, 1.0, 1.0, 1.0 );
* // returns <Complex64Array>
*
* var len = arr.length;
* // returns 2
*/
setReadOnly( Complex64Array, 'of', function of() {
	var args;
	var i;
	if ( !isFunction( this ) ) {
		throw new TypeError( 'invalid invocation. `this` context must be a constructor.' );
	}
	if ( !isComplexArrayConstructor( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	args = [];
	for ( i = 0; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}
	return new this( args );
});

/**
* Returns an array element with support for both nonnegative and negative integer indices.
*
* @name at
* @memberof Complex64Array.prototype
* @type {Function}
* @param {integer} idx - element index
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} must provide an integer
* @returns {(Complex64|void)} array element
*
* @example
* var arr = new Complex64Array( 10 );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var z = arr.at( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 0.0
*
* var im = imagf( z );
* // returns 0.0
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 9.0, -9.0 ], 9 );
*
* z = arr.at( 0 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 1.0
*
* im = imagf( z );
* // returns -1.0
*
* z = arr.at( -1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 9.0
*
* im = imagf( z );
* // returns -9.0
*
* z = arr.at( 100 );
* // returns undefined
*
* z = arr.at( -100 );
* // returns undefined
*/
setReadOnly( Complex64Array.prototype, 'at', function at( idx ) {
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isInteger( idx ) ) {
		throw new TypeError( format( 'invalid argument. Must provide an integer. Value: `%s`.', idx ) );
	}
	if ( idx < 0 ) {
		idx += this._length;
	}
	if ( idx < 0 || idx >= this._length ) {
		return;
	}
	return getComplex64( this._buffer, idx );
});

/**
* Pointer to the underlying data buffer.
*
* @name buffer
* @memberof Complex64Array.prototype
* @readonly
* @type {ArrayBuffer}
*
* @example
* var arr = new Complex64Array( 10 );
*
* var buf = arr.buffer;
* // returns <ArrayBuffer>
*/
setReadOnlyAccessor( Complex64Array.prototype, 'buffer', function get() {
	return this._buffer.buffer;
});

/**
* Size (in bytes) of the array.
*
* @name byteLength
* @memberof Complex64Array.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new Complex64Array( 10 );
*
* var byteLength = arr.byteLength;
* // returns 80
*/
setReadOnlyAccessor( Complex64Array.prototype, 'byteLength', function get() {
	return this._buffer.byteLength;
});

/**
* Offset (in bytes) of the array from the start of its underlying `ArrayBuffer`.
*
* @name byteOffset
* @memberof Complex64Array.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new Complex64Array( 10 );
*
* var byteOffset = arr.byteOffset;
* // returns 0
*/
setReadOnlyAccessor( Complex64Array.prototype, 'byteOffset', function get() {
	return this._buffer.byteOffset;
});

/**
* Size (in bytes) of each array element.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex64Array.prototype
* @readonly
* @type {PositiveInteger}
* @default 8
*
* @example
* var arr = new Complex64Array( 10 );
*
* var nbytes = arr.BYTES_PER_ELEMENT;
* // returns 8
*/
setReadOnly( Complex64Array.prototype, 'BYTES_PER_ELEMENT', Complex64Array.BYTES_PER_ELEMENT );

/**
* Copies a sequence of elements within the array to the position starting at `target`.
*
* @name copyWithin
* @memberof Complex64Array.prototype
* @type {Function}
* @param {integer} target - index at which to start copying elements
* @param {integer} start - source index at which to copy elements from
* @param {integer} [end] - source index at which to stop copying elements from
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex64Array} modified array
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 4 );
*
* // Set the array elements:
* arr.set( new Complex64( 1.0, 1.0 ), 0 );
* arr.set( new Complex64( 2.0, 2.0 ), 1 );
* arr.set( new Complex64( 3.0, 3.0 ), 2 );
* arr.set( new Complex64( 4.0, 4.0 ), 3 );
*
* // Copy the first two elements to the last two elements:
* arr.copyWithin( 2, 0, 2 );
*
* // Get the last array element:
* var z = arr.get( 3 );
*
* var re = realf( z );
* // returns 2.0
*
* var im = imagf( z );
* // returns 2.0
*/
setReadOnly( Complex64Array.prototype, 'copyWithin', function copyWithin( target, start ) {
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	// FIXME: prefer a functional `copyWithin` implementation which addresses lack of universal browser support (e.g., IE11 and Safari) or ensure that typed arrays are polyfilled
	if ( arguments.length === 2 ) {
		this._buffer.copyWithin( target*2, start*2 );
	} else {
		this._buffer.copyWithin( target*2, start*2, arguments[2]*2 );
	}
	return this;
});

/**
* Returns an iterator for iterating over array key-value pairs.
*
* @name entries
* @memberof Complex64Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Iterator} iterator
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var arr = [
*     new Complex64( 1.0, 1.0 ),
*     new Complex64( 2.0, 2.0 ),
*     new Complex64( 3.0, 3.0 )
* ];
* arr = new Complex64Array( arr );
*
* // Create an iterator:
* var it = arr.entries();
*
* // Iterate over the key-value pairs...
* var v = it.next().value;
* // returns [ 0, <Complex64> ]
*
* v = it.next().value;
* // returns [ 1, <Complex64> ]
*
* v = it.next().value;
* // returns [ 2, <Complex64> ]
*
* var bool = it.next().done;
* // returns true
*/
setReadOnly( Complex64Array.prototype, 'entries', function entries() {
	var self;
	var iter;
	var len;
	var buf;
	var FLG;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	self = this;
	buf = this._buffer;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': [ i, getComplex64( buf, i ) ],
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.entries();
	}
});

/**
* Tests whether all elements in an array pass a test implemented by a predicate function.
*
* @name every
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {boolean} boolean indicating whether all elements pass a test
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var bool = arr.every( predicate );
* // returns true
*/
setReadOnly( Complex64Array.prototype, 'every', function every( predicate, thisArg ) {
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( !predicate.call( thisArg, getComplex64( buf, i ), i, this ) ) {
			return false;
		}
	}
	return true;
});

/**
* Returns a modified typed array filled with a fill value.
*
* @name fill
* @memberof Complex64Array.prototype
* @type {Function}
* @param {ComplexLike} value - fill value
* @param {integer} [start=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @throws {TypeError} third argument must be an integer
* @returns {Complex64Array} modified array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 3 );
*
* arr.fill( new Complex64( 1.0, 1.0 ), 1 );
*
* var z = arr.get( 1 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 1.0
*
* var im = imagf( z );
* // returns 1.0
*
* z = arr.get( 2 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 1.0
*
* im = imagf( z );
* // returns 1.0
*/
setReadOnly( Complex64Array.prototype, 'fill', function fill( value, start, end ) {
	var buf;
	var len;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( value ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', value ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		if ( !isInteger( start ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', start ) );
		}
		if ( start < 0 ) {
			start += len;
			if ( start < 0 ) {
				start = 0;
			}
		}
		if ( arguments.length > 2 ) {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Third argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			}
			if ( end > len ) {
				end = len;
			}
		} else {
			end = len;
		}
	} else {
		start = 0;
		end = len;
	}
	re = realf( value );
	im = imagf( value );
	for ( i = start; i < end; i++ ) {
		idx = 2*i;
		buf[ idx ] = re;
		buf[ idx+1 ] = im;
	}
	return this;
});

/**
* Returns a new array containing the elements of an array which pass a test implemented by a predicate function.
*
* @name filter
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex64Array} complex number array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var out = arr.filter( predicate );
* // returns <Complex64Array>
*
* var len = out.length;
* // returns 1
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 2.0
*
* var im = imagf( z );
* // returns 2.0
*/
setReadOnly( Complex64Array.prototype, 'filter', function filter( predicate, thisArg ) {
	var buf;
	var out;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex64( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			out.push( z );
		}
	}
	return new this.constructor( out );
});

/**
* Returns the first element in an array for which a predicate function returns a truthy value.
*
* @name find
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {(Complex64|void)} array element or undefined
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.find( predicate );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 1.0
*
* var im = imagf( z );
* // returns 1.0
*/
setReadOnly( Complex64Array.prototype, 'find', function find( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex64( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return z;
		}
	}
});

/**
* Returns the index of the first element in an array for which a predicate function returns a truthy value.
*
* @name findIndex
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {integer} index or -1
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var idx = arr.findIndex( predicate );
* // returns 2
*/
setReadOnly( Complex64Array.prototype, 'findIndex', function findIndex( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex64( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns the last element in an array for which a predicate function returns a truthy value.
*
* @name findLast
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {(Complex64|void)} array element or undefined
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.findLast( predicate );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 3.0
*
* var im = imagf( z );
* // returns 3.0
*/
setReadOnly( Complex64Array.prototype, 'findLast', function findLast( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = this._length-1; i >= 0; i-- ) {
		z = getComplex64( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return z;
		}
	}
});

/**
* Returns the index of the last element in an array for which a predicate function returns a truthy value.
*
* @name findLastIndex
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {integer} index or -1
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var idx = arr.findLastIndex( predicate );
* // returns 1
*/
setReadOnly( Complex64Array.prototype, 'findLastIndex', function findLastIndex( predicate, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = this._length-1; i >= 0; i-- ) {
		z = getComplex64( buf, i );
		if ( predicate.call( thisArg, z, i, this ) ) {
			return i;
		}
	}
	return -1;
});

/**
* Invokes a function once for each array element.
*
* @name forEach
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} fcn - function to invoke
* @param {*} [thisArg] - function invocation context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* function log( v, i ) {
*     console.log( '%s: %s', i, v.toString() );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* arr.forEach( log );
*/
setReadOnly( Complex64Array.prototype, 'forEach', function forEach( fcn, thisArg ) {
	var buf;
	var i;
	var z;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( fcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', fcn ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		z = getComplex64( buf, i );
		fcn.call( thisArg, z, i, this );
	}
});

/**
* Returns an array element.
*
* @name get
* @memberof Complex64Array.prototype
* @type {Function}
* @param {NonNegativeInteger} idx - element index
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} must provide a nonnegative integer
* @returns {(Complex64|void)} array element
*
* @example
* var arr = new Complex64Array( 10 );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var z = arr.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 0.0
*
* var im = imagf( z );
* // returns 0.0
*
* arr.set( [ 1.0, -1.0 ], 0 );
*
* z = arr.get( 0 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 1.0
*
* im = imagf( z );
* // returns -1.0
*
* z = arr.get( 100 );
* // returns undefined
*/
setReadOnly( Complex64Array.prototype, 'get', function get( idx ) {
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isNonNegativeInteger( idx ) ) {
		throw new TypeError( format( 'invalid argument. Must provide a nonnegative integer. Value: `%s`.', idx ) );
	}
	if ( idx >= this._length ) {
		return;
	}
	return getComplex64( this._buffer, idx );
});

/**
* Returns a boolean indicating whether an array includes a provided value.
*
* @name includes
* @memberof Complex64Array.prototype
* @type {Function}
* @param {ComplexLike} searchElement - search element
* @param {integer} [fromIndex=0] - starting index (inclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @returns {boolean} boolean indicating whether an array includes a provided value
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var arr = new Complex64Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var bool = arr.includes( new Complex64( 3.0, -3.0 ) );
* // returns true
*
* bool = arr.includes( new Complex64( 3.0, -3.0 ), 3 );
* // returns false
*
* bool = arr.includes( new Complex64( 4.0, -4.0 ), -3 );
* // returns true
*/
setReadOnly( Complex64Array.prototype, 'includes', function includes( searchElement, fromIndex ) {
	var buf;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex < 0 ) {
			fromIndex += this._length;
			if ( fromIndex < 0 ) {
				fromIndex = 0;
			}
		}
	} else {
		fromIndex = 0;
	}
	re = realf( searchElement );
	im = imagf( searchElement );
	buf = this._buffer;
	for ( i = fromIndex; i < this._length; i++ ) {
		idx = 2 * i;
		if ( re === buf[ idx ] && im === buf[ idx+1 ] ) {
			return true;
		}
	}
	return false;
});

/**
* Returns the first index at which a given element can be found.
*
* @name indexOf
* @memberof Complex64Array.prototype
* @type {Function}
* @param {ComplexLike} searchElement - element to find
* @param {integer} [fromIndex=0] - starting index (inclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @returns {integer} index or -1
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var arr = new Complex64Array( 10 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var idx = arr.indexOf( new Complex64( 3.0, -3.0 ) );
* // returns 2
*
* idx = arr.indexOf( new Complex64( 3.0, -3.0 ), 3 );
* // returns -1
*
* idx = arr.indexOf( new Complex64( 4.0, -4.0 ), -3 );
* // returns -1
*/
setReadOnly( Complex64Array.prototype, 'indexOf', function indexOf( searchElement, fromIndex ) {
	var buf;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex < 0 ) {
			fromIndex += this._length;
			if ( fromIndex < 0 ) {
				fromIndex = 0;
			}
		}
	} else {
		fromIndex = 0;
	}
	re = realf( searchElement );
	im = imagf( searchElement );
	buf = this._buffer;
	for ( i = fromIndex; i < this._length; i++ ) {
		idx = 2 * i;
		if ( re === buf[ idx ] && im === buf[ idx+1 ] ) {
			return i;
		}
	}
	return -1;
});

/**
* Returns a new string by concatenating all array elements.
*
* @name join
* @memberof Complex64Array.prototype
* @type {Function}
* @param {string} [separator=','] - element separator
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a string
* @returns {string} string representation
*
* @example
* var arr = new Complex64Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var str = arr.join();
* // returns '1 + 1i,2 + 2i'
*
* str = arr.join( '/' );
* // returns '1 + 1i/2 + 2i'
*/
setReadOnly( Complex64Array.prototype, 'join', function join( separator ) {
	var out;
	var buf;
	var sep;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( arguments.length === 0 ) {
		sep = ',';
	} else if ( isString( separator ) ) {
		sep = separator;
	} else {
		throw new TypeError( format( 'invalid argument. First argument must be a string. Value: `%s`.', separator ) );
	}
	out = [];
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		out.push( getComplex64( buf, i ).toString() );
	}
	return out.join( sep );
});

/**
* Returns an iterator for iterating over each index key in a typed array.
*
* @name keys
* @memberof Complex64Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Iterator} iterator
*
* @example
* var arr = new Complex64Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var iter = arr.keys();
*
* var v = iter.next().value;
* // returns 0
*
* v = iter.next().value;
* // returns 1
*
* var bool = iter.next().done;
* // returns true
*/
setReadOnly( Complex64Array.prototype, 'keys', function keys() {
	var self;
	var iter;
	var len;
	var FLG;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	self = this;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': i,
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.keys();
	}
});

/**
* Returns the last index at which a given element can be found.
*
* @name lastIndexOf
* @memberof Complex64Array.prototype
* @type {Function}
* @param {ComplexLike} searchElement - element to find
* @param {integer} [fromIndex] - index at which to start searching backward (inclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a complex number
* @throws {TypeError} second argument must be an integer
* @returns {integer} index or -1
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var arr = new Complex64Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 3.0, -3.0 ], 4 );
*
* var idx = arr.lastIndexOf( new Complex64( 3.0, -3.0 ) );
* // returns 4
*
* idx = arr.lastIndexOf( new Complex64( 3.0, -3.0 ), 3 );
* // returns 2
*
* idx = arr.lastIndexOf( new Complex64( 5.0, -5.0 ), 3 );
* // returns -1
*
* idx = arr.lastIndexOf( new Complex64( 2.0, -2.0 ), -3 );
* // returns 1
*/
setReadOnly( Complex64Array.prototype, 'lastIndexOf', function lastIndexOf( searchElement, fromIndex ) {
	var buf;
	var idx;
	var re;
	var im;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isComplexLike( searchElement ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a complex number. Value: `%s`.', searchElement ) );
	}
	if ( arguments.length > 1 ) {
		if ( !isInteger( fromIndex ) ) {
			throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', fromIndex ) );
		}
		if ( fromIndex >= this._length ) {
			fromIndex = this._length - 1;
		} else if ( fromIndex < 0 ) {
			fromIndex += this._length;
		}
	} else {
		fromIndex = this._length - 1;
	}
	re = realf( searchElement );
	im = imagf( searchElement );
	buf = this._buffer;
	for ( i = fromIndex; i >= 0; i-- ) {
		idx = 2 * i;
		if ( re === buf[ idx ] && im === buf[ idx+1 ] ) {
			return i;
		}
	}
	return -1;
});

/**
* Number of array elements.
*
* @name length
* @memberof Complex64Array.prototype
* @readonly
* @type {NonNegativeInteger}
*
* @example
* var arr = new Complex64Array( 10 );
*
* var len = arr.length;
* // returns 10
*/
setReadOnlyAccessor( Complex64Array.prototype, 'length', function get() {
	return this._length;
});

/**
* Returns a new array with each element being the result of a provided callback function.
*
* @name map
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} fcn - callback function
* @param {*} [thisArg] - callback function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex64Array} complex number array
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function scale( v, i ) {
*     return new Complex64( 2.0*realf( v ), 2.0*imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var out = arr.map( scale );
* // returns <Complex64Array>
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 2
*
* var im = imagf( z );
* // returns -2
*/
setReadOnly( Complex64Array.prototype, 'map', function map( fcn, thisArg ) {
	var outbuf;
	var buf;
	var out;
	var i;
	var v;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( fcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', fcn ) );
	}
	buf = this._buffer;
	out = new this.constructor( this._length );
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < this._length; i++ ) {
		v = fcn.call( thisArg, getComplex64( buf, i ), i, this );
		if ( isComplexLike( v ) ) {
			outbuf[ 2*i ] = realf( v );
			outbuf[ (2*i)+1 ] = imagf( v );
		} else if ( isArrayLikeObject( v ) && v.length === 2 ) {
			outbuf[ 2*i ] = v[ 0 ];
			outbuf[ (2*i)+1 ] = v[ 1 ];
		} else {
			throw new TypeError( format( 'invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.', v ) );
		}
	}
	return out;
});

/**
* Applies a provided callback function to each element of the array, in order, passing in the return value from the calculation on the preceding element and returning the accumulated result upon completion.
*
* @name reduce
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} reducer - callback function
* @param {*} [initialValue] - initial value
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @throws {Error} if not provided an initial value, the array must have at least one element
* @returns {*} accumulated result
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var caddf = require( '@stdlib/complex/float32/base/add' );
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.reduce( caddf );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 6.0
*
* var im = imagf( z );
* // returns 6.0
*/
setReadOnly( Complex64Array.prototype, 'reduce', function reduce( reducer, initialValue ) {
	var buf;
	var acc;
	var len;
	var v;
	var i;

	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( reducer ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', reducer ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		acc = initialValue;
		i = 0;
	} else {
		if ( len === 0 ) {
			throw new Error( 'invalid operation. If not provided an initial value, an array must contain at least one element.' );
		}
		acc = getComplex64( buf, 0 );
		i = 1;
	}
	for ( ; i < len; i++ ) {
		v = getComplex64( buf, i );
		acc = reducer( acc, v, i, this );
	}
	return acc;
});

/**
* Applies a provided callback function to each element of the array, in reverse order, passing in the return value from the calculation on the preceding element and returning the accumulated result upon completion.
*
* @name reduceRight
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} reducer - callback function
* @param {*} [initialValue] - initial value
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @throws {Error} if not provided an initial value, the array must have at least one element
* @returns {*} accumulated result
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var caddf = require( '@stdlib/complex/float32/base/add' );
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var z = arr.reduceRight( caddf );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 6.0
*
* var im = imagf( z );
* // returns 6.0
*/
setReadOnly( Complex64Array.prototype, 'reduceRight', function reduceRight( reducer, initialValue ) {
	var buf;
	var acc;
	var len;
	var v;
	var i;

	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( reducer ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', reducer ) );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length > 1 ) {
		acc = initialValue;
		i = len-1;
	} else {
		if ( len === 0 ) {
			throw new Error( 'invalid operation. If not provided an initial value, an array must contain at least one element.' );
		}
		acc = getComplex64( buf, len-1 );
		i = len-2;
	}
	for ( ; i >= 0; i-- ) {
		v = getComplex64( buf, i );
		acc = reducer( acc, v, i, this );
	}
	return acc;
});

/**
* Reverses an array in-place.
*
* @name reverse
* @memberof Complex64Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex64Array} reversed array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var out = arr.reverse();
* // returns <Complex64Array>
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 3.0
*
* var im = imagf( z );
* // returns 3.0
*
* z = out.get( 1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 2.0
*
* im = imagf( z );
* // returns 2.0
*
* z = out.get( 2 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 1.0
*
* im = imagf( z );
* // returns 1.0
*/
setReadOnly( Complex64Array.prototype, 'reverse', function reverse() {
	var buf;
	var tmp;
	var len;
	var N;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	len = this._length;
	buf = this._buffer;
	N = floor( len / 2 );
	for ( i = 0; i < N; i++ ) {
		j = len - i - 1;
		tmp = buf[ (2*i) ];
		buf[ (2*i) ] = buf[ (2*j) ];
		buf[ (2*j) ] = tmp;
		tmp = buf[ (2*i)+1 ];
		buf[ (2*i)+1 ] = buf[ (2*j)+1 ];
		buf[ (2*j)+1 ] = tmp;
	}
	return this;
});

/**
* Sets an array element.
*
* ## Notes
*
* -   When provided a typed array, real or complex, we must check whether the source array shares the same buffer as the target array and whether the underlying memory overlaps. In particular, we are concerned with the following scenario:
*
*     ```text
*     buf:                ---------------------
*     src: ---------------------
*     ```
*
*     In the above, as we copy values from `src`, we will overwrite values in the `src` view, resulting in duplicated values copied into the end of `buf`, which is not intended. Hence, to avoid overwriting source values, we must **copy** source values to a temporary array.
*
*     In the other overlapping scenario,
*
*     ```text
*     buf: ---------------------
*     src:                ---------------------
*     ```
*
*     by the time we begin copying into the overlapping region, we are copying from the end of `src`, a non-overlapping region, which means we don't run the risk of copying copied values, rather than the original `src` values, as intended.
*
* @name set
* @memberof Complex64Array.prototype
* @type {Function}
* @param {(Collection|Complex|ComplexArray)} value - value(s)
* @param {NonNegativeInteger} [i=0] - element index at which to start writing values
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be either a complex number, an array-like object, or a complex number array
* @throws {TypeError} index argument must be a nonnegative integer
* @throws {RangeError} array-like objects must have a length which is a multiple of two
* @throws {RangeError} index argument is out-of-bounds
* @throws {RangeError} target array lacks sufficient storage to accommodate source values
* @returns {void}
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 10 );
*
* var z = arr.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 0.0
*
* var im = imagf( z );
* // returns 0.0
*
* arr.set( [ 1.0, -1.0 ], 0 );
*
* z = arr.get( 0 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 1.0
*
* im = imagf( z );
* // returns -1.0
*/
setReadOnly( Complex64Array.prototype, 'set', function set( value ) {
	/* eslint-disable no-underscore-dangle */
	var sbuf;
	var idx;
	var buf;
	var tmp;
	var flg;
	var N;
	var v;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	buf = this._buffer;
	if ( arguments.length > 1 ) {
		idx = arguments[ 1 ];
		if ( !isNonNegativeInteger( idx ) ) {
			throw new TypeError( format( 'invalid argument. Index argument must be a nonnegative integer. Value: `%s`.', idx ) );
		}
	} else {
		idx = 0;
	}
	if ( isComplexLike( value ) ) {
		if ( idx >= this._length ) {
			throw new RangeError( format( 'invalid argument. Index argument is out-of-bounds. Value: `%u`.', idx ) );
		}
		idx *= 2;
		buf[ idx ] = realf( value );
		buf[ idx+1 ] = imagf( value );
		return;
	}
	if ( isComplexArray( value ) ) {
		N = value._length;
		if ( idx+N > this._length ) {
			throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
		}
		sbuf = value._buffer;

		// Check for overlapping memory...
		j = buf.byteOffset + (idx*BYTES_PER_ELEMENT);
		if (
			sbuf.buffer === buf.buffer &&
			(
				sbuf.byteOffset < j &&
				sbuf.byteOffset+sbuf.byteLength > j
			)
		) {
			// We need to copy source values...
			tmp = new Float32Array( sbuf.length );
			for ( i = 0; i < sbuf.length; i++ ) {
				tmp[ i ] = sbuf[ i ];
			}
			sbuf = tmp;
		}
		idx *= 2;
		j = 0;
		for ( i = 0; i < N; i++ ) {
			buf[ idx ] = sbuf[ j ];
			buf[ idx+1 ] = sbuf[ j+1 ];
			idx += 2; // stride
			j += 2; // stride
		}
		return;
	}
	if ( isCollection( value ) ) {
		// Detect whether we've been provided an array of complex numbers...
		N = value.length;
		for ( i = 0; i < N; i++ ) {
			if ( !isComplexLike( value[ i ] ) ) {
				flg = true;
				break;
			}
		}
		// If an array does not contain only complex numbers, then we assume interleaved real and imaginary components...
		if ( flg ) {
			if ( !isEven( N ) ) {
				throw new RangeError( format( 'invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.', N ) );
			}
			if ( idx+(N/2) > this._length ) {
				throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
			}
			sbuf = value;

			// Check for overlapping memory...
			j = buf.byteOffset + (idx*BYTES_PER_ELEMENT);
			if (
				sbuf.buffer === buf.buffer &&
				(
					sbuf.byteOffset < j &&
					sbuf.byteOffset+sbuf.byteLength > j
				)
			) {
				// We need to copy source values...
				tmp = new Float32Array( N );
				for ( i = 0; i < N; i++ ) {
					tmp[ i ] = sbuf[ i ]; // TODO: handle accessor arrays
				}
				sbuf = tmp;
			}
			idx *= 2;
			N /= 2;
			j = 0;
			for ( i = 0; i < N; i++ ) {
				buf[ idx ] = sbuf[ j ];
				buf[ idx+1 ] = sbuf[ j+1 ];
				idx += 2; // stride
				j += 2; // stride
			}
			return;
		}
		// If an array contains only complex numbers, then we need to extract real and imaginary components...
		if ( idx+N > this._length ) {
			throw new RangeError( 'invalid arguments. Target array lacks sufficient storage to accommodate source values.' );
		}
		idx *= 2;
		for ( i = 0; i < N; i++ ) {
			v = value[ i ];
			buf[ idx ] = realf( v );
			buf[ idx+1 ] = imagf( v );
			idx += 2; // stride
		}
		return;
	}
	throw new TypeError( format( 'invalid argument. First argument must be either a complex number, an array-like object, or a complex number array. Value: `%s`.', value ) );

	/* eslint-enable no-underscore-dangle */
});

/**
* Copies a portion of a typed array to a new typed array.
*
* @name slice
* @memberof Complex64Array.prototype
* @type {Function}
* @param {integer} [start=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an integer
* @throws {TypeError} second argument must be an integer
* @returns {Complex64Array} complex number array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var out = arr.slice();
* // returns <Complex64Array>
*
* var len = out.length;
* // returns 5
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 1.0
*
* var im = imagf( z );
* // returns -1.0
*
* z = out.get( len-1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 5.0
*
* im = imagf( z );
* // returns -5.0
*
* out = arr.slice( 1, -2 );
* // returns <Complex64Array>
*
* len = out.length;
* // returns 2
*
* z = out.get( 0 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 2.0
*
* im = imagf( z );
* // returns -2.0
*
* z = out.get( len-1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 3.0
*
* im = imagf( z );
* // returns -3.0
*/
setReadOnly( Complex64Array.prototype, 'slice', function slice( start, end ) {
	var outlen;
	var outbuf;
	var out;
	var idx;
	var buf;
	var len;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length === 0 ) {
		start = 0;
		end = len;
	} else {
		if ( !isInteger( start ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', start ) );
		}
		if ( start < 0 ) {
			start += len;
			if ( start < 0 ) {
				start = 0;
			}
		}
		if ( arguments.length === 1 ) {
			end = len;
		} else {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			} else if ( end > len ) {
				end = len;
			}
		}
	}
	if ( start < end ) {
		outlen = end - start;
	} else {
		outlen = 0;
	}
	out = new this.constructor( outlen );
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < outlen; i++ ) {
		idx = 2*(i+start);
		outbuf[ 2*i ] = buf[ idx ];
		outbuf[ (2*i)+1 ] = buf[ idx+1 ];
	}
	return out;
});

/**
* Tests whether at least one element in an array passes a test implemented by a predicate function.
*
* @name some
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} predicate - test function
* @param {*} [thisArg] - predicate function execution context
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {boolean} boolean indicating whether at least one element passes a test
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function predicate( v ) {
*     return ( realf( v ) === imagf( v ) );
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
*
* var bool = arr.some( predicate );
* // returns true
*/
setReadOnly( Complex64Array.prototype, 'some', function some( predicate, thisArg ) {
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( predicate ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', predicate ) );
	}
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		if ( predicate.call( thisArg, getComplex64( buf, i ), i, this ) ) {
			return true;
		}
	}
	return false;
});

/**
* Sorts an array in-place.
*
* @name sort
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} compareFcn - comparison function
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex64Array} sorted array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function compare( a, b ) {
*     var re1;
*     var re2;
*     var im1;
*     var im2;
*     re1 = realf( a );
*     re2 = realf( b );
*     if ( re1 < re2 ) {
*         return -1;
*     }
*     if ( re1 > re2 ) {
*         return 1;
*     }
*     im1 = imagf( a );
*     im2 = imagf( b );
*     if ( im1 < im2 ) {
*         return -1;
*     }
*     if ( im1 > im2 ) {
*         return 1;
*     }
*     return 0;
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 3.0, -3.0 ], 0 );
* arr.set( [ 1.0, -1.0 ], 1 );
* arr.set( [ 2.0, -2.0 ], 2 );
*
* var out = arr.sort( compare );
* // returns <Complex64Array>
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 1.0
*
* var im = imagf( z );
* // returns -1.0
*
* z = out.get( 1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 2.0
*
* im = imagf( z );
* // returns -2.0
*
* z = out.get( 2 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 3.0
*
* im = imagf( z );
* // returns -3.0
*/
setReadOnly( Complex64Array.prototype, 'sort', function sort( compareFcn ) {
	var tmp;
	var buf;
	var len;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( compareFcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', compareFcn ) );
	}
	buf = this._buffer;
	len = this._length;
	tmp = [];
	for ( i = 0; i < len; i++ ) {
		tmp.push( getComplex64( buf, i ) );
	}
	tmp.sort( compareFcn );
	for ( i = 0; i < len; i++ ) {
		j = 2 * i;
		buf[ j ] = realf( tmp[i] );
		buf[ j+1 ] = imagf( tmp[i] );
	}
	return this;
});

/**
* Creates a new typed array view over the same underlying `ArrayBuffer` and with the same underlying data type as the host array.
*
* @name subarray
* @memberof Complex64Array.prototype
* @type {Function}
* @param {integer} [begin=0] - starting index (inclusive)
* @param {integer} [end] - ending index (exclusive)
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an integer
* @throws {TypeError} second argument must be an integer
* @returns {Complex64Array} subarray
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 5 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
* arr.set( [ 3.0, -3.0 ], 2 );
* arr.set( [ 4.0, -4.0 ], 3 );
* arr.set( [ 5.0, -5.0 ], 4 );
*
* var subarr = arr.subarray();
* // returns <Complex64Array>
*
* var len = subarr.length;
* // returns 5
*
* var z = subarr.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 1.0
*
* var im = imagf( z );
* // returns -1.0
*
* z = subarr.get( len-1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 5.0
*
* im = imagf( z );
* // returns -5.0
*
* subarr = arr.subarray( 1, -2 );
* // returns <Complex64Array>
*
* len = subarr.length;
* // returns 2
*
* z = subarr.get( 0 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 2.0
*
* im = imagf( z );
* // returns -2.0
*
* z = subarr.get( len-1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 3.0
*
* im = imagf( z );
* // returns -3.0
*/
setReadOnly( Complex64Array.prototype, 'subarray', function subarray( begin, end ) {
	var offset;
	var buf;
	var len;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	buf = this._buffer;
	len = this._length;
	if ( arguments.length === 0 ) {
		begin = 0;
		end = len;
	} else {
		if ( !isInteger( begin ) ) {
			throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', begin ) );
		}
		if ( begin < 0 ) {
			begin += len;
			if ( begin < 0 ) {
				begin = 0;
			}
		}
		if ( arguments.length === 1 ) {
			end = len;
		} else {
			if ( !isInteger( end ) ) {
				throw new TypeError( format( 'invalid argument. Second argument must be an integer. Value: `%s`.', end ) );
			}
			if ( end < 0 ) {
				end += len;
				if ( end < 0 ) {
					end = 0;
				}
			} else if ( end > len ) {
				end = len;
			}
		}
	}
	if ( begin >= len ) {
		len = 0;
		offset = buf.byteLength;
	} else if ( begin >= end ) {
		len = 0;
		offset = buf.byteOffset + (begin*BYTES_PER_ELEMENT);
	} else {
		len = end - begin;
		offset = buf.byteOffset + ( begin*BYTES_PER_ELEMENT );
	}
	return new this.constructor( buf.buffer, offset, ( len < 0 ) ? 0 : len );
});

/**
* Serializes an array as a locale-specific string.
*
* @name toLocaleString
* @memberof Complex64Array.prototype
* @type {Function}
* @param {(string|Array<string>)} [locales] - locale identifier(s)
* @param {Object} [options] - configuration options
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a string or an array of strings
* @throws {TypeError} options argument must be an object
* @returns {string} string representation
*
* @example
* var arr = new Complex64Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var str = arr.toLocaleString();
* // returns '1 + 1i,2 + 2i'
*/
setReadOnly( Complex64Array.prototype, 'toLocaleString', function toLocaleString( locales, options ) {
	var opts;
	var loc;
	var out;
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( arguments.length === 0 ) {
		loc = [];
	} else if ( isString( locales ) || isStringArray( locales ) ) {
		loc = locales;
	} else {
		throw new TypeError( format( 'invalid argument. First argument must be a string or an array of strings. Value: `%s`.', locales ) );
	}
	if ( arguments.length < 2 ) {
		opts = {};
	} else if ( isObject( options ) ) {
		opts = options;
	} else {
		throw new TypeError( format( 'invalid argument. Options argument must be an object. Value: `%s`.', options ) );
	}
	buf = this._buffer;
	out = [];
	for ( i = 0; i < this._length; i++ ) {
		out.push( getComplex64( buf, i ).toLocaleString( loc, opts ) );
	}
	return out.join( ',' );
});

/**
* Returns a new typed array containing the elements in reversed order.
*
* @name toReversed
* @memberof Complex64Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Complex64Array} reversed array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var out = arr.toReversed();
* // returns <Complex64Array>
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 3.0
*
* var im = imagf( z );
* // returns 3.0
*
* z = out.get( 1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 2.0
*
* im = imagf( z );
* // returns 2.0
*
* z = out.get( 2 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 1.0
*
* im = imagf( z );
* // returns 1.0
*/
setReadOnly( Complex64Array.prototype, 'toReversed', function toReversed() {
	var outbuf;
	var out;
	var len;
	var buf;
	var i;
	var j;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	len = this._length;
	out = new this.constructor( len );
	buf = this._buffer;
	outbuf = out._buffer; // eslint-disable-line no-underscore-dangle
	for ( i = 0; i < len; i++ ) {
		j = len - i - 1;
		outbuf[ (2*i) ] = buf[ (2*j) ];
		outbuf[ (2*i)+1 ] = buf[ (2*j)+1 ];
	}
	return out;
});

/**
* Returns a new typed array containing the elements in sorted order.
*
* @name toSorted
* @memberof Complex64Array.prototype
* @type {Function}
* @param {Function} compareFcn - comparison function
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be a function
* @returns {Complex64Array} sorted array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
*
* function compare( a, b ) {
*     var re1;
*     var re2;
*     var im1;
*     var im2;
*     re1 = realf( a );
*     re2 = realf( b );
*     if ( re1 < re2 ) {
*         return -1;
*     }
*     if ( re1 > re2 ) {
*         return 1;
*     }
*     im1 = imagf( a );
*     im2 = imagf( b );
*     if ( im1 < im2 ) {
*         return -1;
*     }
*     if ( im1 > im2 ) {
*         return 1;
*     }
*     return 0;
* }
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 3.0, -3.0 ], 0 );
* arr.set( [ 1.0, -1.0 ], 1 );
* arr.set( [ 2.0, -2.0 ], 2 );
*
* var out = arr.sort( compare );
* // returns <Complex64Array>
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 1.0
*
* var im = imagf( z );
* // returns -1.0
*
* z = out.get( 1 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 2.0
*
* im = imagf( z );
* // returns -2.0
*
* z = out.get( 2 );
* // returns <Complex64>
*
* re = realf( z );
* // returns 3.0
*
* im = imagf( z );
* // returns -3.0
*/
setReadOnly( Complex64Array.prototype, 'toSorted', function toSorted( compareFcn ) {
	var tmp;
	var buf;
	var len;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isFunction( compareFcn ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a function. Value: `%s`.', compareFcn ) );
	}
	buf = this._buffer;
	len = this._length;
	tmp = [];
	for ( i = 0; i < len; i++ ) {
		tmp.push( getComplex64( buf, i ) );
	}
	tmp.sort( compareFcn );
	return new Complex64Array( tmp );
});

/**
* Serializes an array as a string.
*
* @name toString
* @memberof Complex64Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {string} string representation
*
* @example
* var arr = new Complex64Array( 2 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
*
* var str = arr.toString();
* // returns '1 + 1i,2 + 2i'
*/
setReadOnly( Complex64Array.prototype, 'toString', function toString() {
	var out;
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	out = [];
	buf = this._buffer;
	for ( i = 0; i < this._length; i++ ) {
		out.push( getComplex64( buf, i ).toString() );
	}
	return out.join( ',' );
});

/**
* Returns an iterator for iterating over each value in a typed array.
*
* @name values
* @memberof Complex64Array.prototype
* @type {Function}
* @throws {TypeError} `this` must be a complex number array
* @returns {Iterator} iterator
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var arr = new Complex64Array( 2 );
*
* arr.set( [ 1.0, -1.0 ], 0 );
* arr.set( [ 2.0, -2.0 ], 1 );
*
* var iter = arr.values();
*
* var v = iter.next().value;
* // returns <Complex64>
*
* var re = realf( v );
* // returns 1.0
*
* var im = imagf( v );
* // returns -1.0
*
* v = iter.next().value;
* // returns <Complex64>
*
* re = realf( v );
* // returns 2.0
*
* im = imagf( v );
* // returns -2.0
*
* var bool = iter.next().done;
* // returns true
*/
setReadOnly( Complex64Array.prototype, 'values', function values() {
	var iter;
	var self;
	var len;
	var FLG;
	var buf;
	var i;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	self = this;
	buf = this._buffer;
	len = this._length;

	// Initialize an iteration index:
	i = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	if ( ITERATOR_SYMBOL ) {
		setReadOnly( iter, ITERATOR_SYMBOL, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		i += 1;
		if ( FLG || i >= len ) {
			return {
				'done': true
			};
		}
		return {
			'value': getComplex64( buf, i ),
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return self.values();
	}
});

/**
* Returns a new typed array with the element at a provided index replaced with a provided value.
*
* @name with
* @memberof Complex64Array.prototype
* @type {Function}
* @param {integer} index - element index
* @param {ComplexLike} value - new value
* @throws {TypeError} `this` must be a complex number array
* @throws {TypeError} first argument must be an integer
* @throws {RangeError} index argument is out-of-bounds
* @throws {TypeError} second argument must be a complex number
* @returns {Complex64Array} new typed array
*
* @example
* var realf = require( '@stdlib/complex/float32/real' );
* var imagf = require( '@stdlib/complex/float32/imag' );
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var arr = new Complex64Array( 3 );
*
* arr.set( [ 1.0, 1.0 ], 0 );
* arr.set( [ 2.0, 2.0 ], 1 );
* arr.set( [ 3.0, 3.0 ], 2 );
*
* var out = arr.with( 0, new Complex64( 4.0, 4.0 ) );
* // returns <Complex64Array>
*
* var z = out.get( 0 );
* // returns <Complex64>
*
* var re = realf( z );
* // returns 4.0
*
* var im = imagf( z );
* // returns 4.0
*/
setReadOnly( Complex64Array.prototype, 'with', function copyWith( index, value ) {
	var buf;
	var out;
	var len;
	if ( !isComplexArray( this ) ) {
		throw new TypeError( 'invalid invocation. `this` is not a complex number array.' );
	}
	if ( !isInteger( index ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be an integer. Value: `%s`.', index ) );
	}
	len = this._length;
	if ( index < 0 ) {
		index += len;
	}
	if ( index < 0 || index >= len ) {
		throw new RangeError( format( 'invalid argument. Index argument is out-of-bounds. Value: `%s`.', index ) );
	}
	if ( !isComplexLike( value ) ) {
		throw new TypeError( format( 'invalid argument. Second argument must be a complex number. Value: `%s`.', value ) );
	}
	out = new this.constructor( this._buffer );
	buf = out._buffer; // eslint-disable-line no-underscore-dangle
	buf[ 2*index ] = realf( value );
	buf[ (2*index)+1 ] = imagf( value );
	return out;
});


// EXPORTS //

module.exports = Complex64Array;

},{"./../../base/accessor-getter":36,"./../../base/assert/is-complex128array":43,"./../../base/assert/is-complex64array":45,"./../../base/getter":47,"./../../float32":69,"./from_array.js":59,"./from_iterator.js":60,"./from_iterator_map.js":61,"@stdlib/assert/has-iterator-symbol-support":111,"@stdlib/assert/is-array":133,"@stdlib/assert/is-array-like-object":131,"@stdlib/assert/is-arraybuffer":135,"@stdlib/assert/is-collection":145,"@stdlib/assert/is-complex-like":147,"@stdlib/assert/is-function":155,"@stdlib/assert/is-nonnegative-integer":168,"@stdlib/assert/is-object":180,"@stdlib/assert/is-string":183,"@stdlib/assert/is-string-array":182,"@stdlib/complex/float32/ctor":213,"@stdlib/complex/float32/imag":217,"@stdlib/complex/float32/real":219,"@stdlib/math/base/assert/is-even":242,"@stdlib/math/base/assert/is-integer":244,"@stdlib/math/base/special/floor":248,"@stdlib/strided/base/reinterpret-complex128":260,"@stdlib/strided/base/reinterpret-complex64":262,"@stdlib/string/format":274,"@stdlib/symbol/iterator":279,"@stdlib/utils/define-nonenumerable-read-only-accessor":283,"@stdlib/utils/define-nonenumerable-read-only-property":285}],64:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

// Mapping from array constructors to data types...
var ctor2dtypes = {
	'Float32Array': 'float32',
	'Float64Array': 'float64',
	'Array': 'generic',
	'Int16Array': 'int16',
	'Int32Array': 'int32',
	'Int8Array': 'int8',
	'Uint16Array': 'uint16',
	'Uint32Array': 'uint32',
	'Uint8Array': 'uint8',
	'Uint8ClampedArray': 'uint8c',
	'Complex64Array': 'complex64',
	'Complex128Array': 'complex128',
	'BooleanArray': 'bool'
};


// EXPORTS //

module.exports = ctor2dtypes;

},{}],65:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Float64Array = require( './../../float64' );
var Float32Array = require( './../../float32' );
var Uint32Array = require( './../../uint32' );
var Int32Array = require( './../../int32' );
var Uint16Array = require( './../../uint16' );
var Int16Array = require( './../../int16' );
var Uint8Array = require( './../../uint8' );
var Uint8ClampedArray = require( './../../uint8c' );
var Int8Array = require( './../../int8' );
var Complex64Array = require( './../../complex64' );
var Complex128Array = require( './../../complex128' );
var BooleanArray = require( './../../bool' );


// MAIN //

// Note: order should match `dtypes` order
var CTORS = [
	Float64Array,
	Float32Array,
	Int32Array,
	Uint32Array,
	Int16Array,
	Uint16Array,
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Complex64Array,
	Complex128Array,
	BooleanArray
];


// EXPORTS //

module.exports = CTORS;

},{"./../../bool":52,"./../../complex128":57,"./../../complex64":62,"./../../float32":69,"./../../float64":72,"./../../int16":75,"./../../int32":78,"./../../int8":81,"./../../uint16":84,"./../../uint32":87,"./../../uint8":90,"./../../uint8c":93}],66:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

// Note: order should match `ctors` order
var DTYPES = [
	'float64',
	'float32',
	'int32',
	'uint32',
	'int16',
	'uint16',
	'int8',
	'uint8',
	'uint8c',
	'complex64',
	'complex128',
	'bool'
];


// EXPORTS //

module.exports = DTYPES;

},{}],67:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the data type of an array.
*
* @module @stdlib/array/dtype
*
* @example
* var Float64Array = require( '@stdlib/array/float64' );
* var dtype = require( '@stdlib/array/dtype' );
*
* var arr = new Float64Array( 10 );
*
* var dt = dtype( arr );
* // returns 'float64'
*
* dt = dtype( {} );
* // returns null
*
* dt = dtype( 'beep' );
* // returns null
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":68}],68:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isBuffer = require( '@stdlib/assert/is-buffer' );
var isArray = require( '@stdlib/assert/is-array' );
var constructorName = require( '@stdlib/utils/constructor-name' );
var ctor2dtype = require( './ctor2dtype.js' );
var CTORS = require( './ctors.js' );
var DTYPES = require( './dtypes.js' );


// VARIABLES //

var NTYPES = DTYPES.length;


// MAIN //

/**
* Returns the data type of an array.
*
* @param {*} value - input value
* @returns {(string|null)} data type
*
* @example
* var dt = dtype( [ 1, 2, 3 ] );
* // returns 'generic'
*
* var dt = dtype( 'beep' );
* // returns null
*/
function dtype( value ) {
	var i;
	if ( isArray( value ) ) {
		return 'generic';
	}
	if ( isBuffer( value ) ) {
		return null;
	}
	for ( i = 0; i < NTYPES; i++ ) {
		if ( value instanceof CTORS[ i ] ) {
			return DTYPES[ i ];
		}
	}
	// If the above failed, fall back to a more robust (and significantly slower) means for resolving underlying data types:
	return ctor2dtype[ constructorName( value ) ] || null;
}


// EXPORTS //

module.exports = dtype;

},{"./ctor2dtype.js":64,"./ctors.js":65,"./dtypes.js":66,"@stdlib/assert/is-array":133,"@stdlib/assert/is-buffer":143,"@stdlib/utils/constructor-name":281}],69:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of single-precision floating-point numbers in the platform byte order.
*
* @module @stdlib/array/float32
*
* @example
* var ctor = require( '@stdlib/array/float32' );
*
* var arr = new ctor( 10 );
* // returns <Float32Array>
*/

// MODULES //

var hasFloat32ArraySupport = require( '@stdlib/assert/has-float32array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasFloat32ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":70,"./polyfill.js":71,"@stdlib/assert/has-float32array-support":97}],70:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Float32Array === 'function' ) ? Float32Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],71:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of single-precision floating-point numbers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],72:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of double-precision floating-point numbers in the platform byte order.
*
* @module @stdlib/array/float64
*
* @example
* var ctor = require( '@stdlib/array/float64' );
*
* var arr = new ctor( 10 );
* // returns <Float64Array>
*/

// MODULES //

var hasFloat64ArraySupport = require( '@stdlib/assert/has-float64array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasFloat64ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":73,"./polyfill.js":74,"@stdlib/assert/has-float64array-support":100}],73:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Float64Array === 'function' ) ? Float64Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],74:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of double-precision floating-point numbers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],75:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of twos-complement 16-bit signed integers in the platform byte order.
*
* @module @stdlib/array/int16
*
* @example
* var ctor = require( '@stdlib/array/int16' );
*
* var arr = new ctor( 10 );
* // returns <Int16Array>
*/

// MODULES //

var hasInt16ArraySupport = require( '@stdlib/assert/has-int16array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasInt16ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":76,"./polyfill.js":77,"@stdlib/assert/has-int16array-support":102}],76:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Int16Array === 'function' ) ? Int16Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],77:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of twos-complement 16-bit signed integers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],78:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of twos-complement 32-bit signed integers in the platform byte order.
*
* @module @stdlib/array/int32
*
* @example
* var ctor = require( '@stdlib/array/int32' );
*
* var arr = new ctor( 10 );
* // returns <Int32Array>
*/

// MODULES //

var hasInt32ArraySupport = require( '@stdlib/assert/has-int32array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasInt32ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":79,"./polyfill.js":80,"@stdlib/assert/has-int32array-support":105}],79:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Int32Array === 'function' ) ? Int32Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],80:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of twos-complement 32-bit signed integers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],81:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of twos-complement 8-bit signed integers in the platform byte order.
*
* @module @stdlib/array/int8
*
* @example
* var ctor = require( '@stdlib/array/int8' );
*
* var arr = new ctor( 10 );
* // returns <Int8Array>
*/

// MODULES //

var hasInt8ArraySupport = require( '@stdlib/assert/has-int8array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasInt8ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":82,"./polyfill.js":83,"@stdlib/assert/has-int8array-support":108}],82:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Int8Array === 'function' ) ? Int8Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],83:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of twos-complement 8-bit signed integers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],84:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of 16-bit unsigned integers in the platform byte order.
*
* @module @stdlib/array/uint16
*
* @example
* var ctor = require( '@stdlib/array/uint16' );
*
* var arr = new ctor( 10 );
* // returns <Uint16Array>
*/

// MODULES //

var hasUint16ArraySupport = require( '@stdlib/assert/has-uint16array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasUint16ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":85,"./polyfill.js":86,"@stdlib/assert/has-uint16array-support":119}],85:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Uint16Array === 'function' ) ? Uint16Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],86:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of 16-bit unsigned integers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],87:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of 32-bit unsigned integers in the platform byte order.
*
* @module @stdlib/array/uint32
*
* @example
* var ctor = require( '@stdlib/array/uint32' );
*
* var arr = new ctor( 10 );
* // returns <Uint32Array>
*/

// MODULES //

var hasUint32ArraySupport = require( '@stdlib/assert/has-uint32array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasUint32ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":88,"./polyfill.js":89,"@stdlib/assert/has-uint32array-support":122}],88:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Uint32Array === 'function' ) ? Uint32Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],89:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of 32-bit unsigned integers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],90:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of 8-bit unsigned integers in the platform byte order.
*
* @module @stdlib/array/uint8
*
* @example
* var ctor = require( '@stdlib/array/uint8' );
*
* var arr = new ctor( 10 );
* // returns <Uint8Array>
*/

// MODULES //

var hasUint8ArraySupport = require( '@stdlib/assert/has-uint8array-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasUint8ArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":91,"./polyfill.js":92,"@stdlib/assert/has-uint8array-support":125}],91:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Uint8Array === 'function' ) ? Uint8Array : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],92:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of 8-bit unsigned integers in the platform byte order.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],93:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Typed array constructor which returns a typed array representing an array of 8-bit unsigned integers in the platform byte order clamped to 0-255.
*
* @module @stdlib/array/uint8c
*
* @example
* var ctor = require( '@stdlib/array/uint8c' );
*
* var arr = new ctor( 10 );
* // returns <Uint8ClampedArray>
*/

// MODULES //

var hasUint8ClampedArraySupport = require( '@stdlib/assert/has-uint8clampedarray-support' ); // eslint-disable-line id-length
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var ctor;
if ( hasUint8ClampedArraySupport() ) {
	ctor = builtin;
} else {
	ctor = polyfill;
}


// EXPORTS //

module.exports = ctor;

},{"./main.js":94,"./polyfill.js":95,"@stdlib/assert/has-uint8clampedarray-support":128}],94:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var ctor = ( typeof Uint8ClampedArray === 'function' ) ? Uint8ClampedArray : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = ctor;

},{}],95:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: write polyfill

// MAIN //

/**
* Typed array which represents an array of 8-bit unsigned integers in the platform byte order clamped to 0-255.
*
* @throws {Error} not implemented
*/
function polyfill() {
	throw new Error( 'not implemented' );
}


// EXPORTS //

module.exports = polyfill;

},{}],96:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Float32Array === 'function' ) ? Float32Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],97:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Float32Array` support.
*
* @module @stdlib/assert/has-float32array-support
*
* @example
* var hasFloat32ArraySupport = require( '@stdlib/assert/has-float32array-support' );
*
* var bool = hasFloat32ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasFloat32ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasFloat32ArraySupport;

},{"./main.js":98}],98:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isFloat32Array = require( './../../is-float32array' );
var PINF = require( '@stdlib/constants/float64/pinf' );
var GlobalFloat32Array = require( './float32array.js' );


// MAIN //

/**
* Tests for native `Float32Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Float32Array` support
*
* @example
* var bool = hasFloat32ArraySupport();
* // returns <boolean>
*/
function hasFloat32ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalFloat32Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = new GlobalFloat32Array( [ 1.0, 3.14, -3.14, 5.0e40 ] );
		bool = (
			isFloat32Array( arr ) &&
			arr[ 0 ] === 1.0 &&
			arr[ 1 ] === 3.140000104904175 &&
			arr[ 2 ] === -3.140000104904175 &&
			arr[ 3 ] === PINF
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasFloat32ArraySupport;

},{"./../../is-float32array":151,"./float32array.js":96,"@stdlib/constants/float64/pinf":232}],99:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Float64Array === 'function' ) ? Float64Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],100:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Float64Array` support.
*
* @module @stdlib/assert/has-float64array-support
*
* @example
* var hasFloat64ArraySupport = require( '@stdlib/assert/has-float64array-support' );
*
* var bool = hasFloat64ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasFloat64ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasFloat64ArraySupport;

},{"./main.js":101}],101:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isFloat64Array = require( './../../is-float64array' );
var GlobalFloat64Array = require( './float64array.js' );


// MAIN //

/**
* Tests for native `Float64Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Float64Array` support
*
* @example
* var bool = hasFloat64ArraySupport();
* // returns <boolean>
*/
function hasFloat64ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalFloat64Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = new GlobalFloat64Array( [ 1.0, 3.14, -3.14, NaN ] );
		bool = (
			isFloat64Array( arr ) &&
			arr[ 0 ] === 1.0 &&
			arr[ 1 ] === 3.14 &&
			arr[ 2 ] === -3.14 &&
			arr[ 3 ] !== arr[ 3 ]
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasFloat64ArraySupport;

},{"./../../is-float64array":153,"./float64array.js":99}],102:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Int16Array` support.
*
* @module @stdlib/assert/has-int16array-support
*
* @example
* var hasInt16ArraySupport = require( '@stdlib/assert/has-int16array-support' );
*
* var bool = hasInt16ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasInt16ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasInt16ArraySupport;

},{"./main.js":104}],103:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Int16Array === 'function' ) ? Int16Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],104:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInt16Array = require( './../../is-int16array' );
var INT16_MAX = require( '@stdlib/constants/int16/max' );
var INT16_MIN = require( '@stdlib/constants/int16/min' );
var GlobalInt16Array = require( './int16array.js' );


// MAIN //

/**
* Tests for native `Int16Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Int16Array` support
*
* @example
* var bool = hasInt16ArraySupport();
* // returns <boolean>
*/
function hasInt16ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalInt16Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = new GlobalInt16Array( [ 1, 3.14, -3.14, INT16_MAX+1 ] );
		bool = (
			isInt16Array( arr ) &&
			arr[ 0 ] === 1 &&
			arr[ 1 ] === 3 &&      // truncation
			arr[ 2 ] === -3 &&     // truncation
			arr[ 3 ] === INT16_MIN // wrap around
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasInt16ArraySupport;

},{"./../../is-int16array":157,"./int16array.js":103,"@stdlib/constants/int16/max":233,"@stdlib/constants/int16/min":234}],105:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Int32Array` support.
*
* @module @stdlib/assert/has-int32array-support
*
* @example
* var hasInt32ArraySupport = require( '@stdlib/assert/has-int32array-support' );
*
* var bool = hasInt32ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasInt32ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasInt32ArraySupport;

},{"./main.js":107}],106:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Int32Array === 'function' ) ? Int32Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],107:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInt32Array = require( './../../is-int32array' );
var INT32_MAX = require( '@stdlib/constants/int32/max' );
var INT32_MIN = require( '@stdlib/constants/int32/min' );
var GlobalInt32Array = require( './int32array.js' );


// MAIN //

/**
* Tests for native `Int32Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Int32Array` support
*
* @example
* var bool = hasInt32ArraySupport();
* // returns <boolean>
*/
function hasInt32ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalInt32Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = new GlobalInt32Array( [ 1, 3.14, -3.14, INT32_MAX+1 ] );
		bool = (
			isInt32Array( arr ) &&
			arr[ 0 ] === 1 &&
			arr[ 1 ] === 3 &&      // truncation
			arr[ 2 ] === -3 &&     // truncation
			arr[ 3 ] === INT32_MIN // wrap around
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasInt32ArraySupport;

},{"./../../is-int32array":159,"./int32array.js":106,"@stdlib/constants/int32/max":235,"@stdlib/constants/int32/min":236}],108:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Int8Array` support.
*
* @module @stdlib/assert/has-int8array-support
*
* @example
* var hasInt8ArraySupport = require( '@stdlib/assert/has-int8array-support' );
*
* var bool = hasInt8ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasInt8ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasInt8ArraySupport;

},{"./main.js":110}],109:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Int8Array === 'function' ) ? Int8Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],110:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInt8Array = require( './../../is-int8array' );
var INT8_MAX = require( '@stdlib/constants/int8/max' );
var INT8_MIN = require( '@stdlib/constants/int8/min' );
var GlobalInt8Array = require( './int8array.js' );


// MAIN //

/**
* Tests for native `Int8Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Int8Array` support
*
* @example
* var bool = hasInt8ArraySupport();
* // returns <boolean>
*/
function hasInt8ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalInt8Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = new GlobalInt8Array( [ 1, 3.14, -3.14, INT8_MAX+1 ] );
		bool = (
			isInt8Array( arr ) &&
			arr[ 0 ] === 1 &&
			arr[ 1 ] === 3 &&     // truncation
			arr[ 2 ] === -3 &&    // truncation
			arr[ 3 ] === INT8_MIN // wrap around
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasInt8ArraySupport;

},{"./../../is-int8array":161,"./int8array.js":109,"@stdlib/constants/int8/max":237,"@stdlib/constants/int8/min":238}],111:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Symbol.iterator` support.
*
* @module @stdlib/assert/has-iterator-symbol-support
*
* @example
* var hasIteratorSymbolSupport = require( '@stdlib/assert/has-iterator-symbol-support' );
*
* var bool = hasIteratorSymbolSupport();
* // returns <boolean>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":112}],112:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasOwnProp = require( './../../has-own-property' );
var Symbol = require( '@stdlib/symbol/ctor' );


// MAIN //

/**
* Tests for native `Symbol.iterator` support.
*
* @returns {boolean} boolean indicating if an environment has `Symbol.iterator` support
*
* @example
* var bool = hasIteratorSymbolSupport();
* // returns <boolean>
*/
function hasIteratorSymbolSupport() {
	return (
		typeof Symbol === 'function' &&
		typeof Symbol( 'foo' ) === 'symbol' &&
		hasOwnProp( Symbol, 'iterator' ) &&
		typeof Symbol.iterator === 'symbol'
	);
}


// EXPORTS //

module.exports = hasIteratorSymbolSupport;

},{"./../../has-own-property":113,"@stdlib/symbol/ctor":277}],113:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test whether an object has a specified property.
*
* @module @stdlib/assert/has-own-property
*
* @example
* var hasOwnProp = require( '@stdlib/assert/has-own-property' );
*
* var beep = {
*     'boop': true
* };
*
* var bool = hasOwnProp( beep, 'boop' );
* // returns true
*
* bool = hasOwnProp( beep, 'bop' );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":114}],114:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// FUNCTIONS //

var has = Object.prototype.hasOwnProperty;


// MAIN //

/**
* Tests if an object has a specified property.
*
* @param {*} value - value to test
* @param {*} property - property to test
* @returns {boolean} boolean indicating if an object has a specified property
*
* @example
* var beep = {
*     'boop': true
* };
*
* var bool = hasOwnProp( beep, 'boop' );
* // returns true
*
* @example
* var beep = {
*     'boop': true
* };
*
* var bool = hasOwnProp( beep, 'bap' );
* // returns false
*/
function hasOwnProp( value, property ) {
	if (
		value === void 0 ||
		value === null
	) {
		return false;
	}
	return has.call( value, property );
}


// EXPORTS //

module.exports = hasOwnProp;

},{}],115:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Symbol` support.
*
* @module @stdlib/assert/has-symbol-support
*
* @example
* var hasSymbolSupport = require( '@stdlib/assert/has-symbol-support' );
*
* var bool = hasSymbolSupport();
* // returns <boolean>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":116}],116:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Tests for native `Symbol` support.
*
* @returns {boolean} boolean indicating if an environment has `Symbol` support
*
* @example
* var bool = hasSymbolSupport();
* // returns <boolean>
*/
function hasSymbolSupport() {
	return (
		typeof Symbol === 'function' &&
		typeof Symbol( 'foo' ) === 'symbol'
	);
}


// EXPORTS //

module.exports = hasSymbolSupport;

},{}],117:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `toStringTag` support.
*
* @module @stdlib/assert/has-tostringtag-support
*
* @example
* var hasToStringTagSupport = require( '@stdlib/assert/has-tostringtag-support' );
*
* var bool = hasToStringTagSupport();
* // returns <boolean>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":118}],118:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasSymbols = require( './../../has-symbol-support' );


// VARIABLES //

var FLG = hasSymbols();


// MAIN //

/**
* Tests for native `toStringTag` support.
*
* @returns {boolean} boolean indicating if an environment has `toStringTag` support
*
* @example
* var bool = hasToStringTagSupport();
* // returns <boolean>
*/
function hasToStringTagSupport() {
	return ( FLG && typeof Symbol.toStringTag === 'symbol' );
}


// EXPORTS //

module.exports = hasToStringTagSupport;

},{"./../../has-symbol-support":115}],119:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Uint16Array` support.
*
* @module @stdlib/assert/has-uint16array-support
*
* @example
* var hasUint16ArraySupport = require( '@stdlib/assert/has-uint16array-support' );
*
* var bool = hasUint16ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasUint16ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasUint16ArraySupport;

},{"./main.js":120}],120:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isUint16Array = require( './../../is-uint16array' );
var UINT16_MAX = require( '@stdlib/constants/uint16/max' );
var GlobalUint16Array = require( './uint16array.js' );


// MAIN //

/**
* Tests for native `Uint16Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Uint16Array` support
*
* @example
* var bool = hasUint16ArraySupport();
* // returns <boolean>
*/
function hasUint16ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalUint16Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = [ 1, 3.14, -3.14, UINT16_MAX+1, UINT16_MAX+2 ];
		arr = new GlobalUint16Array( arr );
		bool = (
			isUint16Array( arr ) &&
			arr[ 0 ] === 1 &&
			arr[ 1 ] === 3 &&            // truncation
			arr[ 2 ] === UINT16_MAX-2 && // truncation and wrap around
			arr[ 3 ] === 0 &&            // wrap around
			arr[ 4 ] === 1               // wrap around
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasUint16ArraySupport;

},{"./../../is-uint16array":189,"./uint16array.js":121,"@stdlib/constants/uint16/max":239}],121:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Uint16Array === 'function' ) ? Uint16Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],122:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Uint32Array` support.
*
* @module @stdlib/assert/has-uint32array-support
*
* @example
* var hasUint32ArraySupport = require( '@stdlib/assert/has-uint32array-support' );
*
* var bool = hasUint32ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasUint32ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasUint32ArraySupport;

},{"./main.js":123}],123:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isUint32Array = require( './../../is-uint32array' );
var UINT32_MAX = require( '@stdlib/constants/uint32/max' );
var GlobalUint32Array = require( './uint32array.js' );


// MAIN //

/**
* Tests for native `Uint32Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Uint32Array` support
*
* @example
* var bool = hasUint32ArraySupport();
* // returns <boolean>
*/
function hasUint32ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalUint32Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = [ 1, 3.14, -3.14, UINT32_MAX+1, UINT32_MAX+2 ];
		arr = new GlobalUint32Array( arr );
		bool = (
			isUint32Array( arr ) &&
			arr[ 0 ] === 1 &&
			arr[ 1 ] === 3 &&            // truncation
			arr[ 2 ] === UINT32_MAX-2 && // truncation and wrap around
			arr[ 3 ] === 0 &&            // wrap around
			arr[ 4 ] === 1               // wrap around
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasUint32ArraySupport;

},{"./../../is-uint32array":191,"./uint32array.js":124,"@stdlib/constants/uint32/max":240}],124:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Uint32Array === 'function' ) ? Uint32Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],125:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Uint8Array` support.
*
* @module @stdlib/assert/has-uint8array-support
*
* @example
* var hasUint8ArraySupport = require( '@stdlib/assert/has-uint8array-support' );
*
* var bool = hasUint8ArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasUint8ArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasUint8ArraySupport;

},{"./main.js":126}],126:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isUint8Array = require( './../../is-uint8array' );
var UINT8_MAX = require( '@stdlib/constants/uint8/max' );
var GlobalUint8Array = require( './uint8array.js' );


// MAIN //

/**
* Tests for native `Uint8Array` support.
*
* @returns {boolean} boolean indicating if an environment has `Uint8Array` support
*
* @example
* var bool = hasUint8ArraySupport();
* // returns <boolean>
*/
function hasUint8ArraySupport() {
	var bool;
	var arr;

	if ( typeof GlobalUint8Array !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = [ 1, 3.14, -3.14, UINT8_MAX+1, UINT8_MAX+2 ];
		arr = new GlobalUint8Array( arr );
		bool = (
			isUint8Array( arr ) &&
			arr[ 0 ] === 1 &&
			arr[ 1 ] === 3 &&           // truncation
			arr[ 2 ] === UINT8_MAX-2 && // truncation and wrap around
			arr[ 3 ] === 0 &&           // wrap around
			arr[ 4 ] === 1              // wrap around
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasUint8ArraySupport;

},{"./../../is-uint8array":193,"./uint8array.js":127,"@stdlib/constants/uint8/max":241}],127:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Uint8Array === 'function' ) ? Uint8Array : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],128:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test for native `Uint8ClampedArray` support.
*
* @module @stdlib/assert/has-uint8clampedarray-support
*
* @example
* var hasUint8ClampedArraySupport = require( '@stdlib/assert/has-uint8clampedarray-support' );
*
* var bool = hasUint8ClampedArraySupport();
* // returns <boolean>
*/

// MODULES //

var hasUint8ClampedArraySupport = require( './main.js' );


// EXPORTS //

module.exports = hasUint8ClampedArraySupport;

},{"./main.js":129}],129:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isUint8ClampedArray = require( './../../is-uint8clampedarray' );
var GlobalUint8ClampedArray = require( './uint8clampedarray.js' );


// MAIN //

/**
* Tests for native `Uint8ClampedArray` support.
*
* @returns {boolean} boolean indicating if an environment has `Uint8ClampedArray` support
*
* @example
* var bool = hasUint8ClampedArraySupport();
* // returns <boolean>
*/
function hasUint8ClampedArraySupport() { // eslint-disable-line id-length
	var bool;
	var arr;

	if ( typeof GlobalUint8ClampedArray !== 'function' ) {
		return false;
	}
	// Test basic support...
	try {
		arr = new GlobalUint8ClampedArray( [ -1, 0, 1, 3.14, 4.99, 255, 256 ] );
		bool = (
			isUint8ClampedArray( arr ) &&
			arr[ 0 ] === 0 &&   // clamped
			arr[ 1 ] === 0 &&
			arr[ 2 ] === 1 &&
			arr[ 3 ] === 3 &&   // round to nearest
			arr[ 4 ] === 5 &&   // round to nearest
			arr[ 5 ] === 255 &&
			arr[ 6 ] === 255    // clamped
		);
	} catch ( err ) { // eslint-disable-line no-unused-vars
		bool = false;
	}
	return bool;
}


// EXPORTS //

module.exports = hasUint8ClampedArraySupport;

},{"./../../is-uint8clampedarray":195,"./uint8clampedarray.js":130}],130:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Uint8ClampedArray === 'function' ) ? Uint8ClampedArray : null; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = main;

},{}],131:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an array-like object.
*
* @module @stdlib/assert/is-array-like-object
*
* @example
* var isArrayLikeObject = require( '@stdlib/assert/is-array-like-object' );
*
* var bool = isArrayLikeObject( [] );
* // returns true
*
* bool = isArrayLikeObject( { 'length':10 } );
* // returns true
*
* bool = isArrayLikeObject( 'beep' );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":132}],132:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInteger = require( '@stdlib/math/base/assert/is-integer' );
var MAX_LENGTH = require( '@stdlib/constants/array/max-array-length' );


// MAIN //

/**
* Tests if a value is an array-like object.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is an array-like object
*
* @example
* var bool = isArrayLikeObject( [] );
* // returns true
*
* @example
* var bool = isArrayLikeObject( { 'length':10 } );
* // returns true
*
* @example
* var bool = isArrayLikeObject( 'beep' );
* // returns false
*/
function isArrayLikeObject( value ) {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof value.length === 'number' &&
		isInteger( value.length ) &&
		value.length >= 0 &&
		value.length <= MAX_LENGTH
	);
}


// EXPORTS //

module.exports = isArrayLikeObject;

},{"@stdlib/constants/array/max-array-length":229,"@stdlib/math/base/assert/is-integer":244}],133:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an array.
*
* @module @stdlib/assert/is-array
*
* @example
* var isArray = require( '@stdlib/assert/is-array' );
*
* var bool = isArray( [] );
* // returns true
*
* bool = isArray( {} );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":134}],134:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var f;


// FUNCTIONS //

/**
* Tests if a value is an array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an array
*
* @example
* var bool = isArray( [] );
* // returns true
*
* @example
* var bool = isArray( {} );
* // returns false
*/
function isArray( value ) {
	return ( nativeClass( value ) === '[object Array]' );
}


// MAIN //

if ( Array.isArray ) {
	f = Array.isArray;
} else {
	f = isArray;
}


// EXPORTS //

module.exports = f;

},{"@stdlib/utils/native-class":303}],135:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an ArrayBuffer.
*
* @module @stdlib/assert/is-arraybuffer
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
* var isArrayBuffer = require( '@stdlib/assert/is-arraybuffer' );
*
* var bool = isArrayBuffer( new ArrayBuffer( 10 ) );
* // returns true
*
* bool = isArrayBuffer( [] );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":136}],136:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasArrayBuffer = ( typeof ArrayBuffer === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is an ArrayBuffer.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an ArrayBuffer
*
* @example
* var ArrayBuffer = require( '@stdlib/array/buffer' );
*
* var bool = isArrayBuffer( new ArrayBuffer( 10 ) );
* // returns true
*
* @example
* var bool = isArrayBuffer( [] );
* // returns false
*/
function isArrayBuffer( value ) {
	return (
		( hasArrayBuffer && value instanceof ArrayBuffer ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object ArrayBuffer]'
	);
}


// EXPORTS //

module.exports = isArrayBuffer;

},{"@stdlib/utils/native-class":303}],137:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a boolean.
*
* @module @stdlib/assert/is-boolean
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
* var isBoolean = require( '@stdlib/assert/is-boolean' );
*
* var bool = isBoolean( false );
* // returns true
*
* bool = isBoolean( new Boolean( false ) );
* // returns true
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
* var isBoolean = require( '@stdlib/assert/is-boolean' ).isPrimitive;
*
* var bool = isBoolean( false );
* // returns true
*
* bool = isBoolean( new Boolean( true ) );
* // returns false
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
* var isBoolean = require( '@stdlib/assert/is-boolean' ).isObject;
*
* var bool = isBoolean( true );
* // returns false
*
* bool = isBoolean( new Boolean( false ) );
* // returns true
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

setReadOnly( main, 'isPrimitive', isPrimitive );
setReadOnly( main, 'isObject', isObject );


// EXPORTS //

module.exports = main;

},{"./main.js":138,"./object.js":139,"./primitive.js":140,"@stdlib/utils/define-nonenumerable-read-only-property":285}],138:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

/**
* Tests if a value is a boolean.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a boolean
*
* @example
* var bool = isBoolean( false );
* // returns true
*
* @example
* var bool = isBoolean( true );
* // returns true
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
*
* var bool = isBoolean( new Boolean( false ) );
* // returns true
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
*
* var bool = isBoolean( new Boolean( true ) );
* // returns true
*/
function isBoolean( value ) {
	return ( isPrimitive( value ) || isObject( value ) );
}


// EXPORTS //

module.exports = isBoolean;

},{"./object.js":139,"./primitive.js":140}],139:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasToStringTag = require( './../../has-tostringtag-support' );
var nativeClass = require( '@stdlib/utils/native-class' );
var Boolean = require( '@stdlib/boolean/ctor' );
var test = require( './try2serialize.js' );


// VARIABLES //

var FLG = hasToStringTag();


// MAIN //

/**
* Tests if a value is a boolean object.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a boolean object
*
* @example
* var bool = isBoolean( true );
* // returns false
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
*
* var bool = isBoolean( new Boolean( false ) );
* // returns true
*/
function isBoolean( value ) {
	if ( typeof value === 'object' ) {
		if ( value instanceof Boolean ) {
			return true;
		}
		if ( FLG ) {
			return test( value );
		}
		return ( nativeClass( value ) === '[object Boolean]' );
	}
	return false;
}


// EXPORTS //

module.exports = isBoolean;

},{"./../../has-tostringtag-support":117,"./try2serialize.js":142,"@stdlib/boolean/ctor":211,"@stdlib/utils/native-class":303}],140:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tests if a value is a boolean primitive.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a boolean primitive
*
* @example
* var bool = isBoolean( true );
* // returns true
*
* @example
* var bool = isBoolean( false );
* // returns true
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
*
* var bool = isBoolean( new Boolean( true ) );
* // returns false
*/
function isBoolean( value ) {
	return ( typeof value === 'boolean' );
}


// EXPORTS //

module.exports = isBoolean;

},{}],141:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// eslint-disable-next-line stdlib/no-redeclare
var toString = Boolean.prototype.toString; // non-generic


// EXPORTS //

module.exports = toString;

},{}],142:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var toString = require( './tostring.js' ); // eslint-disable-line stdlib/no-redeclare


// MAIN //

/**
* Attempts to serialize a value to a string.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value can be serialized
*/
function test( value ) {
	try {
		toString.call( value );
		return true;
	} catch ( err ) { // eslint-disable-line no-unused-vars
		return false;
	}
}


// EXPORTS //

module.exports = test;

},{"./tostring.js":141}],143:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Buffer instance.
*
* @module @stdlib/assert/is-buffer
*
* @example
* var isBuffer = require( '@stdlib/assert/is-buffer' );
*
* var v = isBuffer( new Buffer( 'beep' ) );
* // returns true
*
* v = isBuffer( {} );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":144}],144:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isObjectLike = require( './../../is-object-like' );


// MAIN //

/**
* Tests if a value is a Buffer instance.
*
* @param {*} value - value to validate
* @returns {boolean} boolean indicating if a value is a Buffer instance
*
* @example
* var v = isBuffer( new Buffer( 'beep' ) );
* // returns true
*
* @example
* var v = isBuffer( new Buffer( [1,2,3,4] ) );
* // returns true
*
* @example
* var v = isBuffer( {} );
* // returns false
*
* @example
* var v = isBuffer( [] );
* // returns false
*/
function isBuffer( value ) {
	return (
		isObjectLike( value ) &&
		(
			// eslint-disable-next-line no-underscore-dangle
			value._isBuffer || // for envs missing Object.prototype.constructor (e.g., Safari 5-7)
			(
				value.constructor &&

				// WARNING: `typeof` is not a foolproof check, as certain envs consider RegExp and NodeList instances to be functions
				typeof value.constructor.isBuffer === 'function' &&
				value.constructor.isBuffer( value )
			)
		)
	);
}


// EXPORTS //

module.exports = isBuffer;

},{"./../../is-object-like":178}],145:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a collection.
*
* @module @stdlib/assert/is-collection
*
* @example
* var isCollection = require( '@stdlib/assert/is-collection' );
*
* var bool = isCollection( [] );
* // returns true
*
* bool = isCollection( {} );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":146}],146:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInteger = require( '@stdlib/math/base/assert/is-integer' );
var MAX_LENGTH = require( '@stdlib/constants/array/max-typed-array-length' );


// MAIN //

/**
* Tests if a value is a collection.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether a value is a collection
*
* @example
* var bool = isCollection( [] );
* // returns true
*
* @example
* var bool = isCollection( {} );
* // returns false
*/
function isCollection( value ) {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof value.length === 'number' &&
		isInteger( value.length ) &&
		value.length >= 0 &&
		value.length <= MAX_LENGTH
	);
}


// EXPORTS //

module.exports = isCollection;

},{"@stdlib/constants/array/max-typed-array-length":230,"@stdlib/math/base/assert/is-integer":244}],147:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a complex number-like object.
*
* @module @stdlib/assert/is-complex-like
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var isComplexLike = require( '@stdlib/assert/is-complex-like' );
*
* var x = new Complex128( 4.0, 2.0 );
* var bool = isComplexLike( x );
* // returns true
*
* x = new Complex64( 4.0, 2.0 );
* bool = isComplexLike( x );
* // returns true
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":148}],148:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Complex128 = require( '@stdlib/complex/float64/ctor' );
var Complex64 = require( '@stdlib/complex/float32/ctor' );


// MAIN //

/**
* Tests if a value is a complex number-like object.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a complex number-like object.
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var x = new Complex128( 4.0, 2.0 );
* var bool = isComplexLike( x );
* // returns true
*
* x = new Complex64( 4.0, 2.0 );
* bool = isComplexLike( x );
* // returns true
*/
function isComplexLike( value ) {
	if ( value instanceof Complex128 || value instanceof Complex64 ) {
		return true;
	}
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof value.re === 'number' &&
		typeof value.im === 'number'
	);
}


// EXPORTS //

module.exports = isComplexLike;

},{"@stdlib/complex/float32/ctor":213,"@stdlib/complex/float64/ctor":221}],149:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an `Error` object.
*
* @module @stdlib/assert/is-error
*
* @example
* var isError = require( '@stdlib/assert/is-error' );
*
* var bool = isError( new Error( 'beep' ) );
* // returns true
*
* bool = isError( {} );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":150}],150:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var getPrototypeOf = require( '@stdlib/utils/get-prototype-of' );
var nativeClass = require( '@stdlib/utils/native-class' );


// MAIN //

/**
* Tests if a value is an `Error` object.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether a value is an `Error` object
*
* @example
* var bool = isError( new Error( 'beep' ) );
* // returns true
*
* @example
* var bool = isError( {} );
* // returns false
*/
function isError( value ) {
	if ( typeof value !== 'object' || value === null ) {
		return false;
	}
	// Check for `Error` objects from the same realm (same Node.js `vm` or same `Window` object)...
	if ( value instanceof Error ) {
		return true;
	}
	// Walk the prototype tree until we find an object having the desired native class...
	while ( value ) {
		if ( nativeClass( value ) === '[object Error]' ) {
			return true;
		}
		value = getPrototypeOf( value );
	}
	return false;
}


// EXPORTS //

module.exports = isError;

},{"@stdlib/utils/get-prototype-of":293,"@stdlib/utils/native-class":303}],151:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Float32Array.
*
* @module @stdlib/assert/is-float32array
*
* @example
* var isFloat32Array = require( '@stdlib/assert/is-float32array' );
*
* var bool = isFloat32Array( new Float32Array( 10 ) );
* // returns true
*
* bool = isFloat32Array( [] );
* // returns false
*/

// MODULES //

var isFloat32Array = require( './main.js' );


// EXPORTS //

module.exports = isFloat32Array;

},{"./main.js":152}],152:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasFloat32Array = ( typeof Float32Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is a Float32Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a Float32Array
*
* @example
* var bool = isFloat32Array( new Float32Array( 10 ) );
* // returns true
*
* @example
* var bool = isFloat32Array( [] );
* // returns false
*/
function isFloat32Array( value ) {
	return (
		( hasFloat32Array && value instanceof Float32Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Float32Array]'
	);
}


// EXPORTS //

module.exports = isFloat32Array;

},{"@stdlib/utils/native-class":303}],153:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Float64Array.
*
* @module @stdlib/assert/is-float64array
*
* @example
* var isFloat64Array = require( '@stdlib/assert/is-float64array' );
*
* var bool = isFloat64Array( new Float64Array( 10 ) );
* // returns true
*
* bool = isFloat64Array( [] );
* // returns false
*/

// MODULES //

var isFloat64Array = require( './main.js' );


// EXPORTS //

module.exports = isFloat64Array;

},{"./main.js":154}],154:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasFloat64Array = ( typeof Float64Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is a Float64Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a Float64Array
*
* @example
* var bool = isFloat64Array( new Float64Array( 10 ) );
* // returns true
*
* @example
* var bool = isFloat64Array( [] );
* // returns false
*/
function isFloat64Array( value ) {
	return (
		( hasFloat64Array && value instanceof Float64Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Float64Array]'
	);
}


// EXPORTS //

module.exports = isFloat64Array;

},{"@stdlib/utils/native-class":303}],155:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a function.
*
* @module @stdlib/assert/is-function
*
* @example
* var isFunction = require( '@stdlib/assert/is-function' );
*
* function beep() {
*     return 'beep';
* }
*
* var bool = isFunction( beep );
* // returns true
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":156}],156:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var typeOf = require( '@stdlib/utils/type-of' );


// MAIN //

/**
* Tests if a value is a function.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a function
*
* @example
* function beep() {
*     return 'beep';
* }
*
* var bool = isFunction( beep );
* // returns true
*/
function isFunction( value ) {
	// Note: cannot use `typeof` directly, as various browser engines incorrectly return `'function'` when operating on non-function objects, such as regular expressions and NodeLists.
	return ( typeOf( value ) === 'function' );
}


// EXPORTS //

module.exports = isFunction;

},{"@stdlib/utils/type-of":314}],157:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an Int16Array.
*
* @module @stdlib/assert/is-int16array
*
* @example
* var isInt16Array = require( '@stdlib/assert/is-int16array' );
*
* var bool = isInt16Array( new Int16Array( 10 ) );
* // returns true
*
* bool = isInt16Array( [] );
* // returns false
*/

// MODULES //

var isInt16Array = require( './main.js' );


// EXPORTS //

module.exports = isInt16Array;

},{"./main.js":158}],158:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasInt16Array = ( typeof Int16Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is an Int16Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an Int16Array
*
* @example
* var bool = isInt16Array( new Int16Array( 10 ) );
* // returns true
*
* @example
* var bool = isInt16Array( [] );
* // returns false
*/
function isInt16Array( value ) {
	return (
		( hasInt16Array && value instanceof Int16Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Int16Array]'
	);
}


// EXPORTS //

module.exports = isInt16Array;

},{"@stdlib/utils/native-class":303}],159:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an Int32Array.
*
* @module @stdlib/assert/is-int32array
*
* @example
* var isInt32Array = require( '@stdlib/assert/is-int32array' );
*
* var bool = isInt32Array( new Int32Array( 10 ) );
* // returns true
*
* bool = isInt32Array( [] );
* // returns false
*/

// MODULES //

var isInt32Array = require( './main.js' );


// EXPORTS //

module.exports = isInt32Array;

},{"./main.js":160}],160:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasInt32Array = ( typeof Int32Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is an Int32Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an Int32Array
*
* @example
* var bool = isInt32Array( new Int32Array( 10 ) );
* // returns true
*
* @example
* var bool = isInt32Array( [] );
* // returns false
*/
function isInt32Array( value ) {
	return (
		( hasInt32Array && value instanceof Int32Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Int32Array]'
	);
}


// EXPORTS //

module.exports = isInt32Array;

},{"@stdlib/utils/native-class":303}],161:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an Int8Array.
*
* @module @stdlib/assert/is-int8array
*
* @example
* var isInt8Array = require( '@stdlib/assert/is-int8array' );
*
* var bool = isInt8Array( new Int8Array( 10 ) );
* // returns true
*
* bool = isInt8Array( [] );
* // returns false
*/

// MODULES //

var isInt8Array = require( './main.js' );


// EXPORTS //

module.exports = isInt8Array;

},{"./main.js":162}],162:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasInt8Array = ( typeof Int8Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is an Int8Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an Int8Array
*
* @example
* var bool = isInt8Array( new Int8Array( 10 ) );
* // returns true
*
* @example
* var bool = isInt8Array( [] );
* // returns false
*/
function isInt8Array( value ) {
	return (
		( hasInt8Array && value instanceof Int8Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Int8Array]'
	);
}


// EXPORTS //

module.exports = isInt8Array;

},{"@stdlib/utils/native-class":303}],163:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an integer.
*
* @module @stdlib/assert/is-integer
*
* @example
* var isInteger = require( '@stdlib/assert/is-integer' );
*
* var bool = isInteger( 5.0 );
* // returns true
*
* bool = isInteger( new Number( 5.0 ) );
* // returns true
*
* bool = isInteger( -3.14 );
* // returns false
*
* bool = isInteger( null );
* // returns false
*
* @example
* // Use interface to check for integer primitives...
* var isInteger = require( '@stdlib/assert/is-integer' ).isPrimitive;
*
* var bool = isInteger( -3.0 );
* // returns true
*
* bool = isInteger( new Number( -3.0 ) );
* // returns false
*
* @example
* // Use interface to check for integer objects...
* var isInteger = require( '@stdlib/assert/is-integer' ).isObject;
*
* var bool = isInteger( 3.0 );
* // returns false
*
* bool = isInteger( new Number( 3.0 ) );
* // returns true
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

setReadOnly( main, 'isPrimitive', isPrimitive );
setReadOnly( main, 'isObject', isObject );


// EXPORTS //

module.exports = main;

},{"./main.js":165,"./object.js":166,"./primitive.js":167,"@stdlib/utils/define-nonenumerable-read-only-property":285}],164:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var PINF = require( '@stdlib/constants/float64/pinf' );
var NINF = require( '@stdlib/constants/float64/ninf' );
var isInt = require( '@stdlib/math/base/assert/is-integer' );


// MAIN //

/**
* Tests if a number primitive is an integer value.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a number primitive is an integer value
*/
function isInteger( value ) {
	return (
		value < PINF &&
		value > NINF &&
		isInt( value )
	);
}


// EXPORTS //

module.exports = isInteger;

},{"@stdlib/constants/float64/ninf":231,"@stdlib/constants/float64/pinf":232,"@stdlib/math/base/assert/is-integer":244}],165:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

/**
* Tests if a value is an integer.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an integer
*
* @example
* var bool = isInteger( 5.0 );
* // returns true
*
* @example
* var bool = isInteger( new Number( 5.0 ) );
* // returns true
*
* @example
* var bool = isInteger( -3.14 );
* // returns false
*
* @example
* var bool = isInteger( null );
* // returns false
*/
function isInteger( value ) {
	return ( isPrimitive( value ) || isObject( value ) );
}


// EXPORTS //

module.exports = isInteger;

},{"./object.js":166,"./primitive.js":167}],166:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNumber = require( './../../is-number' ).isObject;
var isInt = require( './integer.js' );


// MAIN //

/**
* Tests if a value is a number object having an integer value.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number object having an integer value
*
* @example
* var bool = isInteger( 3.0 );
* // returns false
*
* @example
* var bool = isInteger( new Number( 3.0 ) );
* // returns true
*/
function isInteger( value ) {
	return (
		isNumber( value ) &&
		isInt( value.valueOf() )
	);
}


// EXPORTS //

module.exports = isInteger;

},{"./../../is-number":172,"./integer.js":164}],167:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNumber = require( './../../is-number' ).isPrimitive;
var isInt = require( './integer.js' );


// MAIN //

/**
* Tests if a value is a number primitive having an integer value.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number primitive having an integer value
*
* @example
* var bool = isInteger( -3.0 );
* // returns true
*
* @example
* var bool = isInteger( new Number( -3.0 ) );
* // returns false
*/
function isInteger( value ) {
	return (
		isNumber( value ) &&
		isInt( value )
	);
}


// EXPORTS //

module.exports = isInteger;

},{"./../../is-number":172,"./integer.js":164}],168:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a nonnegative integer.
*
* @module @stdlib/assert/is-nonnegative-integer
*
* @example
* var isNonNegativeInteger = require( '@stdlib/assert/is-nonnegative-integer' );
*
* var bool = isNonNegativeInteger( 5.0 );
* // returns true
*
* bool = isNonNegativeInteger( new Number( 5.0 ) );
* // returns true
*
* bool = isNonNegativeInteger( -5.0 );
* // returns false
*
* bool = isNonNegativeInteger( 3.14 );
* // returns false
*
* bool = isNonNegativeInteger( null );
* // returns false
*
* @example
* var isNonNegativeInteger = require( '@stdlib/assert/is-nonnegative-integer' ).isPrimitive;
*
* var bool = isNonNegativeInteger( 3.0 );
* // returns true
*
* bool = isNonNegativeInteger( new Number( 3.0 ) );
* // returns false
*
* @example
* var isNonNegativeInteger = require( '@stdlib/assert/is-nonnegative-integer' ).isObject;
*
* var bool = isNonNegativeInteger( 3.0 );
* // returns false
*
* bool = isNonNegativeInteger( new Number( 3.0 ) );
* // returns true
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

setReadOnly( main, 'isPrimitive', isPrimitive );
setReadOnly( main, 'isObject', isObject );


// EXPORTS //

module.exports = main;

},{"./main.js":169,"./object.js":170,"./primitive.js":171,"@stdlib/utils/define-nonenumerable-read-only-property":285}],169:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

/**
* Tests if a value is a nonnegative integer.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a nonnegative integer
*
* @example
* var bool = isNonNegativeInteger( 5.0 );
* // returns true
*
* @example
* var bool = isNonNegativeInteger( new Number( 5.0 ) );
* // returns true
*
* @example
* var bool = isNonNegativeInteger( -5.0 );
* // returns false
*
* @example
* var bool = isNonNegativeInteger( 3.14 );
* // returns false
*
* @example
* var bool = isNonNegativeInteger( null );
* // returns false
*/
function isNonNegativeInteger( value ) {
	return ( isPrimitive( value ) || isObject( value ) );
}


// EXPORTS //

module.exports = isNonNegativeInteger;

},{"./object.js":170,"./primitive.js":171}],170:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInteger = require( './../../is-integer' ).isObject;


// MAIN //

/**
* Tests if a value is a number object having a nonnegative integer value.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number object having a nonnegative integer value
*
* @example
* var bool = isNonNegativeInteger( 3.0 );
* // returns false
*
* @example
* var bool = isNonNegativeInteger( new Number( 3.0 ) );
* // returns true
*/
function isNonNegativeInteger( value ) {
	return (
		isInteger( value ) &&
		value.valueOf() >= 0
	);
}


// EXPORTS //

module.exports = isNonNegativeInteger;

},{"./../../is-integer":163}],171:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInteger = require( './../../is-integer' ).isPrimitive;


// MAIN //

/**
* Tests if a value is a number primitive having a nonnegative integer value.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number primitive having a nonnegative integer value
*
* @example
* var bool = isNonNegativeInteger( 3.0 );
* // returns true
*
* @example
* var bool = isNonNegativeInteger( new Number( 3.0 ) );
* // returns false
*/
function isNonNegativeInteger( value ) {
	return (
		isInteger( value ) &&
		value >= 0
	);
}


// EXPORTS //

module.exports = isNonNegativeInteger;

},{"./../../is-integer":163}],172:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a number.
*
* @module @stdlib/assert/is-number
*
* @example
* var isNumber = require( '@stdlib/assert/is-number' );
*
* var bool = isNumber( 3.14 );
* // returns true
*
* bool = isNumber( new Number( 3.14 ) );
* // returns true
*
* bool = isNumber( NaN );
* // returns true
*
* bool = isNumber( null );
* // returns false
*
* @example
* var isNumber = require( '@stdlib/assert/is-number' ).isPrimitive;
*
* var bool = isNumber( 3.14 );
* // returns true
*
* bool = isNumber( NaN );
* // returns true
*
* bool = isNumber( new Number( 3.14 ) );
* // returns false
*
* @example
* var isNumber = require( '@stdlib/assert/is-number' ).isObject;
*
* var bool = isNumber( 3.14 );
* // returns false
*
* bool = isNumber( new Number( 3.14 ) );
* // returns true
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

setReadOnly( main, 'isPrimitive', isPrimitive );
setReadOnly( main, 'isObject', isObject );


// EXPORTS //

module.exports = main;

},{"./main.js":173,"./object.js":174,"./primitive.js":175,"@stdlib/utils/define-nonenumerable-read-only-property":285}],173:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

/**
* Tests if a value is a number.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a number
*
* @example
* var bool = isNumber( 3.14 );
* // returns true
*
* @example
* var bool = isNumber( new Number( 3.14 ) );
* // returns true
*
* @example
* var bool = isNumber( NaN );
* // returns true
*
* @example
* var bool = isNumber( null );
* // returns false
*/
function isNumber( value ) {
	return ( isPrimitive( value ) || isObject( value ) );
}


// EXPORTS //

module.exports = isNumber;

},{"./object.js":174,"./primitive.js":175}],174:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasToStringTag = require( './../../has-tostringtag-support' );
var nativeClass = require( '@stdlib/utils/native-class' );
var Number = require( '@stdlib/number/ctor' );
var test = require( './try2serialize.js' );


// VARIABLES //

var FLG = hasToStringTag();


// MAIN //

/**
* Tests if a value is a number object.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number object
*
* @example
* var bool = isNumber( 3.14 );
* // returns false
*
* @example
* var bool = isNumber( new Number( 3.14 ) );
* // returns true
*/
function isNumber( value ) {
	if ( typeof value === 'object' ) {
		if ( value instanceof Number ) {
			return true;
		}
		if ( FLG ) {
			return test( value );
		}
		return ( nativeClass( value ) === '[object Number]' );
	}
	return false;
}


// EXPORTS //

module.exports = isNumber;

},{"./../../has-tostringtag-support":117,"./try2serialize.js":177,"@stdlib/number/ctor":250,"@stdlib/utils/native-class":303}],175:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tests if a value is a number primitive.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number primitive
*
* @example
* var bool = isNumber( 3.14 );
* // returns true
*
* @example
* var bool = isNumber( NaN );
* // returns true
*
* @example
* var bool = isNumber( new Number( 3.14 ) );
* // returns false
*/
function isNumber( value ) {
	return ( typeof value === 'number' );
}


// EXPORTS //

module.exports = isNumber;

},{}],176:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Number = require( '@stdlib/number/ctor' );


// MAIN //

// eslint-disable-next-line stdlib/no-redeclare
var toString = Number.prototype.toString; // non-generic


// EXPORTS //

module.exports = toString;

},{"@stdlib/number/ctor":250}],177:[function(require,module,exports){
arguments[4][142][0].apply(exports,arguments)
},{"./tostring.js":176,"dup":142}],178:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is object-like.
*
* @module @stdlib/assert/is-object-like
*
* @example
* var isObjectLike = require( '@stdlib/assert/is-object-like' );
*
* var bool = isObjectLike( {} );
* // returns true
*
* bool = isObjectLike( [] );
* // returns true
*
* bool = isObjectLike( null );
* // returns false
*
* @example
* var isObjectLike = require( '@stdlib/assert/is-object-like' ).isObjectLikeArray;
*
* var bool = isObjectLike( [ {}, [] ] );
* // returns true
*
* bool = isObjectLike( [ {}, '3.0' ] );
* // returns false
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var arrayfun = require( './../../tools/array-function' );
var main = require( './main.js' );


// VARIABLES //

var isObjectLikeArray = arrayfun( main );


// MAIN //

setReadOnly( main, 'isObjectLikeArray', isObjectLikeArray );


// EXPORTS //

module.exports = main;

},{"./../../tools/array-function":197,"./main.js":179,"@stdlib/utils/define-nonenumerable-read-only-property":285}],179:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tests if a value is object-like.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether a value is object-like
*
* @example
* var bool = isObjectLike( {} );
* // returns true
*
* @example
* var bool = isObjectLike( [] );
* // returns true
*
* @example
* var bool = isObjectLike( null );
* // returns false
*/
function isObjectLike( value ) {
	return (
		value !== null &&
		typeof value === 'object'
	);
}


// EXPORTS //

module.exports = isObjectLike;

},{}],180:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an object.
*
* @module @stdlib/assert/is-object
*
* @example
* var isObject = require( '@stdlib/assert/is-object' );
*
* var bool = isObject( {} );
* // returns true
*
* bool = isObject( true );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":181}],181:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isArray = require( './../../is-array' );


// MAIN //

/**
* Tests if a value is an object; e.g., `{}`.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is an object
*
* @example
* var bool = isObject( {} );
* // returns true
*
* @example
* var bool = isObject( null );
* // returns false
*/
function isObject( value ) {
	return (
		typeof value === 'object' &&
		value !== null &&
		!isArray( value )
	);
}


// EXPORTS //

module.exports = isObject;

},{"./../../is-array":133}],182:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is an array of strings.
*
* @module @stdlib/assert/is-string-array
*
* @example
* var isStringArray = require( '@stdlib/assert/is-string-array' );
*
* var bool = isStringArray( [ 'abc', 'def' ] );
* // returns true
*
* bool = isStringArray( [ 'abc', 123 ] );
* // returns false
*
* @example
* var isStringArray = require( '@stdlib/assert/is-string-array' ).primitives;
*
* var bool = isStringArray( [ 'abc', 'def' ] );
* // returns true
*
* bool = isStringArray( [ 'abc', new String( 'def' ) ] );
* // returns false
*
* @example
* var isStringArray = require( '@stdlib/assert/is-string-array' ).objects;
*
* var bool = isStringArray( [ new String( 'abc' ), new String( 'def' ) ] );
* // returns true
*
* bool = isStringArray( [ new String( 'abc' ), 'def' ] );
* // returns false
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var arrayfun = require( './../../tools/array-function' );
var isString = require( './../../is-string' );


// VARIABLES //

var isPrimitiveArray = arrayfun( isString.isPrimitive );
var isObjectArray = arrayfun( isString.isObject );


// MAIN //

var isStringArray = arrayfun( isString );
setReadOnly( isStringArray, 'primitives', isPrimitiveArray );
setReadOnly( isStringArray, 'objects', isObjectArray );


// EXPORTS //

module.exports = isStringArray;

},{"./../../is-string":183,"./../../tools/array-function":197,"@stdlib/utils/define-nonenumerable-read-only-property":285}],183:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a string.
*
* @module @stdlib/assert/is-string
*
* @example
* var isString = require( '@stdlib/assert/is-string' );
*
* var bool = isString( 'beep' );
* // returns true
*
* bool = isString( new String( 'beep' ) );
* // returns true
*
* bool = isString( 5 );
* // returns false
*
* @example
* var isString = require( '@stdlib/assert/is-string' ).isObject;
*
* var bool = isString( new String( 'beep' ) );
* // returns true
*
* bool = isString( 'beep' );
* // returns false
*
* @example
* var isString = require( '@stdlib/assert/is-string' ).isPrimitive;
*
* var bool = isString( 'beep' );
* // returns true
*
* bool = isString( new String( 'beep' ) );
* // returns false
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

setReadOnly( main, 'isPrimitive', isPrimitive );
setReadOnly( main, 'isObject', isObject );


// EXPORTS //

module.exports = main;

},{"./main.js":184,"./object.js":185,"./primitive.js":186,"@stdlib/utils/define-nonenumerable-read-only-property":285}],184:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isPrimitive = require( './primitive.js' );
var isObject = require( './object.js' );


// MAIN //

/**
* Tests if a value is a string.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a string
*
* @example
* var bool = isString( new String( 'beep' ) );
* // returns true
*
* @example
* var bool = isString( 'beep' );
* // returns true
*/
function isString( value ) {
	return ( isPrimitive( value ) || isObject( value ) );
}


// EXPORTS //

module.exports = isString;

},{"./object.js":185,"./primitive.js":186}],185:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasToStringTag = require( './../../has-tostringtag-support' );
var nativeClass = require( '@stdlib/utils/native-class' );
var test = require( './try2valueof.js' );


// VARIABLES //

var FLG = hasToStringTag();


// MAIN //

/**
* Tests if a value is a string object.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a string object
*
* @example
* var bool = isString( new String( 'beep' ) );
* // returns true
*
* @example
* var bool = isString( 'beep' );
* // returns false
*/
function isString( value ) {
	if ( typeof value === 'object' ) {
		if ( value instanceof String ) {
			return true;
		}
		if ( FLG ) {
			return test( value );
		}
		return ( nativeClass( value ) === '[object String]' );
	}
	return false;
}


// EXPORTS //

module.exports = isString;

},{"./../../has-tostringtag-support":117,"./try2valueof.js":187,"@stdlib/utils/native-class":303}],186:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tests if a value is a string primitive.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a string primitive
*
* @example
* var bool = isString( 'beep' );
* // returns true
*
* @example
* var bool = isString( new String( 'beep' ) );
* // returns false
*/
function isString( value ) {
	return ( typeof value === 'string' );
}


// EXPORTS //

module.exports = isString;

},{}],187:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var valueOf = require( './valueof.js' ); // eslint-disable-line stdlib/no-redeclare


// MAIN //

/**
* Attempts to extract a string value.
*
* @private
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a string can be extracted
*/
function test( value ) {
	try {
		valueOf.call( value );
		return true;
	} catch ( err ) { // eslint-disable-line no-unused-vars
		return false;
	}
}


// EXPORTS //

module.exports = test;

},{"./valueof.js":188}],188:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// eslint-disable-next-line stdlib/no-redeclare
var valueOf = String.prototype.valueOf; // non-generic


// EXPORTS //

module.exports = valueOf;

},{}],189:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Uint16Array.
*
* @module @stdlib/assert/is-uint16array
*
* @example
* var isUint16Array = require( '@stdlib/assert/is-uint16array' );
*
* var bool = isUint16Array( new Uint16Array( 10 ) );
* // returns true
*
* bool = isUint16Array( [] );
* // returns false
*/

// MODULES //

var isUint16Array = require( './main.js' );


// EXPORTS //

module.exports = isUint16Array;

},{"./main.js":190}],190:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasUint16Array = ( typeof Uint16Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is a Uint16Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a Uint16Array
*
* @example
* var bool = isUint16Array( new Uint16Array( 10 ) );
* // returns true
*
* @example
* var bool = isUint16Array( [] );
* // returns false
*/
function isUint16Array( value ) {
	return (
		( hasUint16Array && value instanceof Uint16Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Uint16Array]'
	);
}


// EXPORTS //

module.exports = isUint16Array;

},{"@stdlib/utils/native-class":303}],191:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Uint32Array.
*
* @module @stdlib/assert/is-uint32array
*
* @example
* var isUint32Array = require( '@stdlib/assert/is-uint32array' );
*
* var bool = isUint32Array( new Uint32Array( 10 ) );
* // returns true
*
* bool = isUint32Array( [] );
* // returns false
*/

// MODULES //

var isUint32Array = require( './main.js' );


// EXPORTS //

module.exports = isUint32Array;

},{"./main.js":192}],192:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasUint32Array = ( typeof Uint32Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is a Uint32Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a Uint32Array
*
* @example
* var bool = isUint32Array( new Uint32Array( 10 ) );
* // returns true
*
* @example
* var bool = isUint32Array( [] );
* // returns false
*/
function isUint32Array( value ) {
	return (
		( hasUint32Array && value instanceof Uint32Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Uint32Array]'
	);
}


// EXPORTS //

module.exports = isUint32Array;

},{"@stdlib/utils/native-class":303}],193:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Uint8Array.
*
* @module @stdlib/assert/is-uint8array
*
* @example
* var isUint8Array = require( '@stdlib/assert/is-uint8array' );
*
* var bool = isUint8Array( new Uint8Array( 10 ) );
* // returns true
*
* bool = isUint8Array( [] );
* // returns false
*/

// MODULES //

var isUint8Array = require( './main.js' );


// EXPORTS //

module.exports = isUint8Array;

},{"./main.js":194}],194:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasUint8Array = ( typeof Uint8Array === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is a Uint8Array.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a Uint8Array
*
* @example
* var bool = isUint8Array( new Uint8Array( 10 ) );
* // returns true
*
* @example
* var bool = isUint8Array( [] );
* // returns false
*/
function isUint8Array( value ) {
	return (
		( hasUint8Array && value instanceof Uint8Array ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Uint8Array]'
	);
}


// EXPORTS //

module.exports = isUint8Array;

},{"@stdlib/utils/native-class":303}],195:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a value is a Uint8ClampedArray.
*
* @module @stdlib/assert/is-uint8clampedarray
*
* @example
* var isUint8ClampedArray = require( '@stdlib/assert/is-uint8clampedarray' );
*
* var bool = isUint8ClampedArray( new Uint8ClampedArray( 10 ) );
* // returns true
*
* bool = isUint8ClampedArray( [] );
* // returns false
*/

// MODULES //

var isUint8ClampedArray = require( './main.js' );


// EXPORTS //

module.exports = isUint8ClampedArray;

},{"./main.js":196}],196:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( '@stdlib/utils/native-class' );


// VARIABLES //

var hasUint8ClampedArray = ( typeof Uint8ClampedArray === 'function' ); // eslint-disable-line stdlib/require-globals


// MAIN //

/**
* Tests if a value is a Uint8ClampedArray.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating whether value is a Uint8ClampedArray
*
* @example
* var bool = isUint8ClampedArray( new Uint8ClampedArray( 10 ) );
* // returns true
*
* @example
* var bool = isUint8ClampedArray( [] );
* // returns false
*/
function isUint8ClampedArray( value ) {
	return (
		( hasUint8ClampedArray && value instanceof Uint8ClampedArray ) || // eslint-disable-line stdlib/require-globals
		nativeClass( value ) === '[object Uint8ClampedArray]'
	);
}


// EXPORTS //

module.exports = isUint8ClampedArray;

},{"@stdlib/utils/native-class":303}],197:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return a function which tests if every element in an array passes a test condition.
*
* @module @stdlib/assert/tools/array-function
*
* @example
* var isOdd = require( '@stdlib/assert/is-odd' );
* var arrayfcn = require( '@stdlib/assert/tools/array-function' );
*
* var arr1 = [ 1, 3, 5, 7 ];
* var arr2 = [ 3, 5, 8 ];
*
* var validate = arrayfcn( isOdd );
*
* var bool = validate( arr1 );
* // returns true
*
* bool = validate( arr2 );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":198}],198:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isArray = require( './../../../is-array' );
var format = require( '@stdlib/string/format' );


// MAIN //

/**
* Returns a function which tests if every element in an array passes a test condition.
*
* @param {Function} predicate - function to apply
* @throws {TypeError} must provide a function
* @returns {Function} an array function
*
* @example
* var isOdd = require( '@stdlib/assert/is-odd' );
*
* var arr1 = [ 1, 3, 5, 7 ];
* var arr2 = [ 3, 5, 8 ];
*
* var validate = arrayfcn( isOdd );
*
* var bool = validate( arr1 );
* // returns true
*
* bool = validate( arr2 );
* // returns false
*/
function arrayfcn( predicate ) {
	if ( typeof predicate !== 'function' ) {
		throw new TypeError( format( 'invalid argument. Must provide a function. Value: `%s`.', predicate ) );
	}
	return every;

	/**
	* Tests if every element in an array passes a test condition.
	*
	* @private
	* @param {*} value - value to test
	* @returns {boolean} boolean indicating whether a value is an array for which all elements pass a test condition
	*/
	function every( value ) {
		var len;
		var i;
		if ( !isArray( value ) ) {
			return false;
		}
		len = value.length;
		if ( len === 0 ) {
			return false;
		}
		for ( i = 0; i < len; i++ ) {
			if ( predicate( value[ i ] ) === false ) {
				return false;
			}
		}
		return true;
	}
}


// EXPORTS //

module.exports = arrayfcn;

},{"./../../../is-array":133,"@stdlib/string/format":274}],199:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test whether an input value is a BLAS memory layout.
*
* @module @stdlib/blas/base/assert/is-layout
*
* @example
* var isLayout = require( '@stdlib/blas/base/assert/is-layout' );
*
* var bool = isLayout( 'row-major' );
* // returns true
*
* bool = isLayout( 'column-major' );
* // returns true
*
* bool = isLayout( 'foo' );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":200}],200:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var contains = require( '@stdlib/array/base/assert/contains' ).factory;
var layouts = require( './../../../../base/layouts' );


// MAIN //

/**
* Tests whether an input value is a BLAS memory layout.
*
* @name isLayout
* @type {Function}
* @param {*} v - value to test
* @returns {boolean} boolean indicating whether an input value is a memory layout
*
* @example
* var bool = isLayout( 'row-major' );
* // returns true
*
* bool = isLayout( 'column-major' );
* // returns true
*
* bool = isLayout( 'foo' );
* // returns false
*/
var isLayout = contains( layouts() );


// EXPORTS //

module.exports = isLayout;

},{"./../../../../base/layouts":205,"@stdlib/array/base/assert/contains":39}],201:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test whether an input value is a BLAS transpose operation.
*
* @module @stdlib/blas/base/assert/is-transpose-operation
*
* @example
* var isTransposeOperation = require( '@stdlib/blas/base/assert/is-transpose-operation' );
*
* var bool = isTransposeOperation( 'transpose' );
* // returns true
*
* bool = isTransposeOperation( 'conjugate-transpose' );
* // returns true
*
* bool = isTransposeOperation( 'foo' );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":202}],202:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var contains = require( '@stdlib/array/base/assert/contains' ).factory;
var ops = require( './../../../../base/transpose-operations' );


// MAIN //

/**
* Tests whether an input value is a BLAS transpose operation.
*
* @name isTransposeOperation
* @type {Function}
* @param {*} v - value to test
* @returns {boolean} boolean indicating whether an input value is a transpose operation
*
* @example
* var bool = isTransposeOperation( 'transpose' );
* // returns true
*
* bool = isTransposeOperation( 'conjugate-transpose' );
* // returns true
*
* bool = isTransposeOperation( 'foo' );
* // returns false
*/
var isTransposeOperation = contains( ops() );


// EXPORTS //

module.exports = isTransposeOperation;

},{"./../../../../base/transpose-operations":209,"@stdlib/array/base/assert/contains":39}],203:[function(require,module,exports){
module.exports=[
  "row-major",
  "column-major"
]

},{}],204:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns an object mapping supported layouts to integer values for purposes of C inter-operation.
*
* ## Notes
*
* -   Downstream consumers of this mapping should **not** rely on specific integer values (e.g., `row-major == 101`). Instead, the object should be used in an opaque manner.
* -   The main purpose of this function is JavaScript and C inter-operation of array objects.
*
* @returns {Object} object mapping supported layouts to integer values
*
* @example
* var table = enumerated();
* // returns <Object>
*/
function enumerated() {
	// NOTE: the following should match the C `layouts.h` enumeration!!!!
	return {
		// Row-major (C-style):
		'row-major': 101,

		// Column-major (Fortran-style):
		'column-major': 102
	};
}


// EXPORTS //

module.exports = enumerated;

},{}],205:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return a list of BLAS memory layouts.
*
* @module @stdlib/blas/base/layouts
*
* @example
* var layouts = require( '@stdlib/blas/base/layouts' );
*
* var list = layouts();
* // e.g., returns [ 'row-major', 'column-major' ]
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var enumeration = require( './enum.js' );


// MAIN //

setReadOnly( main, 'enum', enumeration );


// EXPORTS //

module.exports = main;

},{"./enum.js":204,"./main.js":206,"@stdlib/utils/define-nonenumerable-read-only-property":285}],206:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var DATA = require( './data.json' );


// MAIN //

/**
* Returns a list of BLAS memory layouts.
*
* @returns {StringArray} list of memory layouts
*
* @example
* var list = layouts();
* // e.g., returns [ 'row-major', 'column-major' ]
*/
function layouts() {
	return DATA.slice();
}


// EXPORTS //

module.exports = layouts;

},{"./data.json":203}],207:[function(require,module,exports){
module.exports=[
  "no-transpose",
  "transpose",
  "conjugate-transpose"
]

},{}],208:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns an object mapping supported transpose operations to integer values for purposes of C inter-operation.
*
* ## Notes
*
* -   Downstream consumers of this mapping should **not** rely on specific integer values (e.g., `transpose == 112`). Instead, the object should be used in an opaque manner.
* -   The main purpose of this function is JavaScript and C inter-operation of array objects.
*
* @returns {Object} object mapping supported transpose operations to integer values
*
* @example
* var table = enumerated();
* // returns <Object>
*/
function enumerated() {
	// NOTE: the following should match the C `transpose_operations.h` enumeration!!!!
	return {
		// No transposition:
		'no-transpose': 111,

		// Transposition:
		'transpose': 112,

		// Conjugate transposition:
		'conjugate-transpose': 113
	};
}


// EXPORTS //

module.exports = enumerated;

},{}],209:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return a list of BLAS transpose operations.
*
* @module @stdlib/blas/base/transpose-operations
*
* @example
* var transposeOperations = require( '@stdlib/blas/base/transpose-operations' );
*
* var list = transposeOperations();
* // e.g., returns [ 'no-transpose', 'transpose', 'conjugate-transpose' ]
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var enumeration = require( './enum.js' );


// MAIN //

setReadOnly( main, 'enum', enumeration );


// EXPORTS //

module.exports = main;

},{"./enum.js":208,"./main.js":210,"@stdlib/utils/define-nonenumerable-read-only-property":285}],210:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var DATA = require( './data.json' );


// MAIN //

/**
* Returns a list of BLAS transpose operations.
*
* @returns {StringArray} list of transpose operations
*
* @example
* var list = layouts();
* // e.g., returns [ 'no-transpose', 'transpose', 'conjugate-transpose' ]
*/
function layouts() {
	return DATA.slice();
}


// EXPORTS //

module.exports = layouts;

},{"./data.json":207}],211:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Boolean constructor.
*
* @module @stdlib/boolean/ctor
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
*
* var b = Boolean( null );
* // returns false
*
* b = Boolean( [] );
* // returns true
*
* b = Boolean( {} );
* // returns true
*
* @example
* var Boolean = require( '@stdlib/boolean/ctor' );
*
* var b = new Boolean( false );
* // returns <Boolean>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":212}],212:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns a boolean.
*
* @name Boolean
* @constructor
* @type {Function}
* @param {*} value - input value
* @returns {(boolean|Boolean)} boolean
*
* @example
* var b = Boolean( null );
* // returns false
*
* b = Boolean( [] );
* // returns true
*
* b = Boolean( {} );
* // returns true
*
* @example
* var b = new Boolean( false );
* // returns <Boolean>
*/
var Bool = Boolean; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = Bool;

},{}],213:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* 64-bit complex number constructor.
*
* @module @stdlib/complex/float32/ctor
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var z = new Complex64( 5.0, 3.0 );
* // returns <Complex64>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":214}],214:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNumber = require( '@stdlib/assert/is-number' ).isPrimitive;
var defineProperty = require( '@stdlib/utils/define-property' );
var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var float64ToFloat32 = require( '@stdlib/number/float64/base/to-float32' );
var format = require( '@stdlib/string/format' );
var toStr = require( './tostring.js' );
var toJSON = require( './tojson.js' );


// MAIN //

/**
* 64-bit complex number constructor.
*
* @constructor
* @param {number} real - real component
* @param {number} imag - imaginary component
* @throws {TypeError} must invoke using the `new` keyword
* @throws {TypeError} real component must be a number
* @throws {TypeError} imaginary component must be a number
* @returns {Complex64} 64-bit complex number
*
* @example
* var z = new Complex64( 5.0, 3.0 );
* // returns <Complex64>
*/
function Complex64( real, imag ) {
	if ( !( this instanceof Complex64 ) ) {
		throw new TypeError( 'invalid invocation. Constructor must be called with the `new` keyword.' );
	}
	if ( !isNumber( real ) ) {
		throw new TypeError( format( 'invalid argument. Real component must be a number. Value: `%s`.', real ) );
	}
	if ( !isNumber( imag ) ) {
		throw new TypeError( format( 'invalid argument. Imaginary component must be a number. Value: `%s`.', imag ) );
	}
	defineProperty( this, 're', {
		'configurable': false,
		'enumerable': true,
		'writable': false,
		'value': float64ToFloat32( real )
	});
	defineProperty( this, 'im', {
		'configurable': false,
		'enumerable': true,
		'writable': false,
		'value': float64ToFloat32( imag )
	});
	return this;
}

/**
* Size (in bytes) of each component.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex64
* @type {integer}
* @returns {integer} size of each component
*
* @example
* var nbytes = Complex64.BYTES_PER_ELEMENT;
* // returns 4
*/
setReadOnly( Complex64, 'BYTES_PER_ELEMENT', 4 );

/**
* Size (in bytes) of each component.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex64.prototype
* @type {integer}
* @returns {integer} size of each component
*
* @example
* var z = new Complex64( 5.0, 3.0 );
*
* var nbytes = z.BYTES_PER_ELEMENT;
* // returns 4
*/
setReadOnly( Complex64.prototype, 'BYTES_PER_ELEMENT', 4 );

/**
* Length (in bytes) of a complex number.
*
* @name byteLength
* @memberof Complex64.prototype
* @type {integer}
* @returns {integer} byte length
*
* @example
* var z = new Complex64( 5.0, 3.0 );
*
* var nbytes = z.byteLength;
* // returns 8
*/
setReadOnly( Complex64.prototype, 'byteLength', 8 );

/**
* Serializes a complex number as a string.
*
* @name toString
* @memberof Complex64.prototype
* @type {Function}
* @returns {string} serialized complex number
*
* @example
* var z = new Complex64( 5.0, 3.0 );
*
* var str = z.toString();
* // returns '5 + 3i'
*/
setReadOnly( Complex64.prototype, 'toString', toStr );

/**
* Serializes a complex number as a JSON object.
*
* ## Notes
*
* -   `JSON.stringify()` implicitly calls this method when stringifying a `Complex64` instance.
*
* @name toJSON
* @memberof Complex64.prototype
* @type {Function}
* @returns {Object} serialized complex number
*
* @example
* var z = new Complex64( 5.0, 3.0 );
*
* var obj = z.toJSON();
* // returns { 'type': 'Complex64', 're': 5.0, 'im': 3.0 }
*/
setReadOnly( Complex64.prototype, 'toJSON', toJSON );


// EXPORTS //

module.exports = Complex64;

},{"./tojson.js":215,"./tostring.js":216,"@stdlib/assert/is-number":172,"@stdlib/number/float64/base/to-float32":252,"@stdlib/string/format":274,"@stdlib/utils/define-nonenumerable-read-only-property":285,"@stdlib/utils/define-property":290}],215:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Serializes a complex number as a JSON object.
*
* @private
* @returns {Object} JSON representation
*/
function toJSON() {
	/* eslint-disable no-invalid-this */
	var out = {};
	out.type = 'Complex64';
	out.re = this.re;
	out.im = this.im;
	return out;
}


// EXPORTS //

module.exports = toJSON;

},{}],216:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Serializes a complex number as a string.
*
* @private
* @returns {string} serialized complex number
*/
function toString() { // eslint-disable-line stdlib/no-redeclare
	/* eslint-disable no-invalid-this */
	var str = '' + this.re;
	if ( this.im < 0 ) {
		str += ' - ' + (-this.im);
	} else {
		str += ' + ' + this.im;
	}
	str += 'i';
	return str;
}


// EXPORTS //

module.exports = toString;

},{}],217:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the imaginary component of a single-precision complex floating-point number.
*
* @module @stdlib/complex/float32/imag
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var imag = require( '@stdlib/complex/float32/imag' );
*
* var z = new Complex64( 5.0, 3.0 );
*
* var im = imag( z );
* // returns 3.0
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":218}],218:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Returns the imaginary component of a single-precision complex floating-point number.
*
* @param {Complex} z - complex number
* @returns {number} imaginary component
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var z = new Complex64( 5.0, 3.0 );
*
* var im = imag( z );
* // returns 3.0
*/
function imag( z ) {
	return z.im;
}


// EXPORTS //

module.exports = imag;

},{}],219:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the real component of a single-precision complex floating-point number.
*
* @module @stdlib/complex/float32/real
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
* var real = require( '@stdlib/complex/float32/real' );
*
* var z = new Complex64( 5.0, 3.0 );
*
* var re = real( z );
* // returns 5.0
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":220}],220:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Returns the real component of a single-precision complex floating-point number.
*
* @param {Complex} z - complex number
* @returns {number} real component
*
* @example
* var Complex64 = require( '@stdlib/complex/float32/ctor' );
*
* var z = new Complex64( 5.0, 3.0 );
*
* var re = real( z );
* // returns 5.0
*/
function real( z ) {
	return z.re;
}


// EXPORTS //

module.exports = real;

},{}],221:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* 128-bit complex number constructor.
*
* @module @stdlib/complex/float64/ctor
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var z = new Complex128( 5.0, 3.0 );
* // returns <Complex128>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":222}],222:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNumber = require( '@stdlib/assert/is-number' ).isPrimitive;
var defineProperty = require( '@stdlib/utils/define-property' );
var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var format = require( '@stdlib/string/format' );
var toStr = require( './tostring.js' );
var toJSON = require( './tojson.js' );


// MAIN //

/**
* 128-bit complex number constructor.
*
* @constructor
* @param {number} real - real component
* @param {number} imag - imaginary component
* @throws {TypeError} must invoke using the `new` keyword
* @throws {TypeError} real component must be a number
* @throws {TypeError} imaginary component must be a number
* @returns {Complex128} 128-bit complex number
*
* @example
* var z = new Complex128( 5.0, 3.0 );
* // returns <Complex128>
*/
function Complex128( real, imag ) {
	if ( !( this instanceof Complex128 ) ) {
		throw new TypeError( 'invalid invocation. Constructor must be called with the `new` keyword.' );
	}
	if ( !isNumber( real ) ) {
		throw new TypeError( format( 'invalid argument. Real component must be a number. Value: `%s`.', real ) );
	}
	if ( !isNumber( imag ) ) {
		throw new TypeError( format( 'invalid argument. Imaginary component must be a number. Value: `%s`.', imag ) );
	}
	defineProperty( this, 're', {
		'configurable': false,
		'enumerable': true,
		'writable': false,
		'value': real
	});
	defineProperty( this, 'im', {
		'configurable': false,
		'enumerable': true,
		'writable': false,
		'value': imag
	});
	return this;
}

/**
* Size (in bytes) of each component.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex128
* @type {integer}
* @returns {integer} size of each component
*
* @example
* var nbytes = Complex128.BYTES_PER_ELEMENT;
* // returns 8
*/
setReadOnly( Complex128, 'BYTES_PER_ELEMENT', 8 );

/**
* Size (in bytes) of each component.
*
* @name BYTES_PER_ELEMENT
* @memberof Complex128.prototype
* @type {integer}
* @returns {integer} size of each component
*
* @example
* var z = new Complex128( 5.0, 3.0 );
*
* var nbytes = z.BYTES_PER_ELEMENT;
* // returns 8
*/
setReadOnly( Complex128.prototype, 'BYTES_PER_ELEMENT', 8 );

/**
* Length (in bytes) of a complex number.
*
* @name byteLength
* @memberof Complex128.prototype
* @type {integer}
* @returns {integer} byte length
*
* @example
* var z = new Complex128( 5.0, 3.0 );
*
* var nbytes = z.byteLength;
* // returns 16
*/
setReadOnly( Complex128.prototype, 'byteLength', 16 );

/**
* Serializes a complex number as a string.
*
* @name toString
* @memberof Complex128.prototype
* @type {Function}
* @returns {string} serialized complex number
*
* @example
* var z = new Complex128( 5.0, 3.0 );
*
* var str = z.toString();
* // returns '5 + 3i'
*/
setReadOnly( Complex128.prototype, 'toString', toStr );

/**
* Serializes a complex number as a JSON object.
*
* ## Notes
*
* -   `JSON.stringify()` implicitly calls this method when stringifying a `Complex128` instance.
*
* @name toJSON
* @memberof Complex128.prototype
* @type {Function}
* @returns {Object} serialized complex number
*
* @example
* var z = new Complex128( 5.0, 3.0 );
*
* var obj = z.toJSON();
* // returns { 'type': 'Complex128', 're': 5.0, 'im': 3.0 }
*/
setReadOnly( Complex128.prototype, 'toJSON', toJSON );


// EXPORTS //

module.exports = Complex128;

},{"./tojson.js":223,"./tostring.js":224,"@stdlib/assert/is-number":172,"@stdlib/string/format":274,"@stdlib/utils/define-nonenumerable-read-only-property":285,"@stdlib/utils/define-property":290}],223:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Serializes a complex number as a JSON object.
*
* @private
* @returns {Object} JSON representation
*/
function toJSON() {
	/* eslint-disable no-invalid-this */
	var out = {};
	out.type = 'Complex128';
	out.re = this.re;
	out.im = this.im;
	return out;
}


// EXPORTS //

module.exports = toJSON;

},{}],224:[function(require,module,exports){
arguments[4][216][0].apply(exports,arguments)
},{"dup":216}],225:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the imaginary component of a double-precision complex floating-point number.
*
* @module @stdlib/complex/float64/imag
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var imag = require( '@stdlib/complex/float64/imag' );
*
* var z = new Complex128( 5.0, 3.0 );
*
* var im = imag( z );
* // returns 3.0
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":226}],226:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Returns the imaginary component of a double-precision complex floating-point number.
*
* @param {Complex} z - complex number
* @returns {number} imaginary component
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var z = new Complex128( 5.0, 3.0 );
*
* var im = imag( z );
* // returns 3.0
*/
function imag( z ) {
	return z.im;
}


// EXPORTS //

module.exports = imag;

},{}],227:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the real component of a double-precision complex floating-point number.
*
* @module @stdlib/complex/float64/real
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
* var real = require( '@stdlib/complex/float64/real' );
*
* var z = new Complex128( 5.0, 3.0 );
*
* var re = real( z );
* // returns 5.0
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":228}],228:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Returns the real component of a double-precision complex floating-point number.
*
* @param {Complex} z - complex number
* @returns {number} real component
*
* @example
* var Complex128 = require( '@stdlib/complex/float64/ctor' );
*
* var z = new Complex128( 5.0, 3.0 );
*
* var re = real( z );
* // returns 5.0
*/
function real( z ) {
	return z.re;
}


// EXPORTS //

module.exports = real;

},{}],229:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum length of a generic array.
*
* @module @stdlib/constants/array/max-array-length
*
* @example
* var MAX_ARRAY_LENGTH = require( '@stdlib/constants/array/max-array-length' );
* // returns 4294967295
*/

// MAIN //

/**
* Maximum length of a generic array.
*
* ```tex
* 2^{32} - 1
* ```
*
* @constant
* @type {uinteger32}
* @default 4294967295
*/
var MAX_ARRAY_LENGTH = 4294967295>>>0; // asm type annotation


// EXPORTS //

module.exports = MAX_ARRAY_LENGTH;

},{}],230:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum length of a typed array.
*
* @module @stdlib/constants/array/max-typed-array-length
*
* @example
* var MAX_TYPED_ARRAY_LENGTH = require( '@stdlib/constants/array/max-typed-array-length' );
* // returns 9007199254740991
*/

// MAIN //

/**
* Maximum length of a typed array.
*
* ```tex
* 2^{53} - 1
* ```
*
* @constant
* @type {number}
* @default 9007199254740991
*/
var MAX_TYPED_ARRAY_LENGTH = 9007199254740991;


// EXPORTS //

module.exports = MAX_TYPED_ARRAY_LENGTH;

},{}],231:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Double-precision floating-point negative infinity.
*
* @module @stdlib/constants/float64/ninf
* @type {number}
*
* @example
* var FLOAT64_NINF = require( '@stdlib/constants/float64/ninf' );
* // returns -Infinity
*/

// MODULES //

var Number = require( '@stdlib/number/ctor' );


// MAIN //

/**
* Double-precision floating-point negative infinity.
*
* ## Notes
*
* Double-precision floating-point negative infinity has the bit sequence
*
* ```binarystring
* 1 11111111111 00000000000000000000 00000000000000000000000000000000
* ```
*
* @constant
* @type {number}
* @default Number.NEGATIVE_INFINITY
* @see [IEEE 754]{@link https://en.wikipedia.org/wiki/IEEE_754-1985}
*/
var FLOAT64_NINF = Number.NEGATIVE_INFINITY;


// EXPORTS //

module.exports = FLOAT64_NINF;

},{"@stdlib/number/ctor":250}],232:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Double-precision floating-point positive infinity.
*
* @module @stdlib/constants/float64/pinf
* @type {number}
*
* @example
* var FLOAT64_PINF = require( '@stdlib/constants/float64/pinf' );
* // returns Infinity
*/


// MAIN //

/**
* Double-precision floating-point positive infinity.
*
* ## Notes
*
* Double-precision floating-point positive infinity has the bit sequence
*
* ```binarystring
* 0 11111111111 00000000000000000000 00000000000000000000000000000000
* ```
*
* @constant
* @type {number}
* @default Number.POSITIVE_INFINITY
* @see [IEEE 754]{@link https://en.wikipedia.org/wiki/IEEE_754-1985}
*/
var FLOAT64_PINF = Number.POSITIVE_INFINITY; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = FLOAT64_PINF;

},{}],233:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum signed 16-bit integer.
*
* @module @stdlib/constants/int16/max
* @type {integer32}
*
* @example
* var INT16_MAX = require( '@stdlib/constants/int16/max' );
* // returns 32767
*/


// MAIN //

/**
* Maximum signed 16-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* 2^{15} - 1
* ```
*
* which corresponds to the bit sequence
*
* ```binarystring
* 0111111111111111
* ```
*
* @constant
* @type {integer32}
* @default 32767
*/
var INT16_MAX = 32767|0; // asm type annotation


// EXPORTS //

module.exports = INT16_MAX;

},{}],234:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Minimum signed 16-bit integer.
*
* @module @stdlib/constants/int16/min
* @type {integer32}
*
* @example
* var INT16_MIN = require( '@stdlib/constants/int16/min' );
* // returns -32768
*/


// MAIN //

/**
* Minimum signed 16-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* -(2^{15})
* ```
*
* which corresponds to the two's complement bit sequence
*
* ```binarystring
* 1000000000000000
* ```
*
* @constant
* @type {integer32}
* @default -32768
*/
var INT16_MIN = -32768|0; // asm type annotation


// EXPORTS //

module.exports = INT16_MIN;

},{}],235:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum signed 32-bit integer.
*
* @module @stdlib/constants/int32/max
* @type {integer32}
*
* @example
* var INT32_MAX = require( '@stdlib/constants/int32/max' );
* // returns 2147483647
*/


// MAIN //

/**
* Maximum signed 32-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* 2^{31} - 1
* ```
*
* which corresponds to the bit sequence
*
* ```binarystring
* 01111111111111111111111111111111
* ```
*
* @constant
* @type {integer32}
* @default 2147483647
*/
var INT32_MAX = 2147483647|0; // asm type annotation


// EXPORTS //

module.exports = INT32_MAX;

},{}],236:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Minimum signed 32-bit integer.
*
* @module @stdlib/constants/int32/min
* @type {integer32}
*
* @example
* var INT32_MIN = require( '@stdlib/constants/int32/min' );
* // returns -2147483648
*/


// MAIN //

/**
* Minimum signed 32-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* -(2^{31})
* ```
*
* which corresponds to the two's complement bit sequence
*
* ```binarystring
* 10000000000000000000000000000000
* ```
*
* @constant
* @type {integer32}
* @default -2147483648
*/
var INT32_MIN = -2147483648|0; // asm type annotation


// EXPORTS //

module.exports = INT32_MIN;

},{}],237:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum signed 8-bit integer.
*
* @module @stdlib/constants/int8/max
* @type {integer32}
*
* @example
* var INT8_MAX = require( '@stdlib/constants/int8/max' );
* // returns 127
*/


// MAIN //

/**
* Maximum signed 8-bit integer.
*
* ## Notes
*
* The number is given by
*
* ```tex
* 2^{7} - 1
* ```
*
* which corresponds to the bit sequence
*
* ```binarystring
* 01111111
* ```
*
* @constant
* @type {integer32}
* @default 127
*/
var INT8_MAX = 127|0; // asm type annotation


// EXPORTS //

module.exports = INT8_MAX;

},{}],238:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Minimum signed 8-bit integer.
*
* @module @stdlib/constants/int8/min
* @type {integer32}
*
* @example
* var INT8_MIN = require( '@stdlib/constants/int8/min' );
* // returns -128
*/


// MAIN //

/**
* Minimum signed 8-bit integer.
*
* ## Notes
*
* The number is given by
*
* ```tex
* -(2^{7})
* ```
*
* which corresponds to the two's complement bit sequence
*
* ```binarystring
* 10000000
* ```
*
* @constant
* @type {integer32}
* @default -128
*/
var INT8_MIN = -128|0; // asm type annotation


// EXPORTS //

module.exports = INT8_MIN;

},{}],239:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum unsigned 16-bit integer.
*
* @module @stdlib/constants/uint16/max
* @type {integer32}
*
* @example
* var UINT16_MAX = require( '@stdlib/constants/uint16/max' );
* // returns 65535
*/


// MAIN //

/**
* Maximum unsigned 16-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* 2^{16} - 1
* ```
*
* which corresponds to the bit sequence
*
* ```binarystring
* 1111111111111111
* ```
*
* @constant
* @type {integer32}
* @default 65535
*/
var UINT16_MAX = 65535|0; // asm type annotation


// EXPORTS //

module.exports = UINT16_MAX;

},{}],240:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum unsigned 32-bit integer.
*
* @module @stdlib/constants/uint32/max
* @type {uinteger32}
*
* @example
* var UINT32_MAX = require( '@stdlib/constants/uint32/max' );
* // returns 4294967295
*/


// MAIN //

/**
* Maximum unsigned 32-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* 2^{32} - 1
* ```
*
* which corresponds to the bit sequence
*
* ```binarystring
* 11111111111111111111111111111111
* ```
*
* @constant
* @type {uinteger32}
* @default 4294967295
*/
var UINT32_MAX = 4294967295;


// EXPORTS //

module.exports = UINT32_MAX;

},{}],241:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Maximum unsigned 8-bit integer.
*
* @module @stdlib/constants/uint8/max
* @type {integer32}
*
* @example
* var UINT8_MAX = require( '@stdlib/constants/uint8/max' );
* // returns 255
*/


// MAIN //

/**
* Maximum unsigned 8-bit integer.
*
* ## Notes
*
* The number has the value
*
* ```tex
* 2^{8} - 1
* ```
*
* which corresponds to the bit sequence
*
* ```binarystring
* 11111111
* ```
*
* @constant
* @type {integer32}
* @default 255
*/
var UINT8_MAX = 255|0; // asm type annotation


// EXPORTS //

module.exports = UINT8_MAX;

},{}],242:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a finite numeric value is an even number.
*
* @module @stdlib/math/base/assert/is-even
*
* @example
* var isEven = require( '@stdlib/math/base/assert/is-even' );
*
* var bool = isEven( 5.0 );
* // returns false
*
* bool = isEven( -2.0 );
* // returns true
*
* bool = isEven( 0.0 );
* // returns true
*
* bool = isEven( NaN );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":243}],243:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isInteger = require( './../../../../base/assert/is-integer' );


// MAIN //

/**
* Tests if a finite numeric value is an even number.
*
* @param {number} x - value to test
* @returns {boolean} boolean indicating whether the value is an even number
*
* @example
* var bool = isEven( 5.0 );
* // returns false
*
* @example
* var bool = isEven( -2.0 );
* // returns true
*
* @example
* var bool = isEven( 0.0 );
* // returns true
*
* @example
* var bool = isEven( NaN );
* // returns false
*/
function isEven( x ) {
	return isInteger( x/2.0 );
}


// EXPORTS //

module.exports = isEven;

},{"./../../../../base/assert/is-integer":244}],244:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Test if a finite double-precision floating-point number is an integer.
*
* @module @stdlib/math/base/assert/is-integer
*
* @example
* var isInteger = require( '@stdlib/math/base/assert/is-integer' );
*
* var bool = isInteger( 1.0 );
* // returns true
*
* bool = isInteger( 3.14 );
* // returns false
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":245}],245:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var floor = require( './../../../../base/special/floor' );


// MAIN //

/**
* Tests if a finite double-precision floating-point number is an integer.
*
* @param {number} x - value to test
* @returns {boolean} boolean indicating whether the value is an integer
*
* @example
* var bool = isInteger( 1.0 );
* // returns true
*
* @example
* var bool = isInteger( 3.14 );
* // returns false
*/
function isInteger( x ) {
	return (floor(x) === x);
}


// EXPORTS //

module.exports = isInteger;

},{"./../../../../base/special/floor":248}],246:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the maximum value.
*
* @module @stdlib/math/base/special/fast/max
*
* @example
* var max = require( '@stdlib/math/base/special/fast/max' );
*
* var v = max( 3.14, 4.2 );
* // returns 4.2
*
* v = max( 3.14, NaN );
* // returns NaN
*
* v = max( NaN, 3.14 );
* // returns 3.14
*
* v = max( -0.0, +0.0 );
* // returns +0.0
*
* v = max( +0.0, -0.0 );
* // returns -0.0
*/

// MODULES //

var max = require( './main.js' );


// EXPORTS //

module.exports = max;

},{"./main.js":247}],247:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns the maximum value.
*
* @param {number} x - first number
* @param {number} y - second number
* @returns {number} maximum value
*
* @example
* var v = max( 3.14, 4.2 );
* // returns 4.2
*
* @example
* var v = max( 3.14, NaN );
* // returns NaN
*
* @example
* var v = max( NaN, 3.14 );
* // returns 3.14
*
* @example
* var v = max( -0.0, +0.0 );
* // returns +0.0
*
* @example
* var v = max( +0.0, -0.0 );
* // returns -0.0
*/
function max( x, y ) {
	if ( x > y ) {
		return x;
	}
	return y;
}


// EXPORTS //

module.exports = max;

},{}],248:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Round a double-precision floating-point number toward negative infinity.
*
* @module @stdlib/math/base/special/floor
*
* @example
* var floor = require( '@stdlib/math/base/special/floor' );
*
* var v = floor( -4.2 );
* // returns -5.0
*
* v = floor( 9.99999 );
* // returns 9.0
*
* v = floor( 0.0 );
* // returns 0.0
*
* v = floor( NaN );
* // returns NaN
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":249}],249:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// TODO: implementation (?)

/**
* Rounds a double-precision floating-point number toward negative infinity.
*
* @param {number} x - input value
* @returns {number} rounded value
*
* @example
* var v = floor( -4.2 );
* // returns -5.0
*
* @example
* var v = floor( 9.99999 );
* // returns 9.0
*
* @example
* var v = floor( 0.0 );
* // returns 0.0
*
* @example
* var v = floor( NaN );
* // returns NaN
*/
var floor = Math.floor; // eslint-disable-line stdlib/no-builtin-math


// EXPORTS //

module.exports = floor;

},{}],250:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Constructor which returns a `Number` object.
*
* @module @stdlib/number/ctor
*
* @example
* var Number = require( '@stdlib/number/ctor' );
*
* var v = new Number( 10.0 );
* // returns <Number>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":251}],251:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// EXPORTS //

module.exports = Number; // eslint-disable-line stdlib/require-globals

},{}],252:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Convert a double-precision floating-point number to the nearest single-precision floating-point number.
*
* @module @stdlib/number/float64/base/to-float32
*
* @example
* var float64ToFloat32 = require( '@stdlib/number/float64/base/to-float32' );
*
* var y = float64ToFloat32( 1.337 );
* // returns 1.3370000123977661
*/

// MODULES //

var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var float64ToFloat32;
if ( typeof builtin === 'function' ) {
	float64ToFloat32 = builtin;
} else {
	float64ToFloat32 = polyfill;
}


// EXPORTS //

module.exports = float64ToFloat32;

},{"./main.js":253,"./polyfill.js":254}],253:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var fround = ( typeof Math.fround === 'function' ) ? Math.fround : null; // eslint-disable-line stdlib/no-builtin-math


// EXPORTS //

module.exports = fround;

},{}],254:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Float32Array = require( '@stdlib/array/float32' );


// VARIABLES //

var FLOAT32_VIEW = new Float32Array( 1 );


// MAIN //

/**
* Converts a double-precision floating-point number to the nearest single-precision floating-point number.
*
* @param {number} x - double-precision floating-point number
* @returns {number} nearest single-precision floating-point number
*
* @example
* var y = float64ToFloat32( 1.337 );
* // returns 1.3370000123977661
*/
function float64ToFloat32( x ) {
	FLOAT32_VIEW[ 0 ] = x;
	return FLOAT32_VIEW[ 0 ];
}


// EXPORTS //

module.exports = float64ToFloat32;

},{"@stdlib/array/float32":69}],255:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Object constructor.
*
* @module @stdlib/object/ctor
*
* @example
* var Object = require( '@stdlib/object/ctor' );
*
* var o = new Object( null );
* // returns {}
*
* o = new Object( 5.0 );
* // returns <Number>
*
* o = new Object( 'beep' );
* // returns <String>
*
* var o1 = {};
*
* var o2 = new Object( o1 );
* // returns {}
*
* var bool = ( o1 === o2 );
* // returns true
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":256}],256:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns an object.
*
* @name Object
* @constructor
* @type {Function}
* @param {*} value - input value
* @returns {Object} object
*
* @example
* var o = new Object( null );
* // returns {}
*
* @example
* var o = new Object( 5.0 );
* // returns <Number>
*
* @example
* var o = new Object( 'beep' );
* // returns <String>
*
* @example
* var o1 = {};
*
* var o2 = new Object( o1 );
* // returns {}
*
* var bool = ( o1 === o2 );
* // returns true
*/
var Obj = Object; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = Obj;

},{}],257:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Regular expression to capture everything that is not a space immediately after the `function` keyword and before the first left parenthesis.
*
* @module @stdlib/regexp/function-name
*
* @example
* var reFunctionName = require( '@stdlib/regexp/function-name' );
* var RE_FUNCTION_NAME = reFunctionName();
*
* function fname( fcn ) {
*     return RE_FUNCTION_NAME.exec( fcn.toString() )[ 1 ];
* }
*
* var fn = fname( Math.sqrt );
* // returns 'sqrt'
*
* fn = fname( Int8Array );
* // returns 'Int8Array'
*
* fn = fname( Object.prototype.toString );
* // returns 'toString'
*
* fn = fname( function(){} );
* // returns ''
*/

// MODULES //

var setReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
var main = require( './main.js' );
var REGEXP = require( './regexp.js' );


// MAIN //

setReadOnly( main, 'REGEXP', REGEXP );


// EXPORTS //

module.exports = main;

},{"./main.js":258,"./regexp.js":259,"@stdlib/utils/define-nonenumerable-read-only-property":285}],258:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns a regular expression to capture everything that is not a space immediately after the `function` keyword and before the first left parenthesis.
*
* @returns {RegExp} regular expression
*
* @example
* var RE_FUNCTION_NAME = reFunctionName();
*
* function fname( fcn ) {
*     return RE_FUNCTION_NAME.exec( fcn.toString() )[ 1 ];
* }
*
* var fn = fname( Math.sqrt );
* // returns 'sqrt'
*
* fn = fname( Int8Array );
* // returns 'Int8Array'
*
* fn = fname( Object.prototype.toString );
* // returns 'toString'
*
* fn = fname( function(){} );
* // returns ''
*/
function reFunctionName() {
	return /^\s*function\s*([^(]*)/i;
}


// EXPORTS //

module.exports = reFunctionName;

},{}],259:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var reFunctionName = require( './main.js' );


// MAIN //

/**
* Captures everything that is not a space immediately after the `function` keyword and before the first left parenthesis.
*
* Regular expression: `/^\s*function\s*([^(]*)/i`
*
* -   `/^\s*`
*     -   Match zero or more spaces at beginning
*
* -   `function`
*     -   Match the word `function`
*
* -   `\s*`
*     -   Match zero or more spaces after the word `function`
*
* -   `()`
*     -   Capture
*
* -   `[^(]*`
*     -   Match anything except a left parenthesis `(` zero or more times
*
* -   `/i`
*     -   ignore case
*
* @constant
* @type {RegExp}
* @default /^\s*function\s*([^(]*)/i
*/
var RE_FUNCTION_NAME = reFunctionName();


// EXPORTS //

module.exports = RE_FUNCTION_NAME;

},{"./main.js":258}],260:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Reinterpret a `Complex128Array` as a `Float64Array`.
*
* @module @stdlib/strided/base/reinterpret-complex128
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
* var reinterpret = require( '@stdlib/strided/base/reinterpret-complex128' );
*
* var x = new Complex128Array( 10 );
*
* var out = reinterpret( x, 0 );
* // returns <Float64Array>
*
* var bool = ( out.buffer === x.buffer );
* // returns true
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":261}],261:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Float64Array = require( '@stdlib/array/float64' );


// MAIN //

/**
* Reinterprets a `Complex128Array` as a `Float64Array`.
*
* @param {Complex128Array} x - input array
* @param {NonNegativeInteger} offset - starting index
* @returns {Float64Array} `Float64Array` view
*
* @example
* var Complex128Array = require( '@stdlib/array/complex128' );
*
* var x = new Complex128Array( 10 );
*
* var out = reinterpret( x, 0 );
* // returns <Float64Array>
*
* var bool = ( out.buffer === x.buffer );
* // returns true
*/
function reinterpret( x, offset ) {
	return new Float64Array( x.buffer, x.byteOffset+(x.BYTES_PER_ELEMENT*offset), 2*(x.length-offset) ); // eslint-disable-line max-len
}


// EXPORTS //

module.exports = reinterpret;

},{"@stdlib/array/float64":72}],262:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Reinterpret a `Complex64Array` as a `Float32Array`.
*
* @module @stdlib/strided/base/reinterpret-complex64
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
* var reinterpret = require( '@stdlib/strided/base/reinterpret-complex64' );
*
* var x = new Complex64Array( 10 );
*
* var out = reinterpret( x, 0 );
* // returns <Float32Array>
*
* var bool = ( out.buffer === x.buffer );
* // returns true
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":263}],263:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Float32Array = require( '@stdlib/array/float32' );


// MAIN //

/**
* Reinterprets a `Complex64Array` as a `Float32Array`.
*
* @param {Complex64Array} x - input array
* @param {NonNegativeInteger} offset - starting index
* @returns {Float32Array} `Float32Array` view
*
* @example
* var Complex64Array = require( '@stdlib/array/complex64' );
*
* var x = new Complex64Array( 10 );
*
* var out = reinterpret( x, 0 );
* // returns <Float32Array>
*
* var bool = ( out.buffer === x.buffer );
* // returns true
*/
function reinterpret( x, offset ) {
	return new Float32Array( x.buffer, x.byteOffset+(x.BYTES_PER_ELEMENT*offset), 2*(x.length-offset) ); // eslint-disable-line max-len
}


// EXPORTS //

module.exports = reinterpret;

},{"@stdlib/array/float32":69}],264:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNumber = require( './is_number.js' );

// NOTE: for the following, we explicitly avoid using stdlib packages in this particular package in order to avoid circular dependencies.
var abs = Math.abs; // eslint-disable-line stdlib/no-builtin-math
var lowercase = String.prototype.toLowerCase;
var uppercase = String.prototype.toUpperCase;
var replace = String.prototype.replace;


// VARIABLES //

var RE_EXP_POS_DIGITS = /e\+(\d)$/;
var RE_EXP_NEG_DIGITS = /e-(\d)$/;
var RE_ONLY_DIGITS = /^(\d+)$/;
var RE_DIGITS_BEFORE_EXP = /^(\d+)e/;
var RE_TRAILING_PERIOD_ZERO = /\.0$/;
var RE_PERIOD_ZERO_EXP = /\.0*e/;
var RE_ZERO_BEFORE_EXP = /(\..*[^0])0*e/;


// MAIN //

/**
* Formats a token object argument as a floating-point number.
*
* @private
* @param {Object} token - token object
* @throws {Error} must provide a valid floating-point number
* @returns {string} formatted token argument
*/
function formatDouble( token ) {
	var digits;
	var out;
	var f = parseFloat( token.arg );
	if ( !isFinite( f ) ) { // NOTE: We use the global `isFinite` function here instead of `@stdlib/math/base/assert/is-finite` in order to avoid circular dependencies.
		if ( !isNumber( token.arg ) ) {
			throw new Error( 'invalid floating-point number. Value: ' + out );
		}
		// Case: NaN, Infinity, or -Infinity
		f = token.arg;
	}
	switch ( token.specifier ) {
	case 'e':
	case 'E':
		out = f.toExponential( token.precision );
		break;
	case 'f':
	case 'F':
		out = f.toFixed( token.precision );
		break;
	case 'g':
	case 'G':
		if ( abs( f ) < 0.0001 ) {
			digits = token.precision;
			if ( digits > 0 ) {
				digits -= 1;
			}
			out = f.toExponential( digits );
		} else {
			out = f.toPrecision( token.precision );
		}
		if ( !token.alternate ) {
			out = replace.call( out, RE_ZERO_BEFORE_EXP, '$1e' );
			out = replace.call( out, RE_PERIOD_ZERO_EXP, 'e' );
			out = replace.call( out, RE_TRAILING_PERIOD_ZERO, '' );
		}
		break;
	default:
		throw new Error( 'invalid double notation. Value: ' + token.specifier );
	}
	out = replace.call( out, RE_EXP_POS_DIGITS, 'e+0$1' );
	out = replace.call( out, RE_EXP_NEG_DIGITS, 'e-0$1' );
	if ( token.alternate ) {
		out = replace.call( out, RE_ONLY_DIGITS, '$1.' );
		out = replace.call( out, RE_DIGITS_BEFORE_EXP, '$1.e' );
	}
	if ( f >= 0 && token.sign ) {
		out = token.sign + out;
	}
	out = ( token.specifier === uppercase.call( token.specifier ) ) ?
		uppercase.call( out ) :
		lowercase.call( out );
	return out;
}


// EXPORTS //

module.exports = formatDouble;

},{"./is_number.js":267}],265:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isNumber = require( './is_number.js' );
var zeroPad = require( './zero_pad.js' );

// NOTE: for the following, we explicitly avoid using stdlib packages in this particular package in order to avoid circular dependencies.
var lowercase = String.prototype.toLowerCase;
var uppercase = String.prototype.toUpperCase;


// MAIN //

/**
* Formats a token object argument as an integer.
*
* @private
* @param {Object} token - token object
* @throws {Error} must provide a valid integer
* @returns {string} formatted token argument
*/
function formatInteger( token ) {
	var base;
	var out;
	var i;

	switch ( token.specifier ) {
	case 'b':
		// Case: %b (binary)
		base = 2;
		break;
	case 'o':
		// Case: %o (octal)
		base = 8;
		break;
	case 'x':
	case 'X':
		// Case: %x, %X (hexadecimal)
		base = 16;
		break;
	case 'd':
	case 'i':
	case 'u':
	default:
		// Case: %d, %i, %u (decimal)
		base = 10;
		break;
	}
	out = token.arg;
	i = parseInt( out, 10 );
	if ( !isFinite( i ) ) { // NOTE: We use the global `isFinite` function here instead of `@stdlib/math/base/assert/is-finite` in order to avoid circular dependencies.
		if ( !isNumber( out ) ) {
			throw new Error( 'invalid integer. Value: ' + out );
		}
		i = 0;
	}
	if ( i < 0 && ( token.specifier === 'u' || base !== 10 ) ) {
		i = 0xffffffff + i + 1;
	}
	if ( i < 0 ) {
		out = ( -i ).toString( base );
		if ( token.precision ) {
			out = zeroPad( out, token.precision, token.padRight );
		}
		out = '-' + out;
	} else {
		out = i.toString( base );
		if ( !i && !token.precision ) {
			out = '';
		} else if ( token.precision ) {
			out = zeroPad( out, token.precision, token.padRight );
		}
		if ( token.sign ) {
			out = token.sign + out;
		}
	}
	if ( base === 16 ) {
		if ( token.alternate ) {
			out = '0x' + out;
		}
		out = ( token.specifier === uppercase.call( token.specifier ) ) ?
			uppercase.call( out ) :
			lowercase.call( out );
	}
	if ( base === 8 ) {
		if ( token.alternate && out.charAt( 0 ) !== '0' ) {
			out = '0' + out;
		}
	}
	return out;
}


// EXPORTS //

module.exports = formatInteger;

},{"./is_number.js":267,"./zero_pad.js":271}],266:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Generate string from a token array by interpolating values.
*
* @module @stdlib/string/base/format-interpolate
*
* @example
* var formatInterpolate = require( '@stdlib/string/base/format-interpolate' );
*
* var tokens = ['Hello ', { 'specifier': 's' }, '!' ];
* var out = formatInterpolate( tokens, 'World' );
* // returns 'Hello World!'
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":269}],267:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tests if a value is a number primitive.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a number primitive
*
* @example
* var bool = isNumber( 3.14 );
* // returns true
*
* @example
* var bool = isNumber( NaN );
* // returns true
*
* @example
* var bool = isNumber( new Number( 3.14 ) );
* // returns false
*/
function isNumber( value ) {
	return ( typeof value === 'number' );  // NOTE: we inline the `isNumber.isPrimitive` function from `@stdlib/assert/is-number` in order to avoid circular dependencies.
}


// EXPORTS //

module.exports = isNumber;

},{}],268:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tests if a value is a string primitive.
*
* @param {*} value - value to test
* @returns {boolean} boolean indicating if a value is a string primitive
*
* @example
* var bool = isString( 'beep' );
* // returns true
*
* @example
* var bool = isString( new String( 'beep' ) );
* // returns false
*/
function isString( value ) {
	return ( typeof value === 'string' ); // NOTE: we inline the `isString.isPrimitive` function from `@stdlib/assert/is-string` in order to avoid circular dependencies.
}


// EXPORTS //

module.exports = isString;

},{}],269:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var formatInteger = require( './format_integer.js' );
var isString = require( './is_string.js' );
var formatDouble = require( './format_double.js' );
var spacePad = require( './space_pad.js' );
var zeroPad = require( './zero_pad.js' );


// VARIABLES //

var fromCharCode = String.fromCharCode;
var isArray = Array.isArray; // NOTE: We use the global `Array.isArray` function here instead of `@stdlib/assert/is-array` to avoid circular dependencies.


// FUNCTIONS //

/**
* Returns a boolean indicating whether a value is `NaN`.
*
* @private
* @param {*} value - input value
* @returns {boolean} boolean indicating whether a value is `NaN`
*
* @example
* var bool = isnan( NaN );
* // returns true
*
* @example
* var bool = isnan( 4 );
* // returns false
*/
function isnan( value ) { // explicitly define a function here instead of `@stdlib/math/base/assert/is-nan` in order to avoid circular dependencies
	return ( value !== value );
}

/**
* Initializes token object with properties of supplied format identifier object or default values if not present.
*
* @private
* @param {Object} token - format identifier object
* @returns {Object} token object
*/
function initialize( token ) {
	var out = {};
	out.specifier = token.specifier;
	out.precision = ( token.precision === void 0 ) ? 1 : token.precision;
	out.width = token.width;
	out.flags = token.flags || '';
	out.mapping = token.mapping;
	return out;
}


// MAIN //

/**
* Generates string from a token array by interpolating values.
*
* @param {Array} tokens - string parts and format identifier objects
* @param {Array} ...args - variable values
* @throws {TypeError} first argument must be an array
* @throws {Error} invalid flags
* @returns {string} formatted string
*
* @example
* var tokens = [ 'beep ', { 'specifier': 's' } ];
* var out = formatInterpolate( tokens, 'boop' );
* // returns 'beep boop'
*/
function formatInterpolate( tokens ) {
	var hasPeriod;
	var flags;
	var token;
	var flag;
	var num;
	var out;
	var pos;
	var i;
	var j;

	if ( !isArray( tokens ) ) {
		throw new TypeError( 'invalid argument. First argument must be an array. Value: `' + tokens + '`.' );
	}
	out = '';
	pos = 1;
	for ( i = 0; i < tokens.length; i++ ) {
		token = tokens[ i ];
		if ( isString( token ) ) {
			out += token;
		} else {
			hasPeriod = token.precision !== void 0;
			token = initialize( token );
			if ( !token.specifier ) {
				throw new TypeError( 'invalid argument. Token is missing `specifier` property. Index: `'+ i +'`. Value: `' + token + '`.' );
			}
			if ( token.mapping ) {
				pos = token.mapping;
			}
			flags = token.flags;
			for ( j = 0; j < flags.length; j++ ) {
				flag = flags.charAt( j );
				switch ( flag ) {
				case ' ':
					token.sign = ' ';
					break;
				case '+':
					token.sign = '+';
					break;
				case '-':
					token.padRight = true;
					token.padZeros = false;
					break;
				case '0':
					token.padZeros = flags.indexOf( '-' ) < 0; // NOTE: We use built-in `Array.prototype.indexOf` here instead of `@stdlib/assert/contains` in order to avoid circular dependencies.
					break;
				case '#':
					token.alternate = true;
					break;
				default:
					throw new Error( 'invalid flag: ' + flag );
				}
			}
			if ( token.width === '*' ) {
				token.width = parseInt( arguments[ pos ], 10 );
				pos += 1;
				if ( isnan( token.width ) ) {
					throw new TypeError( 'the argument for * width at position ' + pos + ' is not a number. Value: `' + token.width + '`.' );
				}
				if ( token.width < 0 ) {
					token.padRight = true;
					token.width = -token.width;
				}
			}
			if ( hasPeriod ) {
				if ( token.precision === '*' ) {
					token.precision = parseInt( arguments[ pos ], 10 );
					pos += 1;
					if ( isnan( token.precision ) ) {
						throw new TypeError( 'the argument for * precision at position ' + pos + ' is not a number. Value: `' + token.precision + '`.' );
					}
					if ( token.precision < 0 ) {
						token.precision = 1;
						hasPeriod = false;
					}
				}
			}
			token.arg = arguments[ pos ];
			switch ( token.specifier ) {
			case 'b':
			case 'o':
			case 'x':
			case 'X':
			case 'd':
			case 'i':
			case 'u':
				// Case: %b (binary), %o (octal), %x, %X (hexadecimal), %d, %i (decimal), %u (unsigned decimal)
				if ( hasPeriod ) {
					token.padZeros = false;
				}
				token.arg = formatInteger( token );
				break;
			case 's':
				// Case: %s (string)
				token.maxWidth = ( hasPeriod ) ? token.precision : -1;
				token.arg = String( token.arg );
				break;
			case 'c':
				// Case: %c (character)
				if ( !isnan( token.arg ) ) {
					num = parseInt( token.arg, 10 );
					if ( num < 0 || num > 127 ) {
						throw new Error( 'invalid character code. Value: ' + token.arg );
					}
					token.arg = ( isnan( num ) ) ? String( token.arg ) : fromCharCode( num ); // eslint-disable-line max-len
				}
				break;
			case 'e':
			case 'E':
			case 'f':
			case 'F':
			case 'g':
			case 'G':
				// Case: %e, %E (scientific notation), %f, %F (decimal floating point), %g, %G (uses the shorter of %e/E or %f/F)
				if ( !hasPeriod ) {
					token.precision = 6;
				}
				token.arg = formatDouble( token );
				break;
			default:
				throw new Error( 'invalid specifier: ' + token.specifier );
			}
			// Fit argument into field width...
			if ( token.maxWidth >= 0 && token.arg.length > token.maxWidth ) {
				token.arg = token.arg.substring( 0, token.maxWidth );
			}
			if ( token.padZeros ) {
				token.arg = zeroPad( token.arg, token.width || token.precision, token.padRight ); // eslint-disable-line max-len
			} else if ( token.width ) {
				token.arg = spacePad( token.arg, token.width, token.padRight );
			}
			out += token.arg || '';
			pos += 1;
		}
	}
	return out;
}


// EXPORTS //

module.exports = formatInterpolate;

},{"./format_double.js":264,"./format_integer.js":265,"./is_string.js":268,"./space_pad.js":270,"./zero_pad.js":271}],270:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// FUNCTIONS //

/**
* Returns `n` spaces.
*
* @private
* @param {number} n - number of spaces
* @returns {string} string of spaces
*/
function spaces( n ) {
	var out = '';
	var i;
	for ( i = 0; i < n; i++ ) {
		out += ' ';
	}
	return out;
}


// MAIN //

/**
* Pads a token with spaces to the specified width.
*
* @private
* @param {string} str - token argument
* @param {number} width - token width
* @param {boolean} [right=false] - boolean indicating whether to pad to the right
* @returns {string} padded token argument
*/
function spacePad( str, width, right ) {
	var pad = width - str.length;
	if ( pad < 0 ) {
		return str;
	}
	str = ( right ) ?
		str + spaces( pad ) :
		spaces( pad ) + str;
	return str;
}


// EXPORTS //

module.exports = spacePad;

},{}],271:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// FUNCTIONS //

/**
* Tests if a string starts with a minus sign (`-`).
*
* @private
* @param {string} str - input string
* @returns {boolean} boolean indicating if a string starts with a minus sign (`-`)
*/
function startsWithMinus( str ) {
	return str[ 0 ] === '-';
}

/**
* Returns a string of `n` zeros.
*
* @private
* @param {number} n - number of zeros
* @returns {string} string of zeros
*/
function zeros( n ) {
	var out = '';
	var i;
	for ( i = 0; i < n; i++ ) {
		out += '0';
	}
	return out;
}


// MAIN //

/**
* Pads a token with zeros to the specified width.
*
* @private
* @param {string} str - token argument
* @param {number} width - token width
* @param {boolean} [right=false] - boolean indicating whether to pad to the right
* @returns {string} padded token argument
*/
function zeroPad( str, width, right ) {
	var negative = false;
	var pad = width - str.length;
	if ( pad < 0 ) {
		return str;
	}
	if ( startsWithMinus( str ) ) {
		negative = true;
		str = str.substr( 1 );
	}
	str = ( right ) ?
		str + zeros( pad ) :
		zeros( pad ) + str;
	if ( negative ) {
		str = '-' + str;
	}
	return str;
}


// EXPORTS //

module.exports = zeroPad;

},{}],272:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Tokenize a string into an array of string parts and format identifier objects.
*
* @module @stdlib/string/base/format-tokenize
*
* @example
* var formatTokenize = require( '@stdlib/string/base/format-tokenize' );
*
* var str = 'Hello %s!';
* var tokens = formatTokenize( str );
* // returns [ 'Hello ', {...}, '!' ]
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":273}],273:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// VARIABLES //

var RE = /%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;


// FUNCTIONS //

/**
* Parses a delimiter.
*
* @private
* @param {Array} match - regular expression match
* @returns {Object} delimiter token object
*/
function parse( match ) {
	var token = {
		'mapping': ( match[ 1 ] ) ? parseInt( match[ 1 ], 10 ) : void 0,
		'flags': match[ 2 ],
		'width': match[ 3 ],
		'precision': match[ 5 ],
		'specifier': match[ 6 ]
	};
	if ( match[ 4 ] === '.' && match[ 5 ] === void 0 ) {
		token.precision = '1';
	}
	return token;
}


// MAIN //

/**
* Tokenizes a string into an array of string parts and format identifier objects.
*
* @param {string} str - input string
* @returns {Array} tokens
*
* @example
* var tokens = formatTokenize( 'Hello %s!' );
* // returns [ 'Hello ', {...}, '!' ]
*/
function formatTokenize( str ) {
	var content;
	var tokens;
	var match;
	var prev;

	tokens = [];
	prev = 0;
	match = RE.exec( str );
	while ( match ) {
		content = str.slice( prev, RE.lastIndex - match[ 0 ].length );
		if ( content.length ) {
			tokens.push( content );
		}
		tokens.push( parse( match ) );
		prev = RE.lastIndex;
		match = RE.exec( str );
	}
	content = str.slice( prev );
	if ( content.length ) {
		tokens.push( content );
	}
	return tokens;
}


// EXPORTS //

module.exports = formatTokenize;

},{}],274:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Insert supplied variable values into a format string.
*
* @module @stdlib/string/format
*
* @example
* var format = require( '@stdlib/string/format' );
*
* var out = format( '%s %s!', 'Hello', 'World' );
* // returns 'Hello World!'
*
* out = format( 'Pi: ~%.2f', 3.141592653589793 );
* // returns 'Pi: ~3.14'
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":276}],275:[function(require,module,exports){
arguments[4][268][0].apply(exports,arguments)
},{"dup":268}],276:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var interpolate = require( './../../base/format-interpolate' );
var tokenize = require( './../../base/format-tokenize' );
var isString = require( './is_string.js' );


// MAIN //

/**
* Inserts supplied variable values into a format string.
*
* @param {string} str - input string
* @param {Array} ...args - variable values
* @throws {TypeError} first argument must be a string
* @throws {Error} invalid flags
* @returns {string} formatted string
*
* @example
* var str = format( 'Hello %s!', 'world' );
* // returns 'Hello world!'
*
* @example
* var str = format( 'Pi: ~%.2f', 3.141592653589793 );
* // returns 'Pi: ~3.14'
*/
function format( str ) {
	var args;
	var i;

	if ( !isString( str ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be a string. Value: `%s`.', str ) );
	}
	args = [ tokenize( str ) ];
	for ( i = 1; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}
	return interpolate.apply( null, args );
}


// EXPORTS //

module.exports = format;

},{"./../../base/format-interpolate":266,"./../../base/format-tokenize":272,"./is_string.js":275}],277:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Symbol factory.
*
* @module @stdlib/symbol/ctor
*
* @example
* var Symbol = require( '@stdlib/symbol/ctor' );
*
* var s = Symbol( 'beep' );
* // returns <symbol>
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":278}],278:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var Sym = ( typeof Symbol === 'function' ) ? Symbol : void 0; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = Sym;

},{}],279:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Iterator symbol.
*
* @module @stdlib/symbol/iterator
*
* @example
* var IteratorSymbol = require( '@stdlib/symbol/iterator' );
*
* function iterator() {
*     var it;
*     var i;
*
*     i = -1;
*
*     it = {};
*     it.next = next;
*     it.return = done;
*
*     if ( IteratorSymbol ) {
*         it[ IteratorSymbol ] = iterator;
*     }
*     return it;
*
*     function next() {
*         i += 1;
*         return {
*             'value': i,
*             'done': false
*         };
*     }
*
*     function done( value ) {
*         if ( arguments.length === 0 ) {
*             return {
*                 'done': true
*             };
*         }
*         return {
*             'value': value,
*             'done': true
*         };
*     }
* }
*
* var obj = iterator();
*/

// MAIN //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":280}],280:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasIteratorSymbolSupport = require( '@stdlib/assert/has-iterator-symbol-support' );


// MAIN //

/**
* Iterator symbol.
*
* @name IteratorSymbol
* @constant
* @type {(symbol|null)}
*
* @example
* function iterator() {
*     var it;
*     var i;
*
*     i = -1;
*
*     it = {};
*     it.next = next;
*     it.return = done;
*
*     if ( IteratorSymbol ) {
*         it[ IteratorSymbol ] = iterator;
*     }
*     return it;
*
*     function next() {
*         i += 1;
*         return {
*             'value': i,
*             'done': false
*         };
*     }
*
*     function done( value ) {
*         if ( arguments.length === 0 ) {
*             return {
*                 'done': true
*             };
*         }
*         return {
*             'value': value,
*             'done': true
*         };
*     }
* }
*
* var obj = iterator();
*/
var IteratorSymbol = ( hasIteratorSymbolSupport() ) ? Symbol.iterator : null;


// EXPORTS //

module.exports = IteratorSymbol;

},{"@stdlib/assert/has-iterator-symbol-support":111}],281:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Determine the name of a value's constructor.
*
* @module @stdlib/utils/constructor-name
*
* @example
* var constructorName = require( '@stdlib/utils/constructor-name' );
*
* var v = constructorName( 'a' );
* // returns 'String'
*
* v = constructorName( {} );
* // returns 'Object'
*
* v = constructorName( true );
* // returns 'Boolean'
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":282}],282:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( './../../native-class' );
var RE = require( '@stdlib/regexp/function-name' ).REGEXP;
var isBuffer = require( '@stdlib/assert/is-buffer' );


// MAIN //

/**
* Determines the name of a value's constructor.
*
* @param {*} v - input value
* @returns {string} name of a value's constructor
*
* @example
* var v = constructorName( 'a' );
* // returns 'String'
*
* @example
* var v = constructorName( 5 );
* // returns 'Number'
*
* @example
* var v = constructorName( null );
* // returns 'Null'
*
* @example
* var v = constructorName( undefined );
* // returns 'Undefined'
*
* @example
* var v = constructorName( function noop() {} );
* // returns 'Function'
*/
function constructorName( v ) {
	var match;
	var name;
	var ctor;
	name = nativeClass( v ).slice( 8, -1 );
	if ( (name === 'Object' || name === 'Error') && v.constructor ) {
		ctor = v.constructor;
		if ( typeof ctor.name === 'string' ) {
			return ctor.name;
		}
		match = RE.exec( ctor.toString() );
		if ( match ) {
			return match[ 1 ];
		}
	}
	if ( isBuffer( v ) ) {
		return 'Buffer';
	}
	return name;
}


// EXPORTS //

module.exports = constructorName;

},{"./../../native-class":303,"@stdlib/assert/is-buffer":143,"@stdlib/regexp/function-name":257}],283:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Define a non-enumerable read-only accessor.
*
* @module @stdlib/utils/define-nonenumerable-read-only-accessor
*
* @example
* var setNonEnumerableReadOnlyAccessor = require( '@stdlib/utils/define-nonenumerable-read-only-accessor' );
*
* function getter() {
*     return 'bar';
* }
*
* var obj = {};
*
* setNonEnumerableReadOnlyAccessor( obj, 'foo', getter );
*
* try {
*     obj.foo = 'boop';
* } catch ( err ) {
*     console.error( err.message );
* }
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":284}],284:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var defineProperty = require( './../../define-property' );


// MAIN //

/**
* Defines a non-enumerable read-only accessor.
*
* @param {Object} obj - object on which to define the property
* @param {(string|symbol)} prop - property name
* @param {Function} getter - accessor
*
* @example
* function getter() {
*     return 'bar';
* }
*
* var obj = {};
*
* setNonEnumerableReadOnlyAccessor( obj, 'foo', getter );
*
* try {
*     obj.foo = 'boop';
* } catch ( err ) {
*     console.error( err.message );
* }
*/
function setNonEnumerableReadOnlyAccessor( obj, prop, getter ) { // eslint-disable-line id-length
	defineProperty( obj, prop, {
		'configurable': false,
		'enumerable': false,
		'get': getter
	});
}


// EXPORTS //

module.exports = setNonEnumerableReadOnlyAccessor;

},{"./../../define-property":290}],285:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Define a non-enumerable read-only property.
*
* @module @stdlib/utils/define-nonenumerable-read-only-property
*
* @example
* var setNonEnumerableReadOnly = require( '@stdlib/utils/define-nonenumerable-read-only-property' );
*
* var obj = {};
*
* setNonEnumerableReadOnly( obj, 'foo', 'bar' );
*
* try {
*     obj.foo = 'boop';
* } catch ( err ) {
*     console.error( err.message );
* }
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":286}],286:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var defineProperty = require( './../../define-property' );


// MAIN //

/**
* Defines a non-enumerable read-only property.
*
* @param {Object} obj - object on which to define the property
* @param {(string|symbol)} prop - property name
* @param {*} value - value to set
*
* @example
* var obj = {};
*
* setNonEnumerableReadOnly( obj, 'foo', 'bar' );
*
* try {
*     obj.foo = 'boop';
* } catch ( err ) {
*     console.error( err.message );
* }
*/
function setNonEnumerableReadOnly( obj, prop, value ) {
	defineProperty( obj, prop, {
		'configurable': false,
		'enumerable': false,
		'writable': false,
		'value': value
	});
}


// EXPORTS //

module.exports = setNonEnumerableReadOnly;

},{"./../../define-property":290}],287:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Defines (or modifies) an object property.
*
* ## Notes
*
* -   Property descriptors come in two flavors: **data descriptors** and **accessor descriptors**. A data descriptor is a property that has a value, which may or may not be writable. An accessor descriptor is a property described by a getter-setter function pair. A descriptor must be one of these two flavors and cannot be both.
*
* @name defineProperty
* @type {Function}
* @param {Object} obj - object on which to define the property
* @param {(string|symbol)} prop - property name
* @param {Object} descriptor - property descriptor
* @param {boolean} [descriptor.configurable=false] - boolean indicating if property descriptor can be changed and if the property can be deleted from the provided object
* @param {boolean} [descriptor.enumerable=false] - boolean indicating if the property shows up when enumerating object properties
* @param {boolean} [descriptor.writable=false] - boolean indicating if the value associated with the property can be changed with an assignment operator
* @param {*} [descriptor.value] - property value
* @param {(Function|void)} [descriptor.get=undefined] - function which serves as a getter for the property, or, if no getter, undefined. When the property is accessed, a getter function is called without arguments and with the `this` context set to the object through which the property is accessed (which may not be the object on which the property is defined due to inheritance). The return value will be used as the property value.
* @param {(Function|void)} [descriptor.set=undefined] - function which serves as a setter for the property, or, if no setter, undefined. When assigning a property value, a setter function is called with one argument (the value being assigned to the property) and with the `this` context set to the object through which the property is assigned.
* @throws {TypeError} first argument must be an object
* @throws {TypeError} third argument must be an object
* @throws {Error} property descriptor cannot have both a value and a setter and/or getter
* @returns {Object} object with added property
*
* @example
* var obj = {};
*
* defineProperty( obj, 'foo', {
*     'value': 'bar'
* });
*
* var str = obj.foo;
* // returns 'bar'
*/
var defineProperty = Object.defineProperty;


// EXPORTS //

module.exports = defineProperty;

},{}],288:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var main = ( typeof Object.defineProperty === 'function' ) ? Object.defineProperty : null;


// EXPORTS //

module.exports = main;

},{}],289:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var defineProperty = require( './define_property.js' );


// MAIN //

/**
* Tests for `Object.defineProperty` support.
*
* @private
* @returns {boolean} boolean indicating if an environment has `Object.defineProperty` support
*
* @example
* var bool = hasDefinePropertySupport();
* // returns <boolean>
*/
function hasDefinePropertySupport() {
	// Test basic support...
	try {
		defineProperty( {}, 'x', {} );
		return true;
	} catch ( err ) { // eslint-disable-line no-unused-vars
		return false;
	}
}


// EXPORTS //

module.exports = hasDefinePropertySupport;

},{"./define_property.js":288}],290:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Define (or modify) an object property.
*
* @module @stdlib/utils/define-property
*
* @example
* var defineProperty = require( '@stdlib/utils/define-property' );
*
* var obj = {};
* defineProperty( obj, 'foo', {
*     'value': 'bar',
*     'writable': false,
*     'configurable': false,
*     'enumerable': false
* });
* obj.foo = 'boop'; // => throws
*/

// MODULES //

var hasDefinePropertySupport = require( './has_define_property_support.js' );
var builtin = require( './builtin.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var defineProperty;
if ( hasDefinePropertySupport() ) {
	defineProperty = builtin;
} else {
	defineProperty = polyfill;
}


// EXPORTS //

module.exports = defineProperty;

},{"./builtin.js":287,"./has_define_property_support.js":289,"./polyfill.js":291}],291:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable no-underscore-dangle, no-proto */

'use strict';

// MODULES //

var format = require( '@stdlib/string/format' );


// VARIABLES //

var objectProtoype = Object.prototype;
var toStr = objectProtoype.toString;
var defineGetter = objectProtoype.__defineGetter__;
var defineSetter = objectProtoype.__defineSetter__;
var lookupGetter = objectProtoype.__lookupGetter__;
var lookupSetter = objectProtoype.__lookupSetter__;


// MAIN //

/**
* Defines (or modifies) an object property.
*
* ## Notes
*
* -   Property descriptors come in two flavors: **data descriptors** and **accessor descriptors**. A data descriptor is a property that has a value, which may or may not be writable. An accessor descriptor is a property described by a getter-setter function pair. A descriptor must be one of these two flavors and cannot be both.
*
* @param {Object} obj - object on which to define the property
* @param {string} prop - property name
* @param {Object} descriptor - property descriptor
* @param {boolean} [descriptor.configurable=false] - boolean indicating if property descriptor can be changed and if the property can be deleted from the provided object
* @param {boolean} [descriptor.enumerable=false] - boolean indicating if the property shows up when enumerating object properties
* @param {boolean} [descriptor.writable=false] - boolean indicating if the value associated with the property can be changed with an assignment operator
* @param {*} [descriptor.value] - property value
* @param {(Function|void)} [descriptor.get=undefined] - function which serves as a getter for the property, or, if no getter, undefined. When the property is accessed, a getter function is called without arguments and with the `this` context set to the object through which the property is accessed (which may not be the object on which the property is defined due to inheritance). The return value will be used as the property value.
* @param {(Function|void)} [descriptor.set=undefined] - function which serves as a setter for the property, or, if no setter, undefined. When assigning a property value, a setter function is called with one argument (the value being assigned to the property) and with the `this` context set to the object through which the property is assigned.
* @throws {TypeError} first argument must be an object
* @throws {TypeError} third argument must be an object
* @throws {Error} property descriptor cannot have both a value and a setter and/or getter
* @returns {Object} object with added property
*
* @example
* var obj = {};
*
* defineProperty( obj, 'foo', {
*     'value': 'bar'
* });
*
* var str = obj.foo;
* // returns 'bar'
*/
function defineProperty( obj, prop, descriptor ) {
	var prototype;
	var hasValue;
	var hasGet;
	var hasSet;

	if ( typeof obj !== 'object' || obj === null || toStr.call( obj ) === '[object Array]' ) {
		throw new TypeError( format( 'invalid argument. First argument must be an object. Value: `%s`.', obj ) );
	}
	if ( typeof descriptor !== 'object' || descriptor === null || toStr.call( descriptor ) === '[object Array]' ) {
		throw new TypeError( format( 'invalid argument. Property descriptor must be an object. Value: `%s`.', descriptor ) );
	}
	hasValue = ( 'value' in descriptor );
	if ( hasValue ) {
		if (
			lookupGetter.call( obj, prop ) ||
			lookupSetter.call( obj, prop )
		) {
			// Override `__proto__` to avoid touching inherited accessors:
			prototype = obj.__proto__;
			obj.__proto__ = objectProtoype;

			// Delete property as existing getters/setters prevent assigning value to specified property:
			delete obj[ prop ];
			obj[ prop ] = descriptor.value;

			// Restore original prototype:
			obj.__proto__ = prototype;
		} else {
			obj[ prop ] = descriptor.value;
		}
	}
	hasGet = ( 'get' in descriptor );
	hasSet = ( 'set' in descriptor );

	if ( hasValue && ( hasGet || hasSet ) ) {
		throw new Error( 'invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.' );
	}

	if ( hasGet && defineGetter ) {
		defineGetter.call( obj, prop, descriptor.get );
	}
	if ( hasSet && defineSetter ) {
		defineSetter.call( obj, prop, descriptor.set );
	}
	return obj;
}


// EXPORTS //

module.exports = defineProperty;

},{"@stdlib/string/format":274}],292:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isFunction = require( '@stdlib/assert/is-function' );
var builtin = require( './native.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var getProto;
if ( isFunction( Object.getPrototypeOf ) ) {
	getProto = builtin;
} else {
	getProto = polyfill;
}


// EXPORTS //

module.exports = getProto;

},{"./native.js":295,"./polyfill.js":296,"@stdlib/assert/is-function":155}],293:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return the prototype of a provided object.
*
* @module @stdlib/utils/get-prototype-of
*
* @example
* var getPrototype = require( '@stdlib/utils/get-prototype-of' );
*
* var proto = getPrototype( {} );
* // returns {}
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":294}],294:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Object = require( '@stdlib/object/ctor' );
var getProto = require( './detect.js' );


// MAIN //

/**
* Returns the prototype of a provided object.
*
* @param {*} value - input value
* @returns {(Object|null)} prototype
*
* @example
* var proto = getPrototypeOf( {} );
* // returns {}
*/
function getPrototypeOf( value ) {
	if (
		value === null ||
		value === void 0
	) {
		return null;
	}
	// In order to ensure consistent ES5/ES6 behavior, cast input value to an object (strings, numbers, booleans); ES5 `Object.getPrototypeOf` throws when provided primitives and ES6 `Object.getPrototypeOf` casts:
	value = Object( value );

	return getProto( value );
}


// EXPORTS //

module.exports = getPrototypeOf;

},{"./detect.js":292,"@stdlib/object/ctor":255}],295:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var getProto = Object.getPrototypeOf;


// EXPORTS //

module.exports = getProto;

},{}],296:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var nativeClass = require( './../../native-class' );
var getProto = require( './proto.js' );


// MAIN //

/**
* Returns the prototype of a provided object.
*
* @private
* @param {Object} obj - input object
* @returns {(Object|null)} prototype
*/
function getPrototypeOf( obj ) {
	var proto = getProto( obj );
	if ( proto || proto === null ) {
		return proto;
	}
	if ( nativeClass( obj.constructor ) === '[object Function]' ) {
		// May break if the constructor has been tampered with...
		return obj.constructor.prototype;
	}
	if ( obj instanceof Object ) {
		return Object.prototype;
	}
	// Return `null` for objects created via `Object.create( null )`. Also return `null` for cross-realm objects on browsers that lack `__proto__` support, such as IE < 11.
	return null;
}


// EXPORTS //

module.exports = getPrototypeOf;

},{"./../../native-class":303,"./proto.js":297}],297:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Returns the value of the `__proto__` property.
*
* @private
* @param {Object} obj - input object
* @returns {*} value of `__proto__` property
*/
function getProto( obj ) {
	// eslint-disable-next-line no-proto
	return obj.__proto__;
}


// EXPORTS //

module.exports = getProto;

},{}],298:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isBoolean = require( '@stdlib/assert/is-boolean' ).isPrimitive;
var format = require( '@stdlib/string/format' );
var getThis = require( './codegen.js' );
var Self = require( './self.js' );
var Win = require( './window.js' );
var GlobalThis = require( './global_this.js' );


// MAIN //

/**
* Returns the global object.
*
* ## Notes
*
* -   Using code generation is the **most** reliable way to resolve the global object; however, doing so is likely to violate content security policies (CSPs) in, e.g., Chrome Apps and elsewhere.
*
* @private
* @param {boolean} [codegen=false] - boolean indicating whether to use code generation to resolve the global object
* @throws {TypeError} must provide a boolean
* @throws {Error} unable to resolve global object
* @returns {Object} global object
*
* @example
* var g = getGlobal();
* // returns {...}
*/
function getGlobal( codegen ) {
	if ( arguments.length ) {
		if ( !isBoolean( codegen ) ) {
			throw new TypeError( format( 'invalid argument. Must provide a boolean. Value: `%s`.', codegen ) );
		}
		if ( codegen ) {
			return getThis();
		}
		// Fall through...
	}
	// Case: 2020 revision of ECMAScript standard
	if ( GlobalThis ) {
		return GlobalThis;
	}
	// Case: browsers and web workers
	if ( Self ) {
		return Self;
	}
	// Case: browsers
	if ( Win ) {
		return Win;
	}
	// Case: unknown
	throw new Error( 'unexpected error. Unable to resolve global object.' );
}


// EXPORTS //

module.exports = getGlobal;

},{"./codegen.js":299,"./global_this.js":300,"./self.js":301,"./window.js":302,"@stdlib/assert/is-boolean":137,"@stdlib/string/format":274}],299:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

/**
* Returns the global object using code generation.
*
* @private
* @returns {Object} global object
*/
function getGlobal() {
	return new Function( 'return this;' )(); // eslint-disable-line no-new-func, stdlib/require-globals
}


// EXPORTS //

module.exports = getGlobal;

},{}],300:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var obj = ( typeof globalThis === 'object' ) ? globalThis : null; // eslint-disable-line no-undef


// EXPORTS //

module.exports = obj;

},{}],301:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var obj = ( typeof self === 'object' ) ? self : null;


// EXPORTS //

module.exports = obj;

},{}],302:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var obj = ( typeof window === 'object' ) ? window : null;


// EXPORTS //

module.exports = obj;

},{}],303:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Return a string value indicating a specification defined classification of an object.
*
* @module @stdlib/utils/native-class
*
* @example
* var nativeClass = require( '@stdlib/utils/native-class' );
*
* var str = nativeClass( 'a' );
* // returns '[object String]'
*
* str = nativeClass( 5 );
* // returns '[object Number]'
*
* function Beep() {
*     return this;
* }
* str = nativeClass( new Beep() );
* // returns '[object Object]'
*/

// MODULES //

var hasToStringTag = require( '@stdlib/assert/has-tostringtag-support' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var main;
if ( hasToStringTag() ) {
	main = polyfill;
} else {
	main = builtin;
}


// EXPORTS //

module.exports = main;

},{"./main.js":304,"./polyfill.js":305,"@stdlib/assert/has-tostringtag-support":117}],304:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var toStr = require( './tostring.js' );


// MAIN //

/**
* Returns a string value indicating a specification defined classification (via the internal property `[[Class]]`) of an object.
*
* @param {*} v - input value
* @returns {string} string value indicating a specification defined classification of the input value
*
* @example
* var str = nativeClass( 'a' );
* // returns '[object String]'
*
* @example
* var str = nativeClass( 5 );
* // returns '[object Number]'
*
* @example
* function Beep() {
*     return this;
* }
* var str = nativeClass( new Beep() );
* // returns '[object Object]'
*/
function nativeClass( v ) {
	return toStr.call( v );
}


// EXPORTS //

module.exports = nativeClass;

},{"./tostring.js":306}],305:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var hasOwnProp = require( '@stdlib/assert/has-own-property' );
var toStringTag = require( './tostringtag.js' );
var toStr = require( './tostring.js' );


// MAIN //

/**
* Returns a string value indicating a specification defined classification of an object in environments supporting `Symbol.toStringTag`.
*
* @param {*} v - input value
* @returns {string} string value indicating a specification defined classification of the input value
*
* @example
* var str = nativeClass( 'a' );
* // returns '[object String]'
*
* @example
* var str = nativeClass( 5 );
* // returns '[object Number]'
*
* @example
* function Beep() {
*     return this;
* }
* var str = nativeClass( new Beep() );
* // returns '[object Object]'
*/
function nativeClass( v ) {
	var isOwn;
	var tag;
	var out;

	if ( v === null || v === void 0 ) {
		return toStr.call( v );
	}
	tag = v[ toStringTag ];
	isOwn = hasOwnProp( v, toStringTag );

	// Attempt to override the `toStringTag` property. For built-ins having a `Symbol.toStringTag` property (e.g., `JSON`, `Math`, etc), the `Symbol.toStringTag` property is read-only (e.g., , so we need to wrap in a `try/catch`.
	try {
		v[ toStringTag ] = void 0;
	} catch ( err ) { // eslint-disable-line no-unused-vars
		return toStr.call( v );
	}
	out = toStr.call( v );

	if ( isOwn ) {
		v[ toStringTag ] = tag;
	} else {
		delete v[ toStringTag ];
	}
	return out;
}


// EXPORTS //

module.exports = nativeClass;

},{"./tostring.js":306,"./tostringtag.js":307,"@stdlib/assert/has-own-property":113}],306:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MAIN //

var toStr = Object.prototype.toString;


// EXPORTS //

module.exports = toStr;

},{}],307:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var Symbol = require( '@stdlib/symbol/ctor' );


// MAIN //

var toStrTag = ( typeof Symbol === 'function' ) ? Symbol.toStringTag : '';


// EXPORTS //

module.exports = toStrTag;

},{"@stdlib/symbol/ctor":277}],308:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Wrap `require` in a try/catch block.
*
* @module @stdlib/utils/try-require
*
* @example
* var tryRequire = require( '@stdlib/utils/try-require' );
*
* var out = tryRequire( 'beepboop' );
*
* if ( out instanceof Error ) {
*     console.log( out.message );
* }
*/

// MODULES //

var main = require( './main.js' );


// EXPORTS //

module.exports = main;

},{"./main.js":309}],309:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isError = require( '@stdlib/assert/is-error' );


// MAIN //

/**
* Wraps `require` in a try/catch block.
*
* @param {string} id - module id
* @returns {*|Error} `module.exports` of the resolved module or an error
*
* @example
* var out = tryRequire( 'beepboop' );
*
* if ( out instanceof Error ) {
*     console.error( out.message );
* }
*/
function tryRequire( id ) {
	try {
		return require( id ); // eslint-disable-line stdlib/no-dynamic-require
	} catch ( error ) {
		if ( isError( error ) ) {
			return error;
		}
		// Handle case where a literal is thrown...
		if ( typeof error === 'object' ) {
			return new Error( JSON.stringify( error ) );
		}
		return new Error( error.toString() );
	}
}


// EXPORTS //

module.exports = tryRequire;

},{"@stdlib/assert/is-error":149}],310:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var RE = require( './fixtures/re.js' );
var nodeList = require( './fixtures/nodelist.js' );
var typedarray = require( './fixtures/typedarray.js' );


// MAIN //

/**
* Checks whether a polyfill is needed when using the `typeof` operator.
*
* @private
* @returns {boolean} boolean indicating whether a polyfill is needed
*/
function check() {
	if (
		// Chrome 1-12 returns 'function' for regular expression instances (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof):
		typeof RE === 'function' ||

		// Safari 8 returns 'object' for typed array and weak map constructors (underscore #1929):
		typeof typedarray === 'object' ||

		// PhantomJS 1.9 returns 'function' for `NodeList` instances (underscore #2236):
		typeof nodeList === 'function'
	) {
		return true;
	}
	return false;
}


// EXPORTS //

module.exports = check;

},{"./fixtures/nodelist.js":311,"./fixtures/re.js":312,"./fixtures/typedarray.js":313}],311:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var getGlobal = require( './../../../global' );


// MAIN //

var root = getGlobal();
var nodeList = root.document && root.document.childNodes;


// EXPORTS //

module.exports = nodeList;

},{"./../../../global":298}],312:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

var RE = /./;


// EXPORTS //

module.exports = RE;

},{}],313:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

var typedarray = Int8Array; // eslint-disable-line stdlib/require-globals


// EXPORTS //

module.exports = typedarray;

},{}],314:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/**
* Determine a value's type.
*
* @module @stdlib/utils/type-of
*
* @example
* var typeOf = require( '@stdlib/utils/type-of' );
*
* var str = typeOf( 'a' );
* // returns 'string'
*
* str = typeOf( 5 );
* // returns 'number'
*/

// MODULES //

var usePolyfill = require( './check.js' );
var builtin = require( './main.js' );
var polyfill = require( './polyfill.js' );


// MAIN //

var main = ( usePolyfill() ) ? polyfill : builtin;


// EXPORTS //

module.exports = main;

},{"./check.js":310,"./main.js":315,"./polyfill.js":316}],315:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var ctorName = require( './../../constructor-name' );


// NOTES //

/*
* Built-in `typeof` operator behavior:
*
* ```text
* typeof null => 'object'
* typeof undefined => 'undefined'
* typeof 'a' => 'string'
* typeof 5 => 'number'
* typeof NaN => 'number'
* typeof true => 'boolean'
* typeof false => 'boolean'
* typeof {} => 'object'
* typeof [] => 'object'
* typeof function foo(){} => 'function'
* typeof function* foo(){} => 'object'
* typeof Symbol() => 'symbol'
* ```
*
*/


// MAIN //

/**
* Determines a value's type.
*
* @param {*} v - input value
* @returns {string} string indicating the value's type
*/
function typeOf( v ) {
	var type;

	// Address `typeof null` => `object` (see http://wiki.ecmascript.org/doku.php?id=harmony:typeof_null):
	if ( v === null ) {
		return 'null';
	}
	type = typeof v;

	// If the `typeof` operator returned something other than `object`, we are done. Otherwise, we need to check for an internal class name or search for a constructor.
	if ( type === 'object' ) {
		return ctorName( v ).toLowerCase();
	}
	return type;
}


// EXPORTS //

module.exports = typeOf;

},{"./../../constructor-name":281}],316:[function(require,module,exports){
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var ctorName = require( './../../constructor-name' );


// MAIN //

/**
* Determines a value's type.
*
* @param {*} v - input value
* @returns {string} string indicating the value's type
*/
function typeOf( v ) {
	return ctorName( v ).toLowerCase();
}


// EXPORTS //

module.exports = typeOf;

},{"./../../constructor-name":281}],317:[function(require,module,exports){
var Float64Array = require( '@stdlib/array/float64' );
var dgels = require( 'blapack/lib/lapack/base/dgels' );

module.exports = dgels;


},{"@stdlib/array/float64":318,"blapack/lib/lapack/base/dgels":14}],318:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"./main.js":319,"./polyfill.js":320,"@stdlib/assert/has-float64array-support":322,"dup":72}],319:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],320:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],321:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"dup":99}],322:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"./main.js":323,"dup":100}],323:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"./../../is-float64array":330,"./float64array.js":321,"dup":101}],324:[function(require,module,exports){
arguments[4][113][0].apply(exports,arguments)
},{"./main.js":325,"dup":113}],325:[function(require,module,exports){
arguments[4][114][0].apply(exports,arguments)
},{"dup":114}],326:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"./main.js":327,"dup":115}],327:[function(require,module,exports){
arguments[4][116][0].apply(exports,arguments)
},{"dup":116}],328:[function(require,module,exports){
arguments[4][117][0].apply(exports,arguments)
},{"./main.js":329,"dup":117}],329:[function(require,module,exports){
arguments[4][118][0].apply(exports,arguments)
},{"./../../has-symbol-support":326,"dup":118}],330:[function(require,module,exports){
arguments[4][153][0].apply(exports,arguments)
},{"./main.js":331,"dup":153}],331:[function(require,module,exports){
arguments[4][154][0].apply(exports,arguments)
},{"@stdlib/utils/native-class":334,"dup":154}],332:[function(require,module,exports){
arguments[4][277][0].apply(exports,arguments)
},{"./main.js":333,"dup":277}],333:[function(require,module,exports){
arguments[4][278][0].apply(exports,arguments)
},{"dup":278}],334:[function(require,module,exports){
arguments[4][303][0].apply(exports,arguments)
},{"./main.js":335,"./polyfill.js":336,"@stdlib/assert/has-tostringtag-support":328,"dup":303}],335:[function(require,module,exports){
arguments[4][304][0].apply(exports,arguments)
},{"./tostring.js":337,"dup":304}],336:[function(require,module,exports){
arguments[4][305][0].apply(exports,arguments)
},{"./tostring.js":337,"./tostringtag.js":338,"@stdlib/assert/has-own-property":324,"dup":305}],337:[function(require,module,exports){
arguments[4][306][0].apply(exports,arguments)
},{"dup":306}],338:[function(require,module,exports){
arguments[4][307][0].apply(exports,arguments)
},{"@stdlib/symbol/ctor":332,"dup":307}],339:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":340}],340:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[317]);
