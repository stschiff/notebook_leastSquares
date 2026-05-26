var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/main.js
var require_main = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/main.js"(exports, module) {
    "use strict";
    function hasSymbolSupport() {
      return typeof Symbol === "function" && typeof /* @__PURE__ */ Symbol("foo") === "symbol";
    }
    module.exports = hasSymbolSupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/index.js
var require_lib = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/main.js
var require_main2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/main.js"(exports, module) {
    "use strict";
    var hasSymbols = require_lib();
    var FLG = hasSymbols();
    function hasToStringTagSupport() {
      return FLG && typeof Symbol.toStringTag === "symbol";
    }
    module.exports = hasToStringTagSupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/index.js
var require_lib2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main2();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/tostring.js
var require_tostring = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/tostring.js"(exports, module) {
    "use strict";
    var toStr = Object.prototype.toString;
    module.exports = toStr;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/main.js
var require_main3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/main.js"(exports, module) {
    "use strict";
    var toStr = require_tostring();
    function nativeClass(v) {
      return toStr.call(v);
    }
    module.exports = nativeClass;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-own-property/lib/main.js
var require_main4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-own-property/lib/main.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    function hasOwnProp(value, property) {
      if (value === void 0 || value === null) {
        return false;
      }
      return has.call(value, property);
    }
    module.exports = hasOwnProp;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-own-property/lib/index.js
var require_lib3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-own-property/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main4();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/main.js
var require_main5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/main.js"(exports, module) {
    "use strict";
    var Sym = typeof Symbol === "function" ? Symbol : void 0;
    module.exports = Sym;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/index.js
var require_lib4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main5();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/tostringtag.js
var require_tostringtag = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/tostringtag.js"(exports, module) {
    "use strict";
    var Symbol2 = require_lib4();
    var toStrTag = typeof Symbol2 === "function" ? Symbol2.toStringTag : "";
    module.exports = toStrTag;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/polyfill.js
var require_polyfill = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/polyfill.js"(exports, module) {
    "use strict";
    var hasOwnProp = require_lib3();
    var toStringTag = require_tostringtag();
    var toStr = require_tostring();
    function nativeClass(v) {
      var isOwn;
      var tag;
      var out;
      if (v === null || v === void 0) {
        return toStr.call(v);
      }
      tag = v[toStringTag];
      isOwn = hasOwnProp(v, toStringTag);
      try {
        v[toStringTag] = void 0;
      } catch (err) {
        return toStr.call(v);
      }
      out = toStr.call(v);
      if (isOwn) {
        v[toStringTag] = tag;
      } else {
        delete v[toStringTag];
      }
      return out;
    }
    module.exports = nativeClass;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/index.js
var require_lib5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/index.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib2();
    var builtin = require_main3();
    var polyfill = require_polyfill();
    var main;
    if (hasToStringTag()) {
      main = polyfill;
    } else {
      main = builtin;
    }
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/main.js
var require_main6 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib5();
    var hasFloat64Array = typeof Float64Array === "function";
    function isFloat64Array(value) {
      return hasFloat64Array && value instanceof Float64Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Float64Array]";
    }
    module.exports = isFloat64Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/index.js
var require_lib6 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/index.js"(exports, module) {
    "use strict";
    var isFloat64Array = require_main6();
    module.exports = isFloat64Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/float64array.js
var require_float64array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/float64array.js"(exports, module) {
    "use strict";
    var main = typeof Float64Array === "function" ? Float64Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/main.js
var require_main7 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/main.js"(exports, module) {
    "use strict";
    var isFloat64Array = require_lib6();
    var GlobalFloat64Array = require_float64array();
    function hasFloat64ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalFloat64Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalFloat64Array([1, 3.14, -3.14, NaN]);
        bool = isFloat64Array(arr) && arr[0] === 1 && arr[1] === 3.14 && arr[2] === -3.14 && arr[3] !== arr[3];
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasFloat64ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/index.js
var require_lib7 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat64ArraySupport = require_main7();
    module.exports = hasFloat64ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/main.js
var require_main8 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Float64Array === "function" ? Float64Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/polyfill.js
var require_polyfill2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/index.js
var require_lib8 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat64ArraySupport = require_lib7();
    var builtin = require_main8();
    var polyfill = require_polyfill2();
    var ctor;
    if (hasFloat64ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dnrm2/lib/base.js
var require_base = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dnrm2/lib/base.js"(exports, module) {
    "use strict";
    var TSML = 14916681462400413e-170;
    var TBIG = 1997919072202235e131;
    var SSML = 44989137945431964e145;
    var SBIG = 11113793747425387e-178;
    function dnrm2(N, x, stride, offset) {
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
      if (N <= 0) {
        return 0;
      }
      scl = 1;
      sumsq = 0;
      notbig = true;
      asml = 0;
      amed = 0;
      abig = 0;
      ix = offset;
      for (i = 0; i < N; i++) {
        ax = Math.abs(x[ix]);
        if (ax > TBIG) {
          abig += ax * SBIG * (ax * SBIG);
          notbig = false;
        } else if (ax < TSML) {
          if (notbig) {
            asml += ax * SSML * (ax * SSML);
          }
        } else {
          amed += ax * ax;
        }
        ix += stride;
      }
      if (abig > 0) {
        if (amed > 0 || amed !== amed) {
          abig += amed * SBIG * SBIG;
        }
        scl = 1 / SBIG;
        sumsq = abig;
      } else if (asml > 0) {
        if (amed > 0 || amed !== amed) {
          amed = Math.sqrt(amed);
          asml = Math.sqrt(asml) / SSML;
          if (asml > amed) {
            ymin = amed;
            ymax = asml;
          } else {
            ymin = asml;
            ymax = amed;
          }
          scl = 1;
          sumsq = ymax * ymax * (1 + ymin / ymax * (ymin / ymax));
        } else {
          scl = 1 / SSML;
          sumsq = asml;
        }
      } else {
        scl = 1;
        sumsq = amed;
      }
      return scl * Math.sqrt(sumsq);
    }
    module.exports = dnrm2;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dscal/lib/base.js
var require_base2 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dscal/lib/base.js"(exports, module) {
    "use strict";
    var M = 5;
    function dscal(N, da, x, strideX, offsetX) {
      var ix;
      var m;
      var i;
      if (N <= 0) {
        return x;
      }
      ix = offsetX;
      if (strideX === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            x[ix] *= da;
            ix += 1;
          }
        }
        if (N < M) {
          return x;
        }
        for (i = m; i < N; i += M) {
          x[ix] *= da;
          x[ix + 1] *= da;
          x[ix + 2] *= da;
          x[ix + 3] *= da;
          x[ix + 4] *= da;
          ix += M;
        }
        return x;
      }
      for (i = 0; i < N; i++) {
        x[ix] *= da;
        ix += strideX;
      }
      return x;
    }
    module.exports = dscal;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlamch/lib/base.js
var require_base3 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlamch/lib/base.js"(exports, module) {
    "use strict";
    var EPS = 11102230246251565e-32;
    var SFMIN = 22250738585072014e-324;
    var BASE = 2;
    var PREC = EPS * BASE;
    var DIGITS = 53;
    var RND = 1;
    var EMIN = -1021;
    var RMIN = 22250738585072014e-324;
    var EMAX = 1024;
    var RMAX = 17976931348623157e292;
    var TABLE = {
      "epsilon": EPS,
      "Epsilon": EPS,
      "safe-minimum": SFMIN,
      "Safe minimum": SFMIN,
      "base": BASE,
      "Base": BASE,
      "precision": PREC,
      "Precision": PREC,
      "digits": DIGITS,
      "rounding": RND,
      "min-exponent": EMIN,
      "underflow": RMIN,
      "max-exponent": EMAX,
      "overflow": RMAX,
      "scale": SFMIN,
      "E": EPS,
      "e": EPS,
      "S": SFMIN,
      "s": SFMIN,
      "B": BASE,
      "b": BASE,
      "P": PREC,
      "p": PREC,
      "N": DIGITS,
      "n": DIGITS,
      "R": RND,
      "r": RND,
      "M": EMIN,
      "m": EMIN,
      "U": RMIN,
      "u": RMIN,
      "L": EMAX,
      "l": EMAX,
      "O": RMAX,
      "o": RMAX
    };
    function dlamch(cmach) {
      var v = TABLE[cmach];
      if (v !== void 0) {
        return v;
      }
      return 0;
    }
    module.exports = dlamch;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlapy2/lib/base.js
var require_base4 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlapy2/lib/base.js"(exports, module) {
    "use strict";
    function dlapy2(x, y) {
      var xabs;
      var yabs;
      var w;
      var z;
      if (x !== x) {
        return x;
      }
      if (y !== y) {
        return y;
      }
      xabs = Math.abs(x);
      yabs = Math.abs(y);
      w = Math.max(xabs, yabs);
      z = Math.min(xabs, yabs);
      if (z === 0 || w > 17976931348623157e292) {
        return w;
      }
      return w * Math.sqrt(1 + z / w * (z / w));
    }
    module.exports = dlapy2;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlarfg/lib/base.js
var require_base5 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlarfg/lib/base.js"(exports, module) {
    "use strict";
    var dnrm2 = require_base();
    var dscal = require_base2();
    var dlamch = require_base3();
    var dlapy2 = require_base4();
    function dlarfg(N, alpha, offsetAlpha, x, strideX, offsetX, tau, offsetTau) {
      var rsafmn;
      var safmin;
      var xnorm;
      var sign;
      var beta;
      var knt;
      var j;
      if (N <= 1) {
        tau[offsetTau] = 0;
        return;
      }
      xnorm = dnrm2(N - 1, x, strideX, offsetX);
      if (xnorm === 0) {
        tau[offsetTau] = 0;
      } else {
        sign = Math.sign(alpha[offsetAlpha]) || 1;
        beta = -sign * dlapy2(alpha[offsetAlpha], xnorm);
        safmin = dlamch("safe-minimum") / dlamch("epsilon");
        knt = 0;
        if (Math.abs(beta) < safmin) {
          rsafmn = 1 / safmin;
          do {
            knt += 1;
            dscal(N - 1, rsafmn, x, strideX, offsetX);
            beta *= rsafmn;
            alpha[offsetAlpha] *= rsafmn;
          } while (Math.abs(beta) < safmin && knt < 20);
          xnorm = dnrm2(N - 1, x, strideX, offsetX);
          sign = Math.sign(alpha[offsetAlpha]) || 1;
          beta = -sign * dlapy2(alpha[offsetAlpha], xnorm);
        }
        tau[offsetTau] = (beta - alpha[offsetAlpha]) / beta;
        dscal(N - 1, 1 / (alpha[offsetAlpha] - beta), x, strideX, offsetX);
        for (j = 0; j < knt; j++) {
          beta *= safmin;
        }
        alpha[offsetAlpha] = beta;
      }
    }
    module.exports = dlarfg;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dgemv/lib/base.js
