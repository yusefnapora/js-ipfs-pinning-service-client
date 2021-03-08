# IpfsPinningServiceApi.PinStatus

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**requestid** | **String** | Globally unique identifier of the pin request; can be used to check the status of ongoing pinning, or pin removal | 
**status** | [**Status**](Status.md) |  | 
**created** | **Date** | Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination | 
**pin** | [**Pin**](Pin.md) |  | 
**delegates** | **[String]** | List of multiaddrs designated by pinning service for transferring any new data from external peers | 
**info** | **{String: String}** | Optional info for PinStatus response | [optional] 


