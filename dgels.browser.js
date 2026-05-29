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

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/define_property.js
var require_define_property = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/define_property.js"(exports, module) {
    "use strict";
    var main = typeof Object.defineProperty === "function" ? Object.defineProperty : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/has_define_property_support.js
var require_has_define_property_support = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/has_define_property_support.js"(exports, module) {
    "use strict";
    var defineProperty = require_define_property();
    function hasDefinePropertySupport() {
      try {
        defineProperty({}, "x", {});
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = hasDefinePropertySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/builtin.js
var require_builtin = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/builtin.js"(exports, module) {
    "use strict";
    var defineProperty = Object.defineProperty;
    module.exports = defineProperty;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/is_number.js
var require_is_number = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/is_number.js"(exports, module) {
    "use strict";
    function isNumber(value) {
      return typeof value === "number";
    }
    module.exports = isNumber;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/zero_pad.js
var require_zero_pad = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/zero_pad.js"(exports, module) {
    "use strict";
    function startsWithMinus(str) {
      return str[0] === "-";
    }
    function zeros(n) {
      var out = "";
      var i;
      for (i = 0; i < n; i++) {
        out += "0";
      }
      return out;
    }
    function zeroPad(str, width, right) {
      var negative = false;
      var pad = width - str.length;
      if (pad < 0) {
        return str;
      }
      if (startsWithMinus(str)) {
        negative = true;
        str = str.substr(1);
      }
      str = right ? str + zeros(pad) : zeros(pad) + str;
      if (negative) {
        str = "-" + str;
      }
      return str;
    }
    module.exports = zeroPad;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/format_integer.js
var require_format_integer = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/format_integer.js"(exports, module) {
    "use strict";
    var isNumber = require_is_number();
    var zeroPad = require_zero_pad();
    var lowercase = String.prototype.toLowerCase;
    var uppercase = String.prototype.toUpperCase;
    function formatInteger(token) {
      var base;
      var out;
      var i;
      switch (token.specifier) {
        case "b":
          base = 2;
          break;
        case "o":
          base = 8;
          break;
        case "x":
        case "X":
          base = 16;
          break;
        case "d":
        case "i":
        case "u":
        default:
          base = 10;
          break;
      }
      out = token.arg;
      i = parseInt(out, 10);
      if (!isFinite(i)) {
        if (!isNumber(out)) {
          throw new Error("invalid integer. Value: " + out);
        }
        i = 0;
      }
      if (i < 0 && (token.specifier === "u" || base !== 10)) {
        i = 4294967295 + i + 1;
      }
      if (i < 0) {
        out = (-i).toString(base);
        if (token.precision) {
          out = zeroPad(out, token.precision, token.padRight);
        }
        out = "-" + out;
      } else {
        out = i.toString(base);
        if (!i && !token.precision) {
          out = "";
        } else if (token.precision) {
          out = zeroPad(out, token.precision, token.padRight);
        }
        if (token.sign) {
          out = token.sign + out;
        }
      }
      if (base === 16) {
        if (token.alternate) {
          out = "0x" + out;
        }
        out = token.specifier === uppercase.call(token.specifier) ? uppercase.call(out) : lowercase.call(out);
      }
      if (base === 8) {
        if (token.alternate && out.charAt(0) !== "0") {
          out = "0" + out;
        }
      }
      return out;
    }
    module.exports = formatInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/is_string.js
var require_is_string = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/is_string.js"(exports, module) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    module.exports = isString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/format_double.js
var require_format_double = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/format_double.js"(exports, module) {
    "use strict";
    var isNumber = require_is_number();
    var abs = Math.abs;
    var lowercase = String.prototype.toLowerCase;
    var uppercase = String.prototype.toUpperCase;
    var replace = String.prototype.replace;
    var RE_EXP_POS_DIGITS = /e\+(\d)$/;
    var RE_EXP_NEG_DIGITS = /e-(\d)$/;
    var RE_ONLY_DIGITS = /^(\d+)$/;
    var RE_DIGITS_BEFORE_EXP = /^(\d+)e/;
    var RE_TRAILING_PERIOD_ZERO = /\.0$/;
    var RE_PERIOD_ZERO_EXP = /\.0*e/;
    var RE_ZERO_BEFORE_EXP = /(\..*[^0])0*e/;
    function formatDouble(token) {
      var digits;
      var out;
      var f = parseFloat(token.arg);
      if (!isFinite(f)) {
        if (!isNumber(token.arg)) {
          throw new Error("invalid floating-point number. Value: " + out);
        }
        f = token.arg;
      }
      switch (token.specifier) {
        case "e":
        case "E":
          out = f.toExponential(token.precision);
          break;
        case "f":
        case "F":
          out = f.toFixed(token.precision);
          break;
        case "g":
        case "G":
          if (abs(f) < 1e-4) {
            digits = token.precision;
            if (digits > 0) {
              digits -= 1;
            }
            out = f.toExponential(digits);
          } else {
            out = f.toPrecision(token.precision);
          }
          if (!token.alternate) {
            out = replace.call(out, RE_ZERO_BEFORE_EXP, "$1e");
            out = replace.call(out, RE_PERIOD_ZERO_EXP, "e");
            out = replace.call(out, RE_TRAILING_PERIOD_ZERO, "");
          }
          break;
        default:
          throw new Error("invalid double notation. Value: " + token.specifier);
      }
      out = replace.call(out, RE_EXP_POS_DIGITS, "e+0$1");
      out = replace.call(out, RE_EXP_NEG_DIGITS, "e-0$1");
      if (token.alternate) {
        out = replace.call(out, RE_ONLY_DIGITS, "$1.");
        out = replace.call(out, RE_DIGITS_BEFORE_EXP, "$1.e");
      }
      if (f >= 0 && token.sign) {
        out = token.sign + out;
      }
      out = token.specifier === uppercase.call(token.specifier) ? uppercase.call(out) : lowercase.call(out);
      return out;
    }
    module.exports = formatDouble;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/space_pad.js
var require_space_pad = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/space_pad.js"(exports, module) {
    "use strict";
    function spaces(n) {
      var out = "";
      var i;
      for (i = 0; i < n; i++) {
        out += " ";
      }
      return out;
    }
    function spacePad(str, width, right) {
      var pad = width - str.length;
      if (pad < 0) {
        return str;
      }
      str = right ? str + spaces(pad) : spaces(pad) + str;
      return str;
    }
    module.exports = spacePad;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/main.js
var require_main = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/main.js"(exports, module) {
    "use strict";
    var formatInteger = require_format_integer();
    var isString = require_is_string();
    var formatDouble = require_format_double();
    var spacePad = require_space_pad();
    var zeroPad = require_zero_pad();
    var fromCharCode = String.fromCharCode;
    var isArray = Array.isArray;
    function isnan(value) {
      return value !== value;
    }
    function initialize(token) {
      var out = {};
      out.specifier = token.specifier;
      out.precision = token.precision === void 0 ? 1 : token.precision;
      out.width = token.width;
      out.flags = token.flags || "";
      out.mapping = token.mapping;
      return out;
    }
    function formatInterpolate(tokens) {
      var hasPeriod;
      var flags;
      var token;
      var flag;
      var num;
      var out;
      var pos;
      var i;
      var j;
      if (!isArray(tokens)) {
        throw new TypeError("invalid argument. First argument must be an array. Value: `" + tokens + "`.");
      }
      out = "";
      pos = 1;
      for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if (isString(token)) {
          out += token;
        } else {
          hasPeriod = token.precision !== void 0;
          token = initialize(token);
          if (!token.specifier) {
            throw new TypeError("invalid argument. Token is missing `specifier` property. Index: `" + i + "`. Value: `" + token + "`.");
          }
          if (token.mapping) {
            pos = token.mapping;
          }
          flags = token.flags;
          for (j = 0; j < flags.length; j++) {
            flag = flags.charAt(j);
            switch (flag) {
              case " ":
                token.sign = " ";
                break;
              case "+":
                token.sign = "+";
                break;
              case "-":
                token.padRight = true;
                token.padZeros = false;
                break;
              case "0":
                token.padZeros = flags.indexOf("-") < 0;
                break;
              case "#":
                token.alternate = true;
                break;
              default:
                throw new Error("invalid flag: " + flag);
            }
          }
          if (token.width === "*") {
            token.width = parseInt(arguments[pos], 10);
            pos += 1;
            if (isnan(token.width)) {
              throw new TypeError("the argument for * width at position " + pos + " is not a number. Value: `" + token.width + "`.");
            }
            if (token.width < 0) {
              token.padRight = true;
              token.width = -token.width;
            }
          }
          if (hasPeriod) {
            if (token.precision === "*") {
              token.precision = parseInt(arguments[pos], 10);
              pos += 1;
              if (isnan(token.precision)) {
                throw new TypeError("the argument for * precision at position " + pos + " is not a number. Value: `" + token.precision + "`.");
              }
              if (token.precision < 0) {
                token.precision = 1;
                hasPeriod = false;
              }
            }
          }
          token.arg = arguments[pos];
          switch (token.specifier) {
            case "b":
            case "o":
            case "x":
            case "X":
            case "d":
            case "i":
            case "u":
              if (hasPeriod) {
                token.padZeros = false;
              }
              token.arg = formatInteger(token);
              break;
            case "s":
              token.maxWidth = hasPeriod ? token.precision : -1;
              token.arg = String(token.arg);
              break;
            case "c":
              if (!isnan(token.arg)) {
                num = parseInt(token.arg, 10);
                if (num < 0 || num > 127) {
                  throw new Error("invalid character code. Value: " + token.arg);
                }
                token.arg = isnan(num) ? String(token.arg) : fromCharCode(num);
              }
              break;
            case "e":
            case "E":
            case "f":
            case "F":
            case "g":
            case "G":
              if (!hasPeriod) {
                token.precision = 6;
              }
              token.arg = formatDouble(token);
              break;
            default:
              throw new Error("invalid specifier: " + token.specifier);
          }
          if (token.maxWidth >= 0 && token.arg.length > token.maxWidth) {
            token.arg = token.arg.substring(0, token.maxWidth);
          }
          if (token.padZeros) {
            token.arg = zeroPad(token.arg, token.width || token.precision, token.padRight);
          } else if (token.width) {
            token.arg = spacePad(token.arg, token.width, token.padRight);
          }
          out += token.arg || "";
          pos += 1;
        }
      }
      return out;
    }
    module.exports = formatInterpolate;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/index.js
var require_lib = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-interpolate/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-tokenize/lib/main.js
var require_main2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-tokenize/lib/main.js"(exports, module) {
    "use strict";
    var RE = /%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;
    function parse(match) {
      var token = {
        "mapping": match[1] ? parseInt(match[1], 10) : void 0,
        "flags": match[2],
        "width": match[3],
        "precision": match[5],
        "specifier": match[6]
      };
      if (match[4] === "." && match[5] === void 0) {
        token.precision = "1";
      }
      return token;
    }
    function formatTokenize(str) {
      var content;
      var tokens;
      var match;
      var prev;
      tokens = [];
      prev = 0;
      match = RE.exec(str);
      while (match) {
        content = str.slice(prev, RE.lastIndex - match[0].length);
        if (content.length) {
          tokens.push(content);
        }
        tokens.push(parse(match));
        prev = RE.lastIndex;
        match = RE.exec(str);
      }
      content = str.slice(prev);
      if (content.length) {
        tokens.push(content);
      }
      return tokens;
    }
    module.exports = formatTokenize;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-tokenize/lib/index.js
var require_lib2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/base/format-tokenize/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main2();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/format/lib/is_string.js
var require_is_string2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/format/lib/is_string.js"(exports, module) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    module.exports = isString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/format/lib/main.js
var require_main3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/format/lib/main.js"(exports, module) {
    "use strict";
    var interpolate = require_lib();
    var tokenize = require_lib2();
    var isString = require_is_string2();
    function format(str) {
      var args;
      var i;
      if (!isString(str)) {
        throw new TypeError(format("invalid argument. First argument must be a string. Value: `%s`.", str));
      }
      args = [tokenize(str)];
      for (i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return interpolate.apply(null, args);
    }
    module.exports = format;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/string/format/lib/index.js
var require_lib3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/string/format/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main3();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/polyfill.js
var require_polyfill = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/polyfill.js"(exports, module) {
    "use strict";
    var format = require_lib3();
    var objectProtoype = Object.prototype;
    var toStr = objectProtoype.toString;
    var defineGetter = objectProtoype.__defineGetter__;
    var defineSetter = objectProtoype.__defineSetter__;
    var lookupGetter = objectProtoype.__lookupGetter__;
    var lookupSetter = objectProtoype.__lookupSetter__;
    function defineProperty(obj, prop, descriptor) {
      var prototype;
      var hasValue;
      var hasGet;
      var hasSet;
      if (typeof obj !== "object" || obj === null || toStr.call(obj) === "[object Array]") {
        throw new TypeError(format("invalid argument. First argument must be an object. Value: `%s`.", obj));
      }
      if (typeof descriptor !== "object" || descriptor === null || toStr.call(descriptor) === "[object Array]") {
        throw new TypeError(format("invalid argument. Property descriptor must be an object. Value: `%s`.", descriptor));
      }
      hasValue = "value" in descriptor;
      if (hasValue) {
        if (lookupGetter.call(obj, prop) || lookupSetter.call(obj, prop)) {
          prototype = obj.__proto__;
          obj.__proto__ = objectProtoype;
          delete obj[prop];
          obj[prop] = descriptor.value;
          obj.__proto__ = prototype;
        } else {
          obj[prop] = descriptor.value;
        }
      }
      hasGet = "get" in descriptor;
      hasSet = "set" in descriptor;
      if (hasValue && (hasGet || hasSet)) {
        throw new Error("invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.");
      }
      if (hasGet && defineGetter) {
        defineGetter.call(obj, prop, descriptor.get);
      }
      if (hasSet && defineSetter) {
        defineSetter.call(obj, prop, descriptor.set);
      }
      return obj;
    }
    module.exports = defineProperty;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/index.js
var require_lib4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-property/lib/index.js"(exports, module) {
    "use strict";
    var hasDefinePropertySupport = require_has_define_property_support();
    var builtin = require_builtin();
    var polyfill = require_polyfill();
    var defineProperty;
    if (hasDefinePropertySupport()) {
      defineProperty = builtin;
    } else {
      defineProperty = polyfill;
    }
    module.exports = defineProperty;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-property/lib/main.js
var require_main4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-property/lib/main.js"(exports, module) {
    "use strict";
    var defineProperty = require_lib4();
    function setNonEnumerableReadOnly(obj, prop, value) {
      defineProperty(obj, prop, {
        "configurable": false,
        "enumerable": false,
        "writable": false,
        "value": value
      });
    }
    module.exports = setNonEnumerableReadOnly;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-property/lib/index.js
var require_lib5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-property/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main4();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-accessor-array/lib/main.js
var require_main5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-accessor-array/lib/main.js"(exports, module) {
    "use strict";
    var TYPE = "function";
    function isAccessorArray(value) {
      return typeof value.get === TYPE && typeof value.set === TYPE;
    }
    module.exports = isAccessorArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-accessor-array/lib/index.js
var require_lib6 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-accessor-array/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main5();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/accessor-getter/lib/main.js
var require_main6 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/accessor-getter/lib/main.js"(exports, module) {
    "use strict";
    var GETTERS = {
      "complex128": getComplex128,
      "complex64": getComplex64,
      "default": getArrayLike
    };
    function getComplex128(arr, idx) {
      return arr.get(idx);
    }
    function getComplex64(arr, idx) {
      return arr.get(idx);
    }
    function getArrayLike(arr, idx) {
      return arr.get(idx);
    }
    function getter(dtype) {
      var f = GETTERS[dtype];
      if (typeof f === "function") {
        return f;
      }
      return GETTERS.default;
    }
    module.exports = getter;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/accessor-getter/lib/index.js
var require_lib7 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/accessor-getter/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main6();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/getter/lib/main.js
var require_main7 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/getter/lib/main.js"(exports, module) {
    "use strict";
    var GETTERS = {
      "float64": getFloat64,
      "float32": getFloat32,
      "int32": getInt32,
      "int16": getInt16,
      "int8": getInt8,
      "uint32": getUint32,
      "uint16": getUint16,
      "uint8": getUint8,
      "uint8c": getUint8c,
      "generic": getGeneric,
      "default": getArrayLike
    };
    function getFloat64(arr, idx) {
      return arr[idx];
    }
    function getFloat32(arr, idx) {
      return arr[idx];
    }
    function getInt32(arr, idx) {
      return arr[idx];
    }
    function getInt16(arr, idx) {
      return arr[idx];
    }
    function getInt8(arr, idx) {
      return arr[idx];
    }
    function getUint32(arr, idx) {
      return arr[idx];
    }
    function getUint16(arr, idx) {
      return arr[idx];
    }
    function getUint8(arr, idx) {
      return arr[idx];
    }
    function getUint8c(arr, idx) {
      return arr[idx];
    }
    function getGeneric(arr, idx) {
      return arr[idx];
    }
    function getArrayLike(arr, idx) {
      return arr[idx];
    }
    function getter(dtype) {
      var f = GETTERS[dtype];
      if (typeof f === "function") {
        return f;
      }
      return GETTERS.default;
    }
    module.exports = getter;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/getter/lib/index.js
var require_lib8 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/getter/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main7();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/main.js
var require_main8 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/main.js"(exports, module) {
    "use strict";
    function hasSymbolSupport() {
      return typeof Symbol === "function" && typeof /* @__PURE__ */ Symbol("foo") === "symbol";
    }
    module.exports = hasSymbolSupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/index.js
var require_lib9 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-symbol-support/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main8();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/main.js
var require_main9 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/main.js"(exports, module) {
    "use strict";
    var hasSymbols = require_lib9();
    var FLG = hasSymbols();
    function hasToStringTagSupport() {
      return FLG && typeof Symbol.toStringTag === "symbol";
    }
    module.exports = hasToStringTagSupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/index.js
var require_lib10 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-tostringtag-support/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main9();
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
var require_main10 = __commonJS({
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
var require_main11 = __commonJS({
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
var require_lib11 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-own-property/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main11();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/main.js
var require_main12 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/main.js"(exports, module) {
    "use strict";
    var Sym = typeof Symbol === "function" ? Symbol : void 0;
    module.exports = Sym;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/index.js
var require_lib12 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/symbol/ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main12();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/tostringtag.js
var require_tostringtag = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/tostringtag.js"(exports, module) {
    "use strict";
    var Symbol2 = require_lib12();
    var toStrTag = typeof Symbol2 === "function" ? Symbol2.toStringTag : "";
    module.exports = toStrTag;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/polyfill.js
var require_polyfill2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/polyfill.js"(exports, module) {
    "use strict";
    var hasOwnProp = require_lib11();
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
var require_lib13 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/native-class/lib/index.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib10();
    var builtin = require_main10();
    var polyfill = require_polyfill2();
    var main;
    if (hasToStringTag()) {
      main = polyfill;
    } else {
      main = builtin;
    }
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array/lib/main.js
var require_main13 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var f;
    function isArray(value) {
      return nativeClass(value) === "[object Array]";
    }
    if (Array.isArray) {
      f = Array.isArray;
    } else {
      f = isArray;
    }
    module.exports = f;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array/lib/index.js
var require_lib14 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main13();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/tools/array-function/lib/main.js
var require_main14 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/tools/array-function/lib/main.js"(exports, module) {
    "use strict";
    var isArray = require_lib14();
    var format = require_lib3();
    function arrayfcn(predicate) {
      if (typeof predicate !== "function") {
        throw new TypeError(format("invalid argument. Must provide a function. Value: `%s`.", predicate));
      }
      return every;
      function every(value) {
        var len;
        var i;
        if (!isArray(value)) {
          return false;
        }
        len = value.length;
        if (len === 0) {
          return false;
        }
        for (i = 0; i < len; i++) {
          if (predicate(value[i]) === false) {
            return false;
          }
        }
        return true;
      }
    }
    module.exports = arrayfcn;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/tools/array-function/lib/index.js
var require_lib15 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/tools/array-function/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main14();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object-like/lib/main.js
var require_main15 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object-like/lib/main.js"(exports, module) {
    "use strict";
    function isObjectLike(value) {
      return value !== null && typeof value === "object";
    }
    module.exports = isObjectLike;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object-like/lib/index.js
var require_lib16 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object-like/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var arrayfun = require_lib15();
    var main = require_main15();
    var isObjectLikeArray = arrayfun(main);
    setReadOnly(main, "isObjectLikeArray", isObjectLikeArray);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-buffer/lib/main.js
var require_main16 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-buffer/lib/main.js"(exports, module) {
    "use strict";
    var isObjectLike = require_lib16();
    function isBuffer(value) {
      return isObjectLike(value) && // eslint-disable-next-line no-underscore-dangle
      (value._isBuffer || // for envs missing Object.prototype.constructor (e.g., Safari 5-7)
      value.constructor && // WARNING: `typeof` is not a foolproof check, as certain envs consider RegExp and NodeList instances to be functions
      typeof value.constructor.isBuffer === "function" && value.constructor.isBuffer(value));
    }
    module.exports = isBuffer;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-buffer/lib/index.js
var require_lib17 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-buffer/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main16();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/regexp/function-name/lib/main.js
var require_main17 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/regexp/function-name/lib/main.js"(exports, module) {
    "use strict";
    function reFunctionName() {
      return /^\s*function\s*([^(]*)/i;
    }
    module.exports = reFunctionName;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/regexp/function-name/lib/regexp.js
var require_regexp = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/regexp/function-name/lib/regexp.js"(exports, module) {
    "use strict";
    var reFunctionName = require_main17();
    var RE_FUNCTION_NAME = reFunctionName();
    module.exports = RE_FUNCTION_NAME;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/regexp/function-name/lib/index.js
var require_lib18 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/regexp/function-name/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main17();
    var REGEXP = require_regexp();
    setReadOnly(main, "REGEXP", REGEXP);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/constructor-name/lib/main.js
var require_main18 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/constructor-name/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var RE = require_lib18().REGEXP;
    var isBuffer = require_lib17();
    function constructorName(v) {
      var match;
      var name;
      var ctor;
      name = nativeClass(v).slice(8, -1);
      if ((name === "Object" || name === "Error") && v.constructor) {
        ctor = v.constructor;
        if (typeof ctor.name === "string") {
          return ctor.name;
        }
        match = RE.exec(ctor.toString());
        if (match) {
          return match[1];
        }
      }
      if (isBuffer(v)) {
        return "Buffer";
      }
      return name;
    }
    module.exports = constructorName;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/constructor-name/lib/index.js
var require_lib19 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/constructor-name/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main18();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/ctor2dtype.js
var require_ctor2dtype = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/ctor2dtype.js"(exports, module) {
    "use strict";
    var ctor2dtypes = {
      "Float32Array": "float32",
      "Float64Array": "float64",
      "Array": "generic",
      "Int16Array": "int16",
      "Int32Array": "int32",
      "Int8Array": "int8",
      "Uint16Array": "uint16",
      "Uint32Array": "uint32",
      "Uint8Array": "uint8",
      "Uint8ClampedArray": "uint8c",
      "Complex64Array": "complex64",
      "Complex128Array": "complex128",
      "BooleanArray": "bool"
    };
    module.exports = ctor2dtypes;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/main.js
var require_main19 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasFloat64Array = typeof Float64Array === "function";
    function isFloat64Array(value) {
      return hasFloat64Array && value instanceof Float64Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Float64Array]";
    }
    module.exports = isFloat64Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/index.js
var require_lib20 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float64array/lib/index.js"(exports, module) {
    "use strict";
    var isFloat64Array = require_main19();
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
var require_main20 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/main.js"(exports, module) {
    "use strict";
    var isFloat64Array = require_lib20();
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
var require_lib21 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float64array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat64ArraySupport = require_main20();
    module.exports = hasFloat64ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/main.js
var require_main21 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Float64Array === "function" ? Float64Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/polyfill.js
var require_polyfill3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/index.js
var require_lib22 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float64/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat64ArraySupport = require_lib21();
    var builtin = require_main21();
    var polyfill = require_polyfill3();
    var ctor;
    if (hasFloat64ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float32array/lib/main.js
var require_main22 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float32array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasFloat32Array = typeof Float32Array === "function";
    function isFloat32Array(value) {
      return hasFloat32Array && value instanceof Float32Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Float32Array]";
    }
    module.exports = isFloat32Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float32array/lib/index.js
var require_lib23 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-float32array/lib/index.js"(exports, module) {
    "use strict";
    var isFloat32Array = require_main22();
    module.exports = isFloat32Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/float64/pinf/lib/index.js
var require_lib24 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/float64/pinf/lib/index.js"(exports, module) {
    "use strict";
    var FLOAT64_PINF = Number.POSITIVE_INFINITY;
    module.exports = FLOAT64_PINF;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float32array-support/lib/float32array.js
var require_float32array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float32array-support/lib/float32array.js"(exports, module) {
    "use strict";
    var main = typeof Float32Array === "function" ? Float32Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float32array-support/lib/main.js
var require_main23 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float32array-support/lib/main.js"(exports, module) {
    "use strict";
    var isFloat32Array = require_lib23();
    var PINF = require_lib24();
    var GlobalFloat32Array = require_float32array();
    function hasFloat32ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalFloat32Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalFloat32Array([1, 3.14, -3.14, 5e40]);
        bool = isFloat32Array(arr) && arr[0] === 1 && arr[1] === 3.140000104904175 && arr[2] === -3.140000104904175 && arr[3] === PINF;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasFloat32ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float32array-support/lib/index.js
var require_lib25 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-float32array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat32ArraySupport = require_main23();
    module.exports = hasFloat32ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float32/lib/main.js
var require_main24 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float32/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Float32Array === "function" ? Float32Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float32/lib/polyfill.js
var require_polyfill4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float32/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/float32/lib/index.js
var require_lib26 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/float32/lib/index.js"(exports, module) {
    "use strict";
    var hasFloat32ArraySupport = require_lib25();
    var builtin = require_main24();
    var polyfill = require_polyfill4();
    var ctor;
    if (hasFloat32ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint32array/lib/main.js
var require_main25 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint32array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasUint32Array = typeof Uint32Array === "function";
    function isUint32Array(value) {
      return hasUint32Array && value instanceof Uint32Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Uint32Array]";
    }
    module.exports = isUint32Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint32array/lib/index.js
var require_lib27 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint32array/lib/index.js"(exports, module) {
    "use strict";
    var isUint32Array = require_main25();
    module.exports = isUint32Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/uint32/max/lib/index.js
var require_lib28 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/uint32/max/lib/index.js"(exports, module) {
    "use strict";
    var UINT32_MAX = 4294967295;
    module.exports = UINT32_MAX;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint32array-support/lib/uint32array.js
var require_uint32array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint32array-support/lib/uint32array.js"(exports, module) {
    "use strict";
    var main = typeof Uint32Array === "function" ? Uint32Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint32array-support/lib/main.js
var require_main26 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint32array-support/lib/main.js"(exports, module) {
    "use strict";
    var isUint32Array = require_lib27();
    var UINT32_MAX = require_lib28();
    var GlobalUint32Array = require_uint32array();
    function hasUint32ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint32Array !== "function") {
        return false;
      }
      try {
        arr = [1, 3.14, -3.14, UINT32_MAX + 1, UINT32_MAX + 2];
        arr = new GlobalUint32Array(arr);
        bool = isUint32Array(arr) && arr[0] === 1 && arr[1] === 3 && // truncation
        arr[2] === UINT32_MAX - 2 && // truncation and wrap around
        arr[3] === 0 && // wrap around
        arr[4] === 1;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint32ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint32array-support/lib/index.js
var require_lib29 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint32array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasUint32ArraySupport = require_main26();
    module.exports = hasUint32ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint32/lib/main.js
var require_main27 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint32/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint32Array === "function" ? Uint32Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint32/lib/polyfill.js
var require_polyfill5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint32/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint32/lib/index.js
var require_lib30 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint32/lib/index.js"(exports, module) {
    "use strict";
    var hasUint32ArraySupport = require_lib29();
    var builtin = require_main27();
    var polyfill = require_polyfill5();
    var ctor;
    if (hasUint32ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int32array/lib/main.js
var require_main28 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int32array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasInt32Array = typeof Int32Array === "function";
    function isInt32Array(value) {
      return hasInt32Array && value instanceof Int32Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Int32Array]";
    }
    module.exports = isInt32Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int32array/lib/index.js
var require_lib31 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int32array/lib/index.js"(exports, module) {
    "use strict";
    var isInt32Array = require_main28();
    module.exports = isInt32Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/int32/max/lib/index.js
var require_lib32 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/int32/max/lib/index.js"(exports, module) {
    "use strict";
    var INT32_MAX = 2147483647 | 0;
    module.exports = INT32_MAX;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/int32/min/lib/index.js
var require_lib33 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/int32/min/lib/index.js"(exports, module) {
    "use strict";
    var INT32_MIN = -2147483648 | 0;
    module.exports = INT32_MIN;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int32array-support/lib/int32array.js
var require_int32array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int32array-support/lib/int32array.js"(exports, module) {
    "use strict";
    var main = typeof Int32Array === "function" ? Int32Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int32array-support/lib/main.js
var require_main29 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int32array-support/lib/main.js"(exports, module) {
    "use strict";
    var isInt32Array = require_lib31();
    var INT32_MAX = require_lib32();
    var INT32_MIN = require_lib33();
    var GlobalInt32Array = require_int32array();
    function hasInt32ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalInt32Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalInt32Array([1, 3.14, -3.14, INT32_MAX + 1]);
        bool = isInt32Array(arr) && arr[0] === 1 && arr[1] === 3 && // truncation
        arr[2] === -3 && // truncation
        arr[3] === INT32_MIN;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasInt32ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int32array-support/lib/index.js
var require_lib34 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int32array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasInt32ArraySupport = require_main29();
    module.exports = hasInt32ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int32/lib/main.js
var require_main30 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int32/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Int32Array === "function" ? Int32Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int32/lib/polyfill.js
var require_polyfill6 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int32/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int32/lib/index.js
var require_lib35 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int32/lib/index.js"(exports, module) {
    "use strict";
    var hasInt32ArraySupport = require_lib34();
    var builtin = require_main30();
    var polyfill = require_polyfill6();
    var ctor;
    if (hasInt32ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint16array/lib/main.js
var require_main31 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint16array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasUint16Array = typeof Uint16Array === "function";
    function isUint16Array(value) {
      return hasUint16Array && value instanceof Uint16Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Uint16Array]";
    }
    module.exports = isUint16Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint16array/lib/index.js
var require_lib36 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint16array/lib/index.js"(exports, module) {
    "use strict";
    var isUint16Array = require_main31();
    module.exports = isUint16Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/uint16/max/lib/index.js
var require_lib37 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/uint16/max/lib/index.js"(exports, module) {
    "use strict";
    var UINT16_MAX = 65535 | 0;
    module.exports = UINT16_MAX;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint16array-support/lib/uint16array.js
var require_uint16array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint16array-support/lib/uint16array.js"(exports, module) {
    "use strict";
    var main = typeof Uint16Array === "function" ? Uint16Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint16array-support/lib/main.js
var require_main32 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint16array-support/lib/main.js"(exports, module) {
    "use strict";
    var isUint16Array = require_lib36();
    var UINT16_MAX = require_lib37();
    var GlobalUint16Array = require_uint16array();
    function hasUint16ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint16Array !== "function") {
        return false;
      }
      try {
        arr = [1, 3.14, -3.14, UINT16_MAX + 1, UINT16_MAX + 2];
        arr = new GlobalUint16Array(arr);
        bool = isUint16Array(arr) && arr[0] === 1 && arr[1] === 3 && // truncation
        arr[2] === UINT16_MAX - 2 && // truncation and wrap around
        arr[3] === 0 && // wrap around
        arr[4] === 1;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint16ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint16array-support/lib/index.js
var require_lib38 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint16array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasUint16ArraySupport = require_main32();
    module.exports = hasUint16ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint16/lib/main.js
var require_main33 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint16/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint16Array === "function" ? Uint16Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint16/lib/polyfill.js
var require_polyfill7 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint16/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint16/lib/index.js
var require_lib39 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint16/lib/index.js"(exports, module) {
    "use strict";
    var hasUint16ArraySupport = require_lib38();
    var builtin = require_main33();
    var polyfill = require_polyfill7();
    var ctor;
    if (hasUint16ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int16array/lib/main.js
var require_main34 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int16array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasInt16Array = typeof Int16Array === "function";
    function isInt16Array(value) {
      return hasInt16Array && value instanceof Int16Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Int16Array]";
    }
    module.exports = isInt16Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int16array/lib/index.js
var require_lib40 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int16array/lib/index.js"(exports, module) {
    "use strict";
    var isInt16Array = require_main34();
    module.exports = isInt16Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/int16/max/lib/index.js
var require_lib41 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/int16/max/lib/index.js"(exports, module) {
    "use strict";
    var INT16_MAX = 32767 | 0;
    module.exports = INT16_MAX;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/int16/min/lib/index.js
var require_lib42 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/int16/min/lib/index.js"(exports, module) {
    "use strict";
    var INT16_MIN = -32768 | 0;
    module.exports = INT16_MIN;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int16array-support/lib/int16array.js
var require_int16array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int16array-support/lib/int16array.js"(exports, module) {
    "use strict";
    var main = typeof Int16Array === "function" ? Int16Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int16array-support/lib/main.js
var require_main35 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int16array-support/lib/main.js"(exports, module) {
    "use strict";
    var isInt16Array = require_lib40();
    var INT16_MAX = require_lib41();
    var INT16_MIN = require_lib42();
    var GlobalInt16Array = require_int16array();
    function hasInt16ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalInt16Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalInt16Array([1, 3.14, -3.14, INT16_MAX + 1]);
        bool = isInt16Array(arr) && arr[0] === 1 && arr[1] === 3 && // truncation
        arr[2] === -3 && // truncation
        arr[3] === INT16_MIN;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasInt16ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int16array-support/lib/index.js
var require_lib43 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int16array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasInt16ArraySupport = require_main35();
    module.exports = hasInt16ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int16/lib/main.js
var require_main36 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int16/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Int16Array === "function" ? Int16Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int16/lib/polyfill.js
var require_polyfill8 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int16/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int16/lib/index.js
var require_lib44 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int16/lib/index.js"(exports, module) {
    "use strict";
    var hasInt16ArraySupport = require_lib43();
    var builtin = require_main36();
    var polyfill = require_polyfill8();
    var ctor;
    if (hasInt16ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8array/lib/main.js
var require_main37 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasUint8Array = typeof Uint8Array === "function";
    function isUint8Array(value) {
      return hasUint8Array && value instanceof Uint8Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Uint8Array]";
    }
    module.exports = isUint8Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8array/lib/index.js
var require_lib45 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8array/lib/index.js"(exports, module) {
    "use strict";
    var isUint8Array = require_main37();
    module.exports = isUint8Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/uint8/max/lib/index.js
var require_lib46 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/uint8/max/lib/index.js"(exports, module) {
    "use strict";
    var UINT8_MAX = 255 | 0;
    module.exports = UINT8_MAX;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8array-support/lib/uint8array.js
var require_uint8array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8array-support/lib/uint8array.js"(exports, module) {
    "use strict";
    var main = typeof Uint8Array === "function" ? Uint8Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8array-support/lib/main.js
var require_main38 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8array-support/lib/main.js"(exports, module) {
    "use strict";
    var isUint8Array = require_lib45();
    var UINT8_MAX = require_lib46();
    var GlobalUint8Array = require_uint8array();
    function hasUint8ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint8Array !== "function") {
        return false;
      }
      try {
        arr = [1, 3.14, -3.14, UINT8_MAX + 1, UINT8_MAX + 2];
        arr = new GlobalUint8Array(arr);
        bool = isUint8Array(arr) && arr[0] === 1 && arr[1] === 3 && // truncation
        arr[2] === UINT8_MAX - 2 && // truncation and wrap around
        arr[3] === 0 && // wrap around
        arr[4] === 1;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint8ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8array-support/lib/index.js
var require_lib47 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasUint8ArraySupport = require_main38();
    module.exports = hasUint8ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint8/lib/main.js
var require_main39 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint8/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint8Array === "function" ? Uint8Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint8/lib/polyfill.js
var require_polyfill9 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint8/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint8/lib/index.js
var require_lib48 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint8/lib/index.js"(exports, module) {
    "use strict";
    var hasUint8ArraySupport = require_lib47();
    var builtin = require_main39();
    var polyfill = require_polyfill9();
    var ctor;
    if (hasUint8ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8clampedarray/lib/main.js
var require_main40 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8clampedarray/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasUint8ClampedArray = typeof Uint8ClampedArray === "function";
    function isUint8ClampedArray(value) {
      return hasUint8ClampedArray && value instanceof Uint8ClampedArray || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Uint8ClampedArray]";
    }
    module.exports = isUint8ClampedArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8clampedarray/lib/index.js
var require_lib49 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-uint8clampedarray/lib/index.js"(exports, module) {
    "use strict";
    var isUint8ClampedArray = require_main40();
    module.exports = isUint8ClampedArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8clampedarray-support/lib/uint8clampedarray.js
var require_uint8clampedarray = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8clampedarray-support/lib/uint8clampedarray.js"(exports, module) {
    "use strict";
    var main = typeof Uint8ClampedArray === "function" ? Uint8ClampedArray : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8clampedarray-support/lib/main.js
var require_main41 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8clampedarray-support/lib/main.js"(exports, module) {
    "use strict";
    var isUint8ClampedArray = require_lib49();
    var GlobalUint8ClampedArray = require_uint8clampedarray();
    function hasUint8ClampedArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalUint8ClampedArray !== "function") {
        return false;
      }
      try {
        arr = new GlobalUint8ClampedArray([-1, 0, 1, 3.14, 4.99, 255, 256]);
        bool = isUint8ClampedArray(arr) && arr[0] === 0 && // clamped
        arr[1] === 0 && arr[2] === 1 && arr[3] === 3 && // round to nearest
        arr[4] === 5 && // round to nearest
        arr[5] === 255 && arr[6] === 255;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasUint8ClampedArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8clampedarray-support/lib/index.js
var require_lib50 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-uint8clampedarray-support/lib/index.js"(exports, module) {
    "use strict";
    var hasUint8ClampedArraySupport = require_main41();
    module.exports = hasUint8ClampedArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint8c/lib/main.js
var require_main42 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint8c/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Uint8ClampedArray === "function" ? Uint8ClampedArray : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint8c/lib/polyfill.js
var require_polyfill10 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint8c/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/uint8c/lib/index.js
var require_lib51 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/uint8c/lib/index.js"(exports, module) {
    "use strict";
    var hasUint8ClampedArraySupport = require_lib50();
    var builtin = require_main42();
    var polyfill = require_polyfill10();
    var ctor;
    if (hasUint8ClampedArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int8array/lib/main.js
var require_main43 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int8array/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasInt8Array = typeof Int8Array === "function";
    function isInt8Array(value) {
      return hasInt8Array && value instanceof Int8Array || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object Int8Array]";
    }
    module.exports = isInt8Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int8array/lib/index.js
var require_lib52 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-int8array/lib/index.js"(exports, module) {
    "use strict";
    var isInt8Array = require_main43();
    module.exports = isInt8Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/int8/max/lib/index.js
var require_lib53 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/int8/max/lib/index.js"(exports, module) {
    "use strict";
    var INT8_MAX = 127 | 0;
    module.exports = INT8_MAX;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/int8/min/lib/index.js
var require_lib54 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/int8/min/lib/index.js"(exports, module) {
    "use strict";
    var INT8_MIN = -128 | 0;
    module.exports = INT8_MIN;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int8array-support/lib/int8array.js
var require_int8array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int8array-support/lib/int8array.js"(exports, module) {
    "use strict";
    var main = typeof Int8Array === "function" ? Int8Array : null;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int8array-support/lib/main.js
var require_main44 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int8array-support/lib/main.js"(exports, module) {
    "use strict";
    var isInt8Array = require_lib52();
    var INT8_MAX = require_lib53();
    var INT8_MIN = require_lib54();
    var GlobalInt8Array = require_int8array();
    function hasInt8ArraySupport() {
      var bool;
      var arr;
      if (typeof GlobalInt8Array !== "function") {
        return false;
      }
      try {
        arr = new GlobalInt8Array([1, 3.14, -3.14, INT8_MAX + 1]);
        bool = isInt8Array(arr) && arr[0] === 1 && arr[1] === 3 && // truncation
        arr[2] === -3 && // truncation
        arr[3] === INT8_MIN;
      } catch (err) {
        bool = false;
      }
      return bool;
    }
    module.exports = hasInt8ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int8array-support/lib/index.js
var require_lib55 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-int8array-support/lib/index.js"(exports, module) {
    "use strict";
    var hasInt8ArraySupport = require_main44();
    module.exports = hasInt8ArraySupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int8/lib/main.js
var require_main45 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int8/lib/main.js"(exports, module) {
    "use strict";
    var ctor = typeof Int8Array === "function" ? Int8Array : void 0;
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int8/lib/polyfill.js
var require_polyfill11 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int8/lib/polyfill.js"(exports, module) {
    "use strict";
    function polyfill() {
      throw new Error("not implemented");
    }
    module.exports = polyfill;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/int8/lib/index.js
var require_lib56 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/int8/lib/index.js"(exports, module) {
    "use strict";
    var hasInt8ArraySupport = require_lib55();
    var builtin = require_main45();
    var polyfill = require_polyfill11();
    var ctor;
    if (hasInt8ArraySupport()) {
      ctor = builtin;
    } else {
      ctor = polyfill;
    }
    module.exports = ctor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/primitive.js
var require_primitive = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/primitive.js"(exports, module) {
    "use strict";
    function isNumber(value) {
      return typeof value === "number";
    }
    module.exports = isNumber;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/number/ctor/lib/main.js
var require_main46 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/number/ctor/lib/main.js"(exports, module) {
    "use strict";
    module.exports = Number;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/number/ctor/lib/index.js
var require_lib57 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/number/ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main46();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/tostring.js
var require_tostring2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/tostring.js"(exports, module) {
    "use strict";
    var Number2 = require_lib57();
    var toString = Number2.prototype.toString;
    module.exports = toString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/try2serialize.js
var require_try2serialize = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/try2serialize.js"(exports, module) {
    "use strict";
    var toString = require_tostring2();
    function test(value) {
      try {
        toString.call(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = test;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/object.js
var require_object = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/object.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib10();
    var nativeClass = require_lib13();
    var Number2 = require_lib57();
    var test = require_try2serialize();
    var FLG = hasToStringTag();
    function isNumber(value) {
      if (typeof value === "object") {
        if (value instanceof Number2) {
          return true;
        }
        if (FLG) {
          return test(value);
        }
        return nativeClass(value) === "[object Number]";
      }
      return false;
    }
    module.exports = isNumber;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/main.js
var require_main47 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive();
    var isObject = require_object();
    function isNumber(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isNumber;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/index.js
var require_lib58 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-number/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main47();
    var isPrimitive = require_primitive();
    var isObject = require_object();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/float64/ninf/lib/index.js
var require_lib59 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/float64/ninf/lib/index.js"(exports, module) {
    "use strict";
    var Number2 = require_lib57();
    var FLOAT64_NINF = Number2.NEGATIVE_INFINITY;
    module.exports = FLOAT64_NINF;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/floor/lib/main.js
var require_main48 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/floor/lib/main.js"(exports, module) {
    "use strict";
    var floor = Math.floor;
    module.exports = floor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/floor/lib/index.js
var require_lib60 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/floor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main48();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-integer/lib/main.js
var require_main49 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-integer/lib/main.js"(exports, module) {
    "use strict";
    var floor = require_lib60();
    function isInteger(x) {
      return floor(x) === x;
    }
    module.exports = isInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-integer/lib/index.js
var require_lib61 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-integer/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main49();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/integer.js
var require_integer = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/integer.js"(exports, module) {
    "use strict";
    var PINF = require_lib24();
    var NINF = require_lib59();
    var isInt = require_lib61();
    function isInteger(value) {
      return value < PINF && value > NINF && isInt(value);
    }
    module.exports = isInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/primitive.js
var require_primitive2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/primitive.js"(exports, module) {
    "use strict";
    var isNumber = require_lib58().isPrimitive;
    var isInt = require_integer();
    function isInteger(value) {
      return isNumber(value) && isInt(value);
    }
    module.exports = isInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/object.js
var require_object2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/object.js"(exports, module) {
    "use strict";
    var isNumber = require_lib58().isObject;
    var isInt = require_integer();
    function isInteger(value) {
      return isNumber(value) && isInt(value.valueOf());
    }
    module.exports = isInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/main.js
var require_main50 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive2();
    var isObject = require_object2();
    function isInteger(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/index.js
var require_lib62 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-integer/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main50();
    var isPrimitive = require_primitive2();
    var isObject = require_object2();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/primitive.js
var require_primitive3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/primitive.js"(exports, module) {
    "use strict";
    var isInteger = require_lib62().isPrimitive;
    function isNonNegativeInteger(value) {
      return isInteger(value) && value >= 0;
    }
    module.exports = isNonNegativeInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/object.js
var require_object3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/object.js"(exports, module) {
    "use strict";
    var isInteger = require_lib62().isObject;
    function isNonNegativeInteger(value) {
      return isInteger(value) && value.valueOf() >= 0;
    }
    module.exports = isNonNegativeInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/main.js
var require_main51 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive3();
    var isObject = require_object3();
    function isNonNegativeInteger(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isNonNegativeInteger;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/index.js
var require_lib63 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-nonnegative-integer/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main51();
    var isPrimitive = require_primitive3();
    var isObject = require_object3();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/array/max-array-length/lib/index.js
var require_lib64 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/array/max-array-length/lib/index.js"(exports, module) {
    "use strict";
    var MAX_ARRAY_LENGTH = 4294967295 >>> 0;
    module.exports = MAX_ARRAY_LENGTH;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array-like-object/lib/main.js
var require_main52 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array-like-object/lib/main.js"(exports, module) {
    "use strict";
    var isInteger = require_lib61();
    var MAX_LENGTH = require_lib64();
    function isArrayLikeObject(value) {
      return typeof value === "object" && value !== null && typeof value.length === "number" && isInteger(value.length) && value.length >= 0 && value.length <= MAX_LENGTH;
    }
    module.exports = isArrayLikeObject;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array-like-object/lib/index.js
var require_lib65 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-array-like-object/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main52();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/constants/array/max-typed-array-length/lib/index.js
var require_lib66 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/constants/array/max-typed-array-length/lib/index.js"(exports, module) {
    "use strict";
    var MAX_TYPED_ARRAY_LENGTH = 9007199254740991;
    module.exports = MAX_TYPED_ARRAY_LENGTH;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-collection/lib/main.js
var require_main53 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-collection/lib/main.js"(exports, module) {
    "use strict";
    var isInteger = require_lib61();
    var MAX_LENGTH = require_lib66();
    function isCollection(value) {
      return typeof value === "object" && value !== null && typeof value.length === "number" && isInteger(value.length) && value.length >= 0 && value.length <= MAX_LENGTH;
    }
    module.exports = isCollection;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-collection/lib/index.js
var require_lib67 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-collection/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main53();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-arraybuffer/lib/main.js
var require_main54 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-arraybuffer/lib/main.js"(exports, module) {
    "use strict";
    var nativeClass = require_lib13();
    var hasArrayBuffer = typeof ArrayBuffer === "function";
    function isArrayBuffer(value) {
      return hasArrayBuffer && value instanceof ArrayBuffer || // eslint-disable-line stdlib/require-globals
      nativeClass(value) === "[object ArrayBuffer]";
    }
    module.exports = isArrayBuffer;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-arraybuffer/lib/index.js
var require_lib68 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-arraybuffer/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main54();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object/lib/main.js
var require_main55 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object/lib/main.js"(exports, module) {
    "use strict";
    var isArray = require_lib14();
    function isObject(value) {
      return typeof value === "object" && value !== null && !isArray(value);
    }
    module.exports = isObject;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object/lib/index.js
var require_lib69 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-object/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main55();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/primitive.js
var require_primitive4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/primitive.js"(exports, module) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    module.exports = isString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/valueof.js
var require_valueof = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/valueof.js"(exports, module) {
    "use strict";
    var valueOf = String.prototype.valueOf;
    module.exports = valueOf;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/try2valueof.js
var require_try2valueof = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/try2valueof.js"(exports, module) {
    "use strict";
    var valueOf = require_valueof();
    function test(value) {
      try {
        valueOf.call(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = test;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/object.js
var require_object4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/object.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib10();
    var nativeClass = require_lib13();
    var test = require_try2valueof();
    var FLG = hasToStringTag();
    function isString(value) {
      if (typeof value === "object") {
        if (value instanceof String) {
          return true;
        }
        if (FLG) {
          return test(value);
        }
        return nativeClass(value) === "[object String]";
      }
      return false;
    }
    module.exports = isString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/main.js
var require_main56 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive4();
    var isObject = require_object4();
    function isString(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/index.js
var require_lib70 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main56();
    var isPrimitive = require_primitive4();
    var isObject = require_object4();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string-array/lib/index.js
var require_lib71 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-string-array/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var arrayfun = require_lib15();
    var isString = require_lib70();
    var isPrimitiveArray = arrayfun(isString.isPrimitive);
    var isObjectArray = arrayfun(isString.isObject);
    var isStringArray = arrayfun(isString);
    setReadOnly(isStringArray, "primitives", isPrimitiveArray);
    setReadOnly(isStringArray, "objects", isObjectArray);
    module.exports = isStringArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/fixtures/re.js
var require_re = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/fixtures/re.js"(exports, module) {
    "use strict";
    var RE = /./;
    module.exports = RE;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/primitive.js
var require_primitive5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/primitive.js"(exports, module) {
    "use strict";
    function isBoolean(value) {
      return typeof value === "boolean";
    }
    module.exports = isBoolean;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/boolean/ctor/lib/main.js
var require_main57 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/boolean/ctor/lib/main.js"(exports, module) {
    "use strict";
    var Bool = Boolean;
    module.exports = Bool;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/boolean/ctor/lib/index.js
var require_lib72 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/boolean/ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main57();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/tostring.js
var require_tostring3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/tostring.js"(exports, module) {
    "use strict";
    var toString = Boolean.prototype.toString;
    module.exports = toString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/try2serialize.js
var require_try2serialize2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/try2serialize.js"(exports, module) {
    "use strict";
    var toString = require_tostring3();
    function test(value) {
      try {
        toString.call(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = test;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/object.js
var require_object5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/object.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_lib10();
    var nativeClass = require_lib13();
    var Boolean2 = require_lib72();
    var test = require_try2serialize2();
    var FLG = hasToStringTag();
    function isBoolean(value) {
      if (typeof value === "object") {
        if (value instanceof Boolean2) {
          return true;
        }
        if (FLG) {
          return test(value);
        }
        return nativeClass(value) === "[object Boolean]";
      }
      return false;
    }
    module.exports = isBoolean;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/main.js
var require_main58 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/main.js"(exports, module) {
    "use strict";
    var isPrimitive = require_primitive5();
    var isObject = require_object5();
    function isBoolean(value) {
      return isPrimitive(value) || isObject(value);
    }
    module.exports = isBoolean;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/index.js
var require_lib73 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-boolean/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main58();
    var isPrimitive = require_primitive5();
    var isObject = require_object5();
    setReadOnly(main, "isPrimitive", isPrimitive);
    setReadOnly(main, "isObject", isObject);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/codegen.js
var require_codegen = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/codegen.js"(exports, module) {
    "use strict";
    function getGlobal() {
      return new Function("return this;")();
    }
    module.exports = getGlobal;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/self.js
var require_self = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/self.js"(exports, module) {
    "use strict";
    var obj = typeof self === "object" ? self : null;
    module.exports = obj;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/window.js
var require_window = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/window.js"(exports, module) {
    "use strict";
    var obj = typeof window === "object" ? window : null;
    module.exports = obj;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/global_this.js
var require_global_this = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/global_this.js"(exports, module) {
    "use strict";
    var obj = typeof globalThis === "object" ? globalThis : null;
    module.exports = obj;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/browser.js
var require_browser = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/global/lib/browser.js"(exports, module) {
    "use strict";
    var isBoolean = require_lib73().isPrimitive;
    var format = require_lib3();
    var getThis = require_codegen();
    var Self = require_self();
    var Win = require_window();
    var GlobalThis = require_global_this();
    function getGlobal(codegen) {
      if (arguments.length) {
        if (!isBoolean(codegen)) {
          throw new TypeError(format("invalid argument. Must provide a boolean. Value: `%s`.", codegen));
        }
        if (codegen) {
          return getThis();
        }
      }
      if (GlobalThis) {
        return GlobalThis;
      }
      if (Self) {
        return Self;
      }
      if (Win) {
        return Win;
      }
      throw new Error("unexpected error. Unable to resolve global object.");
    }
    module.exports = getGlobal;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/fixtures/nodelist.js
var require_nodelist = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/fixtures/nodelist.js"(exports, module) {
    "use strict";
    var getGlobal = require_browser();
    var root = getGlobal();
    var nodeList = root.document && root.document.childNodes;
    module.exports = nodeList;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/fixtures/typedarray.js
var require_typedarray = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/fixtures/typedarray.js"(exports, module) {
    "use strict";
    var typedarray = Int8Array;
    module.exports = typedarray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/check.js
var require_check = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/check.js"(exports, module) {
    "use strict";
    var RE = require_re();
    var nodeList = require_nodelist();
    var typedarray = require_typedarray();
    function check() {
      if (
        // Chrome 1-12 returns 'function' for regular expression instances (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof):
        typeof RE === "function" || // Safari 8 returns 'object' for typed array and weak map constructors (underscore #1929):
        typeof typedarray === "object" || // PhantomJS 1.9 returns 'function' for `NodeList` instances (underscore #2236):
        typeof nodeList === "function"
      ) {
        return true;
      }
      return false;
    }
    module.exports = check;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/main.js
var require_main59 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/main.js"(exports, module) {
    "use strict";
    var ctorName = require_lib19();
    function typeOf(v) {
      var type;
      if (v === null) {
        return "null";
      }
      type = typeof v;
      if (type === "object") {
        return ctorName(v).toLowerCase();
      }
      return type;
    }
    module.exports = typeOf;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/polyfill.js
var require_polyfill12 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/polyfill.js"(exports, module) {
    "use strict";
    var ctorName = require_lib19();
    function typeOf(v) {
      return ctorName(v).toLowerCase();
    }
    module.exports = typeOf;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/index.js
var require_lib74 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/type-of/lib/index.js"(exports, module) {
    "use strict";
    var usePolyfill = require_check();
    var builtin = require_main59();
    var polyfill = require_polyfill12();
    var main = usePolyfill() ? polyfill : builtin;
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-function/lib/main.js
var require_main60 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-function/lib/main.js"(exports, module) {
    "use strict";
    var typeOf = require_lib74();
    function isFunction(value) {
      return typeOf(value) === "function";
    }
    module.exports = isFunction;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-function/lib/index.js
var require_lib75 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-function/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main60();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/tostring.js
var require_tostring4 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/tostring.js"(exports, module) {
    "use strict";
    function toString() {
      var str = "" + this.re;
      if (this.im < 0) {
        str += " - " + -this.im;
      } else {
        str += " + " + this.im;
      }
      str += "i";
      return str;
    }
    module.exports = toString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/tojson.js
var require_tojson = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/tojson.js"(exports, module) {
    "use strict";
    function toJSON() {
      var out = {};
      out.type = "Complex128";
      out.re = this.re;
      out.im = this.im;
      return out;
    }
    module.exports = toJSON;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/main.js
var require_main61 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/main.js"(exports, module) {
    "use strict";
    var isNumber = require_lib58().isPrimitive;
    var defineProperty = require_lib4();
    var setReadOnly = require_lib5();
    var format = require_lib3();
    var toStr = require_tostring4();
    var toJSON = require_tojson();
    function Complex128(real, imag) {
      if (!(this instanceof Complex128)) {
        throw new TypeError("invalid invocation. Constructor must be called with the `new` keyword.");
      }
      if (!isNumber(real)) {
        throw new TypeError(format("invalid argument. Real component must be a number. Value: `%s`.", real));
      }
      if (!isNumber(imag)) {
        throw new TypeError(format("invalid argument. Imaginary component must be a number. Value: `%s`.", imag));
      }
      defineProperty(this, "re", {
        "configurable": false,
        "enumerable": true,
        "writable": false,
        "value": real
      });
      defineProperty(this, "im", {
        "configurable": false,
        "enumerable": true,
        "writable": false,
        "value": imag
      });
      return this;
    }
    setReadOnly(Complex128, "BYTES_PER_ELEMENT", 8);
    setReadOnly(Complex128.prototype, "BYTES_PER_ELEMENT", 8);
    setReadOnly(Complex128.prototype, "byteLength", 16);
    setReadOnly(Complex128.prototype, "toString", toStr);
    setReadOnly(Complex128.prototype, "toJSON", toJSON);
    module.exports = Complex128;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/index.js
var require_lib76 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main61();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/number/float64/base/to-float32/lib/main.js
var require_main62 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/number/float64/base/to-float32/lib/main.js"(exports, module) {
    "use strict";
    var fround = typeof Math.fround === "function" ? Math.fround : null;
    module.exports = fround;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/number/float64/base/to-float32/lib/polyfill.js
var require_polyfill13 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/number/float64/base/to-float32/lib/polyfill.js"(exports, module) {
    "use strict";
    var Float32Array2 = require_lib26();
    var FLOAT32_VIEW = new Float32Array2(1);
    function float64ToFloat32(x) {
      FLOAT32_VIEW[0] = x;
      return FLOAT32_VIEW[0];
    }
    module.exports = float64ToFloat32;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/number/float64/base/to-float32/lib/index.js
var require_lib77 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/number/float64/base/to-float32/lib/index.js"(exports, module) {
    "use strict";
    var builtin = require_main62();
    var polyfill = require_polyfill13();
    var float64ToFloat32;
    if (typeof builtin === "function") {
      float64ToFloat32 = builtin;
    } else {
      float64ToFloat32 = polyfill;
    }
    module.exports = float64ToFloat32;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/tostring.js
var require_tostring5 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/tostring.js"(exports, module) {
    "use strict";
    function toString() {
      var str = "" + this.re;
      if (this.im < 0) {
        str += " - " + -this.im;
      } else {
        str += " + " + this.im;
      }
      str += "i";
      return str;
    }
    module.exports = toString;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/tojson.js
var require_tojson2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/tojson.js"(exports, module) {
    "use strict";
    function toJSON() {
      var out = {};
      out.type = "Complex64";
      out.re = this.re;
      out.im = this.im;
      return out;
    }
    module.exports = toJSON;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/main.js
var require_main63 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/main.js"(exports, module) {
    "use strict";
    var isNumber = require_lib58().isPrimitive;
    var defineProperty = require_lib4();
    var setReadOnly = require_lib5();
    var float64ToFloat32 = require_lib77();
    var format = require_lib3();
    var toStr = require_tostring5();
    var toJSON = require_tojson2();
    function Complex64(real, imag) {
      if (!(this instanceof Complex64)) {
        throw new TypeError("invalid invocation. Constructor must be called with the `new` keyword.");
      }
      if (!isNumber(real)) {
        throw new TypeError(format("invalid argument. Real component must be a number. Value: `%s`.", real));
      }
      if (!isNumber(imag)) {
        throw new TypeError(format("invalid argument. Imaginary component must be a number. Value: `%s`.", imag));
      }
      defineProperty(this, "re", {
        "configurable": false,
        "enumerable": true,
        "writable": false,
        "value": float64ToFloat32(real)
      });
      defineProperty(this, "im", {
        "configurable": false,
        "enumerable": true,
        "writable": false,
        "value": float64ToFloat32(imag)
      });
      return this;
    }
    setReadOnly(Complex64, "BYTES_PER_ELEMENT", 4);
    setReadOnly(Complex64.prototype, "BYTES_PER_ELEMENT", 4);
    setReadOnly(Complex64.prototype, "byteLength", 8);
    setReadOnly(Complex64.prototype, "toString", toStr);
    setReadOnly(Complex64.prototype, "toJSON", toJSON);
    module.exports = Complex64;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/index.js
var require_lib78 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/ctor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main63();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-complex-like/lib/main.js
var require_main64 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-complex-like/lib/main.js"(exports, module) {
    "use strict";
    var Complex128 = require_lib76();
    var Complex64 = require_lib78();
    function isComplexLike(value) {
      if (value instanceof Complex128 || value instanceof Complex64) {
        return true;
      }
      return typeof value === "object" && value !== null && typeof value.re === "number" && typeof value.im === "number";
    }
    module.exports = isComplexLike;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/is-complex-like/lib/index.js
var require_lib79 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/is-complex-like/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main64();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-even/lib/main.js
var require_main65 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-even/lib/main.js"(exports, module) {
    "use strict";
    var isInteger = require_lib61();
    function isEven(x) {
      return isInteger(x / 2);
    }
    module.exports = isEven;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-even/lib/index.js
var require_lib80 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/assert/is-even/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main65();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex64array/lib/main.js
var require_main66 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex64array/lib/main.js"(exports, module) {
    "use strict";
    var BYTES_PER_ELEMENT = 8;
    function isComplex64Array(value) {
      return typeof value === "object" && value !== null && value.constructor.name === "Complex64Array" && value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT;
    }
    module.exports = isComplex64Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex64array/lib/index.js
var require_lib81 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex64array/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main66();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex128array/lib/main.js
var require_main67 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex128array/lib/main.js"(exports, module) {
    "use strict";
    var BYTES_PER_ELEMENT = 16;
    function isComplex128Array(value) {
      return typeof value === "object" && value !== null && value.constructor.name === "Complex128Array" && value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT;
    }
    module.exports = isComplex128Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex128array/lib/index.js
var require_lib82 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/is-complex128array/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main67();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-iterator-symbol-support/lib/main.js
var require_main68 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-iterator-symbol-support/lib/main.js"(exports, module) {
    "use strict";
    var hasOwnProp = require_lib11();
    var Symbol2 = require_lib12();
    function hasIteratorSymbolSupport() {
      return typeof Symbol2 === "function" && typeof Symbol2("foo") === "symbol" && hasOwnProp(Symbol2, "iterator") && typeof Symbol2.iterator === "symbol";
    }
    module.exports = hasIteratorSymbolSupport;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/assert/has-iterator-symbol-support/lib/index.js
var require_lib83 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/assert/has-iterator-symbol-support/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main68();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/symbol/iterator/lib/main.js
var require_main69 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/symbol/iterator/lib/main.js"(exports, module) {
    "use strict";
    var hasIteratorSymbolSupport = require_lib83();
    var IteratorSymbol = hasIteratorSymbolSupport() ? Symbol.iterator : null;
    module.exports = IteratorSymbol;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/symbol/iterator/lib/index.js
var require_lib84 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/symbol/iterator/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main69();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-accessor/lib/main.js
var require_main70 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-accessor/lib/main.js"(exports, module) {
    "use strict";
    var defineProperty = require_lib4();
    function setNonEnumerableReadOnlyAccessor(obj, prop, getter) {
      defineProperty(obj, prop, {
        "configurable": false,
        "enumerable": false,
        "get": getter
      });
    }
    module.exports = setNonEnumerableReadOnlyAccessor;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-accessor/lib/index.js
var require_lib85 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/utils/define-nonenumerable-read-only-accessor/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main70();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/real/lib/main.js
var require_main71 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/real/lib/main.js"(exports, module) {
    "use strict";
    function real(z) {
      return z.re;
    }
    module.exports = real;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/real/lib/index.js
var require_lib86 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/real/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main71();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/imag/lib/main.js
var require_main72 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/imag/lib/main.js"(exports, module) {
    "use strict";
    function imag(z) {
      return z.im;
    }
    module.exports = imag;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/imag/lib/index.js
var require_lib87 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float32/imag/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main72();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex64/lib/main.js
var require_main73 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex64/lib/main.js"(exports, module) {
    "use strict";
    var Float32Array2 = require_lib26();
    function reinterpret(x, offset) {
      return new Float32Array2(x.buffer, x.byteOffset + x.BYTES_PER_ELEMENT * offset, 2 * (x.length - offset));
    }
    module.exports = reinterpret;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex64/lib/index.js
var require_lib88 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex64/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main73();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex128/lib/main.js
var require_main74 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex128/lib/main.js"(exports, module) {
    "use strict";
    var Float64Array2 = require_lib22();
    function reinterpret(x, offset) {
      return new Float64Array2(x.buffer, x.byteOffset + x.BYTES_PER_ELEMENT * offset, 2 * (x.length - offset));
    }
    module.exports = reinterpret;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex128/lib/index.js
var require_lib89 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/strided/base/reinterpret-complex128/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main74();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/from_iterator.js
var require_from_iterator = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/from_iterator.js"(exports, module) {
    "use strict";
    var isArrayLikeObject = require_lib65();
    var isComplexLike = require_lib79();
    var realf = require_lib86();
    var imagf = require_lib87();
    var format = require_lib3();
    function fromIterator(it) {
      var out;
      var v;
      var z;
      out = [];
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        z = v.value;
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(realf(z), imagf(z));
        } else {
          return new TypeError(format("invalid argument. An iterator must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", z));
        }
      }
      return out;
    }
    module.exports = fromIterator;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/from_iterator_map.js
var require_from_iterator_map = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/from_iterator_map.js"(exports, module) {
    "use strict";
    var isArrayLikeObject = require_lib65();
    var isComplexLike = require_lib79();
    var realf = require_lib86();
    var imagf = require_lib87();
    var format = require_lib3();
    function fromIteratorMap(it, clbk, thisArg) {
      var out;
      var v;
      var z;
      var i;
      out = [];
      i = -1;
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        i += 1;
        z = clbk.call(thisArg, v.value, i);
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(realf(z), imagf(z));
        } else {
          return new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", z));
        }
      }
      return out;
    }
    module.exports = fromIteratorMap;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/from_array.js
var require_from_array = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/from_array.js"(exports, module) {
    "use strict";
    var isComplexLike = require_lib79();
    var realf = require_lib86();
    var imagf = require_lib87();
    function fromArray(buf, arr) {
      var len;
      var v;
      var i;
      var j;
      len = arr.length;
      j = 0;
      for (i = 0; i < len; i++) {
        v = arr[i];
        if (!isComplexLike(v)) {
          return null;
        }
        buf[j] = realf(v);
        buf[j + 1] = imagf(v);
        j += 2;
      }
      return buf;
    }
    module.exports = fromArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/main.js
var require_main75 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/main.js"(exports, module) {
    "use strict";
    var isNonNegativeInteger = require_lib63().isPrimitive;
    var isArrayLikeObject = require_lib65();
    var isCollection = require_lib67();
    var isArrayBuffer = require_lib68();
    var isObject = require_lib69();
    var isArray = require_lib14();
    var isStringArray = require_lib71().primitives;
    var isString = require_lib70().isPrimitive;
    var isFunction = require_lib75();
    var isComplexLike = require_lib79();
    var isEven = require_lib80();
    var isInteger = require_lib61();
    var isComplex64Array = require_lib81();
    var isComplex128Array = require_lib82();
    var hasIteratorSymbolSupport = require_lib83();
    var ITERATOR_SYMBOL = require_lib84();
    var setReadOnly = require_lib5();
    var setReadOnlyAccessor = require_lib85();
    var Float32Array2 = require_lib26();
    var Complex64 = require_lib78();
    var format = require_lib3();
    var realf = require_lib86();
    var imagf = require_lib87();
    var floor = require_lib60();
    var reinterpret64 = require_lib88();
    var reinterpret128 = require_lib89();
    var getter = require_lib8();
    var accessorGetter = require_lib7();
    var fromIterator = require_from_iterator();
    var fromIteratorMap = require_from_iterator_map();
    var fromArray = require_from_array();
    var BYTES_PER_ELEMENT = Float32Array2.BYTES_PER_ELEMENT * 2;
    var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();
    function isComplexArray(value) {
      return value instanceof Complex64Array || typeof value === "object" && value !== null && (value.constructor.name === "Complex64Array" || value.constructor.name === "Complex128Array") && typeof value._length === "number" && // eslint-disable-line no-underscore-dangle
      // NOTE: we don't perform a more rigorous test here for a typed array for performance reasons, as robustly checking for a typed array instance could require walking the prototype tree and performing relatively expensive constructor checks...
      typeof value._buffer === "object";
    }
    function isComplexArrayConstructor(value) {
      return value === Complex64Array || // NOTE: weaker test in order to avoid a circular dependency with Complex128Array...
      value.name === "Complex128Array";
    }
    function getComplex64(buf, idx) {
      idx *= 2;
      return new Complex64(buf[idx], buf[idx + 1]);
    }
    function Complex64Array() {
      var byteOffset;
      var nargs;
      var buf;
      var len;
      nargs = arguments.length;
      if (!(this instanceof Complex64Array)) {
        if (nargs === 0) {
          return new Complex64Array();
        }
        if (nargs === 1) {
          return new Complex64Array(arguments[0]);
        }
        if (nargs === 2) {
          return new Complex64Array(arguments[0], arguments[1]);
        }
        return new Complex64Array(arguments[0], arguments[1], arguments[2]);
      }
      if (nargs === 0) {
        buf = new Float32Array2(0);
      } else if (nargs === 1) {
        if (isNonNegativeInteger(arguments[0])) {
          buf = new Float32Array2(arguments[0] * 2);
        } else if (isCollection(arguments[0])) {
          buf = arguments[0];
          len = buf.length;
          if (len && isArray(buf) && isComplexLike(buf[0])) {
            buf = fromArray(new Float32Array2(len * 2), buf);
            if (buf === null) {
              if (!isEven(len)) {
                throw new RangeError(format("invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.", len));
              }
              buf = new Float32Array2(arguments[0]);
            }
          } else {
            if (isComplex64Array(buf)) {
              buf = reinterpret64(buf, 0);
            } else if (isComplex128Array(buf)) {
              buf = reinterpret128(buf, 0);
            } else if (!isEven(len)) {
              throw new RangeError(format("invalid argument. Array-like object and typed array arguments must have a length which is a multiple of two. Length: `%u`.", len));
            }
            buf = new Float32Array2(buf);
          }
        } else if (isArrayBuffer(arguments[0])) {
          buf = arguments[0];
          if (!isInteger(buf.byteLength / BYTES_PER_ELEMENT)) {
            throw new RangeError(format("invalid argument. ArrayBuffer byte length must be a multiple of %u. Byte length: `%u`.", BYTES_PER_ELEMENT, buf.byteLength));
          }
          buf = new Float32Array2(buf);
        } else if (isObject(arguments[0])) {
          buf = arguments[0];
          if (HAS_ITERATOR_SYMBOL === false) {
            throw new TypeError(format("invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.", buf));
          }
          if (!isFunction(buf[ITERATOR_SYMBOL])) {
            throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", buf));
          }
          buf = buf[ITERATOR_SYMBOL]();
          if (!isFunction(buf.next)) {
            throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", buf));
          }
          buf = fromIterator(buf);
          if (buf instanceof Error) {
            throw buf;
          }
          buf = new Float32Array2(buf);
        } else {
          throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", arguments[0]));
        }
      } else {
        buf = arguments[0];
        if (!isArrayBuffer(buf)) {
          throw new TypeError(format("invalid argument. First argument must be an ArrayBuffer. Value: `%s`.", buf));
        }
        byteOffset = arguments[1];
        if (!isNonNegativeInteger(byteOffset)) {
          throw new TypeError(format("invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.", byteOffset));
        }
        if (!isInteger(byteOffset / BYTES_PER_ELEMENT)) {
          throw new RangeError(format("invalid argument. Byte offset must be a multiple of %u. Value: `%u`.", BYTES_PER_ELEMENT, byteOffset));
        }
        if (nargs === 2) {
          len = buf.byteLength - byteOffset;
          if (!isInteger(len / BYTES_PER_ELEMENT)) {
            throw new RangeError(format("invalid arguments. ArrayBuffer view byte length must be a multiple of %u. View byte length: `%u`.", BYTES_PER_ELEMENT, len));
          }
          buf = new Float32Array2(buf, byteOffset);
        } else {
          len = arguments[2];
          if (!isNonNegativeInteger(len)) {
            throw new TypeError(format("invalid argument. Length must be a nonnegative integer. Value: `%s`.", len));
          }
          if (len * BYTES_PER_ELEMENT > buf.byteLength - byteOffset) {
            throw new RangeError(format("invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.", len * BYTES_PER_ELEMENT));
          }
          buf = new Float32Array2(buf, byteOffset, len * 2);
        }
      }
      setReadOnly(this, "_buffer", buf);
      setReadOnly(this, "_length", buf.length / 2);
      return this;
    }
    setReadOnly(Complex64Array, "BYTES_PER_ELEMENT", BYTES_PER_ELEMENT);
    setReadOnly(Complex64Array, "name", "Complex64Array");
    setReadOnly(Complex64Array, "from", function from(src) {
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
      if (!isFunction(this)) {
        throw new TypeError("invalid invocation. `this` context must be a constructor.");
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      nargs = arguments.length;
      if (nargs > 1) {
        clbk = arguments[1];
        if (!isFunction(clbk)) {
          throw new TypeError(format("invalid argument. Second argument must be a function. Value: `%s`.", clbk));
        }
        if (nargs > 2) {
          thisArg = arguments[2];
        }
      }
      if (isComplexArray(src)) {
        len = src.length;
        if (clbk) {
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, src.get(i), i);
            if (isComplexLike(v)) {
              buf[j] = realf(v);
              buf[j + 1] = imagf(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", v));
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (isCollection(src)) {
        if (clbk) {
          len = src.length;
          if (src.get && src.set) {
            get = accessorGetter("default");
          } else {
            get = getter("default");
          }
          for (i = 0; i < len; i++) {
            if (!isComplexLike(get(src, i))) {
              flg = true;
              break;
            }
          }
          if (flg) {
            if (!isEven(len)) {
              throw new RangeError(format("invalid argument. First argument must have a length which is a multiple of %u. Length: `%u`.", 2, len));
            }
            out = new this(len / 2);
            buf = out._buffer;
            for (i = 0; i < len; i++) {
              buf[i] = clbk.call(thisArg, get(src, i), i);
            }
            return out;
          }
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, get(src, i), i);
            if (isComplexLike(v)) {
              buf[j] = realf(v);
              buf[j + 1] = imagf(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", v));
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (isObject(src) && HAS_ITERATOR_SYMBOL && isFunction(src[ITERATOR_SYMBOL])) {
        buf = src[ITERATOR_SYMBOL]();
        if (!isFunction(buf.next)) {
          throw new TypeError(format("invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.", src));
        }
        if (clbk) {
          tmp = fromIteratorMap(buf, clbk, thisArg);
        } else {
          tmp = fromIterator(buf);
        }
        if (tmp instanceof Error) {
          throw tmp;
        }
        len = tmp.length / 2;
        out = new this(len);
        buf = out._buffer;
        for (i = 0; i < len; i++) {
          buf[i] = tmp[i];
        }
        return out;
      }
      throw new TypeError(format("invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.", src));
    });
    setReadOnly(Complex64Array, "of", function of() {
      var args;
      var i;
      if (!isFunction(this)) {
        throw new TypeError("invalid invocation. `this` context must be a constructor.");
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      args = [];
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return new this(args);
    });
    setReadOnly(Complex64Array.prototype, "at", function at(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isInteger(idx)) {
        throw new TypeError(format("invalid argument. Must provide an integer. Value: `%s`.", idx));
      }
      if (idx < 0) {
        idx += this._length;
      }
      if (idx < 0 || idx >= this._length) {
        return;
      }
      return getComplex64(this._buffer, idx);
    });
    setReadOnlyAccessor(Complex64Array.prototype, "buffer", function get() {
      return this._buffer.buffer;
    });
    setReadOnlyAccessor(Complex64Array.prototype, "byteLength", function get() {
      return this._buffer.byteLength;
    });
    setReadOnlyAccessor(Complex64Array.prototype, "byteOffset", function get() {
      return this._buffer.byteOffset;
    });
    setReadOnly(Complex64Array.prototype, "BYTES_PER_ELEMENT", Complex64Array.BYTES_PER_ELEMENT);
    setReadOnly(Complex64Array.prototype, "copyWithin", function copyWithin(target, start) {
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (arguments.length === 2) {
        this._buffer.copyWithin(target * 2, start * 2);
      } else {
        this._buffer.copyWithin(target * 2, start * 2, arguments[2] * 2);
      }
      return this;
    });
    setReadOnly(Complex64Array.prototype, "entries", function entries() {
      var self2;
      var iter;
      var len;
      var buf;
      var FLG;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": [i, getComplex64(buf, i)],
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.entries();
      }
    });
    setReadOnly(Complex64Array.prototype, "every", function every(predicate, thisArg) {
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (!predicate.call(thisArg, getComplex64(buf, i), i, this)) {
          return false;
        }
      }
      return true;
    });
    setReadOnly(Complex64Array.prototype, "fill", function fill(value, start, end) {
      var buf;
      var len;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(value)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", value));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        if (!isInteger(start)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", start));
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length > 2) {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Third argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          }
          if (end > len) {
            end = len;
          }
        } else {
          end = len;
        }
      } else {
        start = 0;
        end = len;
      }
      re = realf(value);
      im = imagf(value);
      for (i = start; i < end; i++) {
        idx = 2 * i;
        buf[idx] = re;
        buf[idx + 1] = im;
      }
      return this;
    });
    setReadOnly(Complex64Array.prototype, "filter", function filter(predicate, thisArg) {
      var buf;
      var out;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        z = getComplex64(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          out.push(z);
        }
      }
      return new this.constructor(out);
    });
    setReadOnly(Complex64Array.prototype, "find", function find(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        z = getComplex64(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return z;
        }
      }
    });
    setReadOnly(Complex64Array.prototype, "findIndex", function findIndex(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        z = getComplex64(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex64Array.prototype, "findLast", function findLast(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = this._length - 1; i >= 0; i--) {
        z = getComplex64(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return z;
        }
      }
    });
    setReadOnly(Complex64Array.prototype, "findLastIndex", function findLastIndex(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = this._length - 1; i >= 0; i--) {
        z = getComplex64(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex64Array.prototype, "forEach", function forEach(fcn, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(fcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", fcn));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        z = getComplex64(buf, i);
        fcn.call(thisArg, z, i, this);
      }
    });
    setReadOnly(Complex64Array.prototype, "get", function get(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isNonNegativeInteger(idx)) {
        throw new TypeError(format("invalid argument. Must provide a nonnegative integer. Value: `%s`.", idx));
      }
      if (idx >= this._length) {
        return;
      }
      return getComplex64(this._buffer, idx);
    });
    setReadOnly(Complex64Array.prototype, "includes", function includes(searchElement, fromIndex) {
      var buf;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex < 0) {
          fromIndex += this._length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      } else {
        fromIndex = 0;
      }
      re = realf(searchElement);
      im = imagf(searchElement);
      buf = this._buffer;
      for (i = fromIndex; i < this._length; i++) {
        idx = 2 * i;
        if (re === buf[idx] && im === buf[idx + 1]) {
          return true;
        }
      }
      return false;
    });
    setReadOnly(Complex64Array.prototype, "indexOf", function indexOf(searchElement, fromIndex) {
      var buf;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex < 0) {
          fromIndex += this._length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      } else {
        fromIndex = 0;
      }
      re = realf(searchElement);
      im = imagf(searchElement);
      buf = this._buffer;
      for (i = fromIndex; i < this._length; i++) {
        idx = 2 * i;
        if (re === buf[idx] && im === buf[idx + 1]) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex64Array.prototype, "join", function join(separator) {
      var out;
      var buf;
      var sep;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (arguments.length === 0) {
        sep = ",";
      } else if (isString(separator)) {
        sep = separator;
      } else {
        throw new TypeError(format("invalid argument. First argument must be a string. Value: `%s`.", separator));
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex64(buf, i).toString());
      }
      return out.join(sep);
    });
    setReadOnly(Complex64Array.prototype, "keys", function keys() {
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      self2 = this;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": i,
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.keys();
      }
    });
    setReadOnly(Complex64Array.prototype, "lastIndexOf", function lastIndexOf(searchElement, fromIndex) {
      var buf;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex >= this._length) {
          fromIndex = this._length - 1;
        } else if (fromIndex < 0) {
          fromIndex += this._length;
        }
      } else {
        fromIndex = this._length - 1;
      }
      re = realf(searchElement);
      im = imagf(searchElement);
      buf = this._buffer;
      for (i = fromIndex; i >= 0; i--) {
        idx = 2 * i;
        if (re === buf[idx] && im === buf[idx + 1]) {
          return i;
        }
      }
      return -1;
    });
    setReadOnlyAccessor(Complex64Array.prototype, "length", function get() {
      return this._length;
    });
    setReadOnly(Complex64Array.prototype, "map", function map(fcn, thisArg) {
      var outbuf;
      var buf;
      var out;
      var i;
      var v;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(fcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", fcn));
      }
      buf = this._buffer;
      out = new this.constructor(this._length);
      outbuf = out._buffer;
      for (i = 0; i < this._length; i++) {
        v = fcn.call(thisArg, getComplex64(buf, i), i, this);
        if (isComplexLike(v)) {
          outbuf[2 * i] = realf(v);
          outbuf[2 * i + 1] = imagf(v);
        } else if (isArrayLikeObject(v) && v.length === 2) {
          outbuf[2 * i] = v[0];
          outbuf[2 * i + 1] = v[1];
        } else {
          throw new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", v));
        }
      }
      return out;
    });
    setReadOnly(Complex64Array.prototype, "reduce", function reduce(reducer, initialValue) {
      var buf;
      var acc;
      var len;
      var v;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(reducer)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", reducer));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        acc = initialValue;
        i = 0;
      } else {
        if (len === 0) {
          throw new Error("invalid operation. If not provided an initial value, an array must contain at least one element.");
        }
        acc = getComplex64(buf, 0);
        i = 1;
      }
      for (; i < len; i++) {
        v = getComplex64(buf, i);
        acc = reducer(acc, v, i, this);
      }
      return acc;
    });
    setReadOnly(Complex64Array.prototype, "reduceRight", function reduceRight(reducer, initialValue) {
      var buf;
      var acc;
      var len;
      var v;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(reducer)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", reducer));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        acc = initialValue;
        i = len - 1;
      } else {
        if (len === 0) {
          throw new Error("invalid operation. If not provided an initial value, an array must contain at least one element.");
        }
        acc = getComplex64(buf, len - 1);
        i = len - 2;
      }
      for (; i >= 0; i--) {
        v = getComplex64(buf, i);
        acc = reducer(acc, v, i, this);
      }
      return acc;
    });
    setReadOnly(Complex64Array.prototype, "reverse", function reverse() {
      var buf;
      var tmp;
      var len;
      var N;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      len = this._length;
      buf = this._buffer;
      N = floor(len / 2);
      for (i = 0; i < N; i++) {
        j = len - i - 1;
        tmp = buf[2 * i];
        buf[2 * i] = buf[2 * j];
        buf[2 * j] = tmp;
        tmp = buf[2 * i + 1];
        buf[2 * i + 1] = buf[2 * j + 1];
        buf[2 * j + 1] = tmp;
      }
      return this;
    });
    setReadOnly(Complex64Array.prototype, "set", function set(value) {
      var sbuf;
      var idx;
      var buf;
      var tmp;
      var flg;
      var N;
      var v;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      buf = this._buffer;
      if (arguments.length > 1) {
        idx = arguments[1];
        if (!isNonNegativeInteger(idx)) {
          throw new TypeError(format("invalid argument. Index argument must be a nonnegative integer. Value: `%s`.", idx));
        }
      } else {
        idx = 0;
      }
      if (isComplexLike(value)) {
        if (idx >= this._length) {
          throw new RangeError(format("invalid argument. Index argument is out-of-bounds. Value: `%u`.", idx));
        }
        idx *= 2;
        buf[idx] = realf(value);
        buf[idx + 1] = imagf(value);
        return;
      }
      if (isComplexArray(value)) {
        N = value._length;
        if (idx + N > this._length) {
          throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
        }
        sbuf = value._buffer;
        j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
        if (sbuf.buffer === buf.buffer && (sbuf.byteOffset < j && sbuf.byteOffset + sbuf.byteLength > j)) {
          tmp = new Float32Array2(sbuf.length);
          for (i = 0; i < sbuf.length; i++) {
            tmp[i] = sbuf[i];
          }
          sbuf = tmp;
        }
        idx *= 2;
        j = 0;
        for (i = 0; i < N; i++) {
          buf[idx] = sbuf[j];
          buf[idx + 1] = sbuf[j + 1];
          idx += 2;
          j += 2;
        }
        return;
      }
      if (isCollection(value)) {
        N = value.length;
        for (i = 0; i < N; i++) {
          if (!isComplexLike(value[i])) {
            flg = true;
            break;
          }
        }
        if (flg) {
          if (!isEven(N)) {
            throw new RangeError(format("invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.", N));
          }
          if (idx + N / 2 > this._length) {
            throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
          }
          sbuf = value;
          j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
          if (sbuf.buffer === buf.buffer && (sbuf.byteOffset < j && sbuf.byteOffset + sbuf.byteLength > j)) {
            tmp = new Float32Array2(N);
            for (i = 0; i < N; i++) {
              tmp[i] = sbuf[i];
            }
            sbuf = tmp;
          }
          idx *= 2;
          N /= 2;
          j = 0;
          for (i = 0; i < N; i++) {
            buf[idx] = sbuf[j];
            buf[idx + 1] = sbuf[j + 1];
            idx += 2;
            j += 2;
          }
          return;
        }
        if (idx + N > this._length) {
          throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
        }
        idx *= 2;
        for (i = 0; i < N; i++) {
          v = value[i];
          buf[idx] = realf(v);
          buf[idx + 1] = imagf(v);
          idx += 2;
        }
        return;
      }
      throw new TypeError(format("invalid argument. First argument must be either a complex number, an array-like object, or a complex number array. Value: `%s`.", value));
    });
    setReadOnly(Complex64Array.prototype, "slice", function slice(start, end) {
      var outlen;
      var outbuf;
      var out;
      var idx;
      var buf;
      var len;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        start = 0;
        end = len;
      } else {
        if (!isInteger(start)) {
          throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", start));
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (start < end) {
        outlen = end - start;
      } else {
        outlen = 0;
      }
      out = new this.constructor(outlen);
      outbuf = out._buffer;
      for (i = 0; i < outlen; i++) {
        idx = 2 * (i + start);
        outbuf[2 * i] = buf[idx];
        outbuf[2 * i + 1] = buf[idx + 1];
      }
      return out;
    });
    setReadOnly(Complex64Array.prototype, "some", function some(predicate, thisArg) {
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (predicate.call(thisArg, getComplex64(buf, i), i, this)) {
          return true;
        }
      }
      return false;
    });
    setReadOnly(Complex64Array.prototype, "sort", function sort(compareFcn) {
      var tmp;
      var buf;
      var len;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", compareFcn));
      }
      buf = this._buffer;
      len = this._length;
      tmp = [];
      for (i = 0; i < len; i++) {
        tmp.push(getComplex64(buf, i));
      }
      tmp.sort(compareFcn);
      for (i = 0; i < len; i++) {
        j = 2 * i;
        buf[j] = realf(tmp[i]);
        buf[j + 1] = imagf(tmp[i]);
      }
      return this;
    });
    setReadOnly(Complex64Array.prototype, "subarray", function subarray(begin, end) {
      var offset;
      var buf;
      var len;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        begin = 0;
        end = len;
      } else {
        if (!isInteger(begin)) {
          throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", begin));
        }
        if (begin < 0) {
          begin += len;
          if (begin < 0) {
            begin = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (begin >= len) {
        len = 0;
        offset = buf.byteLength;
      } else if (begin >= end) {
        len = 0;
        offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
      } else {
        len = end - begin;
        offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
      }
      return new this.constructor(buf.buffer, offset, len < 0 ? 0 : len);
    });
    setReadOnly(Complex64Array.prototype, "toLocaleString", function toLocaleString(locales, options) {
      var opts;
      var loc;
      var out;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (arguments.length === 0) {
        loc = [];
      } else if (isString(locales) || isStringArray(locales)) {
        loc = locales;
      } else {
        throw new TypeError(format("invalid argument. First argument must be a string or an array of strings. Value: `%s`.", locales));
      }
      if (arguments.length < 2) {
        opts = {};
      } else if (isObject(options)) {
        opts = options;
      } else {
        throw new TypeError(format("invalid argument. Options argument must be an object. Value: `%s`.", options));
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        out.push(getComplex64(buf, i).toLocaleString(loc, opts));
      }
      return out.join(",");
    });
    setReadOnly(Complex64Array.prototype, "toReversed", function toReversed() {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        j = len - i - 1;
        outbuf[2 * i] = buf[2 * j];
        outbuf[2 * i + 1] = buf[2 * j + 1];
      }
      return out;
    });
    setReadOnly(Complex64Array.prototype, "toSorted", function toSorted(compareFcn) {
      var tmp;
      var buf;
      var len;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", compareFcn));
      }
      buf = this._buffer;
      len = this._length;
      tmp = [];
      for (i = 0; i < len; i++) {
        tmp.push(getComplex64(buf, i));
      }
      tmp.sort(compareFcn);
      return new Complex64Array(tmp);
    });
    setReadOnly(Complex64Array.prototype, "toString", function toString() {
      var out;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex64(buf, i).toString());
      }
      return out.join(",");
    });
    setReadOnly(Complex64Array.prototype, "values", function values() {
      var iter;
      var self2;
      var len;
      var FLG;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": getComplex64(buf, i),
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.values();
      }
    });
    setReadOnly(Complex64Array.prototype, "with", function copyWith(index, value) {
      var buf;
      var out;
      var len;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isInteger(index)) {
        throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", index));
      }
      len = this._length;
      if (index < 0) {
        index += len;
      }
      if (index < 0 || index >= len) {
        throw new RangeError(format("invalid argument. Index argument is out-of-bounds. Value: `%s`.", index));
      }
      if (!isComplexLike(value)) {
        throw new TypeError(format("invalid argument. Second argument must be a complex number. Value: `%s`.", value));
      }
      out = new this.constructor(this._buffer);
      buf = out._buffer;
      buf[2 * index] = realf(value);
      buf[2 * index + 1] = imagf(value);
      return out;
    });
    module.exports = Complex64Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/index.js
var require_lib90 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex64/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main75();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/real/lib/main.js
var require_main76 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/real/lib/main.js"(exports, module) {
    "use strict";
    function real(z) {
      return z.re;
    }
    module.exports = real;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/real/lib/index.js
var require_lib91 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/real/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main76();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/imag/lib/main.js
var require_main77 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/imag/lib/main.js"(exports, module) {
    "use strict";
    function imag(z) {
      return z.im;
    }
    module.exports = imag;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/imag/lib/index.js
var require_lib92 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/complex/float64/imag/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main77();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/from_iterator.js
var require_from_iterator2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/from_iterator.js"(exports, module) {
    "use strict";
    var isArrayLikeObject = require_lib65();
    var isComplexLike = require_lib79();
    var format = require_lib3();
    var real = require_lib91();
    var imag = require_lib92();
    function fromIterator(it) {
      var out;
      var v;
      var z;
      out = [];
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        z = v.value;
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(real(z), imag(z));
        } else {
          return new TypeError(format("invalid argument. An iterator must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", z));
        }
      }
      return out;
    }
    module.exports = fromIterator;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/from_iterator_map.js
var require_from_iterator_map2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/from_iterator_map.js"(exports, module) {
    "use strict";
    var isArrayLikeObject = require_lib65();
    var isComplexLike = require_lib79();
    var format = require_lib3();
    var real = require_lib91();
    var imag = require_lib92();
    function fromIteratorMap(it, clbk, thisArg) {
      var out;
      var v;
      var z;
      var i;
      out = [];
      i = -1;
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        i += 1;
        z = clbk.call(thisArg, v.value, i);
        if (isArrayLikeObject(z) && z.length >= 2) {
          out.push(z[0], z[1]);
        } else if (isComplexLike(z)) {
          out.push(real(z), imag(z));
        } else {
          return new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", z));
        }
      }
      return out;
    }
    module.exports = fromIteratorMap;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/from_array.js
var require_from_array2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/from_array.js"(exports, module) {
    "use strict";
    var isComplexLike = require_lib79();
    var real = require_lib91();
    var imag = require_lib92();
    function fromArray(buf, arr) {
      var len;
      var v;
      var i;
      var j;
      len = arr.length;
      j = 0;
      for (i = 0; i < len; i++) {
        v = arr[i];
        if (!isComplexLike(v)) {
          return null;
        }
        buf[j] = real(v);
        buf[j + 1] = imag(v);
        j += 2;
      }
      return buf;
    }
    module.exports = fromArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/main.js
var require_main78 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/main.js"(exports, module) {
    "use strict";
    var isNonNegativeInteger = require_lib63().isPrimitive;
    var isArrayLikeObject = require_lib65();
    var isCollection = require_lib67();
    var isArrayBuffer = require_lib68();
    var isObject = require_lib69();
    var isArray = require_lib14();
    var isStringArray = require_lib71().primitives;
    var isString = require_lib70();
    var isFunction = require_lib75();
    var isComplexLike = require_lib79();
    var isEven = require_lib80();
    var isInteger = require_lib61();
    var isComplex64Array = require_lib81();
    var isComplex128Array = require_lib82();
    var hasIteratorSymbolSupport = require_lib83();
    var ITERATOR_SYMBOL = require_lib84();
    var setReadOnly = require_lib5();
    var setReadOnlyAccessor = require_lib85();
    var Float64Array2 = require_lib22();
    var Complex128 = require_lib76();
    var real = require_lib91();
    var imag = require_lib92();
    var floor = require_lib60();
    var reinterpret64 = require_lib88();
    var reinterpret128 = require_lib89();
    var getter = require_lib8();
    var accessorGetter = require_lib7();
    var format = require_lib3();
    var fromIterator = require_from_iterator2();
    var fromIteratorMap = require_from_iterator_map2();
    var fromArray = require_from_array2();
    var BYTES_PER_ELEMENT = Float64Array2.BYTES_PER_ELEMENT * 2;
    var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();
    function isComplexArray(value) {
      return value instanceof Complex128Array || typeof value === "object" && value !== null && (value.constructor.name === "Complex64Array" || value.constructor.name === "Complex128Array") && typeof value._length === "number" && // eslint-disable-line no-underscore-dangle
      // NOTE: we don't perform a more rigorous test here for a typed array for performance reasons, as robustly checking for a typed array instance could require walking the prototype tree and performing relatively expensive constructor checks...
      typeof value._buffer === "object";
    }
    function isComplexArrayConstructor(value) {
      return value === Complex128Array || // NOTE: weaker test in order to avoid a circular dependency with Complex64Array...
      value.name === "Complex64Array";
    }
    function getComplex128(buf, idx) {
      idx *= 2;
      return new Complex128(buf[idx], buf[idx + 1]);
    }
    function Complex128Array() {
      var byteOffset;
      var nargs;
      var buf;
      var len;
      nargs = arguments.length;
      if (!(this instanceof Complex128Array)) {
        if (nargs === 0) {
          return new Complex128Array();
        }
        if (nargs === 1) {
          return new Complex128Array(arguments[0]);
        }
        if (nargs === 2) {
          return new Complex128Array(arguments[0], arguments[1]);
        }
        return new Complex128Array(arguments[0], arguments[1], arguments[2]);
      }
      if (nargs === 0) {
        buf = new Float64Array2(0);
      } else if (nargs === 1) {
        if (isNonNegativeInteger(arguments[0])) {
          buf = new Float64Array2(arguments[0] * 2);
        } else if (isCollection(arguments[0])) {
          buf = arguments[0];
          len = buf.length;
          if (len && isArray(buf) && isComplexLike(buf[0])) {
            buf = fromArray(new Float64Array2(len * 2), buf);
            if (buf === null) {
              if (!isEven(len)) {
                throw new RangeError(format("invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.", len));
              }
              buf = new Float64Array2(arguments[0]);
            }
          } else {
            if (isComplex64Array(buf)) {
              buf = reinterpret64(buf, 0);
            } else if (isComplex128Array(buf)) {
              buf = reinterpret128(buf, 0);
            } else if (!isEven(len)) {
              throw new RangeError(format("invalid argument. Array-like object and typed array arguments must have a length which is a multiple of two. Length: `%u`.", len));
            }
            buf = new Float64Array2(buf);
          }
        } else if (isArrayBuffer(arguments[0])) {
          buf = arguments[0];
          if (!isInteger(buf.byteLength / BYTES_PER_ELEMENT)) {
            throw new RangeError(format("invalid argument. ArrayBuffer byte length must be a multiple of %u. Byte length: `%u`.", BYTES_PER_ELEMENT, buf.byteLength));
          }
          buf = new Float64Array2(buf);
        } else if (isObject(arguments[0])) {
          buf = arguments[0];
          if (HAS_ITERATOR_SYMBOL === false) {
            throw new TypeError(format("invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.", buf));
          }
          if (!isFunction(buf[ITERATOR_SYMBOL])) {
            throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", buf));
          }
          buf = buf[ITERATOR_SYMBOL]();
          if (!isFunction(buf.next)) {
            throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", buf));
          }
          buf = fromIterator(buf);
          if (buf instanceof Error) {
            throw buf;
          }
          buf = new Float64Array2(buf);
        } else {
          throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", arguments[0]));
        }
      } else {
        buf = arguments[0];
        if (!isArrayBuffer(buf)) {
          throw new TypeError(format("invalid argument. First argument must be an ArrayBuffer. Value: `%s`.", buf));
        }
        byteOffset = arguments[1];
        if (!isNonNegativeInteger(byteOffset)) {
          throw new TypeError(format("invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.", byteOffset));
        }
        if (!isInteger(byteOffset / BYTES_PER_ELEMENT)) {
          throw new RangeError(format("invalid argument. Byte offset must be a multiple of %u. Value: `%u`.", BYTES_PER_ELEMENT, byteOffset));
        }
        if (nargs === 2) {
          len = buf.byteLength - byteOffset;
          if (!isInteger(len / BYTES_PER_ELEMENT)) {
            throw new RangeError(format("invalid arguments. ArrayBuffer view byte length must be a multiple of %u. View byte length: `%u`.", BYTES_PER_ELEMENT, len));
          }
          buf = new Float64Array2(buf, byteOffset);
        } else {
          len = arguments[2];
          if (!isNonNegativeInteger(len)) {
            throw new TypeError(format("invalid argument. Length must be a nonnegative integer. Value: `%s`.", len));
          }
          if (len * BYTES_PER_ELEMENT > buf.byteLength - byteOffset) {
            throw new RangeError(format("invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.", len * BYTES_PER_ELEMENT));
          }
          buf = new Float64Array2(buf, byteOffset, len * 2);
        }
      }
      setReadOnly(this, "_buffer", buf);
      setReadOnly(this, "_length", buf.length / 2);
      return this;
    }
    setReadOnly(Complex128Array, "BYTES_PER_ELEMENT", BYTES_PER_ELEMENT);
    setReadOnly(Complex128Array, "name", "Complex128Array");
    setReadOnly(Complex128Array, "from", function from(src) {
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
      if (!isFunction(this)) {
        throw new TypeError("invalid invocation. `this` context must be a constructor.");
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      nargs = arguments.length;
      if (nargs > 1) {
        clbk = arguments[1];
        if (!isFunction(clbk)) {
          throw new TypeError(format("invalid argument. Second argument must be a function. Value: `%s`.", clbk));
        }
        if (nargs > 2) {
          thisArg = arguments[2];
        }
      }
      if (isComplexArray(src)) {
        len = src.length;
        if (clbk) {
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, src.get(i), i);
            if (isComplexLike(v)) {
              buf[j] = real(v);
              buf[j + 1] = imag(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", v));
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (isCollection(src)) {
        if (clbk) {
          len = src.length;
          if (src.get && src.set) {
            get = accessorGetter("default");
          } else {
            get = getter("default");
          }
          for (i = 0; i < len; i++) {
            if (!isComplexLike(get(src, i))) {
              flg = true;
              break;
            }
          }
          if (flg) {
            if (!isEven(len)) {
              throw new RangeError(format("invalid argument. First argument must have a length which is a multiple of two. Length: `%u`.", len));
            }
            out = new this(len / 2);
            buf = out._buffer;
            for (i = 0; i < len; i++) {
              buf[i] = clbk.call(thisArg, get(src, i), i);
            }
            return out;
          }
          out = new this(len);
          buf = out._buffer;
          j = 0;
          for (i = 0; i < len; i++) {
            v = clbk.call(thisArg, get(src, i), i);
            if (isComplexLike(v)) {
              buf[j] = real(v);
              buf[j + 1] = imag(v);
            } else if (isArrayLikeObject(v) && v.length >= 2) {
              buf[j] = v[0];
              buf[j + 1] = v[1];
            } else {
              throw new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", v));
            }
            j += 2;
          }
          return out;
        }
        return new this(src);
      }
      if (isObject(src) && HAS_ITERATOR_SYMBOL && isFunction(src[ITERATOR_SYMBOL])) {
        buf = src[ITERATOR_SYMBOL]();
        if (!isFunction(buf.next)) {
          throw new TypeError(format("invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.", src));
        }
        if (clbk) {
          tmp = fromIteratorMap(buf, clbk, thisArg);
        } else {
          tmp = fromIterator(buf);
        }
        if (tmp instanceof Error) {
          throw tmp;
        }
        len = tmp.length / 2;
        out = new this(len);
        buf = out._buffer;
        for (i = 0; i < len; i++) {
          buf[i] = tmp[i];
        }
        return out;
      }
      throw new TypeError(format("invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.", src));
    });
    setReadOnly(Complex128Array, "of", function of() {
      var args;
      var i;
      if (!isFunction(this)) {
        throw new TypeError("invalid invocation. `this` context must be a constructor.");
      }
      if (!isComplexArrayConstructor(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      args = [];
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return new this(args);
    });
    setReadOnly(Complex128Array.prototype, "at", function at(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isInteger(idx)) {
        throw new TypeError(format("invalid argument. Must provide an integer. Value: `%s`.", idx));
      }
      if (idx < 0) {
        idx += this._length;
      }
      if (idx < 0 || idx >= this._length) {
        return;
      }
      return getComplex128(this._buffer, idx);
    });
    setReadOnlyAccessor(Complex128Array.prototype, "buffer", function get() {
      return this._buffer.buffer;
    });
    setReadOnlyAccessor(Complex128Array.prototype, "byteLength", function get() {
      return this._buffer.byteLength;
    });
    setReadOnlyAccessor(Complex128Array.prototype, "byteOffset", function get() {
      return this._buffer.byteOffset;
    });
    setReadOnly(Complex128Array.prototype, "BYTES_PER_ELEMENT", Complex128Array.BYTES_PER_ELEMENT);
    setReadOnly(Complex128Array.prototype, "copyWithin", function copyWithin(target, start) {
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (arguments.length === 2) {
        this._buffer.copyWithin(target * 2, start * 2);
      } else {
        this._buffer.copyWithin(target * 2, start * 2, arguments[2] * 2);
      }
      return this;
    });
    setReadOnly(Complex128Array.prototype, "entries", function entries() {
      var buffer;
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      self2 = this;
      buffer = this._buffer;
      len = this._length;
      i = -1;
      j = -2;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        var z;
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        j += 2;
        z = new Complex128(buffer[j], buffer[j + 1]);
        return {
          "value": [i, z],
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.entries();
      }
    });
    setReadOnly(Complex128Array.prototype, "every", function every(predicate, thisArg) {
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (!predicate.call(thisArg, getComplex128(buf, i), i, this)) {
          return false;
        }
      }
      return true;
    });
    setReadOnly(Complex128Array.prototype, "fill", function fill(value, start, end) {
      var buf;
      var len;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(value)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", value));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        if (!isInteger(start)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", start));
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length > 2) {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Third argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          }
          if (end > len) {
            end = len;
          }
        } else {
          end = len;
        }
      } else {
        start = 0;
        end = len;
      }
      re = real(value);
      im = imag(value);
      for (i = start; i < end; i++) {
        idx = 2 * i;
        buf[idx] = re;
        buf[idx + 1] = im;
      }
      return this;
    });
    setReadOnly(Complex128Array.prototype, "filter", function filter(predicate, thisArg) {
      var buf;
      var out;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        z = getComplex128(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          out.push(z);
        }
      }
      return new this.constructor(out);
    });
    setReadOnly(Complex128Array.prototype, "find", function find(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        z = getComplex128(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return z;
        }
      }
    });
    setReadOnly(Complex128Array.prototype, "findIndex", function findIndex(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        z = getComplex128(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex128Array.prototype, "findLast", function findLast(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = this._length - 1; i >= 0; i--) {
        z = getComplex128(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return z;
        }
      }
    });
    setReadOnly(Complex128Array.prototype, "findLastIndex", function findLastIndex(predicate, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = this._length - 1; i >= 0; i--) {
        z = getComplex128(buf, i);
        if (predicate.call(thisArg, z, i, this)) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex128Array.prototype, "forEach", function forEach(fcn, thisArg) {
      var buf;
      var i;
      var z;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(fcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", fcn));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        z = getComplex128(buf, i);
        fcn.call(thisArg, z, i, this);
      }
    });
    setReadOnly(Complex128Array.prototype, "get", function get(idx) {
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isNonNegativeInteger(idx)) {
        throw new TypeError(format("invalid argument. Must provide a nonnegative integer. Value: `%s`.", idx));
      }
      if (idx >= this._length) {
        return;
      }
      return getComplex128(this._buffer, idx);
    });
    setReadOnlyAccessor(Complex128Array.prototype, "length", function get() {
      return this._length;
    });
    setReadOnly(Complex128Array.prototype, "includes", function includes(searchElement, fromIndex) {
      var buf;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex < 0) {
          fromIndex += this._length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      } else {
        fromIndex = 0;
      }
      re = real(searchElement);
      im = imag(searchElement);
      buf = this._buffer;
      for (i = fromIndex; i < this._length; i++) {
        idx = 2 * i;
        if (re === buf[idx] && im === buf[idx + 1]) {
          return true;
        }
      }
      return false;
    });
    setReadOnly(Complex128Array.prototype, "indexOf", function indexOf(searchElement, fromIndex) {
      var buf;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex < 0) {
          fromIndex += this._length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      } else {
        fromIndex = 0;
      }
      re = real(searchElement);
      im = imag(searchElement);
      buf = this._buffer;
      for (i = fromIndex; i < this._length; i++) {
        idx = 2 * i;
        if (re === buf[idx] && im === buf[idx + 1]) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex128Array.prototype, "join", function join(separator) {
      var out;
      var buf;
      var sep;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (arguments.length === 0) {
        sep = ",";
      } else if (isString(separator)) {
        sep = separator;
      } else {
        throw new TypeError(format("invalid argument. First argument must be a string. Value: `%s`.", separator));
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex128(buf, i).toString());
      }
      return out.join(sep);
    });
    setReadOnly(Complex128Array.prototype, "keys", function keys() {
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      self2 = this;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": i,
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.keys();
      }
    });
    setReadOnly(Complex128Array.prototype, "lastIndexOf", function lastIndexOf(searchElement, fromIndex) {
      var buf;
      var idx;
      var re;
      var im;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isComplexLike(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a complex number. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex >= this._length) {
          fromIndex = this._length - 1;
        } else if (fromIndex < 0) {
          fromIndex += this._length;
        }
      } else {
        fromIndex = this._length - 1;
      }
      re = real(searchElement);
      im = imag(searchElement);
      buf = this._buffer;
      for (i = fromIndex; i >= 0; i--) {
        idx = 2 * i;
        if (re === buf[idx] && im === buf[idx + 1]) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(Complex128Array.prototype, "map", function map(fcn, thisArg) {
      var outbuf;
      var buf;
      var out;
      var i;
      var v;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(fcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", fcn));
      }
      buf = this._buffer;
      out = new this.constructor(this._length);
      outbuf = out._buffer;
      for (i = 0; i < this._length; i++) {
        v = fcn.call(thisArg, getComplex128(buf, i), i, this);
        if (isComplexLike(v)) {
          outbuf[2 * i] = real(v);
          outbuf[2 * i + 1] = imag(v);
        } else if (isArrayLikeObject(v) && v.length === 2) {
          outbuf[2 * i] = v[0];
          outbuf[2 * i + 1] = v[1];
        } else {
          throw new TypeError(format("invalid argument. Callback must return either a two-element array containing real and imaginary components or a complex number. Value: `%s`.", v));
        }
      }
      return out;
    });
    setReadOnly(Complex128Array.prototype, "reduce", function reduce(reducer, initialValue) {
      var buf;
      var acc;
      var len;
      var v;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(reducer)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", reducer));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        acc = initialValue;
        i = 0;
      } else {
        if (len === 0) {
          throw new Error("invalid operation. If not provided an initial value, an array must contain at least one element.");
        }
        acc = getComplex128(buf, 0);
        i = 1;
      }
      for (; i < len; i++) {
        v = getComplex128(buf, i);
        acc = reducer(acc, v, i, this);
      }
      return acc;
    });
    setReadOnly(Complex128Array.prototype, "reduceRight", function reduceRight(reducer, initialValue) {
      var buf;
      var acc;
      var len;
      var v;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(reducer)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", reducer));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        acc = initialValue;
        i = len - 1;
      } else {
        if (len === 0) {
          throw new Error("invalid operation. If not provided an initial value, an array must contain at least one element.");
        }
        acc = getComplex128(buf, len - 1);
        i = len - 2;
      }
      for (; i >= 0; i--) {
        v = getComplex128(buf, i);
        acc = reducer(acc, v, i, this);
      }
      return acc;
    });
    setReadOnly(Complex128Array.prototype, "reverse", function reverse() {
      var buf;
      var tmp;
      var len;
      var N;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      len = this._length;
      buf = this._buffer;
      N = floor(len / 2);
      for (i = 0; i < N; i++) {
        j = len - i - 1;
        tmp = buf[2 * i];
        buf[2 * i] = buf[2 * j];
        buf[2 * j] = tmp;
        tmp = buf[2 * i + 1];
        buf[2 * i + 1] = buf[2 * j + 1];
        buf[2 * j + 1] = tmp;
      }
      return this;
    });
    setReadOnly(Complex128Array.prototype, "set", function set(value) {
      var sbuf;
      var idx;
      var buf;
      var tmp;
      var flg;
      var N;
      var v;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      buf = this._buffer;
      if (arguments.length > 1) {
        idx = arguments[1];
        if (!isNonNegativeInteger(idx)) {
          throw new TypeError(format("invalid argument. Index argument must be a nonnegative integer. Value: `%s`.", idx));
        }
      } else {
        idx = 0;
      }
      if (isComplexLike(value)) {
        if (idx >= this._length) {
          throw new RangeError(format("invalid argument. Index argument is out-of-bounds. Value: `%u`.", idx));
        }
        idx *= 2;
        buf[idx] = real(value);
        buf[idx + 1] = imag(value);
        return;
      }
      if (isComplexArray(value)) {
        N = value._length;
        if (idx + N > this._length) {
          throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
        }
        sbuf = value._buffer;
        j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
        if (sbuf.buffer === buf.buffer && (sbuf.byteOffset < j && sbuf.byteOffset + sbuf.byteLength > j)) {
          tmp = new Float64Array2(sbuf.length);
          for (i = 0; i < sbuf.length; i++) {
            tmp[i] = sbuf[i];
          }
          sbuf = tmp;
        }
        idx *= 2;
        j = 0;
        for (i = 0; i < N; i++) {
          buf[idx] = sbuf[j];
          buf[idx + 1] = sbuf[j + 1];
          idx += 2;
          j += 2;
        }
        return;
      }
      if (isCollection(value)) {
        N = value.length;
        for (i = 0; i < N; i++) {
          if (!isComplexLike(value[i])) {
            flg = true;
            break;
          }
        }
        if (flg) {
          if (!isEven(N)) {
            throw new RangeError(format("invalid argument. Array-like object arguments must have a length which is a multiple of two. Length: `%u`.", N));
          }
          if (idx + N / 2 > this._length) {
            throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
          }
          sbuf = value;
          j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
          if (sbuf.buffer === buf.buffer && (sbuf.byteOffset < j && sbuf.byteOffset + sbuf.byteLength > j)) {
            tmp = new Float64Array2(N);
            for (i = 0; i < N; i++) {
              tmp[i] = sbuf[i];
            }
            sbuf = tmp;
          }
          idx *= 2;
          N /= 2;
          j = 0;
          for (i = 0; i < N; i++) {
            buf[idx] = sbuf[j];
            buf[idx + 1] = sbuf[j + 1];
            idx += 2;
            j += 2;
          }
          return;
        }
        if (idx + N > this._length) {
          throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
        }
        idx *= 2;
        for (i = 0; i < N; i++) {
          v = value[i];
          buf[idx] = real(v);
          buf[idx + 1] = imag(v);
          idx += 2;
        }
        return;
      }
      throw new TypeError(format("invalid argument. First argument must be either a complex number, an array-like object, or a complex number array. Value: `%s`.", value));
    });
    setReadOnly(Complex128Array.prototype, "slice", function slice(start, end) {
      var outlen;
      var outbuf;
      var out;
      var idx;
      var buf;
      var len;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        start = 0;
        end = len;
      } else {
        if (!isInteger(start)) {
          throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", start));
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (start < end) {
        outlen = end - start;
      } else {
        outlen = 0;
      }
      out = new this.constructor(outlen);
      outbuf = out._buffer;
      for (i = 0; i < outlen; i++) {
        idx = 2 * (i + start);
        outbuf[2 * i] = buf[idx];
        outbuf[2 * i + 1] = buf[idx + 1];
      }
      return out;
    });
    setReadOnly(Complex128Array.prototype, "some", function some(predicate, thisArg) {
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (predicate.call(thisArg, getComplex128(buf, i), i, this)) {
          return true;
        }
      }
      return false;
    });
    setReadOnly(Complex128Array.prototype, "sort", function sort(compareFcn) {
      var tmp;
      var buf;
      var len;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", compareFcn));
      }
      buf = this._buffer;
      len = this._length;
      tmp = [];
      for (i = 0; i < len; i++) {
        tmp.push(getComplex128(buf, i));
      }
      tmp.sort(compareFcn);
      for (i = 0; i < len; i++) {
        j = 2 * i;
        buf[j] = real(tmp[i]);
        buf[j + 1] = imag(tmp[i]);
      }
      return this;
    });
    setReadOnly(Complex128Array.prototype, "subarray", function subarray(begin, end) {
      var offset;
      var buf;
      var len;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        begin = 0;
        end = len;
      } else {
        if (!isInteger(begin)) {
          throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", begin));
        }
        if (begin < 0) {
          begin += len;
          if (begin < 0) {
            begin = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (begin >= len) {
        len = 0;
        offset = buf.byteLength;
      } else if (begin >= end) {
        len = 0;
        offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
      } else {
        len = end - begin;
        offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
      }
      return new this.constructor(buf.buffer, offset, len < 0 ? 0 : len);
    });
    setReadOnly(Complex128Array.prototype, "toLocaleString", function toLocaleString(locales, options) {
      var opts;
      var loc;
      var out;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (arguments.length === 0) {
        loc = [];
      } else if (isString(locales) || isStringArray(locales)) {
        loc = locales;
      } else {
        throw new TypeError(format("invalid argument. First argument must be a string or an array of strings. Value: `%s`.", locales));
      }
      if (arguments.length < 2) {
        opts = {};
      } else if (isObject(options)) {
        opts = options;
      } else {
        throw new TypeError(format("invalid argument. Options argument must be an object. Value: `%s`.", options));
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        out.push(getComplex128(buf, i).toLocaleString(loc, opts));
      }
      return out.join(",");
    });
    setReadOnly(Complex128Array.prototype, "toReversed", function toReversed() {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      var j;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        j = len - i - 1;
        outbuf[2 * i] = buf[2 * j];
        outbuf[2 * i + 1] = buf[2 * j + 1];
      }
      return out;
    });
    setReadOnly(Complex128Array.prototype, "toSorted", function toSorted(compareFcn) {
      var tmp;
      var buf;
      var len;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", compareFcn));
      }
      buf = this._buffer;
      len = this._length;
      tmp = [];
      for (i = 0; i < len; i++) {
        tmp.push(getComplex128(buf, i));
      }
      tmp.sort(compareFcn);
      return new Complex128Array(tmp);
    });
    setReadOnly(Complex128Array.prototype, "toString", function toString() {
      var out;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        out.push(getComplex128(buf, i).toString());
      }
      return out.join(",");
    });
    setReadOnly(Complex128Array.prototype, "values", function values() {
      var iter;
      var self2;
      var len;
      var FLG;
      var buf;
      var i;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": getComplex128(buf, i),
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.values();
      }
    });
    setReadOnly(Complex128Array.prototype, "with", function copyWith(index, value) {
      var buf;
      var out;
      var len;
      if (!isComplexArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a complex number array.");
      }
      if (!isInteger(index)) {
        throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", index));
      }
      len = this._length;
      if (index < 0) {
        index += len;
      }
      if (index < 0 || index >= len) {
        throw new RangeError(format("invalid argument. Index argument is out-of-bounds. Value: `%s`.", index));
      }
      if (!isComplexLike(value)) {
        throw new TypeError(format("invalid argument. Second argument must be a complex number. Value: `%s`.", value));
      }
      out = new this.constructor(this._buffer);
      buf = out._buffer;
      buf[2 * index] = real(value);
      buf[2 * index + 1] = imag(value);
      return out;
    });
    module.exports = Complex128Array;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/index.js
