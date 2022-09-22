
import { IReturnSuccess, IReturnError } from 'lib/types/http'
import { IAuth } from 'lib/types/user'

interface TReturnSignInSuccess extends IReturnSuccess {
  data: IAuth
}

type TGetUserMe = (token: string) => Promise<TReturnSignInSuccess | IReturnError>

export const getUserMe: TGetUserMe = async (token) => {
  const res = await fetch('/api/user/me', {
    headers: { Authorization: `Bearer ${token}` }
  })

  const { data, error } = await res.json()

  if (error) {
    return {
      data: null,
      error: {
        status: res.status,
        message: error
      }
    }
  }

  return {
    data,
    error: null
  }
}
