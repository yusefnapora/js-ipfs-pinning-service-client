"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Pin = _interopRequireDefault(require("./Pin"));

var _Status = _interopRequireDefault(require("./Status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The PinStatus model module.
 * @module model/PinStatus
 * @version 1.0.0
 */
var PinStatus = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PinStatus</code>.
   * Pin object with status
   * @alias module:model/PinStatus
   * @param requestid {String} Globally unique identifier of the pin request; can be used to check the status of ongoing pinning, or pin removal
   * @param status {module:model/Status} 
   * @param created {Date} Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination
   * @param pin {module:model/Pin} 
   * @param delegates {Array.<String>} List of multiaddrs designated by pinning service for transferring any new data from external peers
   */
  function PinStatus(requestid, status, created, pin, delegates) {
    _classCallCheck(this, PinStatus);

    PinStatus.initialize(this, requestid, status, created, pin, delegates);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(PinStatus, null, [{
    key: "initialize",
    value: function initialize(obj, requestid, status, created, pin, delegates) {
      obj['requestid'] = requestid;
      obj['status'] = status;
      obj['created'] = created;
      obj['pin'] = pin;
      obj['delegates'] = delegates;
    }
    /**
     * Constructs a <code>PinStatus</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PinStatus} obj Optional instance to populate.
     * @return {module:model/PinStatus} The populated <code>PinStatus</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PinStatus();

        if (data.hasOwnProperty('requestid')) {
          obj['requestid'] = _ApiClient["default"].convertToType(data['requestid'], 'String');
        }

        if (data.hasOwnProperty('status')) {
          obj['status'] = _Status["default"].constructFromObject(data['status']);
        }

        if (data.hasOwnProperty('created')) {
          obj['created'] = _ApiClient["default"].convertToType(data['created'], 'Date');
        }

        if (data.hasOwnProperty('pin')) {
          obj['pin'] = _Pin["default"].constructFromObject(data['pin']);
        }

        if (data.hasOwnProperty('delegates')) {
          obj['delegates'] = _ApiClient["default"].convertToType(data['delegates'], ['String']);
        }

        if (data.hasOwnProperty('info')) {
          obj['info'] = _ApiClient["default"].convertToType(data['info'], {
            'String': 'String'
          });
        }
      }

      return obj;
    }
  }]);

  return PinStatus;
}();
/**
 * Globally unique identifier of the pin request; can be used to check the status of ongoing pinning, or pin removal
 * @member {String} requestid
 */


PinStatus.prototype['requestid'] = undefined;
/**
 * @member {module:model/Status} status
 */

PinStatus.prototype['status'] = undefined;
/**
 * Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination
 * @member {Date} created
 */

PinStatus.prototype['created'] = undefined;
/**
 * @member {module:model/Pin} pin
 */

PinStatus.prototype['pin'] = undefined;
/**
 * List of multiaddrs designated by pinning service for transferring any new data from external peers
 * @member {Array.<String>} delegates
 */

PinStatus.prototype['delegates'] = undefined;
/**
 * Optional info for PinStatus response
 * @member {Object.<String, String>} info
 */

PinStatus.prototype['info'] = undefined;
var _default = PinStatus;
exports["default"] = _default;