var require_base6 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dgemv/lib/base.js"(exports, module) {
    "use strict";
    function dgemv(trans, M, N, alpha, A, strideA1, strideA2, offsetA, x, strideX, offsetX, beta, y, strideY, offsetY) {
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
      noTrans = trans === "no-transpose";
      if (M === 0 || N === 0 || alpha === 0 && beta === 1) {
        return y;
      }
      sa1 = strideA1;
      sa2 = strideA2;
      if (noTrans) {
        leny = M;
      } else {
        leny = N;
      }
      if (beta !== 1) {
        iy = offsetY;
        if (beta === 0) {
          for (i = 0; i < leny; i++) {
            y[iy] = 0;
            iy += strideY;
          }
        } else {
          for (i = 0; i < leny; i++) {
            y[iy] *= beta;
            iy += strideY;
          }
        }
      }
      if (alpha === 0) {
        return y;
      }
      if (noTrans) {
        jx = offsetX;
        for (j = 0; j < N; j++) {
          temp = alpha * x[jx];
          iy = offsetY;
          ia = offsetA + j * sa2;
          for (i = 0; i < M; i++) {
            y[iy] += temp * A[ia];
            iy += strideY;
            ia += sa1;
          }
          jx += strideX;
        }
      } else {
        jy = offsetY;
        for (j = 0; j < N; j++) {
          temp = 0;
          ix = offsetX;
          ia = offsetA + j * sa2;
          for (i = 0; i < M; i++) {
            temp += A[ia] * x[ix];
            ix += strideX;
            ia += sa1;
          }
          y[jy] += alpha * temp;
          jy += strideY;
        }
      }
      return y;
    }
    module.exports = dgemv;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dger/lib/base.js
var require_base7 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dger/lib/base.js"(exports, module) {
    "use strict";
    function dger(M, N, alpha, x, strideX, offsetX, y, strideY, offsetY, A, strideA1, strideA2, offsetA) {
      var temp;
      var ix;
      var jy;
      var i;
      var j;
      if (M === 0 || N === 0 || alpha === 0) {
        return A;
      }
      jy = offsetY;
      for (j = 0; j < N; j++) {
        if (y[jy] !== 0) {
          temp = alpha * y[jy];
          ix = offsetX;
          for (i = 0; i < M; i++) {
            A[offsetA + i * strideA1 + j * strideA2] += x[ix] * temp;
            ix += strideX;
          }
        }
        jy += strideY;
      }
      return A;
    }
    module.exports = dger;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/iladlr/lib/base.js
var require_base8 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/iladlr/lib/base.js"(exports, module) {
    "use strict";
    function iladlr(M, N, A, strideA1, strideA2, offsetA) {
      var result;
      var i;
      var j;
      if (M === 0) {
        return -1;
      }
      if (A[offsetA + (M - 1) * strideA1] !== 0 || A[offsetA + (M - 1) * strideA1 + (N - 1) * strideA2] !== 0) {
        return M - 1;
      }
      result = -1;
      for (j = 0; j < N; j++) {
        i = M - 1;
        while (i >= 0 && A[offsetA + i * strideA1 + j * strideA2] === 0) {
          i -= 1;
        }
        if (i > result) {
          result = i;
        }
      }
      return result;
    }
    module.exports = iladlr;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/iladlc/lib/base.js
var require_base9 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/iladlc/lib/base.js"(exports, module) {
    "use strict";
    function iladlc(M, N, A, strideA1, strideA2, offsetA) {
      var i;
      var j;
      if (N === 0) {
        return -1;
      }
      if (A[offsetA + (N - 1) * strideA2] !== 0 || A[offsetA + (M - 1) * strideA1 + (N - 1) * strideA2] !== 0) {
        return N - 1;
      }
      for (j = N - 1; j >= 0; j--) {
        for (i = 0; i < M; i++) {
          if (A[offsetA + i * strideA1 + j * strideA2] !== 0) {
            return j;
          }
        }
      }
      return -1;
    }
    module.exports = iladlc;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlarf/lib/base.js
var require_base10 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlarf/lib/base.js"(exports, module) {
    "use strict";
    var dgemv = require_base6();
    var dger = require_base7();
    var iladlr = require_base8();
    var iladlc = require_base9();
    function dlarf(side, M, N, v, strideV, offsetV, tau, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK) {
      var applyLeft;
      var lastv;
      var lastc;
      var ix;
      applyLeft = side === "left";
      lastv = 0;
      lastc = 0;
      if (tau !== 0) {
        if (applyLeft) {
          lastv = M;
        } else {
          lastv = N;
        }
        if (strideV > 0) {
          ix = offsetV + (lastv - 1) * strideV;
        } else {
          ix = offsetV;
        }
        while (lastv > 0 && v[ix] === 0) {
          lastv -= 1;
          ix -= strideV;
        }
        if (applyLeft) {
          lastc = iladlc(lastv, N, C, strideC1, strideC2, offsetC) + 1;
        } else {
          lastc = iladlr(M, lastv, C, strideC1, strideC2, offsetC) + 1;
        }
      }
      if (applyLeft) {
        if (lastv > 0) {
          dgemv("transpose", lastv, lastc, 1, C, strideC1, strideC2, offsetC, v, strideV, offsetV, 0, WORK, strideWORK, offsetWORK);
          dger(lastv, lastc, -tau, v, strideV, offsetV, WORK, strideWORK, offsetWORK, C, strideC1, strideC2, offsetC);
        }
      } else if (lastv > 0) {
        dgemv("no-transpose", lastc, lastv, 1, C, strideC1, strideC2, offsetC, v, strideV, offsetV, 0, WORK, strideWORK, offsetWORK);
        dger(lastc, lastv, -tau, WORK, strideWORK, offsetWORK, v, strideV, offsetV, C, strideC1, strideC2, offsetC);
      }
    }
    module.exports = dlarf;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dgeqr2/lib/base.js
var require_base11 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dgeqr2/lib/base.js"(exports, module) {
    "use strict";
    var dlarfg = require_base5();
    var dlarf = require_base10();
    function dgeqr2(M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK) {
      var alpha;
      var aii;
      var K;
      var i;
      K = Math.min(M, N);
      for (i = 0; i < K; i++) {
        aii = offsetA + i * strideA1 + i * strideA2;
        dlarfg(M - i, A, aii, A, strideA1, offsetA + Math.min(i + 1, M - 1) * strideA1 + i * strideA2, TAU, offsetTAU + i * strideTAU);
        if (i < N - 1) {
          alpha = A[aii];
          A[aii] = 1;
          dlarf("left", M - i, N - i - 1, A, strideA1, aii, TAU[offsetTAU + i * strideTAU], A, strideA1, strideA2, offsetA + i * strideA1 + (i + 1) * strideA2, WORK, strideWORK, offsetWORK);
          A[aii] = alpha;
        }
      }
      return 0;
    }
    module.exports = dgeqr2;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dcopy/lib/base.js
var require_base12 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dcopy/lib/base.js"(exports, module) {
    "use strict";
    var M = 7;
    function dcopy(N, x, strideX, offsetX, y, strideY, offsetY) {
      var ix;
      var iy;
      var m;
      var i;
      if (N <= 0) {
        return y;
      }
      ix = offsetX;
      iy = offsetY;
      if (strideX === 1 && strideY === 1) {
        m = N % M;
        if (m > 0) {
          for (i = 0; i < m; i++) {
            y[iy] = x[ix];
            ix += 1;
            iy += 1;
          }
        }
        if (N < M) {
          return y;
        }
        for (i = m; i < N; i += M) {
          y[iy] = x[ix];
          y[iy + 1] = x[ix + 1];
          y[iy + 2] = x[ix + 2];
          y[iy + 3] = x[ix + 3];
          y[iy + 4] = x[ix + 4];
          y[iy + 5] = x[ix + 5];
          y[iy + 6] = x[ix + 6];
          ix += M;
          iy += M;
        }
        return y;
      }
      for (i = 0; i < N; i++) {
        y[iy] = x[ix];
        ix += strideX;
        iy += strideY;
      }
      return y;
    }
    module.exports = dcopy;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dgemm/lib/base.js