var require_lib93 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/complex128/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main78();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/from_iterator.js
var require_from_iterator3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/from_iterator.js"(exports, module) {
    "use strict";
    var Boolean2 = require_lib72();
    function fromIterator(it) {
      var out;
      var v;
      out = [];
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        out.push(Boolean2(v.value));
      }
      return out;
    }
    module.exports = fromIterator;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/from_iterator_map.js
var require_from_iterator_map3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/from_iterator_map.js"(exports, module) {
    "use strict";
    var Boolean2 = require_lib72();
    function fromIteratorMap(it, clbk, thisArg) {
      var out;
      var v;
      var i;
      out = [];
      i = -1;
      while (true) {
        v = it.next();
        if (v.done) {
          break;
        }
        i += 1;
        out.push(Boolean2(clbk.call(thisArg, v.value, i)));
      }
      return out;
    }
    module.exports = fromIteratorMap;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/from_array.js
var require_from_array3 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/from_array.js"(exports, module) {
    "use strict";
    var Boolean2 = require_lib72();
    function fromArray(buf, arr) {
      var len;
      var i;
      len = arr.length;
      for (i = 0; i < len; i++) {
        buf[i] = Boolean2(arr[i]);
      }
      return buf;
    }
    module.exports = fromArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/main.js
var require_main79 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/main.js"(exports, module) {
    "use strict";
    var isNonNegativeInteger = require_lib63().isPrimitive;
    var isCollection = require_lib67();
    var isArrayBuffer = require_lib68();
    var isObject = require_lib69();
    var isFunction = require_lib75();
    var isBoolean = require_lib73().isPrimitive;
    var isInteger = require_lib62().isPrimitive;
    var isString = require_lib70().isPrimitive;
    var isStringArray = require_lib71().primitives;
    var hasIteratorSymbolSupport = require_lib83();
    var ITERATOR_SYMBOL = require_lib84();
    var setReadOnly = require_lib5();
    var setReadOnlyAccessor = require_lib85();
    var Uint8Array2 = require_lib48();
    var Boolean2 = require_lib72();
    var getter = require_lib8();
    var floor = require_lib60();
    var accessorGetter = require_lib7();
    var format = require_lib3();
    var fromIterator = require_from_iterator3();
    var fromIteratorMap = require_from_iterator_map3();
    var fromArray = require_from_array3();
    var BYTES_PER_ELEMENT = Uint8Array2.BYTES_PER_ELEMENT;
    var HAS_ITERATOR_SYMBOL = hasIteratorSymbolSupport();
    function isBooleanArray(value) {
      return typeof value === "object" && value !== null && value.constructor.name === "BooleanArray" && value.BYTES_PER_ELEMENT === BYTES_PER_ELEMENT;
    }
    function isBooleanArrayConstructor(value) {
      return value === BooleanArray;
    }
    function BooleanArray() {
      var byteOffset;
      var nargs;
      var buf;
      var len;
      var arg;
      nargs = arguments.length;
      if (!(this instanceof BooleanArray)) {
        if (nargs === 0) {
          return new BooleanArray();
        }
        if (nargs === 1) {
          return new BooleanArray(arguments[0]);
        }
        if (nargs === 2) {
          return new BooleanArray(arguments[0], arguments[1]);
        }
        return new BooleanArray(arguments[0], arguments[1], arguments[2]);
      }
      if (nargs === 0) {
        buf = new Uint8Array2(0);
      } else if (nargs === 1) {
        arg = arguments[0];
        if (isNonNegativeInteger(arg)) {
          buf = new Uint8Array2(arg);
        } else if (isCollection(arg)) {
          buf = fromArray(new Uint8Array2(arg.length), arg);
        } else if (isArrayBuffer(arg)) {
          buf = new Uint8Array2(arg);
        } else if (isObject(arg)) {
          if (HAS_ITERATOR_SYMBOL === false) {
            throw new TypeError(format("invalid argument. Environment lacks Symbol.iterator support. Must provide a length, ArrayBuffer, typed array, or array-like object. Value: `%s`.", arg));
          }
          if (!isFunction(arg[ITERATOR_SYMBOL])) {
            throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", arg));
          }
          buf = arg[ITERATOR_SYMBOL]();
          if (!isFunction(buf.next)) {
            throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", arg));
          }
          buf = new Uint8Array2(fromIterator(buf));
        } else {
          throw new TypeError(format("invalid argument. Must provide a length, ArrayBuffer, typed array, array-like object, or an iterable. Value: `%s`.", arg));
        }
      } else {
        buf = arguments[0];
        if (!isArrayBuffer(buf)) {
          throw new TypeError(format("invalid argument. First argument must be an ArrayBuffer. Value: `%s`.", buf));
        }
        byteOffset = arguments[1];
        if (!isNonNegativeInteger(byteOffset)) {
          throw new TypeError(format("invalid argument. Byte offset must be a nonnegative integer. Value: `%s`.", byteOffset));
        }
        if (nargs === 2) {
          buf = new Uint8Array2(buf, byteOffset);
        } else {
          len = arguments[2];
          if (!isNonNegativeInteger(len)) {
            throw new TypeError(format("invalid argument. Length must be a nonnegative integer. Value: `%s`.", len));
          }
          if (len * BYTES_PER_ELEMENT > buf.byteLength - byteOffset) {
            throw new RangeError(format("invalid arguments. ArrayBuffer has insufficient capacity. Either decrease the array length or provide a bigger buffer. Minimum capacity: `%u`.", len * BYTES_PER_ELEMENT));
          }
          buf = new Uint8Array2(buf, byteOffset, len);
        }
      }
      setReadOnly(this, "_buffer", buf);
      setReadOnly(this, "_length", buf.length);
      return this;
    }
    setReadOnly(BooleanArray, "BYTES_PER_ELEMENT", BYTES_PER_ELEMENT);
    setReadOnly(BooleanArray, "name", "BooleanArray");
    setReadOnly(BooleanArray, "from", function from(src) {
      var thisArg;
      var nargs;
      var clbk;
      var out;
      var buf;
      var tmp;
      var get;
      var len;
      var i;
      if (!isFunction(this)) {
        throw new TypeError("invalid invocation. `this` context must be a constructor.");
      }
      if (!isBooleanArrayConstructor(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      nargs = arguments.length;
      if (nargs > 1) {
        clbk = arguments[1];
        if (!isFunction(clbk)) {
          throw new TypeError(format("invalid argument. Second argument must be a function. Value: `%s`.", clbk));
        }
        if (nargs > 2) {
          thisArg = arguments[2];
        }
      }
      if (isCollection(src)) {
        if (clbk) {
          len = src.length;
          if (src.get && src.set) {
            get = accessorGetter("default");
          } else {
            get = getter("default");
          }
          out = new this(len);
          buf = out._buffer;
          for (i = 0; i < len; i++) {
            buf[i] = Boolean2(clbk.call(thisArg, get(src, i), i));
          }
          return out;
        }
        return new this(src);
      }
      if (isObject(src) && HAS_ITERATOR_SYMBOL && isFunction(src[ITERATOR_SYMBOL])) {
        buf = src[ITERATOR_SYMBOL]();
        if (!isFunction(buf.next)) {
          throw new TypeError(format("invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.", src));
        }
        if (clbk) {
          tmp = fromIteratorMap(buf, clbk, thisArg);
        } else {
          tmp = fromIterator(buf);
        }
        len = tmp.length;
        out = new this(len);
        buf = out._buffer;
        for (i = 0; i < len; i++) {
          buf[i] = tmp[i];
        }
        return out;
      }
      throw new TypeError(format("invalid argument. First argument must be an array-like object or an iterable. Value: `%s`.", src));
    });
    setReadOnly(BooleanArray, "of", function of() {
      var args;
      var i;
      if (!isFunction(this)) {
        throw new TypeError("invalid invocation. `this` context must be a constructor.");
      }
      if (!isBooleanArrayConstructor(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      args = [];
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return new this(args);
    });
    setReadOnly(BooleanArray.prototype, "at", function at(idx) {
      var buf;
      var len;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isInteger(idx)) {
        throw new TypeError(format("invalid argument. Must provide an integer. Value: `%s`.", idx));
      }
      len = this._length;
      buf = this._buffer;
      if (idx < 0) {
        idx += len;
      }
      if (idx < 0 || idx >= len) {
        return;
      }
      return Boolean2(buf[idx]);
    });
    setReadOnlyAccessor(BooleanArray.prototype, "buffer", function get() {
      return this._buffer.buffer;
    });
    setReadOnlyAccessor(BooleanArray.prototype, "byteLength", function get() {
      return this._buffer.byteLength;
    });
    setReadOnlyAccessor(BooleanArray.prototype, "byteOffset", function get() {
      return this._buffer.byteOffset;
    });
    setReadOnly(BooleanArray.prototype, "BYTES_PER_ELEMENT", BooleanArray.BYTES_PER_ELEMENT);
    setReadOnly(BooleanArray.prototype, "copyWithin", function copyWithin(target, start) {
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (arguments.length === 2) {
        this._buffer.copyWithin(target, start);
      } else {
        this._buffer.copyWithin(target, start, arguments[2]);
      }
      return this;
    });
    setReadOnly(BooleanArray.prototype, "entries", function entries() {
      var self2;
      var iter;
      var len;
      var buf;
      var FLG;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": [i, Boolean2(buf[i])],
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.entries();
      }
    });
    setReadOnly(BooleanArray.prototype, "every", function every(predicate, thisArg) {
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (!predicate.call(thisArg, Boolean2(buf[i]), i, this)) {
          return false;
        }
      }
      return true;
    });
    setReadOnly(BooleanArray.prototype, "fill", function fill(value, start, end) {
      var buf;
      var len;
      var val;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isBoolean(value)) {
        throw new TypeError(format("invalid argument. First argument must be a boolean. Value: `%s`.", value));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        if (!isInteger(start)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", start));
        }
        if (start < 0) {
          start += len;
          if (start < 0) {
            start = 0;
          }
        }
        if (arguments.length > 2) {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Third argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          }
          if (end > len) {
            end = len;
          }
        } else {
          end = len;
        }
      } else {
        start = 0;
        end = len;
      }
      if (value) {
        val = 1;
      } else {
        val = 0;
      }
      for (i = start; i < end; i++) {
        buf[i] = val;
      }
      return this;
    });
    setReadOnly(BooleanArray.prototype, "filter", function filter(predicate, thisArg) {
      var buf;
      var out;
      var i;
      var v;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        v = Boolean2(buf[i]);
        if (predicate.call(thisArg, v, i, this)) {
          out.push(v);
        }
      }
      return new this.constructor(out);
    });
    setReadOnly(BooleanArray.prototype, "find", function find(predicate, thisArg) {
      var buf;
      var v;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        v = Boolean2(buf[i]);
        if (predicate.call(thisArg, v, i, this)) {
          return v;
        }
      }
    });
    setReadOnly(BooleanArray.prototype, "findIndex", function findIndex(predicate, thisArg) {
      var buf;
      var v;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        v = Boolean2(buf[i]);
        if (predicate.call(thisArg, v, i, this)) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(BooleanArray.prototype, "findLast", function findLast(predicate, thisArg) {
      var buf;
      var v;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = this._length - 1; i >= 0; i--) {
        v = Boolean2(buf[i]);
        if (predicate.call(thisArg, v, i, this)) {
          return v;
        }
      }
    });
    setReadOnly(BooleanArray.prototype, "findLastIndex", function findLastIndex(predicate, thisArg) {
      var buf;
      var v;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = this._length - 1; i >= 0; i--) {
        v = Boolean2(buf[i]);
        if (predicate.call(thisArg, v, i, this)) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(BooleanArray.prototype, "forEach", function forEach(fcn, thisArg) {
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(fcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", fcn));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        fcn.call(thisArg, Boolean2(buf[i]), i, this);
      }
    });
    setReadOnly(BooleanArray.prototype, "get", function get(idx) {
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isNonNegativeInteger(idx)) {
        throw new TypeError(format("invalid argument. Must provide a nonnegative integer. Value: `%s`.", idx));
      }
      if (idx >= this._length) {
        return;
      }
      return Boolean2(this._buffer[idx]);
    });
    setReadOnly(BooleanArray.prototype, "includes", function includes(searchElement, fromIndex) {
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isBoolean(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a boolean. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex < 0) {
          fromIndex += this._length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      } else {
        fromIndex = 0;
      }
      buf = this._buffer;
      for (i = fromIndex; i < this._length; i++) {
        if (searchElement === Boolean2(buf[i])) {
          return true;
        }
      }
      return false;
    });
    setReadOnly(BooleanArray.prototype, "indexOf", function indexOf(searchElement, fromIndex) {
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isBoolean(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a boolean. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex < 0) {
          fromIndex += this._length;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      } else {
        fromIndex = 0;
      }
      buf = this._buffer;
      for (i = fromIndex; i < this._length; i++) {
        if (searchElement === Boolean2(buf[i])) {
          return i;
        }
      }
      return -1;
    });
    setReadOnly(BooleanArray.prototype, "join", function join(separator) {
      var buf;
      var out;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (arguments.length > 0) {
        if (!isString(separator)) {
          throw new TypeError(format("invalid argument. First argument must be a string. Value: `%s`.", separator));
        }
      } else {
        separator = ",";
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        if (buf[i]) {
          out.push("true");
        } else {
          out.push("false");
        }
      }
      return out.join(separator);
    });
    setReadOnly(BooleanArray.prototype, "keys", function keys() {
      var self2;
      var iter;
      var len;
      var FLG;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      self2 = this;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": i,
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.keys();
      }
    });
    setReadOnly(BooleanArray.prototype, "lastIndexOf", function lastIndexOf(searchElement, fromIndex) {
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isBoolean(searchElement)) {
        throw new TypeError(format("invalid argument. First argument must be a boolean. Value: `%s`.", searchElement));
      }
      if (arguments.length > 1) {
        if (!isInteger(fromIndex)) {
          throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", fromIndex));
        }
        if (fromIndex >= this._length) {
          fromIndex = this._length - 1;
        } else if (fromIndex < 0) {
          fromIndex += this._length;
        }
      } else {
        fromIndex = this._length - 1;
      }
      buf = this._buffer;
      for (i = fromIndex; i >= 0; i--) {
        if (searchElement === Boolean2(buf[i])) {
          return i;
        }
      }
      return -1;
    });
    setReadOnlyAccessor(BooleanArray.prototype, "length", function get() {
      return this._length;
    });
    setReadOnly(BooleanArray.prototype, "map", function map(fcn, thisArg) {
      var outbuf;
      var out;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(fcn)) {
        throw new TypeError("invalid argument. First argument must be a function. Value: `%s`.", fcn);
      }
      buf = this._buffer;
      out = new this.constructor(this._length);
      outbuf = out._buffer;
      for (i = 0; i < this._length; i++) {
        outbuf[i] = Boolean2(fcn.call(thisArg, Boolean2(buf[i]), i, this));
      }
      return out;
    });
    setReadOnly(BooleanArray.prototype, "reduce", function reduce(reducer, initialValue) {
      var buf;
      var len;
      var acc;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(reducer)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", reducer));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        acc = initialValue;
        i = 0;
      } else {
        if (len === 0) {
          throw new Error("invalid operation. If not provided an initial value, an array must contain at least one element.");
        }
        acc = Boolean2(buf[0]);
        i = 1;
      }
      for (; i < len; i++) {
        acc = reducer(acc, Boolean2(buf[i]), i, this);
      }
      return acc;
    });
    setReadOnly(BooleanArray.prototype, "reduceRight", function reduceRight(reducer, initialValue) {
      var buf;
      var len;
      var acc;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(reducer)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", reducer));
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length > 1) {
        acc = initialValue;
        i = len - 1;
      } else {
        if (len === 0) {
          throw new Error("invalid operation. If not provided an initial value, an array must contain at least one element.");
        }
        acc = Boolean2(buf[len - 1]);
        i = len - 2;
      }
      for (; i >= 0; i--) {
        acc = reducer(acc, Boolean2(buf[i]), i, this);
      }
      return acc;
    });
    setReadOnly(BooleanArray.prototype, "reverse", function reverse() {
      var buf;
      var tmp;
      var len;
      var N;
      var i;
      var j;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      buf = this._buffer;
      len = this._length;
      N = floor(len / 2);
      for (i = 0; i < N; i++) {
        j = len - i - 1;
        tmp = buf[i];
        buf[i] = buf[j];
        buf[j] = tmp;
      }
      return this;
    });
    setReadOnly(BooleanArray.prototype, "set", function set(value) {
      var sbuf;
      var idx;
      var buf;
      var tmp;
      var N;
      var i;
      var j;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      buf = this._buffer;
      if (arguments.length > 1) {
        idx = arguments[1];
        if (!isNonNegativeInteger(idx)) {
          throw new TypeError(format("invalid argument. Index argument must be a nonnegative integer. Value: `%s`.", idx));
        }
      } else {
        idx = 0;
      }
      if (isCollection(value)) {
        N = value.length;
        if (idx + N > this._length) {
          throw new RangeError("invalid arguments. Target array lacks sufficient storage to accommodate source values.");
        }
        if (isBooleanArray(value)) {
          sbuf = value._buffer;
        } else {
          sbuf = value;
        }
        j = buf.byteOffset + idx * BYTES_PER_ELEMENT;
        if (sbuf.buffer === buf.buffer && (sbuf.byteOffset < j && sbuf.byteOffset + sbuf.byteLength > j)) {
          tmp = new Uint8Array2(sbuf.length);
          for (i = 0; i < sbuf.length; i++) {
            tmp[i] = sbuf[i];
          }
          sbuf = tmp;
        }
        for (i = 0; i < N; idx++, i++) {
          buf[idx] = sbuf[i] ? 1 : 0;
        }
        return;
      }
      if (idx >= this._length) {
        throw new RangeError(format("invalid argument. Index argument is out-of-bounds. Value: `%u`.", idx));
      }
      buf[idx] = value ? 1 : 0;
    });
    setReadOnly(BooleanArray.prototype, "slice", function slice(begin, end) {
      var outlen;
      var outbuf;
      var out;
      var buf;
      var len;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        begin = 0;
        end = len;
      } else {
        if (!isInteger(begin)) {
          throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", begin));
        }
        if (begin < 0) {
          begin += len;
          if (begin < 0) {
            begin = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (begin < end) {
        outlen = end - begin;
      } else {
        outlen = 0;
      }
      out = new this.constructor(outlen);
      outbuf = out._buffer;
      for (i = 0; i < outlen; i++) {
        outbuf[i] = buf[i + begin];
      }
      return out;
    });
    setReadOnly(BooleanArray.prototype, "some", function some(predicate, thisArg) {
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isFunction(predicate)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", predicate));
      }
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (predicate.call(thisArg, Boolean2(buf[i]), i, this)) {
          return true;
        }
      }
      return false;
    });
    setReadOnly(BooleanArray.prototype, "sort", function sort(compareFcn) {
      var buf;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      buf = this._buffer;
      if (arguments.length === 0) {
        buf.sort();
        return this;
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", compareFcn));
      }
      buf.sort(compare);
      return this;
      function compare(a, b) {
        return compareFcn(Boolean2(a), Boolean2(b));
      }
    });
    setReadOnly(BooleanArray.prototype, "subarray", function subarray(begin, end) {
      var offset;
      var buf;
      var len;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      buf = this._buffer;
      len = this._length;
      if (arguments.length === 0) {
        begin = 0;
        end = len;
      } else {
        if (!isInteger(begin)) {
          throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", begin));
        }
        if (begin < 0) {
          begin += len;
          if (begin < 0) {
            begin = 0;
          }
        }
        if (arguments.length === 1) {
          end = len;
        } else {
          if (!isInteger(end)) {
            throw new TypeError(format("invalid argument. Second argument must be an integer. Value: `%s`.", end));
          }
          if (end < 0) {
            end += len;
            if (end < 0) {
              end = 0;
            }
          } else if (end > len) {
            end = len;
          }
        }
      }
      if (begin >= len) {
        len = 0;
        offset = buf.byteLength;
      } else if (begin >= end) {
        len = 0;
        offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
      } else {
        len = end - begin;
        offset = buf.byteOffset + begin * BYTES_PER_ELEMENT;
      }
      return new this.constructor(buf.buffer, offset, len < 0 ? 0 : len);
    });
    setReadOnly(BooleanArray.prototype, "toLocaleString", function toLocaleString(locales, options) {
      var opts;
      var loc;
      var out;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (arguments.length === 0) {
        loc = [];
      } else if (isString(locales) || isStringArray(locales)) {
        loc = locales;
      } else {
        throw new TypeError(format("invalid argument. First argument must be a string or an array of strings. Value: `%s`.", locales));
      }
      if (arguments.length < 2) {
        opts = {};
      } else if (isObject(options)) {
        opts = options;
      } else {
        throw new TypeError(format("invalid argument. Options argument must be an object. Value: `%s`.", options));
      }
      buf = this._buffer;
      out = [];
      for (i = 0; i < this._length; i++) {
        out.push(Boolean2(buf[i]).toLocaleString(loc, opts));
      }
      return out.join(",");
    });
    setReadOnly(BooleanArray.prototype, "toReversed", function toReversed() {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        outbuf[i] = buf[len - i - 1];
      }
      return out;
    });
    setReadOnly(BooleanArray.prototype, "toSorted", function toSorted(compareFcn) {
      var outbuf;
      var out;
      var len;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      len = this._length;
      out = new this.constructor(len);
      buf = this._buffer;
      outbuf = out._buffer;
      for (i = 0; i < len; i++) {
        outbuf[i] = buf[i];
      }
      if (arguments.length === 0) {
        outbuf.sort();
        return out;
      }
      if (!isFunction(compareFcn)) {
        throw new TypeError(format("invalid argument. First argument must be a function. Value: `%s`.", compareFcn));
      }
      outbuf.sort(compare);
      return out;
      function compare(a, b) {
        return compareFcn(Boolean2(a), Boolean2(b));
      }
    });
    setReadOnly(BooleanArray.prototype, "toString", function toString() {
      var out;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      out = [];
      buf = this._buffer;
      for (i = 0; i < this._length; i++) {
        if (buf[i]) {
          out.push("true");
        } else {
          out.push("false");
        }
      }
      return out.join(",");
    });
    setReadOnly(BooleanArray.prototype, "values", function values() {
      var iter;
      var self2;
      var len;
      var FLG;
      var buf;
      var i;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      self2 = this;
      buf = this._buffer;
      len = this._length;
      i = -1;
      iter = {};
      setReadOnly(iter, "next", next);
      setReadOnly(iter, "return", end);
      if (ITERATOR_SYMBOL) {
        setReadOnly(iter, ITERATOR_SYMBOL, factory);
      }
      return iter;
      function next() {
        i += 1;
        if (FLG || i >= len) {
          return {
            "done": true
          };
        }
        return {
          "value": Boolean2(buf[i]),
          "done": false
        };
      }
      function end(value) {
        FLG = true;
        if (arguments.length) {
          return {
            "value": value,
            "done": true
          };
        }
        return {
          "done": true
        };
      }
      function factory() {
        return self2.values();
      }
    });
    setReadOnly(BooleanArray.prototype, "with", function copyWith(index, value) {
      var buf;
      var out;
      var len;
      if (!isBooleanArray(this)) {
        throw new TypeError("invalid invocation. `this` is not a boolean array.");
      }
      if (!isInteger(index)) {
        throw new TypeError(format("invalid argument. First argument must be an integer. Value: `%s`.", index));
      }
      len = this._length;
      if (index < 0) {
        index += len;
      }
      if (index < 0 || index >= len) {
        throw new RangeError(format("invalid argument. Index argument is out-of-bounds. Value: `%s`.", index));
      }
      if (!isBoolean(value)) {
        throw new TypeError(format("invalid argument. Second argument must be a boolean. Value: `%s`.", value));
      }
      out = new this.constructor(this._buffer);
      buf = out._buffer;
      if (value) {
        buf[index] = 1;
      } else {
        buf[index] = 0;
      }
      return out;
    });
    module.exports = BooleanArray;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/index.js
