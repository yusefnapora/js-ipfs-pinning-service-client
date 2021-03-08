"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Failure = _interopRequireDefault(require("../model/Failure"));

var _Pin = _interopRequireDefault(require("../model/Pin"));

var _PinResults = _interopRequireDefault(require("../model/PinResults"));

var _PinStatus = _interopRequireDefault(require("../model/PinStatus"));

var _Status = _interopRequireDefault(require("../model/Status"));

var _TextMatchingStrategy = _interopRequireDefault(require("../model/TextMatchingStrategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Pins service.
* @module api/PinsApi
* @version 1.0.0
*/
var PinsApi = /*#__PURE__*/function () {
  /**
  * Constructs a new PinsApi. 
  * @alias module:api/PinsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function PinsApi(apiClient) {
    _classCallCheck(this, PinsApi);

    this.apiClient = apiClient || _ApiClient["default"].instance;
  }
  /**
   * List pin objects
   * List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned
   * @param {Object} opts Optional parameters
   * @param {Array.<String>} opts.cid Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
   * @param {String} opts.name Return pin objects with specified name (by default a case-sensitive, exact match)
   * @param {module:model/TextMatchingStrategy} opts.match Customize the text matching strategy applied when name filter is present
   * @param {Array.<module:model/Status>} opts.status Return pin objects for pins with the specified status
   * @param {Date} opts.before Return results created (queued) before provided timestamp
   * @param {Date} opts.after Return results created (queued) after provided timestamp
   * @param {Number} opts.limit Max records to return (default to 10)
   * @param {Object.<String, {String: String}>} opts.meta Return pin objects that match specified metadata
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PinResults} and HTTP response
   */


  _createClass(PinsApi, [{
    key: "pinsGetWithHttpInfo",
    value: function pinsGetWithHttpInfo(opts) {
      opts = opts || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'cid': this.apiClient.buildCollectionParam(opts['cid'], 'csv'),
        'name': opts['name'],
        'match': opts['match'],
        'status': this.apiClient.buildCollectionParam(opts['status'], 'csv'),
        'before': opts['before'],
        'after': opts['after'],
        'limit': opts['limit'],
        'meta': opts['meta']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = ['accessToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _PinResults["default"];
      return this.apiClient.callApi('/pins', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null);
    }
    /**
     * List pin objects
     * List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned
     * @param {Object} opts Optional parameters
     * @param {Array.<String>} opts.cid Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
     * @param {String} opts.name Return pin objects with specified name (by default a case-sensitive, exact match)
     * @param {module:model/TextMatchingStrategy} opts.match Customize the text matching strategy applied when name filter is present
     * @param {Array.<module:model/Status>} opts.status Return pin objects for pins with the specified status
     * @param {Date} opts.before Return results created (queued) before provided timestamp
     * @param {Date} opts.after Return results created (queued) after provided timestamp
     * @param {Number} opts.limit Max records to return (default to 10)
     * @param {Object.<String, {String: String}>} opts.meta Return pin objects that match specified metadata
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinResults}
     */

  }, {
    key: "pinsGet",
    value: function pinsGet(opts) {
      return this.pinsGetWithHttpInfo(opts).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Add pin object
     * Add a new pin object for the current access token
     * @param {module:model/Pin} pin 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PinStatus} and HTTP response
     */

  }, {
    key: "pinsPostWithHttpInfo",
    value: function pinsPostWithHttpInfo(pin) {
      var postBody = pin; // verify the required parameter 'pin' is set

      if (pin === undefined || pin === null) {
        throw new Error("Missing the required parameter 'pin' when calling pinsPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['accessToken'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _PinStatus["default"];
      return this.apiClient.callApi('/pins', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null);
    }
    /**
     * Add pin object
     * Add a new pin object for the current access token
     * @param {module:model/Pin} pin 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
     */

  }, {
    key: "pinsPost",
    value: function pinsPost(pin) {
      return this.pinsPostWithHttpInfo(pin).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Remove pin object
     * Remove a pin object
     * @param {String} requestid 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */

  }, {
    key: "pinsRequestidDeleteWithHttpInfo",
    value: function pinsRequestidDeleteWithHttpInfo(requestid) {
      var postBody = null; // verify the required parameter 'requestid' is set

      if (requestid === undefined || requestid === null) {
        throw new Error("Missing the required parameter 'requestid' when calling pinsRequestidDelete");
      }

      var pathParams = {
        'requestid': requestid
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['accessToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;
      return this.apiClient.callApi('/pins/{requestid}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null);
    }
    /**
     * Remove pin object
     * Remove a pin object
     * @param {String} requestid 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "pinsRequestidDelete",
    value: function pinsRequestidDelete(requestid) {
      return this.pinsRequestidDeleteWithHttpInfo(requestid).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Get pin object
     * Get a pin object and its status
     * @param {String} requestid 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PinStatus} and HTTP response
     */

  }, {
    key: "pinsRequestidGetWithHttpInfo",
    value: function pinsRequestidGetWithHttpInfo(requestid) {
      var postBody = null; // verify the required parameter 'requestid' is set

      if (requestid === undefined || requestid === null) {
        throw new Error("Missing the required parameter 'requestid' when calling pinsRequestidGet");
      }

      var pathParams = {
        'requestid': requestid
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['accessToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _PinStatus["default"];
      return this.apiClient.callApi('/pins/{requestid}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null);
    }
    /**
     * Get pin object
     * Get a pin object and its status
     * @param {String} requestid 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
     */

  }, {
    key: "pinsRequestidGet",
    value: function pinsRequestidGet(requestid) {
      return this.pinsRequestidGetWithHttpInfo(requestid).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Replace pin object
     * Replace an existing pin object (shortcut for executing remove and add operations in one step to avoid unnecessary garbage collection of blocks present in both recursive pins)
     * @param {String} requestid 
     * @param {module:model/Pin} pin 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PinStatus} and HTTP response
     */

  }, {
    key: "pinsRequestidPostWithHttpInfo",
    value: function pinsRequestidPostWithHttpInfo(requestid, pin) {
      var postBody = pin; // verify the required parameter 'requestid' is set

      if (requestid === undefined || requestid === null) {
        throw new Error("Missing the required parameter 'requestid' when calling pinsRequestidPost");
      } // verify the required parameter 'pin' is set


      if (pin === undefined || pin === null) {
        throw new Error("Missing the required parameter 'pin' when calling pinsRequestidPost");
      }

      var pathParams = {
        'requestid': requestid
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['accessToken'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _PinStatus["default"];
      return this.apiClient.callApi('/pins/{requestid}', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null);
    }
    /**
     * Replace pin object
     * Replace an existing pin object (shortcut for executing remove and add operations in one step to avoid unnecessary garbage collection of blocks present in both recursive pins)
     * @param {String} requestid 
     * @param {module:model/Pin} pin 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PinStatus}
     */

  }, {
    key: "pinsRequestidPost",
    value: function pinsRequestidPost(requestid, pin) {
      return this.pinsRequestidPostWithHttpInfo(requestid, pin).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
  }]);

  return PinsApi;
}();

exports["default"] = PinsApi;