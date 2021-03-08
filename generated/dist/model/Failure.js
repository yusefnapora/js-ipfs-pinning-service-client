"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _FailureError = _interopRequireDefault(require("./FailureError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Failure model module.
 * @module model/Failure
 * @version 1.0.0
 */
var Failure = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Failure</code>.
   * Response for a failed request
   * @alias module:model/Failure
   * @param error {module:model/FailureError} 
   */
  function Failure(error) {
    _classCallCheck(this, Failure);

    Failure.initialize(this, error);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Failure, null, [{
    key: "initialize",
    value: function initialize(obj, error) {
      obj['error'] = error;
    }
    /**
     * Constructs a <code>Failure</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Failure} obj Optional instance to populate.
     * @return {module:model/Failure} The populated <code>Failure</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Failure();

        if (data.hasOwnProperty('error')) {
          obj['error'] = _FailureError["default"].constructFromObject(data['error']);
        }
      }

      return obj;
    }
  }]);

  return Failure;
}();
/**
 * @member {module:model/FailureError} error
 */


Failure.prototype['error'] = undefined;
var _default = Failure;
exports["default"] = _default;