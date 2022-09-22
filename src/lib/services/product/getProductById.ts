import { IReturnError, IReturnSuccess } from 'lib/types/http'
import { IProduct } from 'lib/types'

interface TReturnGetAllProductsSuccess extends IReturnSuccess {
  data: IProduct
}

type TGetAllProducts = (id: string) => Promise<TReturnGetAllProductsSuccess | IReturnError>

export const getProductById: TGetAllProducts = async (id) => {
  const res = await fetch(`/api/product/${id}`)
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