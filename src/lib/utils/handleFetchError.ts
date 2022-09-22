import { toast, TypeOptions } from 'react-toastify'

export const handleFetchError = (status: number, message: string) => {
  console.error('handleFetchError', status, message)
  const typeStatus: TypeOptions = (status >= 200 && status < 300)
    ? 'success'
    : (status >= 300 && status < 500)
      ? 'warning'
      : (status >= 500)
        ? 'error'
        : 'default'

  toast(message, { type: typeStatus })
}