var require_base13 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dgemm/lib/base.js"(exports, module) {
    "use strict";
    function dgemm(transa, transb, M, N, K, alpha, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB, beta, C, strideC1, strideC2, offsetC) {
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
      nota = transa === "no-transpose";
      notb = transb === "no-transpose";
      if (M === 0 || N === 0 || (alpha === 0 || K === 0) && beta === 1) {
        return C;
      }
      sa1 = strideA1;
      sa2 = strideA2;
      sb1 = strideB1;
      sb2 = strideB2;
      sc1 = strideC1;
      sc2 = strideC2;
      if (alpha === 0) {
        if (beta === 0) {
          for (j = 0; j < N; j++) {
            ic = offsetC + j * sc2;
            for (i = 0; i < M; i++) {
              C[ic] = 0;
              ic += sc1;
            }
          }
        } else {
          for (j = 0; j < N; j++) {
            ic = offsetC + j * sc2;
            for (i = 0; i < M; i++) {
              C[ic] *= beta;
              ic += sc1;
            }
          }
        }
        return C;
      }
      if (notb) {
        if (nota) {
          for (j = 0; j < N; j++) {
            if (beta === 0) {
              ic = offsetC + j * sc2;
              for (i = 0; i < M; i++) {
                C[ic] = 0;
                ic += sc1;
              }
            } else if (beta !== 1) {
              ic = offsetC + j * sc2;
              for (i = 0; i < M; i++) {
                C[ic] *= beta;
                ic += sc1;
              }
            }
            for (l = 0; l < K; l++) {
              temp = alpha * B[offsetB + l * sb1 + j * sb2];
              ia = offsetA + l * sa2;
              ic = offsetC + j * sc2;
              for (i = 0; i < M; i++) {
                C[ic] += temp * A[ia];
                ia += sa1;
                ic += sc1;
              }
            }
          }
        } else {
          for (j = 0; j < N; j++) {
            for (i = 0; i < M; i++) {
              temp = 0;
              ia = offsetA + i * sa2;
              ib = offsetB + j * sb2;
              for (l = 0; l < K; l++) {
                temp += A[ia] * B[ib];
                ia += sa1;
                ib += sb1;
              }
              ic = offsetC + i * sc1 + j * sc2;
              if (beta === 0) {
                C[ic] = alpha * temp;
              } else {
                C[ic] = alpha * temp + beta * C[ic];
              }
            }
          }
        }
      } else if (nota) {
        for (j = 0; j < N; j++) {
          if (beta === 0) {
            ic = offsetC + j * sc2;
            for (i = 0; i < M; i++) {
              C[ic] = 0;
              ic += sc1;
            }
          } else if (beta !== 1) {
            ic = offsetC + j * sc2;
            for (i = 0; i < M; i++) {
              C[ic] *= beta;
              ic += sc1;
            }
          }
          for (l = 0; l < K; l++) {
            temp = alpha * B[offsetB + j * sb1 + l * sb2];
            ia = offsetA + l * sa2;
            ic = offsetC + j * sc2;
            for (i = 0; i < M; i++) {
              C[ic] += temp * A[ia];
              ia += sa1;
              ic += sc1;
            }
          }
        }
      } else {
        for (j = 0; j < N; j++) {
          for (i = 0; i < M; i++) {
            temp = 0;
            ia = offsetA + i * sa2;
            ib = offsetB + j * sb1;
            for (l = 0; l < K; l++) {
              temp += A[ia] * B[ib];
              ia += sa1;
              ib += sb2;
            }
            ic = offsetC + i * sc1 + j * sc2;
            if (beta === 0) {
              C[ic] = alpha * temp;
            } else {
              C[ic] = alpha * temp + beta * C[ic];
            }
          }
        }
      }
      return C;
    }
    module.exports = dgemm;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dtrmm/lib/base.js
var require_base14 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dtrmm/lib/base.js"(exports, module) {
    "use strict";
    function dtrmm(side, uplo, transa, diag, M, N, alpha, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB) {
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
      if (M === 0 || N === 0) {
        return B;
      }
      lside = side === "left";
      upper = uplo === "upper";
      nounit = diag === "non-unit";
      sa1 = strideA1;
      sa2 = strideA2;
      sb1 = strideB1;
      sb2 = strideB2;
      if (alpha === 0) {
        for (j = 0; j < N; j++) {
          ib = offsetB + j * sb2;
          for (i = 0; i < M; i++) {
            B[ib] = 0;
            ib += sb1;
          }
        }
        return B;
      }
      if (lside) {
        if (transa === "no-transpose") {
          if (upper) {
            for (j = 0; j < N; j++) {
              for (k = 0; k < M; k++) {
                ib = offsetB + k * sb1 + j * sb2;
                if (B[ib] !== 0) {
                  temp = alpha * B[ib];
                  ia = offsetA + k * sa2;
                  for (i = 0; i < k; i++) {
                    B[offsetB + i * sb1 + j * sb2] += temp * A[ia];
                    ia += sa1;
                  }
                  if (nounit) {
                    B[ib] = temp * A[offsetA + k * sa1 + k * sa2];
                  } else {
                    B[ib] = temp;
                  }
                }
              }
            }
          } else {
            for (j = 0; j < N; j++) {
              for (k = M - 1; k >= 0; k--) {
                ib = offsetB + k * sb1 + j * sb2;
                if (B[ib] !== 0) {
                  temp = alpha * B[ib];
                  B[ib] = temp;
                  if (nounit) {
                    B[ib] = temp * A[offsetA + k * sa1 + k * sa2];
                  }
                  ia = offsetA + (k + 1) * sa1 + k * sa2;
                  for (i = k + 1; i < M; i++) {
                    B[offsetB + i * sb1 + j * sb2] += temp * A[ia];
                    ia += sa1;
                  }
                }
              }
            }
          }
        } else if (upper) {
          for (j = 0; j < N; j++) {
            for (i = M - 1; i >= 0; i--) {
              temp = B[offsetB + i * sb1 + j * sb2];
              if (nounit) {
                temp *= A[offsetA + i * sa1 + i * sa2];
              }
              ia = offsetA + i * sa2;
              for (k = 0; k < i; k++) {
                temp += A[ia] * B[offsetB + k * sb1 + j * sb2];
                ia += sa1;
              }
              B[offsetB + i * sb1 + j * sb2] = alpha * temp;
            }
          }
        } else {
          for (j = 0; j < N; j++) {
            for (i = 0; i < M; i++) {
              temp = B[offsetB + i * sb1 + j * sb2];
              if (nounit) {
                temp *= A[offsetA + i * sa1 + i * sa2];
              }
              for (k = i + 1; k < M; k++) {
                temp += A[offsetA + k * sa1 + i * sa2] * B[offsetB + k * sb1 + j * sb2];
              }
              B[offsetB + i * sb1 + j * sb2] = alpha * temp;
            }
          }
        }
      } else if (transa === "no-transpose") {
        if (upper) {
          for (j = N - 1; j >= 0; j--) {
            temp = alpha;
            if (nounit) {
              temp *= A[offsetA + j * sa1 + j * sa2];
            }
            ib = offsetB + j * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= temp;
              ib += sb1;
            }
            for (k = 0; k < j; k++) {
              if (A[offsetA + k * sa1 + j * sa2] !== 0) {
                temp = alpha * A[offsetA + k * sa1 + j * sa2];
                for (i = 0; i < M; i++) {
                  B[offsetB + i * sb1 + j * sb2] += temp * B[offsetB + i * sb1 + k * sb2];
                }
              }
            }
          }
        } else {
          for (j = 0; j < N; j++) {
            temp = alpha;
            if (nounit) {
              temp *= A[offsetA + j * sa1 + j * sa2];
            }
            ib = offsetB + j * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= temp;
              ib += sb1;
            }
            for (k = j + 1; k < N; k++) {
              if (A[offsetA + k * sa1 + j * sa2] !== 0) {
                temp = alpha * A[offsetA + k * sa1 + j * sa2];
                for (i = 0; i < M; i++) {
                  B[offsetB + i * sb1 + j * sb2] += temp * B[offsetB + i * sb1 + k * sb2];
                }
              }
            }
          }
        }
      } else if (upper) {
        for (k = 0; k < N; k++) {
          for (j = 0; j < k; j++) {
            if (A[offsetA + j * sa1 + k * sa2] !== 0) {
              temp = alpha * A[offsetA + j * sa1 + k * sa2];
              for (i = 0; i < M; i++) {
                B[offsetB + i * sb1 + j * sb2] += temp * B[offsetB + i * sb1 + k * sb2];
              }
            }
          }
          temp = alpha;
          if (nounit) {
            temp *= A[offsetA + k * sa1 + k * sa2];
          }
          if (temp !== 1) {
            ib = offsetB + k * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= temp;
              ib += sb1;
            }
          }
        }
      } else {
        for (k = N - 1; k >= 0; k--) {
          for (j = k + 1; j < N; j++) {
            if (A[offsetA + j * sa1 + k * sa2] !== 0) {
              temp = alpha * A[offsetA + j * sa1 + k * sa2];
              for (i = 0; i < M; i++) {
                B[offsetB + i * sb1 + j * sb2] += temp * B[offsetB + i * sb1 + k * sb2];
              }
            }
          }
          temp = alpha;
          if (nounit) {
            temp *= A[offsetA + k * sa1 + k * sa2];
          }
          if (temp !== 1) {
            ib = offsetB + k * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= temp;
              ib += sb1;
            }
          }
        }
      }
      return B;
    }
    module.exports = dtrmm;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlarfb/lib/base.js
