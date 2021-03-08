"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _PinStatus = _interopRequireDefault(require("./PinStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The PinResults model module.
 * @module model/PinResults
 * @version 1.0.0
 */
var PinResults = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PinResults</code>.
   * Response used for listing pin objects matching request
   * @alias module:model/PinResults
   * @param count {Number} The total number of pin objects that exist for passed query filters
   * @param results {Array.<module:model/PinStatus>} An array of PinStatus results
   */
  function PinResults(count, results) {
    _classCallCheck(this, PinResults);

    PinResults.initialize(this, count, results);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(PinResults, null, [{
    key: "initialize",
    value: function initialize(obj, count, results) {
      obj['count'] = count;
      obj['results'] = results;
    }
    /**
     * Constructs a <code>PinResults</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PinResults} obj Optional instance to populate.
     * @return {module:model/PinResults} The populated <code>PinResults</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PinResults();

        if (data.hasOwnProperty('count')) {
          obj['count'] = _ApiClient["default"].convertToType(data['count'], 'Number');
        }

        if (data.hasOwnProperty('results')) {
          obj['results'] = _ApiClient["default"].convertToType(data['results'], [_PinStatus["default"]]);
        }
      }

      return obj;
    }
  }]);

  return PinResults;
}();
/**
 * The total number of pin objects that exist for passed query filters
 * @member {Number} count
 */


PinResults.prototype['count'] = undefined;
/**
 * An array of PinStatus results
 * @member {Array.<module:model/PinStatus>} results
 */

PinResults.prototype['results'] = undefined;
var _default = PinResults;
exports["default"] = _default;