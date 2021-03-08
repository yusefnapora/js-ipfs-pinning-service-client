/**
 * IPFS Pinning Service API
 *   ## About this spec The IPFS Pinning Service API is intended to be an implementation-agnostic API&#x3a; - For use and implementation by pinning service providers - For use in client mode by IPFS nodes and GUI-based applications  > **Note**: while ready for implementation, this spec is still a work in progress! 🏗️  **Your input and feedback are welcome and valuable as we develop this API spec. Please join the design discussion at [github.com/ipfs/pinning-services-api-spec](https://github.com/ipfs/pinning-services-api-spec).**  # Schemas This section describes the most important object types and conventions.  A full list of fields and schemas can be found in the `schemas` section of the [YAML file](https://github.com/ipfs/pinning-services-api-spec/blob/master/ipfs-pinning-service.yaml).  ## Identifiers ### cid [Content Identifier (CID)](https://docs.ipfs.io/concepts/content-addressing/) points at the root of a DAG that is pinned recursively. ### requestid Unique identifier of a pin request.  When a pin is created, the service responds with unique `requestid` that can be later used for pin removal. When the same `cid` is pinned again, a different `requestid` is returned to differentiate between those pin requests.  Service implementation should use UUID, `hash(accessToken,Pin,PinStatus.created)`, or any other opaque identifier that provides equally strong protection against race conditions.  ## Objects ### Pin object  ![pin object](https://bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq.ipfs.dweb.link/pin.png)  The `Pin` object is a representation of a pin request.  It includes the `cid` of data to be pinned, as well as optional metadata in `name`, `origins`, and `meta`.  ### Pin status response  ![pin status response object](https://bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq.ipfs.dweb.link/pinstatus.png)  The `PinStatus` object is a representation of the current state of a pinning operation. It includes the original `pin` object, along with the current `status` and globally unique `requestid` of the entire pinning request, which can be used for future status checks and management. Addresses in the `delegates` array are peers delegated by the pinning service for facilitating direct file transfers (more details in the provider hints section). Any additional vendor-specific information is returned in optional `info`.  # The pin lifecycle  ![pinning service objects and lifecycle](https://bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq.ipfs.dweb.link/lifecycle.png)  ## Creating a new pin object The user sends a `Pin` object to `POST /pins` and receives a `PinStatus` response: - `requestid` in `PinStatus` is the identifier of the pin operation, which can can be used for checking status, and removing the pin in the future - `status` in `PinStatus` indicates the current state of a pin  ## Checking status of in-progress pinning `status` (in `PinStatus`) may indicate a pending state (`queued` or `pinning`). This means the data behind `Pin.cid` was not found on the pinning service and is being fetched from the IPFS network at large, which may take time.  In this case, the user can periodically check pinning progress via `GET /pins/{requestid}` until pinning is successful, or the user decides to remove the pending pin.  ## Replacing an existing pin object The user can replace an existing pin object via `POST /pins/{requestid}`. This is a shortcut for removing a pin object identified by `requestid` and creating a new one in a single API call that protects against undesired garbage collection of blocks common to both pins. Useful when updating a pin representing a huge dataset where most of blocks did not change. The new pin object `requestid` is returned in the `PinStatus` response. The old pin object is deleted automatically.  ## Removing a pin object A pin object can be removed via `DELETE /pins/{requestid}`.   # Provider hints A pinning service will use the DHT and other discovery methods to locate pinned content; however, it is a good practice to provide additional provider hints to speed up the discovery phase and start the transfer immediately, especially if a client has the data in their own datastore or already knows of other providers.  The most common scenario is a client putting its own IPFS node's multiaddrs in `Pin.origins`,  and then attempt to connect to every multiaddr returned by a pinning service in `PinStatus.delegates` to initiate transfer.  At the same time, a pinning service will try to connect to multiaddrs provided by the client in `Pin.origins`.  This ensures data transfer starts immediately (without waiting for provider discovery over DHT), and mutual direct dial between a client and a service works around peer routing issues in restrictive network topologies, such as NATs, firewalls, etc.  **NOTE:** Connections to multiaddrs in `origins` and `delegates` arrays should be attempted in best-effort fashion, and dial failure should not fail the pinning operation. When unable to act on explicit provider hints, DHT and other discovery methods should be used as a fallback by a pinning service.  **NOTE:** All multiaddrs MUST end with `/p2p/{peerID}` and SHOULD be fully resolved and confirmed to be dialable from the public internet. Avoid sending addresses from local networks.  # Custom metadata Pinning services are encouraged to add support for additional features by leveraging the optional `Pin.meta` and `PinStatus.info` fields. While these attributes can be application- or vendor-specific, we encourage the community at large to leverage these attributes as a sandbox to come up with conventions that could become part of future revisions of this API. ## Pin metadata String keys and values passed in `Pin.meta` are persisted with the pin object.  Potential uses: - `Pin.meta[app_id]`: Attaching a unique identifier to pins created by an app enables filtering pins per app via `?meta={\"app_id\":<UUID>}` - `Pin.meta[vendor_policy]`: Vendor-specific policy (for example: which region to use, how many copies to keep)  Note that it is OK for a client to omit or ignore these optional attributes; doing so should not impact the basic pinning functionality.  ## Pin status info Additional `PinStatus.info` can be returned by pinning service.  Potential uses: - `PinStatus.info[status_details]`: more info about the current status (queue position, percentage of transferred data, summary of where data is stored, etc); when `PinStatus.status=failed`, it could provide a reason why a pin operation failed (e.g. lack of funds, DAG too big, etc.) - `PinStatus.info[dag_size]`: the size of pinned data, along with DAG overhead - `PinStatus.info[raw_size]`: the size of data without DAG overhead (eg. unixfs) - `PinStatus.info[pinned_until]`: if vendor supports time-bound pins, this could indicate when the pin will expire  # Pagination and filtering Pin objects can be listed by executing `GET /pins` with optional parameters:  - When no filters are provided, the endpoint will return a small batch of the 10 most recently created items, from the latest to the oldest. - The number of returned items can be adjusted with the `limit` parameter (implicit default is 10). - If the value in `PinResults.count` is bigger than the length of `PinResults.results`, the client can infer there are more results that can be queried. - To read more items, pass the `before` filter with the timestamp from `PinStatus.created` found in the oldest item in the current batch of results. Repeat to read all results. - Returned results can be fine-tuned by applying optional `after`, `cid`, `name`, `status`, or `meta` filters.  > **Note**: pagination by the `created` timestamp requires each value to be globally unique. Any future considerations to add support for bulk creation must account for this.  
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from './ApiClient';
import Failure from './model/Failure';
import FailureError from './model/FailureError';
import Pin from './model/Pin';
import PinResults from './model/PinResults';
import PinStatus from './model/PinStatus';
import Status from './model/Status';
import TextMatchingStrategy from './model/TextMatchingStrategy';
import PinsApi from './api/PinsApi';


/**
* _About_this_specThe_IPFS_Pinning_Service_API_is_intended_to_be_an_implementation_agnostic_APIx3a__For_use_and_implementation_by_pinning_service_providers__For_use_in_client_mode_by_IPFS_nodes_and_GUI_based_applications_Note_while_ready_for_implementation_this_spec_is_still_a_work_in_progress___Your_input_and_feedback_are_welcome_and_valuable_as_we_develop_this_API_spec__Please_join_the_design_discussion_at__github_com_ipfs_pinning_services_api_spec_https__github_com_ipfs_pinning_services_api_spec__SchemasThis_section_describes_the_most_important_object_types_and_conventions_A_full_list_of_fields_and_schemas_can_be_found_in_the_schemas_section_of_the__YAML_file_https__github_com_ipfs_pinning_services_api_spec_blob_master_ipfs_pinning_service_yaml__Identifiers_cid_Content_Identifier__CID_https__docs_ipfs_io_concepts_content_addressing__points_at_the_root_of_a_DAG_that_is_pinned_recursively__requestidUnique_identifier_of_a_pin_request_When_a_pin_is_created_the_service_responds_with_unique_requestid_that_can_be_later_used_for_pin_removal__When_the_same_cid_is_pinned_again_a_different_requestid_is_returned_to_differentiate_between_those_pin_requests_Service_implementation_should_use_UUID_hash_accessTokenPinPinStatus_created_or_any_other_opaque_identifier_that_provides_equally_strong_protection_against_race_conditions__Objects_Pin_object_pin_object_https__bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq_ipfs_dweb_link_pin_pngThe_Pin_object_is_a_representation_of_a_pin_request_It_includes_the_cid_of_data_to_be_pinned_as_well_as_optional_metadata_in_name_origins_and_meta__Pin_status_response_pin_status_response_object_https__bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq_ipfs_dweb_link_pinstatus_pngThe_PinStatus_object_is_a_representation_of_the_current_state_of_a_pinning_operation_It_includes_the_original_pin_object_along_with_the_current_status_and_globally_unique_requestid_of_the_entire_pinning_request_which_can_be_used_for_future_status_checks_and_management__Addresses_in_the_delegates_array_are_peers_delegated_by_the_pinning_service_for_facilitating_direct_file_transfers__more_details_in_the_provider_hints_section__Any_additional_vendor_specific_information_is_returned_in_optional_info__The_pin_lifecycle_pinning_service_objects_and_lifecycle_https__bafybeideck2fchyxna4wqwc2mo67yriokehw3yujboc5redjdaajrk2fjq_ipfs_dweb_link_lifecycle_png_Creating_a_new_pin_objectThe_user_sends_a_Pin_object_to_POST__pins_and_receives_a_PinStatus_response__requestid_in_PinStatus_is_the_identifier_of_the_pin_operation_which_can_can_be_used_for_checking_status_and_removing_the_pin_in_the_future__status_in_PinStatus_indicates_the_current_state_of_a_pin_Checking_status_of_in_progress_pinningstatus__in_PinStatus_may_indicate_a_pending_state__queued_or_pinning__This_means_the_data_behind_Pin_cid_was_not_found_on_the_pinning_service_and_is_being_fetched_from_the_IPFS_network_at_large_which_may_take_time_In_this_case_the_user_can_periodically_check_pinning_progress_via_GET__pins_requestid_until_pinning_is_successful_or_the_user_decides_to_remove_the_pending_pin__Replacing_an_existing_pin_objectThe_user_can_replace_an_existing_pin_object_via_POST__pins_requestid__This_is_a_shortcut_for_removing_a_pin_object_identified_by_requestid_and_creating_a_new_one_in_a_single_API_call_that_protects_against_undesired_garbage_collection_of_blocks_common_to_both_pins__Useful_when_updating_a_pin_representing_a_huge_dataset_where_most_of_blocks_did_not_change__The_new_pin_object_requestid_is_returned_in_the_PinStatus_response__The_old_pin_object_is_deleted_automatically__Removing_a_pin_objectA_pin_object_can_be_removed_via_DELETE__pins_requestid__Provider_hintsA_pinning_service_will_use_the_DHT_and_other_discovery_methods_to_locate_pinned_content_however_it_is_a_good_practice_to_provide_additional_provider_hints_to_speed_up_the_discovery_phase_and_start_the_transfer_immediately_especially_if_a_client_has_the_data_in_their_own_datastore_or_already_knows_of_other_providers_The_most_common_scenario_is_a_client_putting_its_own_IPFS_nodes_multiaddrs_in_Pin_origins__and_then_attempt_to_connect_to_every_multiaddr_returned_by_a_pinning_service_in_PinStatus_delegates_to_initiate_transfer___At_the_same_time_a_pinning_service_will_try_to_connect_to_multiaddrs_provided_by_the_client_in_Pin_origins_This_ensures_data_transfer_starts_immediately__without_waiting_for_provider_discovery_over_DHT_and_mutual_direct_dial_between_a_client_and_a_service_works_around_peer_routing_issues_in_restrictive_network_topologies_such_as_NATs_firewalls_etc_NOTE_Connections_to_multiaddrs_in_origins_and_delegates_arrays_should_be_attempted_in_best_effort_fashion_and_dial_failure_should_not_fail_the_pinning_operation__When_unable_to_act_on_explicit_provider_hints_DHT_and_other_discovery_methods_should_be_used_as_a_fallback_by_a_pinning_service_NOTE_All_multiaddrs_MUST_end_with__p2p_peerID_and_SHOULD_be_fully_resolved_and_confirmed_to_be_dialable_from_the_public_internet__Avoid_sending_addresses_from_local_networks__Custom_metadataPinning_services_are_encouraged_to_add_support_for_additional_features_by_leveraging_the_optional_Pin_meta_and_PinStatus_info_fields__While_these_attributes_can_be_application__or_vendor_specific_we_encourage_the_community_at_large_to_leverage_these_attributes_as_a_sandbox_to_come_up_with_conventions_that_could_become_part_of_future_revisions_of_this_API__Pin_metadataString_keys_and_values_passed_in_Pin_meta_are_persisted_with_the_pin_object_Potential_uses__Pin_meta_app_id_Attaching_a_unique_identifier_to_pins_created_by_an_app_enables_filtering_pins_per_app_via_metaapp_idUUID__Pin_meta_vendor_policy_Vendor_specific_policy__for_example_which_region_to_use_how_many_copies_to_keepNote_that_it_is_OK_for_a_client_to_omit_or_ignore_these_optional_attributes_doing_so_should_not_impact_the_basic_pinning_functionality__Pin_status_infoAdditional_PinStatus_info_can_be_returned_by_pinning_service_Potential_uses__PinStatus_info_status_details_more_info_about_the_current_status__queue_position_percentage_of_transferred_data_summary_of_where_data_is_stored_etc_when_PinStatus_statusfailed_it_could_provide_a_reason_why_a_pin_operation_failed__e_g__lack_of_funds_DAG_too_big_etc___PinStatus_info_dag_size_the_size_of_pinned_data_along_with_DAG_overhead__PinStatus_info_raw_size_the_size_of_data_without_DAG_overhead__eg__unixfs__PinStatus_info_pinned_until_if_vendor_supports_time_bound_pins_this_could_indicate_when_the_pin_will_expire_Pagination_and_filteringPin_objects_can_be_listed_by_executing_GET__pins_with_optional_parameters__When_no_filters_are_provided_the_endpoint_will_return_a_small_batch_of_the_10_most_recently_created_items_from_the_latest_to_the_oldest___The_number_of_returned_items_can_be_adjusted_with_the_limit_parameter__implicit_default_is_10___If_the_value_in_PinResults_count_is_bigger_than_the_length_of_PinResults_results_the_client_can_infer_there_are_more_results_that_can_be_queried___To_read_more_items_pass_the_before_filter_with_the_timestamp_from_PinStatus_created_found_in_the_oldest_item_in_the_current_batch_of_results__Repeat_to_read_all_results___Returned_results_can_be_fine_tuned_by_applying_optional_after_cid_name_status_or_meta_filters__Note_pagination_by_the_created_timestamp_requires_each_value_to_be_globally_unique__Any_future_considerations_to_add_support_for_bulk_creation_must_account_for_this_.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var IpfsPinningServiceApi = require('index'); // See note below*.
* var xxxSvc = new IpfsPinningServiceApi.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new IpfsPinningServiceApi.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new IpfsPinningServiceApi.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new IpfsPinningServiceApi.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 1.0.0
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The Failure model constructor.
     * @property {module:model/Failure}
     */
    Failure,

    /**
     * The FailureError model constructor.
     * @property {module:model/FailureError}
     */
    FailureError,

    /**
     * The Pin model constructor.
     * @property {module:model/Pin}
     */
    Pin,

    /**
     * The PinResults model constructor.
     * @property {module:model/PinResults}
     */
    PinResults,

    /**
     * The PinStatus model constructor.
     * @property {module:model/PinStatus}
     */
    PinStatus,

    /**
     * The Status model constructor.
     * @property {module:model/Status}
     */
    Status,

    /**
     * The TextMatchingStrategy model constructor.
     * @property {module:model/TextMatchingStrategy}
     */
    TextMatchingStrategy,

    /**
    * The PinsApi service constructor.
    * @property {module:api/PinsApi}
    */
    PinsApi
};