var require_lib94 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/bool/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main79();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/ctors.js
var require_ctors = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/ctors.js"(exports, module) {
    "use strict";
    var Float64Array2 = require_lib22();
    var Float32Array2 = require_lib26();
    var Uint32Array2 = require_lib30();
    var Int32Array2 = require_lib35();
    var Uint16Array2 = require_lib39();
    var Int16Array2 = require_lib44();
    var Uint8Array2 = require_lib48();
    var Uint8ClampedArray2 = require_lib51();
    var Int8Array2 = require_lib56();
    var Complex64Array = require_lib90();
    var Complex128Array = require_lib93();
    var BooleanArray = require_lib94();
    var CTORS = [
      Float64Array2,
      Float32Array2,
      Int32Array2,
      Uint32Array2,
      Int16Array2,
      Uint16Array2,
      Int8Array2,
      Uint8Array2,
      Uint8ClampedArray2,
      Complex64Array,
      Complex128Array,
      BooleanArray
    ];
    module.exports = CTORS;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/dtypes.js
var require_dtypes = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/dtypes.js"(exports, module) {
    "use strict";
    var DTYPES = [
      "float64",
      "float32",
      "int32",
      "uint32",
      "int16",
      "uint16",
      "int8",
      "uint8",
      "uint8c",
      "complex64",
      "complex128",
      "bool"
    ];
    module.exports = DTYPES;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/main.js
