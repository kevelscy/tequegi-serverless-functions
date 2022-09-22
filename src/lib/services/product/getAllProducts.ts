import { IReturnError, IReturnSuccess } from "lib/types/http"

interface TReturnGetAllProductsSuccess extends IReturnSuccess {
  data: any
}

type TGetAllProducts = () => Promise<TReturnGetAllProductsSuccess | IReturnError>

export const getAllProducts: TGetAllProducts = async () => {
  const res = await fetch('/api/product')

  if (!res.ok) {
    return {
      data: null,
      error: {
        status: res.status,
        message: 'Sign In Error Fetch'
      }
    }
  }

  const { data }: any = await res.json()

  return {
    data,
    error: null
  }
}