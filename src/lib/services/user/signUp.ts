import { IReturnSuccess, IReturnError } from 'lib/types/http'
import { IAuth, IUserToSignUp } from 'lib/types/user'

interface TReturnSignUpSuccess extends IReturnSuccess {
  data: IAuth
}

type TSignUp = (userToSignUp: IUserToSignUp) => Promise<TReturnSignUpSuccess | IReturnError>

export const signUp: TSignUp = async (userToSignUp: IUserToSignUp) => {
  const res = await fetch('/api/auth/signUp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...userToSignUp })
  })

  if (!res.ok) {
    return {
      data: null,
      error: {
        status: res.status,
        message: 'Sign In Error Fetch'
      }
    }
  }

  const data: IAuth = await res.json()

  return {
    data,
    error: null
  }
}
