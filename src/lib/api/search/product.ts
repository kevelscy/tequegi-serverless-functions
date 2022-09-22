import { NextApiRequest, NextApiResponse } from 'next'

import 'lib/db/models/Category'
import { ProductModel } from 'lib/db/models/Product'

export const searchProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  const agg = [
    // {$search: {autocomplete: {query: 'ger', path: 'title'}}},
      {
        $search: {
          index: 'search_product',
          text: {
            query: 'Pastelit',
            path: 'title'
          },
          highlight: {
            path: 'title',
          }
        }
      }
  ]

  const result = await ProductModel.aggregate(agg)

  console.log(result)
  // await result.forEach((doc) => console.log(doc))

  return res.status(500).json({
    data: result,
    error: null
  })
}