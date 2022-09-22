export interface IReturnSuccess {
  data: any
  error: null
}

export interface IReturnError {
  data: any
  error: {
    status: number
    message: string
  }
}

export interface IReturnFetch {
  data: any
  error: {
    status: number
    message: string
  }
}
