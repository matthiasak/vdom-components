'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.util = exports.head = undefined;

var _head = require('./head');

var head = _interopRequireWildcard(_head);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.head = head;
exports.util = util;