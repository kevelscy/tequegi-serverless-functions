import { IProduct, IProductToCreate } from 'lib/types/product'
import { IReturnError, IReturnSuccess } from 'lib/types/http'

interface TReturnCreateProductSuccess extends IReturnSuccess {
  data: IProduct
}

export type TCreateProduct = (newProduct: IProductToCreate, token: string) => Promise<TReturnCreateProductSuccess | IReturnError>

export const createProduct: TCreateProduct = async (newProduct, token) => {
  const formData = new FormData()
  const entries = Object.entries(newProduct)

  entries.forEach(([key, value]) => {
    if (key === 'image') {
      // return formData.append(key, 'Imagen')
      return formData.append(key, value)
    }

    formData.append(key, JSON.stringify(value))
  })

  const res = await fetch('/api/product/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
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
    data: data,
    error: null
  }
}
