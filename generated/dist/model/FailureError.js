"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The FailureError model module.
 * @module model/FailureError
 * @version 1.0.0
 */
var FailureError = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>FailureError</code>.
   * @alias module:model/FailureError
   * @param reason {String} Mandatory string identifying the type of error
   */
  function FailureError(reason) {
    _classCallCheck(this, FailureError);

    FailureError.initialize(this, reason);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(FailureError, null, [{
    key: "initialize",
    value: function initialize(obj, reason) {
      obj['reason'] = reason;
    }
    /**
     * Constructs a <code>FailureError</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/FailureError} obj Optional instance to populate.
     * @return {module:model/FailureError} The populated <code>FailureError</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new FailureError();

        if (data.hasOwnProperty('reason')) {
          obj['reason'] = _ApiClient["default"].convertToType(data['reason'], 'String');
        }

        if (data.hasOwnProperty('details')) {
          obj['details'] = _ApiClient["default"].convertToType(data['details'], 'String');
        }
      }

      return obj;
    }
  }]);

  return FailureError;
}();
/**
 * Mandatory string identifying the type of error
 * @member {String} reason
 */


FailureError.prototype['reason'] = undefined;
/**
 * Optional, longer description of the error; may include UUID of transaction for support, links to documentation etc
 * @member {String} details
 */

FailureError.prototype['details'] = undefined;
var _default = FailureError;
exports["default"] = _default;