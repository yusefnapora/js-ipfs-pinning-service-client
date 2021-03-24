

export class ApiClient {
  basePath: string
  authentications: object
  defaultHeaders: object
  timeout: number
  cache: boolean
  enableCookies: boolean
  requestAgent?: string
}

type TextMatchingStrategy = 'exact' | 'iexact' | 'partial' | 'ipartial' 
type Status = 'queued' | 'pinning' | 'pinned' | 'failed'


interface PinsGetOptions {
  cid?: Array<string>
  name?: string
  match?: TextMatchingStrategy
  status?: Array<Status>
  before?: Date
  after?: Date
  limit?: Number
  meta?: Object
}

interface Pin {
  cid: string
  name?: string
  origins?: Array<string>
  meta?: Object
}

interface PinStatus {
  requestid: string
  created: Date
  pin: Pin
  delegates?: Array<string>
  info?: Object
}

interface PinResults {
  count: number
  results: Array<PinStatus>
}

export class PinsApi {
  constructor(client: ApiClient)

  pinsGet(opts?: PinsGetOptions): Promise<PinResults>

  pinsRequestidGet(requestid: string): Promise<PinStatus>

  pinsPost(pin: Pin): Promise<PinStatus>

  pinsRequestidPost(requestid: string, pin: Pin): Promise<PinStatus>

  pinsRequestidDelete(requestid: string): Promise<void>
}