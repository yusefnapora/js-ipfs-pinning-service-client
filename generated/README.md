# ipfs_pinning_service_api

IpfsPinningServiceApi - JavaScript client for ipfs_pinning_service_api


## About this spec
The IPFS Pinning Service API is intended to be an implementation-agnostic API&#x3a;
- For use and implementation by pinning service providers
- For use in client mode by IPFS nodes and GUI-based applications

> **Note**: while ready for implementation, this spec is still a work in progress! 🏗️  **Your input and feedback are welcome and valuable as we develop this API spec. Please join the design discussion at [github.com/ipfs/pinning-services-api-spec](https://github.com/ipfs/pinning-services-api-spec).**

# Schemas
This section describes the most important object types and conventions.

A full list of fields and schemas can be found in the `schemas` section of the [YAML file](https://github.com/ipfs/pinning-services-api-spec/blob/master/ipfs-pinning-service.yaml).

## Identifiers
### cid
[Content Identifier (CID)](https://docs.ipfs.io/concepts/content-addressing/) points at the root of a DAG that is pinned recursively.
### requestid
Unique identifier of a pin request.

When a pin is created, the service responds with unique `requestid` that can be later used for pin removal. When the same `cid` is pinned again, a different `requestid` is returned to differentiate between those pin requests.

Service implementation should use UUID, `hash(accessToken,Pin,PinStatus.created)`, or any other opaque identifier that provides equally strong protection against race conditions.

## Objects
### Pin object

![pin object](https://bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq.ipfs.dweb.link/pin.png)

The `Pin` object is a representation of a pin request.

It includes the `cid` of data to be pinned, as well as optional metadata in `name`, `origins`, and `meta`.

### Pin status response

![pin status response object](https://bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq.ipfs.dweb.link/pinstatus.png)

The `PinStatus` object is a representation of the current state of a pinning operation.
It includes the original `pin` object, along with the current `status` and globally unique `requestid` of the entire pinning request, which can be used for future status checks and management. Addresses in the `delegates` array are peers delegated by the pinning service for facilitating direct file transfers (more details in the provider hints section). Any additional vendor-specific information is returned in optional `info`.

# The pin lifecycle

![pinning service objects and lifecycle](https://bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq.ipfs.dweb.link/lifecycle.png)

## Creating a new pin object
The user sends a `Pin` object to `POST /pins` and receives a `PinStatus` response:
- `requestid` in `PinStatus` is the identifier of the pin operation, which can can be used for checking status, and removing the pin in the future
- `status` in `PinStatus` indicates the current state of a pin

## Checking status of in-progress pinning
`status` (in `PinStatus`) may indicate a pending state (`queued` or `pinning`). This means the data behind `Pin.cid` was not found on the pinning service and is being fetched from the IPFS network at large, which may take time.

In this case, the user can periodically check pinning progress via `GET /pins/{requestid}` until pinning is successful, or the user decides to remove the pending pin.

## Replacing an existing pin object
The user can replace an existing pin object via `POST /pins/{requestid}`. This is a shortcut for removing a pin object identified by `requestid` and creating a new one in a single API call that protects against undesired garbage collection of blocks common to both pins. Useful when updating a pin representing a huge dataset where most of blocks did not change. The new pin object `requestid` is returned in the `PinStatus` response. The old pin object is deleted automatically.

## Removing a pin object
A pin object can be removed via `DELETE /pins/{requestid}`.


# Provider hints
A pinning service will use the DHT and other discovery methods to locate pinned content; however, it is a good practice to provide additional provider hints to speed up the discovery phase and start the transfer immediately, especially if a client has the data in their own datastore or already knows of other providers.

The most common scenario is a client putting its own IPFS node's multiaddrs in `Pin.origins`,  and then attempt to connect to every multiaddr returned by a pinning service in `PinStatus.delegates` to initiate transfer.  At the same time, a pinning service will try to connect to multiaddrs provided by the client in `Pin.origins`.

This ensures data transfer starts immediately (without waiting for provider discovery over DHT), and mutual direct dial between a client and a service works around peer routing issues in restrictive network topologies, such as NATs, firewalls, etc.

**NOTE:** Connections to multiaddrs in `origins` and `delegates` arrays should be attempted in best-effort fashion, and dial failure should not fail the pinning operation. When unable to act on explicit provider hints, DHT and other discovery methods should be used as a fallback by a pinning service.

**NOTE:** All multiaddrs MUST end with `/p2p/{peerID}` and SHOULD be fully resolved and confirmed to be dialable from the public internet. Avoid sending addresses from local networks.

# Custom metadata
Pinning services are encouraged to add support for additional features by leveraging the optional `Pin.meta` and `PinStatus.info` fields. While these attributes can be application- or vendor-specific, we encourage the community at large to leverage these attributes as a sandbox to come up with conventions that could become part of future revisions of this API.
## Pin metadata
String keys and values passed in `Pin.meta` are persisted with the pin object.

Potential uses:
- `Pin.meta[app_id]`: Attaching a unique identifier to pins created by an app enables filtering pins per app via `?meta={\"app_id\":<UUID>}`
- `Pin.meta[vendor_policy]`: Vendor-specific policy (for example: which region to use, how many copies to keep)

Note that it is OK for a client to omit or ignore these optional attributes; doing so should not impact the basic pinning functionality.

## Pin status info
Additional `PinStatus.info` can be returned by pinning service.

Potential uses:
- `PinStatus.info[status_details]`: more info about the current status (queue position, percentage of transferred data, summary of where data is stored, etc); when `PinStatus.status=failed`, it could provide a reason why a pin operation failed (e.g. lack of funds, DAG too big, etc.)
- `PinStatus.info[dag_size]`: the size of pinned data, along with DAG overhead
- `PinStatus.info[raw_size]`: the size of data without DAG overhead (eg. unixfs)
- `PinStatus.info[pinned_until]`: if vendor supports time-bound pins, this could indicate when the pin will expire

# Pagination and filtering
Pin objects can be listed by executing `GET /pins` with optional parameters:

- When no filters are provided, the endpoint will return a small batch of the 10 most recently created items, from the latest to the oldest.
- The number of returned items can be adjusted with the `limit` parameter (implicit default is 10).
- If the value in `PinResults.count` is bigger than the length of `PinResults.results`, the client can infer there are more results that can be queried.
- To read more items, pass the `before` filter with the timestamp from `PinStatus.created` found in the oldest item in the current batch of results. Repeat to read all results.
- Returned results can be fine-tuned by applying optional `after`, `cid`, `name`, `status`, or `meta` filters.

> **Note**: pagination by the `created` timestamp requires each value to be globally unique. Any future considerations to add support for bulk creation must account for this.


This SDK is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: 1.0.0
- Package version: 1.0.0
- Build package: org.openapitools.codegen.languages.JavascriptClientCodegen

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/), please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install ipfs_pinning_service_api --save
```

Finally, you need to build the module:

```shell
npm run build
```

##### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

To use the link you just defined in your project, switch to the directory you want to use your ipfs_pinning_service_api from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

Finally, you need to build the module:

```shell
npm run build
```

#### git

If the library is hosted at a git repository, e.g.https://github.com/GIT_USER_ID/GIT_REPO_ID
then install it via:

```shell
    npm install GIT_USER_ID/GIT_REPO_ID --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var IpfsPinningServiceApi = require('ipfs_pinning_service_api');

var defaultClient = IpfsPinningServiceApi.ApiClient.instance;
// Configure Bearer access token for authorization: accessToken
var accessToken = defaultClient.authentications['accessToken'];
accessToken.accessToken = "YOUR ACCESS TOKEN"

var api = new IpfsPinningServiceApi.PinsApi()
var opts = {
  'cid': ["Qm1","Qm2","bafy3"], // {[String]} Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL  in browser contexts
  'name': PreciousData.pdf, // {String} Return pin objects with specified name (by default a case-sensitive, exact match)
  'match': exact, // {TextMatchingStrategy} Customize the text matching strategy applied when name filter is present
  'status': ["queued","pinning"], // {[Status]} Return pin objects for pins with the specified status
  'before': 2020-07-27T17:32:28Z, // {Date} Return results created (queued) before provided timestamp
  'after': 2020-07-27T17:32:28Z, // {Date} Return results created (queued) after provided timestamp
  'limit': 10, // {Number} Max records to return
  'meta': {key: "null"} // {{String: String}} Return pin objects that match specified metadata
};
api.pinsGet(opts).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});


```

## Documentation for API Endpoints

All URIs are relative to *https://pinning-service.example.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*IpfsPinningServiceApi.PinsApi* | [**pinsGet**](docs/PinsApi.md#pinsGet) | **GET** /pins | List pin objects
*IpfsPinningServiceApi.PinsApi* | [**pinsPost**](docs/PinsApi.md#pinsPost) | **POST** /pins | Add pin object
*IpfsPinningServiceApi.PinsApi* | [**pinsRequestidDelete**](docs/PinsApi.md#pinsRequestidDelete) | **DELETE** /pins/{requestid} | Remove pin object
*IpfsPinningServiceApi.PinsApi* | [**pinsRequestidGet**](docs/PinsApi.md#pinsRequestidGet) | **GET** /pins/{requestid} | Get pin object
*IpfsPinningServiceApi.PinsApi* | [**pinsRequestidPost**](docs/PinsApi.md#pinsRequestidPost) | **POST** /pins/{requestid} | Replace pin object


## Documentation for Models

 - [IpfsPinningServiceApi.Failure](docs/Failure.md)
 - [IpfsPinningServiceApi.FailureError](docs/FailureError.md)
 - [IpfsPinningServiceApi.Pin](docs/Pin.md)
 - [IpfsPinningServiceApi.PinResults](docs/PinResults.md)
 - [IpfsPinningServiceApi.PinStatus](docs/PinStatus.md)
 - [IpfsPinningServiceApi.Status](docs/Status.md)
 - [IpfsPinningServiceApi.TextMatchingStrategy](docs/TextMatchingStrategy.md)


## Documentation for Authorization



### accessToken

- **Type**: Bearer authentication