var require_main80 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/main.js"(exports, module) {
    "use strict";
    var isBuffer = require_lib17();
    var isArray = require_lib14();
    var constructorName = require_lib19();
    var ctor2dtype = require_ctor2dtype();
    var CTORS = require_ctors();
    var DTYPES = require_dtypes();
    var NTYPES = DTYPES.length;
    function dtype(value) {
      var i;
      if (isArray(value)) {
        return "generic";
      }
      if (isBuffer(value)) {
        return null;
      }
      for (i = 0; i < NTYPES; i++) {
        if (value instanceof CTORS[i]) {
          return DTYPES[i];
        }
      }
      return ctor2dtype[constructorName(value)] || null;
    }
    module.exports = dtype;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/index.js
var require_lib95 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/dtype/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main80();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/contains/lib/main.js
var require_main81 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/contains/lib/main.js"(exports, module) {
    "use strict";
    var isAccessorArray = require_lib6();
    var accessorGetter = require_lib7();
    var getter = require_lib8();
    var dtype = require_lib95();
    function contains(x, value) {
      var len;
      var get;
      var dt;
      var i;
      dt = dtype(x);
      if (isAccessorArray(x)) {
        get = accessorGetter(dt);
      } else {
        get = getter(dt);
      }
      len = x.length;
      for (i = 0; i < len; i++) {
        if (get(x, i) === value) {
          return true;
        }
      }
      return false;
    }
    module.exports = contains;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/contains/lib/factory.js
