import { IReturnError, IReturnSuccess } from 'lib/types/http'
import { ICategory } from 'lib/types/product/category'

interface TReturnGetAllProductsSuccess extends IReturnSuccess {
  data: ICategory[]
}

type TGetAllCategories = () => Promise<TReturnGetAllProductsSuccess | IReturnError>

export const getAllCategories: TGetAllCategories = async () => {
  const res = await fetch('/api/category')
  const { data, error }: { data: ICategory[], error: string } = await res.json()

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