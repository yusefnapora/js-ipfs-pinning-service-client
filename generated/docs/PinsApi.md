# IpfsPinningServiceApi.PinsApi

All URIs are relative to *https://pinning-service.example.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pinsGet**](PinsApi.md#pinsGet) | **GET** /pins | List pin objects
[**pinsPost**](PinsApi.md#pinsPost) | **POST** /pins | Add pin object
[**pinsRequestidDelete**](PinsApi.md#pinsRequestidDelete) | **DELETE** /pins/{requestid} | Remove pin object
[**pinsRequestidGet**](PinsApi.md#pinsRequestidGet) | **GET** /pins/{requestid} | Get pin object
[**pinsRequestidPost**](PinsApi.md#pinsRequestidPost) | **POST** /pins/{requestid} | Replace pin object



## pinsGet

> PinResults pinsGet(opts)

List pin objects

List all the pin objects, matching optional filters; when no filter is provided, only successful pins are returned

### Example

```javascript
import IpfsPinningServiceApi from 'ipfs_pinning_service_api';
let defaultClient = IpfsPinningServiceApi.ApiClient.instance;
// Configure Bearer access token for authorization: accessToken
let accessToken = defaultClient.authentications['accessToken'];
accessToken.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new IpfsPinningServiceApi.PinsApi();
let opts = {
  'cid': ["Qm1","Qm2","bafy3"], // [String] | Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
  'name': PreciousData.pdf, // String | Return pin objects with specified name (by default a case-sensitive, exact match)
  'match': exact, // TextMatchingStrategy | Customize the text matching strategy applied when name filter is present
  'status': ["queued","pinning"], // [Status] | Return pin objects for pins with the specified status
  'before': 2020-07-27T17:32:28Z, // Date | Return results created (queued) before provided timestamp
  'after': 2020-07-27T17:32:28Z, // Date | Return results created (queued) after provided timestamp
  'limit': 10, // Number | Max records to return
  'meta': {key: "null"} // {String: String} | Return pin objects that match specified metadata
};
apiInstance.pinsGet(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **cid** | [**[String]**](String.md)| Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts | [optional] 
 **name** | **String**| Return pin objects with specified name (by default a case-sensitive, exact match) | [optional] 
 **match** | [**TextMatchingStrategy**](.md)| Customize the text matching strategy applied when name filter is present | [optional] 
 **status** | [**[Status]**](Status.md)| Return pin objects for pins with the specified status | [optional] 
 **before** | **Date**| Return results created (queued) before provided timestamp | [optional] 
 **after** | **Date**| Return results created (queued) after provided timestamp | [optional] 
 **limit** | **Number**| Max records to return | [optional] [default to 10]
 **meta** | [**{String: String}**](String.md)| Return pin objects that match specified metadata | [optional] 

### Return type

[**PinResults**](PinResults.md)

### Authorization

[accessToken](../README.md#accessToken)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## pinsPost

> PinStatus pinsPost(pin)

Add pin object

Add a new pin object for the current access token

### Example

```javascript
import IpfsPinningServiceApi from 'ipfs_pinning_service_api';
let defaultClient = IpfsPinningServiceApi.ApiClient.instance;
// Configure Bearer access token for authorization: accessToken
let accessToken = defaultClient.authentications['accessToken'];
accessToken.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new IpfsPinningServiceApi.PinsApi();
let pin = new IpfsPinningServiceApi.Pin(); // Pin | 
apiInstance.pinsPost(pin).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pin** | [**Pin**](Pin.md)|  | 

### Return type

[**PinStatus**](PinStatus.md)

### Authorization

[accessToken](../README.md#accessToken)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## pinsRequestidDelete

> pinsRequestidDelete(requestid)

Remove pin object

Remove a pin object

### Example

```javascript
import IpfsPinningServiceApi from 'ipfs_pinning_service_api';
let defaultClient = IpfsPinningServiceApi.ApiClient.instance;
// Configure Bearer access token for authorization: accessToken
let accessToken = defaultClient.authentications['accessToken'];
accessToken.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new IpfsPinningServiceApi.PinsApi();
let requestid = "requestid_example"; // String | 
apiInstance.pinsRequestidDelete(requestid).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestid** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[accessToken](../README.md#accessToken)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## pinsRequestidGet

> PinStatus pinsRequestidGet(requestid)

Get pin object

Get a pin object and its status

### Example

```javascript
import IpfsPinningServiceApi from 'ipfs_pinning_service_api';
let defaultClient = IpfsPinningServiceApi.ApiClient.instance;
// Configure Bearer access token for authorization: accessToken
let accessToken = defaultClient.authentications['accessToken'];
accessToken.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new IpfsPinningServiceApi.PinsApi();
let requestid = "requestid_example"; // String | 
apiInstance.pinsRequestidGet(requestid).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestid** | **String**|  | 

### Return type

[**PinStatus**](PinStatus.md)

### Authorization

[accessToken](../README.md#accessToken)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## pinsRequestidPost

> PinStatus pinsRequestidPost(requestid, pin)

Replace pin object

Replace an existing pin object (shortcut for executing remove and add operations in one step to avoid unnecessary garbage collection of blocks present in both recursive pins)

### Example

```javascript
import IpfsPinningServiceApi from 'ipfs_pinning_service_api';
let defaultClient = IpfsPinningServiceApi.ApiClient.instance;
// Configure Bearer access token for authorization: accessToken
let accessToken = defaultClient.authentications['accessToken'];
accessToken.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new IpfsPinningServiceApi.PinsApi();
let requestid = "requestid_example"; // String | 
let pin = new IpfsPinningServiceApi.Pin(); // Pin | 
apiInstance.pinsRequestidPost(requestid, pin).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestid** | **String**|  | 
 **pin** | [**Pin**](Pin.md)|  | 

### Return type

[**PinStatus**](PinStatus.md)

### Authorization

[accessToken](../README.md#accessToken)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