var require_factory = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/contains/lib/factory.js"(exports, module) {
    "use strict";
    var isCollection = require_lib67();
    var isAccessorArray = require_lib6();
    var accessorGetter = require_lib7();
    var dtype = require_lib95();
    var format = require_lib3();
    function factory(x) {
      var get;
      var len;
      var dt;
      if (!isCollection(x)) {
        throw new TypeError(format("invalid argument. Must provide an array-like object. Value: `%s`.", x));
      }
      dt = dtype(x);
      if (isAccessorArray(x)) {
        get = accessorGetter(dt);
      }
      len = x.length;
      return get === void 0 ? contains : accessors;
      function contains(value) {
        var i;
        for (i = 0; i < len; i++) {
          if (x[i] === value) {
            return true;
          }
        }
        return false;
      }
      function accessors(value) {
        var i;
        for (i = 0; i < len; i++) {
          if (get(x, i) === value) {
            return true;
          }
        }
        return false;
      }
    }
    module.exports = factory;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/contains/lib/index.js
var require_lib96 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/array/base/assert/contains/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main81();
    var factory = require_factory();
    setReadOnly(main, "factory", factory);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/data.json
var require_data = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/data.json"(exports, module) {
    module.exports = [
      "row-major",
      "column-major"
    ];
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/main.js
var require_main82 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/main.js"(exports, module) {
    "use strict";
    var DATA = require_data();
    function layouts() {
      return DATA.slice();
    }
    module.exports = layouts;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/enum.js
