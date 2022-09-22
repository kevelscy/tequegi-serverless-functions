// import { decodeAccessToken } from 'lib/utils/decodeAccessToken'
import { IReturnFetch } from 'lib/types/http'
import { IAuth, IUserToSignIn } from 'lib/types/user'

interface TReturnSignInSuccess extends IReturnFetch {
  data: IAuth
}

type TSignIn = (userToSignIn: IUserToSignIn) => Promise<TReturnSignInSuccess>

export const signIn: TSignIn = async (userToSignIn) => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(userToSignIn)
  })

  const { data, error } = await res.json()

  return { data, error }
}
