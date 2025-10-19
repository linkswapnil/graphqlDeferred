import { gql } from 'graphql-tag';

export const deviceTypeDefs = gql`
  # Error shape from the API
  type ApiError {
    code: Int
    message: String
    status: String
  }

  # Endpoint tuple
  type Endpoint {
    ip: String
    port: Int
  }

  # Collection of service endpoints
  type Endpoints {
    grpc: Endpoint
    http: Endpoint
    web: Endpoint
    ssh: Endpoint
  }

  # Software bank info
  type SoftwareBank {
    name: String
    softwareVersion: String
    updateTimeSeconds: Int
  }

  # Install params
  type InstallParams {
    latitude: Float
    longitude: Float
    height: Float
    heightAgl: Float
    tilt: Float
    antennaAzimuth: Float
  }

  # Core device shape (partial, extend as needed)
  type Device {
    registered: Boolean
    cbrsDevice: Boolean
    id: ID
    serialNumber: String
    macAddress: String
    type: String
    sectorId: Int
    retailerId: Int
    retailerName: String
    softwareVersion: String
    ip: String
    port: Int
    endpoints: Endpoints
    transportSecurity: Boolean
    rebootReason: String
    rebootSecondaryReason: String
    authenticated: Boolean
    minSlaEnforceReason: String
    insecureMode: Boolean
    masterId: String
    masterName: String
    masterSerial: String
    masterSoftwareVersion: String
    installParams: InstallParams
    address: String
    bootTimeSeconds: Int
    uptimeSeconds: Int
    losRange: Int
    bootId: String
    lastUpdateTimeSeconds: Int
    connected: Boolean
    reachable: String
    linkState: String
    linkAttachTimestampMillis: Int
    connectionId: String
    partNumber: String
    loginBanner: String
    activeBank: String
    currentBank: String
    activeBankUpdateTimeSeconds: Int
    currentBankUpdateTimeSeconds: Int
    bootReason: String
    rebootMessage: String
    cloudDisconnectReason: String
    lastCloudDisconnectTimeMillis: Int
    rfBoardSerialNumber: String
    rfBoardPartNumber: String
    digiBoardSerialNumber: String
    digiBoardPartNumber: String

    # Deeply nested structures can be incrementally typed later
    ancestry: JSON

    modelNumber: String
    lastChangeReason: String
    lastChangeSecondaryReason: String
    lastChangeReasonMessage: String
    softwareBanks: [SoftwareBank!]
    sectorName: String
    isOrphan: Boolean
    configPushEnabled: Boolean

    savedConfig: JSON
    reportedConfig: JSON
    reportedState: JSON

    configMismatch: Boolean
    radioOperatorId: Int
    networkProfile: Int
    regulatoryDomain: String
    regulatoryCountry: String
    regulatoryInfoVersion: String
    regulatoryInfoCapabilityVersion: String
    radioSetId: Int
    radioCellId: Int
    band: String
    mfgBand: String
    radioSectorId: Int
    svLan: String
    slaClassificationType: String
    hostName: String
    muteMode: Boolean
    radioNetworkUp: Boolean
    managementSubnet: String
    managementSubnetMask: String
    multiCarrierModeBn: String
    multiCarrierModeRn: String
    slaProfile: String
    dataVlan: Int
    cVlan: [Int!]
    dpuManagementVlan: Int
    vlanMode: Int
    vlanSubscriberAwarenessEnabled: Boolean
    rnTransmitPower: Int
    bnTransmitPower: Int
    managementVlan: Int
    cpiId: String
    notes: String
    isCbrsDevice: Boolean
    usesDynamicSpectrum: Boolean
    grantStatus: String
    firstSeenTimeSeconds: Int
    updatedBy: String
    customAttributes: JSON
    bnPriorityList: [BnPriorityItem!]
    preferredBn: String
    preferredBnHostName: String
    preferredBnEnabled: Boolean
    autoReconnectToPreferredBnEnabled: Boolean
    previousPreferredBn: String
    autoMuteBnRadioDelayEnabled: Boolean
    autoMuteBnRadioDelaySeconds: Int
    lastDisconnectTimeNanos: Int
    downDurationMillis: Int
    excludeDurationMillis: Int
    connectionUptimeSeconds: Int
    dhcpRelayAgentEnabled: Boolean
    remoteIdentifierType: String
    circuitIdentifierType: String
    dhcpV6RelayAgentEnabled: Boolean
    dhcpV6InterfaceIdentifierTypeEnabled: Boolean
    dhcpV6RemoteIdentifierTypeEnabled: Boolean
    dhcpV6RemoteIdentifierType: String
    dhcpV6InterfaceIdentifierType: String
    warrantyStartSeconds: Int
    warrantyExpirySeconds: Int
    preferredBnSearchTimeoutSeconds: Int
    preferredBnResetTimeSeconds: Int
    lastConnectionTimeSeconds: Int
    telemetryCollector: TelemetryCollector
    radioOperationalStatus: Int
    version: Int
    frameOffsetMicroseconds: Int
    gpsLockStatus: Int
    gpsAvailable: Boolean
    trrcVersion: Int
    downstreamArp: Int
    autoDialOutSupported: Boolean
    customSlaConfigAllowed: Boolean
    bufferAllocationProfile: Int
    localAccessPortEnabled: Boolean
    remoteAccessPortEnabled: Boolean
    webLocalAccessPortEnabled: Boolean
    webUiAdminUserEnabled: Boolean
    overrideLocalAccessPortEnabled: Boolean
    overrideRemoteAccessPortEnabled: Boolean
    overrideWebLocalAccessPortEnabled: Boolean
    overrideWebUiAdminUserEnabled: Boolean
    multicastMode: MulticastMode
    firstNetworkEntryTime: NetworkEntryTime
    latestNetworkEntryTime: NetworkEntryTime
    targetRxsi: Int
    macTableAlarmThreshold: Int
    operatorIdStatus: Int
    capabilities: [String!]
    mfgPartNumber: String
    licenseDetails: LicenseDetails
    currentLicenseState: String
    licenseControlMode: String
    rnCountRestrictedSupportLimit: Int
    rnCountIncrementPerLicense: Int
    rnCountMinimumForUnrestricted: Int
    spectrumProviderConfig: SpectrumProviderConfig
  }

  type BnPriorityItem {
    serialNumber: String
    hostName: String
  }

  type TelemetryCollector {
    id: String
    name: String
    host: String
    port: Int
    intervalSeconds: Int
    authMethod: Int
    encryptedAccessKey: String
    accessKeyHash: String
    enabled: Boolean
  }

  type MulticastMode {
    slaacEnabled: Boolean
  }

  type NetworkEntryTime {
    totalTimeMillis: Int
    searchTimeMillis: Int
    searchRetryCount: Int
    radioCalibrationTimeMillis: Int
    radioCalibrationRetryCount: Int
    rachTimeMillis: Int
    rachRetryCount: Int
    linkSetupTimeMillis: Int
    linkSetupRetryCount: Int
    linkAuthTimeMillis: Int
    linkAuthRetryCount: Int
  }

  type LicenseDetails {
    allowedRnCount: Int
    expansionLicenseCount: Int
    unlockLicenseCount: Int
    graceStartedTimeSeconds: Int
  }

  type SpectrumProviderConfig {
    sasProvider: String
    afcsProvider: String
    fccOrId: String
  }

  # Wrapper response from the API
  type DeviceResponse {
    data: Device
    error: ApiError
  }

  # List response wrapper for devices
  type DeviceListResponse {
    data: [Device!]!
    offset: Int!
    totalCount: Int!
  }

  # Spectrum data request input (used by queries)
  input SpectrumDataInput {
    deviceSerialNumbers: [String!]!
    eirpCarrier0: Boolean
    eirpCarrier1: Boolean
    eirpCarrier2: Boolean
    eirpCarrier3: Boolean
    palCount: Boolean
    reason: Boolean
    status: Boolean
  }

  # Spectrum data returned from SDS (shape may vary by request)
  type SpectrumData {
    eirpCarrier0: JSON
    eirpCarrier1: JSON
    eirpCarrier2: JSON
    eirpCarrier3: JSON
    palCount: JSON
    reason: JSON
    status: JSON
  }

  # Combined device + spectrum response
  type AllDeviceData {
    device: Device!
    spectrum: SpectrumData!
  }
`;


