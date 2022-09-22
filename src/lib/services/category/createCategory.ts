// import { decodeAccessToken } from 'lib/utils/decodeAccessToken'
import { IReturnFetch } from 'lib/types/http'
import { ICategoryToCreate, ICategory } from 'lib/types/product/category'

interface TReturnSignInSuccess extends IReturnFetch {
  data: ICategory
}

type TSignIn = (category: ICategoryToCreate) => Promise<TReturnSignInSuccess>

export const createCategory: TSignIn = async (category) => {
  const res = await fetch('/api/category', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(category)
  })

  const { data, error } = await res.json()

  return { data, error }
}