var require_enum = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/enum.js"(exports, module) {
    "use strict";
    function enumerated() {
      return {
        // Row-major (C-style):
        "row-major": 101,
        // Column-major (Fortran-style):
        "column-major": 102
      };
    }
    module.exports = enumerated;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/index.js
var require_lib97 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/layouts/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main82();
    var enumeration = require_enum();
    setReadOnly(main, "enum", enumeration);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-layout/lib/main.js
var require_main83 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-layout/lib/main.js"(exports, module) {
    "use strict";
    var contains = require_lib96().factory;
    var layouts = require_lib97();
    var isLayout = contains(layouts());
    module.exports = isLayout;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-layout/lib/index.js
var require_lib98 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-layout/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main83();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/data.json
var require_data2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/data.json"(exports, module) {
    module.exports = [
      "no-transpose",
      "transpose",
      "conjugate-transpose"
    ];
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/main.js
var require_main84 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/main.js"(exports, module) {
    "use strict";
    var DATA = require_data2();
    function layouts() {
      return DATA.slice();
    }
    module.exports = layouts;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/enum.js
var require_enum2 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/enum.js"(exports, module) {
    "use strict";
    function enumerated() {
      return {
        // No transposition:
        "no-transpose": 111,
        // Transposition:
        "transpose": 112,
        // Conjugate transposition:
        "conjugate-transpose": 113
      };
    }
    module.exports = enumerated;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/index.js