var require_base15 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlarfb/lib/base.js"(exports, module) {
    "use strict";
    var dcopy = require_base12();
    var dgemm = require_base13();
    var dtrmm = require_base14();
    function dlarfb(side, trans, direct, storev, M, N, K, V, strideV1, strideV2, offsetV, T, strideT1, strideT2, offsetT, C, strideC1, strideC2, offsetC, WORK, strideWORK1, strideWORK2, offsetWORK) {
      var transt;
      var i;
      var j;
      if (M <= 0 || N <= 0) {
        return;
      }
      if (trans === "no-transpose") {
        transt = "transpose";
      } else {
        transt = "no-transpose";
      }
      if (storev === "columnwise") {
        if (direct === "forward") {
          if (side === "left") {
            for (j = 0; j < K; j++) {
              dcopy(N, C, strideC2, offsetC + j * strideC1, WORK, strideWORK1, offsetWORK + j * strideWORK2);
            }
            dtrmm("right", "lower", "no-transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
            if (M > K) {
              dgemm("transpose", "no-transpose", N, K, M - K, 1, C, strideC1, strideC2, offsetC + K * strideC1, V, strideV1, strideV2, offsetV + K * strideV1, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
            }
            dtrmm("right", "upper", transt, "non-unit", N, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
            if (M > K) {
              dgemm("no-transpose", "transpose", M - K, N, K, -1, V, strideV1, strideV2, offsetV + K * strideV1, WORK, strideWORK1, strideWORK2, offsetWORK, 1, C, strideC1, strideC2, offsetC + K * strideC1);
            }
            dtrmm("right", "lower", "transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
            for (j = 0; j < K; j++) {
              for (i = 0; i < N; i++) {
                C[offsetC + j * strideC1 + i * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
              }
            }
          } else if (side === "right") {
            for (j = 0; j < K; j++) {
              dcopy(M, C, strideC1, offsetC + j * strideC2, WORK, strideWORK1, offsetWORK + j * strideWORK2);
            }
            dtrmm("right", "lower", "no-transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
            if (N > K) {
              dgemm("no-transpose", "no-transpose", M, K, N - K, 1, C, strideC1, strideC2, offsetC + K * strideC2, V, strideV1, strideV2, offsetV + K * strideV1, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
            }
            dtrmm("right", "upper", trans, "non-unit", M, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
            if (N > K) {
              dgemm("no-transpose", "transpose", M, N - K, K, -1, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV + K * strideV1, 1, C, strideC1, strideC2, offsetC + K * strideC2);
            }
            dtrmm("right", "lower", "transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
            for (j = 0; j < K; j++) {
              for (i = 0; i < M; i++) {
                C[offsetC + i * strideC1 + j * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
              }
            }
          }
        } else if (side === "left") {
          for (j = 0; j < K; j++) {
            dcopy(N, C, strideC2, offsetC + (M - K + j) * strideC1, WORK, strideWORK1, offsetWORK + j * strideWORK2);
          }
          dtrmm("right", "upper", "no-transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV + (M - K) * strideV1, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (M > K) {
            dgemm("transpose", "no-transpose", N, K, M - K, 1, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
          }
          dtrmm("right", "lower", transt, "non-unit", N, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (M > K) {
            dgemm("no-transpose", "transpose", M - K, N, K, -1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK, 1, C, strideC1, strideC2, offsetC);
          }
          dtrmm("right", "upper", "transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV + (M - K) * strideV1, WORK, strideWORK1, strideWORK2, offsetWORK);
          for (j = 0; j < K; j++) {
            for (i = 0; i < N; i++) {
              C[offsetC + (M - K + j) * strideC1 + i * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
            }
          }
        } else if (side === "right") {
          for (j = 0; j < K; j++) {
            dcopy(M, C, strideC1, offsetC + (N - K + j) * strideC2, WORK, strideWORK1, offsetWORK + j * strideWORK2);
          }
          dtrmm("right", "upper", "no-transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV + (N - K) * strideV1, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (N > K) {
            dgemm("no-transpose", "no-transpose", M, K, N - K, 1, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
          }
          dtrmm("right", "lower", trans, "non-unit", M, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (N > K) {
            dgemm("no-transpose", "transpose", M, N - K, K, -1, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV, 1, C, strideC1, strideC2, offsetC);
          }
          dtrmm("right", "upper", "transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV + (N - K) * strideV1, WORK, strideWORK1, strideWORK2, offsetWORK);
          for (j = 0; j < K; j++) {
            for (i = 0; i < M; i++) {
              C[offsetC + i * strideC1 + (N - K + j) * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
            }
          }
        }
      } else if (direct === "forward") {
        if (side === "left") {
          for (j = 0; j < K; j++) {
            dcopy(N, C, strideC2, offsetC + j * strideC1, WORK, strideWORK1, offsetWORK + j * strideWORK2);
          }
          dtrmm("right", "upper", "transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (M > K) {
            dgemm("transpose", "transpose", N, K, M - K, 1, C, strideC1, strideC2, offsetC + K * strideC1, V, strideV1, strideV2, offsetV + K * strideV2, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
          }
          dtrmm("right", "upper", transt, "non-unit", N, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (M > K) {
            dgemm("transpose", "transpose", M - K, N, K, -1, V, strideV1, strideV2, offsetV + K * strideV2, WORK, strideWORK1, strideWORK2, offsetWORK, 1, C, strideC1, strideC2, offsetC + K * strideC1);
          }
          dtrmm("right", "upper", "no-transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
          for (j = 0; j < K; j++) {
            for (i = 0; i < N; i++) {
              C[offsetC + j * strideC1 + i * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
            }
          }
        } else if (side === "right") {
          for (j = 0; j < K; j++) {
            dcopy(M, C, strideC1, offsetC + j * strideC2, WORK, strideWORK1, offsetWORK + j * strideWORK2);
          }
          dtrmm("right", "upper", "transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (N > K) {
            dgemm("no-transpose", "transpose", M, K, N - K, 1, C, strideC1, strideC2, offsetC + K * strideC2, V, strideV1, strideV2, offsetV + K * strideV2, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
          }
          dtrmm("right", "upper", trans, "non-unit", M, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
          if (N > K) {
            dgemm("no-transpose", "no-transpose", M, N - K, K, -1, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV + K * strideV2, 1, C, strideC1, strideC2, offsetC + K * strideC2);
          }
          dtrmm("right", "upper", "no-transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK);
          for (j = 0; j < K; j++) {
            for (i = 0; i < M; i++) {
              C[offsetC + i * strideC1 + j * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
            }
          }
        }
      } else if (side === "left") {
        for (j = 0; j < K; j++) {
          dcopy(N, C, strideC2, offsetC + (M - K + j) * strideC1, WORK, strideWORK1, offsetWORK + j * strideWORK2);
        }
        dtrmm("right", "lower", "transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV + (M - K) * strideV2, WORK, strideWORK1, strideWORK2, offsetWORK);
        if (M > K) {
          dgemm("transpose", "transpose", N, K, M - K, 1, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
        }
        dtrmm("right", "lower", transt, "non-unit", N, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
        if (M > K) {
          dgemm("transpose", "transpose", M - K, N, K, -1, V, strideV1, strideV2, offsetV, WORK, strideWORK1, strideWORK2, offsetWORK, 1, C, strideC1, strideC2, offsetC);
        }
        dtrmm("right", "lower", "no-transpose", "unit", N, K, 1, V, strideV1, strideV2, offsetV + (M - K) * strideV2, WORK, strideWORK1, strideWORK2, offsetWORK);
        for (j = 0; j < K; j++) {
          for (i = 0; i < N; i++) {
            C[offsetC + (M - K + j) * strideC1 + i * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
          }
        }
      } else if (side === "right") {
        for (j = 0; j < K; j++) {
          dcopy(M, C, strideC1, offsetC + (N - K + j) * strideC2, WORK, strideWORK1, offsetWORK + j * strideWORK2);
        }
        dtrmm("right", "lower", "transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV + (N - K) * strideV2, WORK, strideWORK1, strideWORK2, offsetWORK);
        if (N > K) {
          dgemm("no-transpose", "transpose", M, K, N - K, 1, C, strideC1, strideC2, offsetC, V, strideV1, strideV2, offsetV, 1, WORK, strideWORK1, strideWORK2, offsetWORK);
        }
        dtrmm("right", "lower", trans, "non-unit", M, K, 1, T, strideT1, strideT2, offsetT, WORK, strideWORK1, strideWORK2, offsetWORK);
        if (N > K) {
          dgemm("no-transpose", "no-transpose", M, N - K, K, -1, WORK, strideWORK1, strideWORK2, offsetWORK, V, strideV1, strideV2, offsetV, 1, C, strideC1, strideC2, offsetC);
        }
        dtrmm("right", "lower", "no-transpose", "unit", M, K, 1, V, strideV1, strideV2, offsetV + (N - K) * strideV2, WORK, strideWORK1, strideWORK2, offsetWORK);
        for (j = 0; j < K; j++) {
          for (i = 0; i < M; i++) {
            C[offsetC + i * strideC1 + (N - K + j) * strideC2] -= WORK[offsetWORK + i * strideWORK1 + j * strideWORK2];
          }
        }
      }
    }
    module.exports = dlarfb;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dtrmv/lib/base.js
var require_base16 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dtrmv/lib/base.js"(exports, module) {
    "use strict";
    function dtrmv(uplo, trans, diag, N, A, strideA1, strideA2, offsetA, x, strideX, offsetX) {
      var nounit;
      var temp;
      var sa1;
      var sa2;
      var ix;
      var jx;
      var ia;
      var i;
      var j;
      if (N <= 0) {
        return x;
      }
      nounit = diag === "non-unit";
      sa1 = strideA1;
      sa2 = strideA2;
      if (trans === "no-transpose") {
        if (uplo === "upper") {
          jx = offsetX;
          for (j = 0; j < N; j++) {
            if (x[jx] !== 0) {
              temp = x[jx];
              ix = offsetX;
              ia = offsetA + j * sa2;
              for (i = 0; i < j; i++) {
                x[ix] += temp * A[ia];
                ix += strideX;
                ia += sa1;
              }
              if (nounit) {
                x[jx] *= A[offsetA + j * sa1 + j * sa2];
              }
            }
            jx += strideX;
          }
        } else {
          jx = offsetX + (N - 1) * strideX;
          for (j = N - 1; j >= 0; j--) {
            if (x[jx] !== 0) {
              temp = x[jx];
              ix = offsetX + (N - 1) * strideX;
              ia = offsetA + (N - 1) * sa1 + j * sa2;
              for (i = N - 1; i > j; i--) {
                x[ix] += temp * A[ia];
                ix -= strideX;
                ia -= sa1;
              }
              if (nounit) {
                x[jx] *= A[offsetA + j * sa1 + j * sa2];
              }
            }
            jx -= strideX;
          }
        }
      } else if (uplo === "upper") {
        jx = offsetX + (N - 1) * strideX;
        for (j = N - 1; j >= 0; j--) {
          temp = x[jx];
          if (nounit) {
            temp *= A[offsetA + j * sa1 + j * sa2];
          }
          ix = offsetX + (j - 1) * strideX;
          ia = offsetA + (j - 1) * sa1 + j * sa2;
          for (i = j - 1; i >= 0; i--) {
            temp += A[ia] * x[ix];
            ix -= strideX;
            ia -= sa1;
          }
          x[jx] = temp;
          jx -= strideX;
        }
      } else {
        jx = offsetX;
        for (j = 0; j < N; j++) {
          temp = x[jx];
          if (nounit) {
            temp *= A[offsetA + j * sa1 + j * sa2];
          }
          ix = offsetX + (j + 1) * strideX;
          ia = offsetA + (j + 1) * sa1 + j * sa2;
          for (i = j + 1; i < N; i++) {
            temp += A[ia] * x[ix];
            ix += strideX;
            ia += sa1;
          }
          x[jx] = temp;
          jx += strideX;
        }
      }
      return x;
    }
    module.exports = dtrmv;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlarft/lib/base.js
var require_base17 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlarft/lib/base.js"(exports, module) {
    "use strict";
    var dgemv = require_base6();
    var dtrmv = require_base16();
    function dlarft(direct, storev, N, K, V, strideV1, strideV2, offsetV, TAU, strideTAU, offsetTAU, T, strideT1, strideT2, offsetT) {
      var prevlastv;
      var lastv;
      var jj;
      var i;
      var j;
      if (N === 0) {
        return;
      }
      if (direct === "forward") {
        prevlastv = N;
        for (i = 0; i < K; i++) {
          prevlastv = Math.max(prevlastv, i);
          if (TAU[offsetTAU + i * strideTAU] === 0) {
            for (j = 0; j <= i; j++) {
              T[offsetT + j * strideT1 + i * strideT2] = 0;
            }
          } else {
            if (storev === "columnwise") {
              lastv = N;
              for (jj = N - 1; jj > i; jj--) {
                if (V[offsetV + jj * strideV1 + i * strideV2] !== 0) {
                  break;
                }
                lastv = jj;
              }
              for (j = 0; j < i; j++) {
                T[offsetT + j * strideT1 + i * strideT2] = -(TAU[offsetTAU + i * strideTAU] * V[offsetV + i * strideV1 + j * strideV2]);
              }
              jj = Math.min(lastv, prevlastv);
              if (jj - i - 1 > 0) {
                dgemv("transpose", jj - i - 1, i, -TAU[offsetTAU + i * strideTAU], V, strideV1, strideV2, offsetV + (i + 1) * strideV1, V, strideV1, offsetV + (i + 1) * strideV1 + i * strideV2, 1, T, strideT1, offsetT + i * strideT2);
              }
            } else {
              lastv = N;
              for (jj = N - 1; jj > i; jj--) {
                if (V[offsetV + i * strideV1 + jj * strideV2] !== 0) {
                  break;
                }
                lastv = jj;
              }
              for (j = 0; j < i; j++) {
                T[offsetT + j * strideT1 + i * strideT2] = -(TAU[offsetTAU + i * strideTAU] * V[offsetV + j * strideV1 + i * strideV2]);
              }
              jj = Math.min(lastv, prevlastv);
              if (jj - i - 1 > 0) {
                dgemv("no-transpose", i, jj - i - 1, -TAU[offsetTAU + i * strideTAU], V, strideV1, strideV2, offsetV + (i + 1) * strideV2, V, strideV2, offsetV + i * strideV1 + (i + 1) * strideV2, 1, T, strideT1, offsetT + i * strideT2);
              }
            }
            if (i > 0) {
              dtrmv("upper", "no-transpose", "non-unit", i, T, strideT1, strideT2, offsetT, T, strideT1, offsetT + i * strideT2);
            }
            T[offsetT + i * strideT1 + i * strideT2] = TAU[offsetTAU + i * strideTAU];
            if (i > 0) {
              prevlastv = Math.max(prevlastv, lastv);
            } else {
              prevlastv = lastv;
            }
          }
        }
      } else {
        prevlastv = 0;
        for (i = K - 1; i >= 0; i--) {
          if (TAU[offsetTAU + i * strideTAU] === 0) {
            for (j = i; j < K; j++) {
              T[offsetT + j * strideT1 + i * strideT2] = 0;
            }
          } else {
            if (i < K - 1) {
              if (storev === "columnwise") {
                lastv = 0;
                for (jj = 0; jj < i; jj++) {
                  if (V[offsetV + jj * strideV1 + i * strideV2] !== 0) {
                    break;
                  }
                  lastv = jj + 1;
                }
                for (j = i + 1; j < K; j++) {
                  T[offsetT + j * strideT1 + i * strideT2] = -(TAU[offsetTAU + i * strideTAU] * V[offsetV + (N - K + i) * strideV1 + j * strideV2]);
                }
                jj = Math.max(lastv, prevlastv);
                if (N - K + i - jj > 0) {
                  dgemv("transpose", N - K + i - jj, K - i - 1, -TAU[offsetTAU + i * strideTAU], V, strideV1, strideV2, offsetV + jj * strideV1 + (i + 1) * strideV2, V, strideV1, offsetV + jj * strideV1 + i * strideV2, 1, T, strideT1, offsetT + (i + 1) * strideT1 + i * strideT2);
                }
              } else {
                lastv = 0;
                for (jj = 0; jj < i; jj++) {
                  if (V[offsetV + i * strideV1 + jj * strideV2] !== 0) {
                    break;
                  }
                  lastv = jj + 1;
                }
                for (j = i + 1; j < K; j++) {
                  T[offsetT + j * strideT1 + i * strideT2] = -(TAU[offsetTAU + i * strideTAU] * V[offsetV + j * strideV1 + (N - K + i) * strideV2]);
                }
                jj = Math.max(lastv, prevlastv);
                if (N - K + i - jj > 0) {
                  dgemv("no-transpose", K - i - 1, N - K + i - jj, -TAU[offsetTAU + i * strideTAU], V, strideV1, strideV2, offsetV + (i + 1) * strideV1 + jj * strideV2, V, strideV2, offsetV + i * strideV1 + jj * strideV2, 1, T, strideT1, offsetT + (i + 1) * strideT1 + i * strideT2);
                }
              }
              dtrmv("lower", "no-transpose", "non-unit", K - i - 1, T, strideT1, strideT2, offsetT + (i + 1) * strideT1 + (i + 1) * strideT2, T, strideT1, offsetT + (i + 1) * strideT1 + i * strideT2);
              if (i > 0) {
                prevlastv = Math.min(prevlastv, lastv);
              } else {
                prevlastv = lastv;
              }
            }
            T[offsetT + i * strideT1 + i * strideT2] = TAU[offsetTAU + i * strideTAU];
          }
        }
      }
    }
    module.exports = dlarft;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dgeqrf/lib/base.js
var require_base18 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dgeqrf/lib/base.js"(exports, module) {
    "use strict";
    var dgeqr2 = require_base11();
    var dlarfb = require_base15();
    var dlarft = require_base17();
    var DEFAULT_NB = 32;
    function dgeqrf(M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK) {
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
      K = Math.min(M, N);
      if (K === 0) {
        return 0;
      }
      nb = DEFAULT_NB;
      nbmin = 2;
      nx = 0;
      iws = N;
      ldwork = N;
      T = WORK;
      if (nb > 1 && nb < K) {
        iws = ldwork * nb;
      }
      offsetT = offsetWORK + iws;
      if (nb >= nbmin && nb < K && nx < K) {
        i = 0;
        while (i <= K - 1 - nx) {
          ib = Math.min(K - i, nb);
          dgeqr2(M - i, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, WORK, strideWORK, offsetWORK);
          if (i + ib < N) {
            dlarft("forward", "columnwise", M - i, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, T, 1, nb, offsetT);
            dlarfb("left", "transpose", "forward", "columnwise", M - i, N - i - ib, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, T, 1, nb, offsetT, A, strideA1, strideA2, offsetA + i * strideA1 + (i + ib) * strideA2, WORK, 1, ldwork, offsetWORK);
          }
          i += nb;
        }
      } else {
        i = 0;
      }
      if (i <= K - 1) {
        dgeqr2(M - i, N - i, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, WORK, strideWORK, offsetWORK);
      }
      return 0;
    }
    module.exports = dgeqrf;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dgelq2/lib/base.js
var require_base19 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dgelq2/lib/base.js"(exports, module) {
    "use strict";
    var dlarfg = require_base5();
    var dlarf = require_base10();
    function dgelq2(M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK) {
      var save;
      var aii;
      var K;
      var i;
      K = Math.min(M, N);
      for (i = 0; i < K; i++) {
        aii = offsetA + i * strideA1 + i * strideA2;
        dlarfg(N - i, A, aii, A, strideA2, offsetA + i * strideA1 + Math.min(i + 1, N - 1) * strideA2, TAU, offsetTAU + i * strideTAU);
        if (i < M - 1) {
          save = A[aii];
          A[aii] = 1;
          dlarf(
            "right",
            M - i - 1,
            // number of rows of sub-matrix
            N - i,
            // number of columns of sub-matrix
            A,
            strideA2,
            aii,
            // v = row i from col i onward, stride along columns
            TAU[offsetTAU + i * strideTAU],
            // tau is a plain scalar for dlarf
            A,
            strideA1,
            strideA2,
            offsetA + (i + 1) * strideA1 + i * strideA2,
            // C = A(i+1, i)
            WORK,
            strideWORK,
            offsetWORK
          );
          A[aii] = save;
        }
      }
      return 0;
    }
    module.exports = dgelq2;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dgelqf/lib/base.js
var require_base20 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dgelqf/lib/base.js"(exports, module) {
    "use strict";
    var Float64Array2 = require_lib8();
    var dgelq2 = require_base19();
    var dlarfb = require_base15();
    var dlarft = require_base17();
    var DEFAULT_NB = 32;
    function dgelqf(M, N, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, WORK, strideWORK, offsetWORK) {
      var ldwork;
      var nbmin;
      var iws;
      var ib;
      var nb;
      var nx;
      var T;
      var K;
      var i;
      K = Math.min(M, N);
      if (K === 0) {
        return 0;
      }
      nb = DEFAULT_NB;
      nbmin = 2;
      nx = 0;
      iws = M;
      if (nb > 1 && nb < K) {
        nx = 0;
        if (nx < K) {
          ldwork = M;
          iws = ldwork * nb;
        }
      }
      T = new Float64Array2(nb * nb);
      ldwork = M;
      if (nb >= nbmin && nb < K && nx < K) {
        i = 0;
        while (i <= K - 1 - nx) {
          ib = Math.min(K - i, nb);
          dgelq2(ib, N - i, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, WORK, strideWORK, offsetWORK);
          if (i + ib < M) {
            dlarft("forward", "rowwise", N - i, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, T, 1, nb, 0);
            dlarfb("right", "no-transpose", "forward", "rowwise", M - i - ib, N - i, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, T, 1, nb, 0, A, strideA1, strideA2, offsetA + (i + ib) * strideA1 + i * strideA2, WORK, 1, ldwork, offsetWORK);
          }
          i += nb;
        }
      } else {
        i = 0;
      }
      if (i <= K - 1) {
        dgelq2(M - i, N - i, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, WORK, strideWORK, offsetWORK);
      }
      return 0;
    }
    module.exports = dgelqf;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dorm2r/lib/base.js
var require_base21 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dorm2r/lib/base.js"(exports, module) {
    "use strict";
    var dlarf = require_base10();
    function dorm2r(side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK) {
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
      if (M === 0 || N === 0 || K === 0) {
        return 0;
      }
      left = side === "left";
      notran = trans === "no-transpose";
      if (left && !notran || !left && notran) {
        i1 = 0;
        i2 = K;
        i3 = 1;
      } else {
        i1 = K - 1;
        i2 = -1;
        i3 = -1;
      }
      if (left) {
        ni = N;
        jc = 0;
      } else {
        mi = M;
        ic = 0;
      }
      for (i = i1; i !== i2; i += i3) {
        if (left) {
          mi = M - i;
          ic = i;
        } else {
          ni = N - i;
          jc = i;
        }
        idxA = offsetA + i * strideA1 + i * strideA2;
        aii = A[idxA];
        A[idxA] = 1;
        dlarf(side, mi, ni, A, strideA1, offsetA + i * strideA1 + i * strideA2, TAU[offsetTAU + i * strideTAU], C, strideC1, strideC2, offsetC + ic * strideC1 + jc * strideC2, WORK, strideWORK, offsetWORK);
        A[idxA] = aii;
      }
      return 0;
    }
    module.exports = dorm2r;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dormqr/lib/base.js
var require_base22 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dormqr/lib/base.js"(exports, module) {
    "use strict";
    var dlarfb = require_base15();
    var dlarft = require_base17();
    var dorm2r = require_base21();
    var NB = 32;
    function dormqr(side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK) {
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
      left = side === "left";
      notran = trans === "no-transpose";
      if (left) {
        nq = M;
        nw = Math.max(1, N);
      } else {
        nq = N;
        nw = Math.max(1, M);
      }
      if (M === 0 || N === 0 || K === 0) {
        return 0;
      }
      nb = NB;
      ldwork = nw;
      ldt = nb + 1;
      T = WORK;
      offsetT = offsetWORK + nw * nb;
      if (nb >= K) {
        dorm2r(side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK);
        return 0;
      }
      if (left && !notran || !left && notran) {
        i1 = 0;
        i2 = K;
        i3 = nb;
      } else {
        i1 = Math.floor((K - 1) / nb) * nb;
        i2 = -1;
        i3 = -nb;
      }
      if (left) {
        ni = N;
        jc = 0;
      } else {
        mi = M;
        ic = 0;
      }
      for (i = i1; i3 > 0 ? i < i2 : i > i2; i += i3) {
        ib = Math.min(nb, K - i);
        dlarft("forward", "columnwise", nq - i, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, T, 1, ldt, offsetT);
        if (left) {
          mi = M - i;
          ic = i;
        } else {
          ni = N - i;
          jc = i;
        }
        dlarfb(side, trans, "forward", "columnwise", mi, ni, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, T, 1, ldt, offsetT, C, strideC1, strideC2, offsetC + ic * strideC1 + jc * strideC2, WORK, 1, ldwork, offsetWORK);
      }
      return 0;
    }
    module.exports = dormqr;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dorml2/lib/base.js
var require_base23 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dorml2/lib/base.js"(exports, module) {
    "use strict";
    var dlarf = require_base10();
    function dorml2(side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK) {
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
      if (M === 0 || N === 0 || K === 0) {
        return 0;
      }
      left = side === "left";
      notran = trans === "no-transpose";
      if (left && notran || !left && !notran) {
        i1 = 0;
        i2 = K;
        i3 = 1;
      } else {
        i1 = K - 1;
        i2 = -1;
        i3 = -1;
      }
      if (left) {
        ni = N;
        jc = 0;
      } else {
        mi = M;
        ic = 0;
      }
      for (i = i1; i3 > 0 ? i < i2 : i > i2; i += i3) {
        if (left) {
          mi = M - i;
          ic = i;
        } else {
          ni = N - i;
          jc = i;
        }
        aii = A[offsetA + i * strideA1 + i * strideA2];
        A[offsetA + i * strideA1 + i * strideA2] = 1;
        dlarf(side, mi, ni, A, strideA2, offsetA + i * strideA1 + i * strideA2, TAU[offsetTAU + i * strideTAU], C, strideC1, strideC2, offsetC + ic * strideC1 + jc * strideC2, WORK, strideWORK, offsetWORK);
        A[offsetA + i * strideA1 + i * strideA2] = aii;
      }
      return 0;
    }
    module.exports = dorml2;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dormlq/lib/base.js
var require_base24 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dormlq/lib/base.js"(exports, module) {
    "use strict";
    var dlarfb = require_base15();
    var dlarft = require_base17();
    var dorml2 = require_base23();
    var NB = 32;
    function dormlq(side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK) {
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
      if (M === 0 || N === 0 || K === 0) {
        return 0;
      }
      left = side === "left";
      notran = trans === "no-transpose";
      if (left) {
        nq = M;
        nw = Math.max(1, N);
      } else {
        nq = N;
        nw = Math.max(1, M);
      }
      nb = NB;
      if (nb > K) {
        nb = K;
      }
      if (nb < 2 || nb >= K) {
        return dorml2(side, trans, M, N, K, A, strideA1, strideA2, offsetA, TAU, strideTAU, offsetTAU, C, strideC1, strideC2, offsetC, WORK, strideWORK, offsetWORK);
      }
      ldwork = nw;
      ldt = nb + 1;
      T = WORK;
      offsetT = offsetWORK + ldwork * nb;
      if (left && notran || !left && !notran) {
        i1 = 0;
        i2 = K;
        i3 = nb;
      } else {
        i1 = Math.floor((K - 1) / nb) * nb;
        i2 = -1;
        i3 = -nb;
      }
      if (left) {
        ni = N;
        jc = 0;
      } else {
        mi = M;
        ic = 0;
      }
      if (notran) {
        transt = "transpose";
      } else {
        transt = "no-transpose";
      }
      for (i = i1; i3 > 0 ? i < i2 : i > i2; i += i3) {
        ib = Math.min(nb, K - i);
        dlarft("forward", "rowwise", nq - i, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, TAU, strideTAU, offsetTAU + i * strideTAU, T, 1, ldt, offsetT);
        if (left) {
          mi = M - i;
          ic = i;
        } else {
          ni = N - i;
          jc = i;
        }
        dlarfb(side, transt, "forward", "rowwise", mi, ni, ib, A, strideA1, strideA2, offsetA + i * strideA1 + i * strideA2, T, 1, ldt, offsetT, C, strideC1, strideC2, offsetC + ic * strideC1 + jc * strideC2, WORK, 1, ldwork, offsetWORK);
      }
      return 0;
    }
    module.exports = dormlq;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlassq/lib/base.js
var require_base25 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlassq/lib/base.js"(exports, module) {
    "use strict";
    var TSML = Math.pow(2, -511);
    var TBIG = Math.pow(2, 486);
    var SSML = Math.pow(2, 537);
    var SBIG = Math.pow(2, -538);
    function dlassq(N, x, stride, offset, scale, sumsq) {
      var notbig;
      var abig;
      var amed;
      var asml;
      var ymax;
      var ymin;
      var ax;
      var ix;
      var i;
      if (scale !== scale || sumsq !== sumsq) {
        return {
          "scl": scale,
          "sumsq": sumsq
        };
      }
      if (sumsq === 0) {
        scale = 1;
      }
      if (scale === 0) {
        scale = 1;
        sumsq = 0;
      }
      if (N <= 0) {
        return {
          "scl": scale,
          "sumsq": sumsq
        };
      }
      notbig = true;
      asml = 0;
      amed = 0;
      abig = 0;
      ix = offset;
      if (stride < 0) {
        ix = offset - (N - 1) * stride;
      }
      for (i = 0; i < N; i++) {
        ax = Math.abs(x[ix]);
        if (ax > TBIG) {
          abig += ax * SBIG * (ax * SBIG);
          notbig = false;
        } else if (ax < TSML) {
          if (notbig) {
            asml += ax * SSML * (ax * SSML);
          }
        } else {
          amed += ax * ax;
        }
        ix += stride;
      }
      if (sumsq > 0) {
        ax = scale * Math.sqrt(sumsq);
        if (ax > TBIG) {
          if (scale > 1) {
            scale *= SBIG;
            abig += scale * (scale * sumsq);
          } else {
            abig += scale * (scale * (SBIG * (SBIG * sumsq)));
          }
        } else if (ax < TSML) {
          if (notbig) {
            if (scale < 1) {
              scale *= SSML;
              asml += scale * (scale * sumsq);
            } else {
              asml += scale * (scale * (SSML * (SSML * sumsq)));
            }
          }
        } else {
          amed += scale * (scale * sumsq);
        }
      }
      if (abig > 0) {
        if (amed > 0 || amed !== amed) {
          abig += amed * SBIG * SBIG;
        }
        scale = 1 / SBIG;
        sumsq = abig;
      } else if (asml > 0) {
        if (amed > 0 || amed !== amed) {
          amed = Math.sqrt(amed);
          asml = Math.sqrt(asml) / SSML;
          if (asml > amed) {
            ymin = amed;
            ymax = asml;
          } else {
            ymin = asml;
            ymax = amed;
          }
          scale = 1;
          sumsq = ymax * ymax * (1 + ymin / ymax * (ymin / ymax));
        } else {
          scale = 1 / SSML;
          sumsq = asml;
        }
      } else {
        scale = 1;
        sumsq = amed;
      }
      return {
        "scl": scale,
        "sumsq": sumsq
      };
    }
    module.exports = dlassq;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlange/lib/base.js
var require_base26 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlange/lib/base.js"(exports, module) {
    "use strict";
    var dlassq = require_base25();
    function dlange(norm, M, N, A, strideA1, strideA2, offsetA, WORK, strideWORK, offsetWORK) {
      var value;
      var scale;
      var temp;
      var sum;
      var out;
      var ai;
      var wi;
      var i;
      var j;
      if (M === 0 || N === 0) {
        return 0;
      }
      if (norm === "max") {
        value = 0;
        for (j = 0; j < N; j++) {
          ai = offsetA + j * strideA2;
          for (i = 0; i < M; i++) {
            temp = Math.abs(A[ai]);
            if (value < temp || temp !== temp) {
              value = temp;
            }
            ai += strideA1;
          }
        }
      } else if (norm === "one-norm") {
        value = 0;
        for (j = 0; j < N; j++) {
          sum = 0;
          ai = offsetA + j * strideA2;
          for (i = 0; i < M; i++) {
            sum += Math.abs(A[ai]);
            ai += strideA1;
          }
          if (value < sum || sum !== sum) {
            value = sum;
          }
        }
      } else if (norm === "inf-norm") {
        for (i = 0; i < M; i++) {
          wi = offsetWORK + i * strideWORK;
          WORK[wi] = 0;
        }
        for (j = 0; j < N; j++) {
          ai = offsetA + j * strideA2;
          wi = offsetWORK;
          for (i = 0; i < M; i++) {
            WORK[wi] += Math.abs(A[ai]);
            ai += strideA1;
            wi += strideWORK;
          }
        }
        value = 0;
        for (i = 0; i < M; i++) {
          wi = offsetWORK + i * strideWORK;
          temp = WORK[wi];
          if (value < temp || temp !== temp) {
            value = temp;
          }
        }
      } else if (norm === "frobenius") {
        scale = 0;
        sum = 1;
        for (j = 0; j < N; j++) {
          out = dlassq(M, A, strideA1, offsetA + j * strideA2, scale, sum);
          scale = out.scl;
          sum = out.sumsq;
        }
        value = scale * Math.sqrt(sum);
      } else {
        value = 0;
      }
      return value;
    }
    module.exports = dlange;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlascl/lib/base.js
var require_base27 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlascl/lib/base.js"(exports, module) {
    "use strict";
    var dlamch = require_base3();
    function dlascl(type, kl, ku, cfrom, cto, M, N, A, strideA1, strideA2, offsetA) {
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
      if (type === "general") {
        itype = 0;
      } else if (type === "lower") {
        itype = 1;
      } else if (type === "upper") {
        itype = 2;
      } else if (type === "upper-hessenberg") {
        itype = 3;
      } else if (type === "lower-band") {
        itype = 4;
      } else if (type === "upper-band") {
        itype = 5;
      } else if (type === "band") {
        itype = 6;
      } else {
        return -1;
      }
      if (N === 0 || M === 0) {
        return 0;
      }
      smlnum = dlamch("safe-minimum");
      bignum = 1 / smlnum;
      cfromc = cfrom;
      ctoc = cto;
      done = false;
      while (!done) {
        cfrom1 = cfromc * smlnum;
        if (cfrom1 === cfromc) {
          mul = ctoc / cfromc;
          done = true;
        } else {
          cto1 = ctoc / bignum;
          if (cto1 === ctoc) {
            mul = ctoc;
            done = true;
            cfromc = 1;
          } else if (Math.abs(cfrom1) > Math.abs(ctoc) && ctoc !== 0) {
            mul = smlnum;
            done = false;
            cfromc = cfrom1;
          } else if (Math.abs(cto1) > Math.abs(cfromc)) {
            mul = bignum;
            done = false;
            ctoc = cto1;
          } else {
            mul = ctoc / cfromc;
            done = true;
            if (mul === 1) {
              return 0;
            }
          }
        }
        if (itype === 0) {
          for (j = 0; j < N; j++) {
            for (i = 0; i < M; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        } else if (itype === 1) {
          for (j = 0; j < N; j++) {
            for (i = j; i < M; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        } else if (itype === 2) {
          for (j = 0; j < N; j++) {
            iMax = Math.min(j + 1, M);
            for (i = 0; i < iMax; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        } else if (itype === 3) {
          for (j = 0; j < N; j++) {
            iMax = Math.min(j + 2, M);
            for (i = 0; i < iMax; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        } else if (itype === 4) {
          k3 = kl + 1;
          k4 = N + 1;
          for (j = 0; j < N; j++) {
            iMax = Math.min(k3, k4 - j - 1);
            for (i = 0; i < iMax; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        } else if (itype === 5) {
          k1 = ku + 2;
          k3 = ku + 1;
          for (j = 0; j < N; j++) {
            iMin = Math.max(k1 - j - 2, 0);
            for (i = iMin; i < k3; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        } else if (itype === 6) {
          k1 = kl + ku + 2;
          k2 = kl + 1;
          k3 = 2 * kl + ku + 1;
          k4 = kl + ku + 1 + M;
          for (j = 0; j < N; j++) {
            iMin = Math.max(k1 - j - 2, k2 - 1);
            iMax = Math.min(k3, k4 - j - 1);
            for (i = iMin; i < iMax; i++) {
              ai = offsetA + i * strideA1 + j * strideA2;
              A[ai] *= mul;
            }
          }
        }
      }
      return 0;
    }
    module.exports = dlascl;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dlaset/lib/base.js
var require_base28 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dlaset/lib/base.js"(exports, module) {
    "use strict";
    function dlaset(uplo, M, N, alpha, beta, A, strideA1, strideA2, offsetA) {
      var idx;
      var mn;
      var i;
      var j;
      mn = Math.min(M, N);
      if (uplo === "upper") {
        for (j = 1; j < N; j++) {
          idx = offsetA + j * strideA2;
          for (i = 0; i < Math.min(j, M); i++) {
            A[idx] = alpha;
            idx += strideA1;
          }
        }
      } else if (uplo === "lower") {
        for (j = 0; j < mn; j++) {
          idx = offsetA + (j + 1) * strideA1 + j * strideA2;
          for (i = j + 1; i < M; i++) {
            A[idx] = alpha;
            idx += strideA1;
          }
        }
      } else {
        for (j = 0; j < N; j++) {
          idx = offsetA + j * strideA2;
          for (i = 0; i < M; i++) {
            A[idx] = alpha;
            idx += strideA1;
          }
        }
      }
      idx = offsetA;
      for (i = 0; i < mn; i++) {
        A[idx] = beta;
        idx += strideA1 + strideA2;
      }
      return A;
    }
    module.exports = dlaset;
  }
});

// ../../dev/rreusser/notes/lib/blas/base/dtrsm/lib/base.js
var require_base29 = __commonJS({
  "../../dev/rreusser/notes/lib/blas/base/dtrsm/lib/base.js"(exports, module) {
    "use strict";
    function dtrsm(side, uplo, transa, diag, M, N, alpha, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB) {
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
      lside = side === "left";
      nounit = diag === "non-unit";
      upper = uplo === "upper";
      if (M === 0 || N === 0) {
        return B;
      }
      sa1 = strideA1;
      sa2 = strideA2;
      sb1 = strideB1;
      sb2 = strideB2;
      if (alpha === 0) {
        for (j = 0; j < N; j++) {
          ib = offsetB + j * sb2;
          for (i = 0; i < M; i++) {
            B[ib] = 0;
            ib += sb1;
          }
        }
        return B;
      }
      if (lside) {
        if (transa === "no-transpose") {
          if (upper) {
            for (j = 0; j < N; j++) {
              if (alpha !== 1) {
                ib = offsetB + j * sb2;
                for (i = 0; i < M; i++) {
                  B[ib] *= alpha;
                  ib += sb1;
                }
              }
              for (k = M - 1; k >= 0; k--) {
                ib = offsetB + k * sb1 + j * sb2;
                if (B[ib] !== 0) {
                  if (nounit) {
                    B[ib] /= A[offsetA + k * sa1 + k * sa2];
                  }
                  ia = offsetA + k * sa2;
                  for (i = 0; i < k; i++) {
                    B[offsetB + i * sb1 + j * sb2] -= B[ib] * A[ia];
                    ia += sa1;
                  }
                }
              }
            }
          } else {
            for (j = 0; j < N; j++) {
              if (alpha !== 1) {
                ib = offsetB + j * sb2;
                for (i = 0; i < M; i++) {
                  B[ib] *= alpha;
                  ib += sb1;
                }
              }
              for (k = 0; k < M; k++) {
                ib = offsetB + k * sb1 + j * sb2;
                if (B[ib] !== 0) {
                  if (nounit) {
                    B[ib] /= A[offsetA + k * sa1 + k * sa2];
                  }
                  for (i = k + 1; i < M; i++) {
                    B[offsetB + i * sb1 + j * sb2] -= B[ib] * A[offsetA + i * sa1 + k * sa2];
                  }
                }
              }
            }
          }
        } else if (upper) {
          for (j = 0; j < N; j++) {
            for (i = 0; i < M; i++) {
              temp = alpha * B[offsetB + i * sb1 + j * sb2];
              ia = offsetA + i * sa2;
              for (k = 0; k < i; k++) {
                temp -= A[ia] * B[offsetB + k * sb1 + j * sb2];
                ia += sa1;
              }
              if (nounit) {
                temp /= A[offsetA + i * sa1 + i * sa2];
              }
              B[offsetB + i * sb1 + j * sb2] = temp;
            }
          }
        } else {
          for (j = 0; j < N; j++) {
            for (i = M - 1; i >= 0; i--) {
              temp = alpha * B[offsetB + i * sb1 + j * sb2];
              for (k = i + 1; k < M; k++) {
                temp -= A[offsetA + k * sa1 + i * sa2] * B[offsetB + k * sb1 + j * sb2];
              }
              if (nounit) {
                temp /= A[offsetA + i * sa1 + i * sa2];
              }
              B[offsetB + i * sb1 + j * sb2] = temp;
            }
          }
        }
      } else if (transa === "no-transpose") {
        if (upper) {
          for (j = 0; j < N; j++) {
            if (alpha !== 1) {
              ib = offsetB + j * sb2;
              for (i = 0; i < M; i++) {
                B[ib] *= alpha;
                ib += sb1;
              }
            }
            for (k = 0; k < j; k++) {
              if (A[offsetA + k * sa1 + j * sa2] !== 0) {
                for (i = 0; i < M; i++) {
                  B[offsetB + i * sb1 + j * sb2] -= A[offsetA + k * sa1 + j * sa2] * B[offsetB + i * sb1 + k * sb2];
                }
              }
            }
            if (nounit) {
              temp = 1 / A[offsetA + j * sa1 + j * sa2];
              ib = offsetB + j * sb2;
              for (i = 0; i < M; i++) {
                B[ib] *= temp;
                ib += sb1;
              }
            }
          }
        } else {
          for (j = N - 1; j >= 0; j--) {
            if (alpha !== 1) {
              ib = offsetB + j * sb2;
              for (i = 0; i < M; i++) {
                B[ib] *= alpha;
                ib += sb1;
              }
            }
            for (k = j + 1; k < N; k++) {
              if (A[offsetA + k * sa1 + j * sa2] !== 0) {
                for (i = 0; i < M; i++) {
                  B[offsetB + i * sb1 + j * sb2] -= A[offsetA + k * sa1 + j * sa2] * B[offsetB + i * sb1 + k * sb2];
                }
              }
            }
            if (nounit) {
              temp = 1 / A[offsetA + j * sa1 + j * sa2];
              ib = offsetB + j * sb2;
              for (i = 0; i < M; i++) {
                B[ib] *= temp;
                ib += sb1;
              }
            }
          }
        }
      } else if (upper) {
        for (k = N - 1; k >= 0; k--) {
          if (nounit) {
            temp = 1 / A[offsetA + k * sa1 + k * sa2];
            ib = offsetB + k * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= temp;
              ib += sb1;
            }
          }
          for (j = 0; j < k; j++) {
            if (A[offsetA + j * sa1 + k * sa2] !== 0) {
              temp = A[offsetA + j * sa1 + k * sa2];
              for (i = 0; i < M; i++) {
                B[offsetB + i * sb1 + j * sb2] -= temp * B[offsetB + i * sb1 + k * sb2];
              }
            }
          }
          if (alpha !== 1) {
            ib = offsetB + k * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= alpha;
              ib += sb1;
            }
          }
        }
      } else {
        for (k = 0; k < N; k++) {
          if (nounit) {
            temp = 1 / A[offsetA + k * sa1 + k * sa2];
            ib = offsetB + k * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= temp;
              ib += sb1;
            }
          }
          for (j = k + 1; j < N; j++) {
            if (A[offsetA + j * sa1 + k * sa2] !== 0) {
              temp = A[offsetA + j * sa1 + k * sa2];
              for (i = 0; i < M; i++) {
                B[offsetB + i * sb1 + j * sb2] -= temp * B[offsetB + i * sb1 + k * sb2];
              }
            }
          }
          if (alpha !== 1) {
            ib = offsetB + k * sb2;
            for (i = 0; i < M; i++) {
              B[ib] *= alpha;
              ib += sb1;
            }
          }
        }
      }
      return B;
    }
    module.exports = dtrsm;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dtrtrs/lib/base.js
var require_base30 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dtrtrs/lib/base.js"(exports, module) {
    "use strict";
    var dtrsm = require_base29();
    function dtrtrs(uplo, trans, diag, N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB) {
      var nounit;
      var sa1;
      var sa2;
      var i;
      nounit = diag === "non-unit";
      if (N === 0) {
        return 0;
      }
      sa1 = strideA1;
      sa2 = strideA2;
      if (nounit) {
        for (i = 0; i < N; i++) {
          if (A[offsetA + i * sa1 + i * sa2] === 0) {
            return i + 1;
          }
        }
      }
      dtrsm("left", uplo, trans, diag, N, nrhs, 1, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB);
      return 0;
    }
    module.exports = dtrtrs;
  }
});

// ../../dev/rreusser/notes/lib/lapack/base/dgels/lib/base.js
var require_base31 = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dgels/lib/base.js"(exports, module) {
    "use strict";
    var Float64Array2 = require_lib8();
    var dgeqrf = require_base18();
    var dgelqf = require_base20();
    var dormqr = require_base22();
    var dormlq = require_base24();
    var dlange = require_base26();
    var dlascl = require_base27();
    var dlaset = require_base28();
    var dlamch = require_base3();
    var dtrtrs = require_base30();
    var NB = 32;
    function dgels2(trans, M, N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB) {
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
      MN = Math.min(M, N);
      tpsd = trans === "transpose";
      if (MN === 0 || nrhs === 0) {
        dlaset("full", Math.max(M, N), nrhs, 0, 0, B, strideB1, strideB2, offsetB);
        return 0;
      }
      TAU = new Float64Array2(MN);
      wsize = MN + Math.max(MN, nrhs) * NB;
      wsize = Math.max(1, wsize);
      WORK = new Float64Array2(wsize);
      smlnum = dlamch("safe-minimum") / dlamch("precision");
      bignum = 1 / smlnum;
      anrm = dlange("max", M, N, A, strideA1, strideA2, offsetA, WORK, 1, 0);
      iascl = 0;
      if (anrm > 0 && anrm < smlnum) {
        dlascl("general", 0, 0, anrm, smlnum, M, N, A, strideA1, strideA2, offsetA);
        iascl = 1;
      } else if (anrm > bignum) {
        dlascl("general", 0, 0, anrm, bignum, M, N, A, strideA1, strideA2, offsetA);
        iascl = 2;
      } else if (anrm === 0) {
        dlaset("full", Math.max(M, N), nrhs, 0, 0, B, strideB1, strideB2, offsetB);
        return 0;
      }
      brow = tpsd ? N : M;
      bnrm = dlange("max", brow, nrhs, B, strideB1, strideB2, offsetB, WORK, 1, 0);
      ibscl = 0;
      if (bnrm > 0 && bnrm < smlnum) {
        dlascl("general", 0, 0, bnrm, smlnum, brow, nrhs, B, strideB1, strideB2, offsetB);
        ibscl = 1;
      } else if (bnrm > bignum) {
        dlascl("general", 0, 0, bnrm, bignum, brow, nrhs, B, strideB1, strideB2, offsetB);
        ibscl = 2;
      }
      if (M >= N) {
        dgeqrf(M, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, WORK, 1, 0);
        if (tpsd) {
          info = dtrtrs("upper", "transpose", "non-unit", N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB);
          if (info > 0) {
            return info;
          }
          for (j = 0; j < nrhs; j++) {
            bi = offsetB + j * strideB2 + N * strideB1;
            for (i = N; i < M; i++) {
              B[bi] = 0;
              bi += strideB1;
            }
          }
          dormqr("left", "no-transpose", M, nrhs, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0);
          scllen = M;
        } else {
          dormqr("left", "transpose", M, nrhs, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0);
          info = dtrtrs("upper", "no-transpose", "non-unit", N, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB);
          if (info > 0) {
            return info;
          }
          scllen = N;
        }
      } else {
        dgelqf(M, N, A, strideA1, strideA2, offsetA, TAU, 1, 0, WORK, 1);
        if (tpsd) {
          dormlq("left", "no-transpose", N, nrhs, M, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0);
          info = dtrtrs("lower", "transpose", "non-unit", M, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB);
          if (info > 0) {
            return info;
          }
          scllen = M;
        } else {
          info = dtrtrs("lower", "no-transpose", "non-unit", M, nrhs, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB);
          if (info > 0) {
            return info;
          }
          for (j = 0; j < nrhs; j++) {
            bi = offsetB + j * strideB2 + M * strideB1;
            for (i = M; i < N; i++) {
              B[bi] = 0;
              bi += strideB1;
            }
          }
          dormlq("left", "transpose", N, nrhs, M, A, strideA1, strideA2, offsetA, TAU, 1, 0, B, strideB1, strideB2, offsetB, WORK, 1, 0);
          scllen = N;
        }
      }
      if (iascl === 1) {
        dlascl("general", 0, 0, anrm, smlnum, scllen, nrhs, B, strideB1, strideB2, offsetB);
      } else if (iascl === 2) {
        dlascl("general", 0, 0, anrm, bignum, scllen, nrhs, B, strideB1, strideB2, offsetB);
      }
      if (ibscl === 1) {
        dlascl("general", 0, 0, smlnum, bnrm, scllen, nrhs, B, strideB1, strideB2, offsetB);
      } else if (ibscl === 2) {
        dlascl("general", 0, 0, bignum, bnrm, scllen, nrhs, B, strideB1, strideB2, offsetB);
      }
      return 0;
    }
    module.exports = dgels2;
  }
});

// dgels-wrapper.js
var import_base = __toESM(require_base31(), 1);
var export_dgels = import_base.default;
export {
  export_dgels as dgels
};
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
/*! Bundled license information:

@stdlib/assert/has-symbol-support/lib/main.js:
@stdlib/assert/has-symbol-support/lib/index.js:
@stdlib/assert/has-tostringtag-support/lib/main.js:
@stdlib/assert/has-tostringtag-support/lib/index.js:
@stdlib/utils/native-class/lib/tostring.js:
@stdlib/utils/native-class/lib/main.js:
@stdlib/assert/has-own-property/lib/main.js:
@stdlib/assert/has-own-property/lib/index.js:
@stdlib/symbol/ctor/lib/main.js:
@stdlib/symbol/ctor/lib/index.js:
@stdlib/utils/native-class/lib/tostringtag.js:
@stdlib/utils/native-class/lib/polyfill.js:
@stdlib/utils/native-class/lib/index.js:
@stdlib/assert/is-float64array/lib/main.js:
@stdlib/assert/is-float64array/lib/index.js:
@stdlib/assert/has-float64array-support/lib/float64array.js:
@stdlib/assert/has-float64array-support/lib/main.js:
@stdlib/assert/has-float64array-support/lib/index.js:
@stdlib/array/float64/lib/main.js:
@stdlib/array/float64/lib/polyfill.js:
@stdlib/array/float64/lib/index.js:
  (**
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
  *)
*/
