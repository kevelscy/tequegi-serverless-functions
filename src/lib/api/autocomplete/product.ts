import { NextApiRequest, NextApiResponse } from 'next'

import 'lib/db/models/Category'
import { ProductModel } from 'lib/db/models/Product'

export const autocompleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const agg = [
    { $search: { autocomplete: { query: 'Past', path: 'title' } } },
    { $limit: 20 }
  ]
  
    const result = await ProductModel.aggregate(agg)
    await result.forEach((doc) => console.log(doc))
  
    return res.status(200).json({
      data: result,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `AUTOCOMPLETE_PRODUCT - ${err}`
    })
  }
}