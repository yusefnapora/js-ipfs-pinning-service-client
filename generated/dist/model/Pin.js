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
 * The Pin model module.
 * @module model/Pin
 * @version 1.0.0
 */
var Pin = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Pin</code>.
   * Pin object
   * @alias module:model/Pin
   * @param cid {String} Content Identifier (CID) to be pinned recursively
   */
  function Pin(cid) {
    _classCallCheck(this, Pin);

    Pin.initialize(this, cid);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Pin, null, [{
    key: "initialize",
    value: function initialize(obj, cid) {
      obj['cid'] = cid;
    }
    /**
     * Constructs a <code>Pin</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Pin} obj Optional instance to populate.
     * @return {module:model/Pin} The populated <code>Pin</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Pin();

        if (data.hasOwnProperty('cid')) {
          obj['cid'] = _ApiClient["default"].convertToType(data['cid'], 'String');
        }

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('origins')) {
          obj['origins'] = _ApiClient["default"].convertToType(data['origins'], ['String']);
        }

        if (data.hasOwnProperty('meta')) {
          obj['meta'] = _ApiClient["default"].convertToType(data['meta'], {
            'String': 'String'
          });
        }
      }

      return obj;
    }
  }]);

  return Pin;
}();
/**
 * Content Identifier (CID) to be pinned recursively
 * @member {String} cid
 */


Pin.prototype['cid'] = undefined;
/**
 * Optional name for pinned data; can be used for lookups later
 * @member {String} name
 */

Pin.prototype['name'] = undefined;
/**
 * Optional list of multiaddrs known to provide the data
 * @member {Array.<String>} origins
 */

Pin.prototype['origins'] = undefined;
/**
 * Optional metadata for pin object
 * @member {Object.<String, String>} meta
 */

Pin.prototype['meta'] = undefined;
var _default = Pin;
exports["default"] = _default;