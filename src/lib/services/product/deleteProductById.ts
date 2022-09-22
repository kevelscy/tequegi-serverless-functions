import { IReturnError, IReturnSuccess } from "lib/types/http"

interface TReturnGetAllProductsSuccess extends IReturnSuccess {
  data: boolean
}

type TDeleteProductById = (id: string, token: string) => Promise<TReturnGetAllProductsSuccess | IReturnError>

export const deleteProductById: TDeleteProductById = async (id: string, token: string) => {
  console.log({ id, token })

  return  {
    data: 'nice',
    error: null
  }

  // const res = await fetch(`/api/product/${id}`, {
  //   method: 'DELETE',
  //   headers: { Authorization: `Bearer ${token}` },
  // })

  // const { data, error } = await res.json()

  // if (error) {
  //   return {
  //     data: null,
  //     error: {
  //       status: res.status,
  //       message: error
  //     }
  //   }
  // }

  // return {
  //   data,
  //   error: null
  // }
}