var require_lib99 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/transpose-operations/lib/index.js"(exports, module) {
    "use strict";
    var setReadOnly = require_lib5();
    var main = require_main84();
    var enumeration = require_enum2();
    setReadOnly(main, "enum", enumeration);
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-transpose-operation/lib/main.js
var require_main85 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-transpose-operation/lib/main.js"(exports, module) {
    "use strict";
    var contains = require_lib96().factory;
    var ops = require_lib99();
    var isTransposeOperation = contains(ops());
    module.exports = isTransposeOperation;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-transpose-operation/lib/index.js
var require_lib100 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/blas/base/assert/is-transpose-operation/lib/index.js"(exports, module) {
    "use strict";
    var main = require_main85();
    module.exports = main;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/fast/max/lib/main.js
var require_main86 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/fast/max/lib/main.js"(exports, module) {
    "use strict";
    function max(x, y) {
      if (x > y) {
        return x;
      }
      return y;
    }
    module.exports = max;
  }
});

// ../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/fast/max/lib/index.js
var require_lib101 = __commonJS({
  "../../dev/rreusser/notes/node_modules/@stdlib/math/base/special/fast/max/lib/index.js"(exports, module) {
    "use strict";
    var max = require_main86();
    module.exports = max;
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
    var Float64Array2 = require_lib22();
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
    var Float64Array2 = require_lib22();
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

// ../../dev/rreusser/notes/lib/lapack/base/dgels/lib/dgels.js
var require_dgels = __commonJS({
  "../../dev/rreusser/notes/lib/lapack/base/dgels/lib/dgels.js"(exports, module) {
    "use strict";
    var isLayout = require_lib98();
    var format = require_lib3();
    var isMatrixTranspose = require_lib100();
    var max = require_lib101();
    var base = require_base31();
    function dgels2(order, trans, M, N, nrhs, A, LDA, B, LDB) {
      var sa1;
      var sa2;
      var sb1;
      var sb2;
      if (!isLayout(order)) {
        throw new TypeError(format("invalid argument. First argument must be a valid order. Value: `%s`.", order));
      }
      if (!isMatrixTranspose(trans)) {
        throw new TypeError(format("invalid argument. Second argument must be a valid transpose operation. Value: `%s`.", trans));
      }
      if (M < 0) {
        throw new RangeError(format("invalid argument. Third argument must be a nonnegative integer. Value: `%d`.", M));
      }
      if (N < 0) {
        throw new RangeError(format("invalid argument. Fourth argument must be a nonnegative integer. Value: `%d`.", N));
      }
      if (nrhs < 0) {
        throw new RangeError(format("invalid argument. Fifth argument must be a nonnegative integer. Value: `%d`.", nrhs));
      }
      if (order === "row-major" && LDB < max(1, N)) {
        throw new RangeError(format("invalid argument. Ninth argument must be greater than or equal to max(1,N). Value: `%d`.", LDB));
      }
      if (order === "column-major" && LDB < max(1, M)) {
        throw new RangeError(format("invalid argument. Ninth argument must be greater than or equal to max(1,M). Value: `%d`.", LDB));
      }
      if (order === "row-major" && LDA < max(1, N)) {
        throw new RangeError(format("invalid argument. Seventh argument must be greater than or equal to max(1,N). Value: `%d`.", LDA));
      }
      if (order === "column-major" && LDA < max(1, M)) {
        throw new RangeError(format("invalid argument. Seventh argument must be greater than or equal to max(1,M). Value: `%d`.", LDA));
      }
      if (order === "column-major") {
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
      return base(trans, M, N, nrhs, A, sa1, sa2, 0, B, sb1, sb2, 0);
    }
    module.exports = dgels2;
  }
});

// dgels-wrapper.js
var import_dgels = __toESM(require_dgels(), 1);
var export_dgels = import_dgels.default;
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

@stdlib/utils/define-property/lib/define_property.js:
@stdlib/utils/define-property/lib/has_define_property_support.js:
@stdlib/regexp/function-name/lib/main.js:
@stdlib/regexp/function-name/lib/index.js:
@stdlib/complex/float32/real/lib/main.js:
@stdlib/complex/float32/real/lib/index.js:
@stdlib/complex/float32/imag/lib/main.js:
@stdlib/complex/float32/imag/lib/index.js:
@stdlib/strided/base/reinterpret-complex64/lib/main.js:
@stdlib/strided/base/reinterpret-complex64/lib/index.js:
@stdlib/strided/base/reinterpret-complex128/lib/main.js:
@stdlib/strided/base/reinterpret-complex128/lib/index.js:
  (**
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
  *)

@stdlib/utils/define-property/lib/builtin.js:
@stdlib/utils/define-property/lib/polyfill.js:
@stdlib/utils/define-property/lib/index.js:
@stdlib/utils/define-nonenumerable-read-only-property/lib/main.js:
@stdlib/utils/define-nonenumerable-read-only-property/lib/index.js:
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
@stdlib/assert/is-array/lib/main.js:
@stdlib/assert/is-array/lib/index.js:
@stdlib/assert/tools/array-function/lib/main.js:
@stdlib/assert/tools/array-function/lib/index.js:
@stdlib/assert/is-object-like/lib/main.js:
@stdlib/assert/is-object-like/lib/index.js:
@stdlib/assert/is-buffer/lib/main.js:
@stdlib/assert/is-buffer/lib/index.js:
@stdlib/regexp/function-name/lib/regexp.js:
@stdlib/utils/constructor-name/lib/main.js:
@stdlib/utils/constructor-name/lib/index.js:
@stdlib/assert/is-float64array/lib/main.js:
@stdlib/assert/is-float64array/lib/index.js:
@stdlib/assert/has-float64array-support/lib/float64array.js:
@stdlib/assert/has-float64array-support/lib/main.js:
@stdlib/assert/has-float64array-support/lib/index.js:
@stdlib/array/float64/lib/main.js:
@stdlib/array/float64/lib/polyfill.js:
@stdlib/array/float64/lib/index.js:
@stdlib/assert/is-float32array/lib/main.js:
@stdlib/assert/is-float32array/lib/index.js:
@stdlib/constants/float64/pinf/lib/index.js:
@stdlib/assert/has-float32array-support/lib/float32array.js:
@stdlib/assert/has-float32array-support/lib/main.js:
@stdlib/assert/has-float32array-support/lib/index.js:
@stdlib/array/float32/lib/main.js:
@stdlib/array/float32/lib/polyfill.js:
@stdlib/array/float32/lib/index.js:
@stdlib/assert/is-uint32array/lib/main.js:
@stdlib/assert/is-uint32array/lib/index.js:
@stdlib/constants/uint32/max/lib/index.js:
@stdlib/assert/has-uint32array-support/lib/uint32array.js:
@stdlib/assert/has-uint32array-support/lib/main.js:
@stdlib/assert/has-uint32array-support/lib/index.js:
@stdlib/array/uint32/lib/main.js:
@stdlib/array/uint32/lib/polyfill.js:
@stdlib/array/uint32/lib/index.js:
@stdlib/assert/is-int32array/lib/main.js:
@stdlib/assert/is-int32array/lib/index.js:
@stdlib/constants/int32/max/lib/index.js:
@stdlib/constants/int32/min/lib/index.js:
@stdlib/assert/has-int32array-support/lib/int32array.js:
@stdlib/assert/has-int32array-support/lib/main.js:
@stdlib/assert/has-int32array-support/lib/index.js:
@stdlib/array/int32/lib/main.js:
@stdlib/array/int32/lib/polyfill.js:
@stdlib/array/int32/lib/index.js:
@stdlib/assert/is-uint16array/lib/main.js:
@stdlib/assert/is-uint16array/lib/index.js:
@stdlib/constants/uint16/max/lib/index.js:
@stdlib/assert/has-uint16array-support/lib/uint16array.js:
@stdlib/assert/has-uint16array-support/lib/main.js:
@stdlib/assert/has-uint16array-support/lib/index.js:
@stdlib/array/uint16/lib/main.js:
@stdlib/array/uint16/lib/polyfill.js:
@stdlib/array/uint16/lib/index.js:
@stdlib/assert/is-int16array/lib/main.js:
@stdlib/assert/is-int16array/lib/index.js:
@stdlib/constants/int16/max/lib/index.js:
@stdlib/constants/int16/min/lib/index.js:
@stdlib/assert/has-int16array-support/lib/int16array.js:
@stdlib/assert/has-int16array-support/lib/main.js:
@stdlib/assert/has-int16array-support/lib/index.js:
@stdlib/array/int16/lib/main.js:
@stdlib/array/int16/lib/polyfill.js:
@stdlib/array/int16/lib/index.js:
@stdlib/assert/is-uint8array/lib/main.js:
@stdlib/assert/is-uint8array/lib/index.js:
@stdlib/constants/uint8/max/lib/index.js:
@stdlib/assert/has-uint8array-support/lib/uint8array.js:
@stdlib/assert/has-uint8array-support/lib/main.js:
@stdlib/assert/has-uint8array-support/lib/index.js:
@stdlib/array/uint8/lib/main.js:
@stdlib/array/uint8/lib/polyfill.js:
@stdlib/array/uint8/lib/index.js:
@stdlib/assert/is-uint8clampedarray/lib/main.js:
@stdlib/assert/is-uint8clampedarray/lib/index.js:
@stdlib/assert/has-uint8clampedarray-support/lib/uint8clampedarray.js:
@stdlib/assert/has-uint8clampedarray-support/lib/main.js:
@stdlib/assert/has-uint8clampedarray-support/lib/index.js:
@stdlib/array/uint8c/lib/main.js:
@stdlib/array/uint8c/lib/polyfill.js:
@stdlib/array/uint8c/lib/index.js:
@stdlib/assert/is-int8array/lib/main.js:
@stdlib/assert/is-int8array/lib/index.js:
@stdlib/constants/int8/max/lib/index.js:
@stdlib/constants/int8/min/lib/index.js:
@stdlib/assert/has-int8array-support/lib/int8array.js:
@stdlib/assert/has-int8array-support/lib/main.js:
@stdlib/assert/has-int8array-support/lib/index.js:
@stdlib/array/int8/lib/main.js:
@stdlib/array/int8/lib/polyfill.js:
@stdlib/array/int8/lib/index.js:
@stdlib/assert/is-number/lib/primitive.js:
@stdlib/number/ctor/lib/main.js:
@stdlib/number/ctor/lib/index.js:
@stdlib/assert/is-number/lib/tostring.js:
@stdlib/assert/is-number/lib/try2serialize.js:
@stdlib/assert/is-number/lib/object.js:
@stdlib/assert/is-number/lib/main.js:
@stdlib/assert/is-number/lib/index.js:
@stdlib/constants/float64/ninf/lib/index.js:
@stdlib/math/base/special/floor/lib/main.js:
@stdlib/math/base/special/floor/lib/index.js:
@stdlib/math/base/assert/is-integer/lib/main.js:
@stdlib/math/base/assert/is-integer/lib/index.js:
@stdlib/assert/is-integer/lib/integer.js:
@stdlib/assert/is-integer/lib/primitive.js:
@stdlib/assert/is-integer/lib/object.js:
@stdlib/assert/is-integer/lib/main.js:
@stdlib/assert/is-integer/lib/index.js:
@stdlib/assert/is-nonnegative-integer/lib/primitive.js:
@stdlib/assert/is-nonnegative-integer/lib/object.js:
@stdlib/assert/is-nonnegative-integer/lib/main.js:
@stdlib/assert/is-nonnegative-integer/lib/index.js:
@stdlib/constants/array/max-array-length/lib/index.js:
@stdlib/assert/is-array-like-object/lib/main.js:
@stdlib/assert/is-array-like-object/lib/index.js:
@stdlib/constants/array/max-typed-array-length/lib/index.js:
@stdlib/assert/is-collection/lib/main.js:
@stdlib/assert/is-collection/lib/index.js:
@stdlib/assert/is-arraybuffer/lib/main.js:
@stdlib/assert/is-arraybuffer/lib/index.js:
@stdlib/assert/is-object/lib/main.js:
@stdlib/assert/is-object/lib/index.js:
@stdlib/assert/is-string/lib/primitive.js:
@stdlib/assert/is-string/lib/valueof.js:
@stdlib/assert/is-string/lib/try2valueof.js:
@stdlib/assert/is-string/lib/object.js:
@stdlib/assert/is-string/lib/main.js:
@stdlib/assert/is-string/lib/index.js:
@stdlib/assert/is-string-array/lib/index.js:
@stdlib/utils/type-of/lib/fixtures/re.js:
@stdlib/assert/is-boolean/lib/primitive.js:
@stdlib/assert/is-boolean/lib/tostring.js:
@stdlib/assert/is-boolean/lib/try2serialize.js:
@stdlib/assert/is-boolean/lib/object.js:
@stdlib/assert/is-boolean/lib/main.js:
@stdlib/assert/is-boolean/lib/index.js:
@stdlib/utils/global/lib/codegen.js:
@stdlib/utils/global/lib/self.js:
@stdlib/utils/global/lib/window.js:
@stdlib/utils/type-of/lib/fixtures/nodelist.js:
@stdlib/utils/type-of/lib/fixtures/typedarray.js:
@stdlib/utils/type-of/lib/check.js:
@stdlib/utils/type-of/lib/main.js:
@stdlib/utils/type-of/lib/polyfill.js:
@stdlib/utils/type-of/lib/index.js:
@stdlib/assert/is-function/lib/main.js:
@stdlib/assert/is-function/lib/index.js:
@stdlib/complex/float64/ctor/lib/tostring.js:
@stdlib/complex/float64/ctor/lib/tojson.js:
@stdlib/complex/float64/ctor/lib/main.js:
@stdlib/complex/float64/ctor/lib/index.js:
@stdlib/number/float64/base/to-float32/lib/main.js:
@stdlib/number/float64/base/to-float32/lib/polyfill.js:
@stdlib/number/float64/base/to-float32/lib/index.js:
@stdlib/complex/float32/ctor/lib/tostring.js:
@stdlib/complex/float32/ctor/lib/tojson.js:
@stdlib/complex/float32/ctor/lib/main.js:
@stdlib/complex/float32/ctor/lib/index.js:
@stdlib/assert/is-complex-like/lib/main.js:
@stdlib/assert/is-complex-like/lib/index.js:
@stdlib/math/base/assert/is-even/lib/main.js:
@stdlib/math/base/assert/is-even/lib/index.js:
@stdlib/assert/has-iterator-symbol-support/lib/main.js:
@stdlib/assert/has-iterator-symbol-support/lib/index.js:
@stdlib/symbol/iterator/lib/main.js:
@stdlib/symbol/iterator/lib/index.js:
@stdlib/utils/define-nonenumerable-read-only-accessor/lib/main.js:
@stdlib/utils/define-nonenumerable-read-only-accessor/lib/index.js:
@stdlib/array/complex64/lib/from_iterator.js:
@stdlib/array/complex64/lib/from_iterator_map.js:
@stdlib/array/complex64/lib/from_array.js:
@stdlib/array/complex64/lib/main.js:
@stdlib/array/complex64/lib/index.js:
@stdlib/complex/float64/real/lib/main.js:
@stdlib/complex/float64/real/lib/index.js:
@stdlib/complex/float64/imag/lib/main.js:
@stdlib/complex/float64/imag/lib/index.js:
@stdlib/array/complex128/lib/from_iterator.js:
@stdlib/array/complex128/lib/from_iterator_map.js:
@stdlib/array/complex128/lib/from_array.js:
@stdlib/array/complex128/lib/index.js:
@stdlib/array/dtype/lib/main.js:
@stdlib/array/dtype/lib/index.js:
@stdlib/math/base/special/fast/max/lib/main.js:
@stdlib/math/base/special/fast/max/lib/index.js:
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

@stdlib/string/base/format-interpolate/lib/is_number.js:
@stdlib/string/base/format-interpolate/lib/zero_pad.js:
@stdlib/string/base/format-interpolate/lib/format_integer.js:
@stdlib/string/base/format-interpolate/lib/is_string.js:
@stdlib/string/base/format-interpolate/lib/format_double.js:
@stdlib/string/base/format-interpolate/lib/space_pad.js:
@stdlib/string/base/format-interpolate/lib/main.js:
@stdlib/string/base/format-interpolate/lib/index.js:
@stdlib/string/base/format-tokenize/lib/main.js:
@stdlib/string/base/format-tokenize/lib/index.js:
@stdlib/string/format/lib/is_string.js:
@stdlib/string/format/lib/main.js:
@stdlib/string/format/lib/index.js:
@stdlib/array/base/assert/is-accessor-array/lib/main.js:
@stdlib/array/base/assert/is-accessor-array/lib/index.js:
@stdlib/array/base/accessor-getter/lib/main.js:
@stdlib/array/base/accessor-getter/lib/index.js:
@stdlib/array/base/getter/lib/main.js:
@stdlib/array/base/getter/lib/index.js:
@stdlib/boolean/ctor/lib/main.js:
@stdlib/boolean/ctor/lib/index.js:
@stdlib/utils/global/lib/global_this.js:
@stdlib/utils/global/lib/browser.js:
  (**
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
  *)

@stdlib/array/dtype/lib/ctor2dtype.js:
@stdlib/array/base/assert/is-complex64array/lib/main.js:
@stdlib/array/base/assert/is-complex64array/lib/index.js:
@stdlib/array/base/assert/is-complex128array/lib/main.js:
@stdlib/array/base/assert/is-complex128array/lib/index.js:
@stdlib/array/complex128/lib/main.js:
@stdlib/array/bool/lib/from_iterator.js:
@stdlib/array/bool/lib/from_iterator_map.js:
@stdlib/array/bool/lib/from_array.js:
@stdlib/array/bool/lib/main.js:
@stdlib/array/bool/lib/index.js:
@stdlib/array/dtype/lib/ctors.js:
@stdlib/array/dtype/lib/dtypes.js:
@stdlib/blas/base/layouts/lib/main.js:
@stdlib/blas/base/layouts/lib/enum.js:
@stdlib/blas/base/layouts/lib/index.js:
@stdlib/blas/base/assert/is-layout/lib/main.js:
@stdlib/blas/base/assert/is-layout/lib/index.js:
@stdlib/blas/base/transpose-operations/lib/main.js:
@stdlib/blas/base/transpose-operations/lib/enum.js:
@stdlib/blas/base/transpose-operations/lib/index.js:
@stdlib/blas/base/assert/is-transpose-operation/lib/main.js:
@stdlib/blas/base/assert/is-transpose-operation/lib/index.js:
  (**
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
  *)

@stdlib/array/base/assert/contains/lib/main.js:
@stdlib/array/base/assert/contains/lib/factory.js:
@stdlib/array/base/assert/contains/lib/index.js:
  (**
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
  *)
*/
