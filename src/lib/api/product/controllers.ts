import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { normalizeProductCategoryTitle } from 'lib/utils/normalizeProductCategoryTitle'
import { CategoryModel } from 'lib/db/models/Category'
import { ProductModel } from 'lib/db/models/Product'
import { cloudinary } from 'lib/services/cloudinary'
import { slugify } from 'lib/utils/slugify'
import { IProduct } from 'lib/types'

export const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const products = await ProductModel.find().populate('category', 'title -_id')
    const productsNormalized: IProduct[] = products.map(product => normalizeProductCategoryTitle(product.toJSON()))

    return res.status(200).json({
      data: productsNormalized,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_ALL_PRODUCTS_ERROR - ${err}`
    })
  }
}

export const getProductById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    const product = await ProductModel.findById(id).populate('category', 'title -_id')
    const productsNormalized = normalizeProductCategoryTitle(product.toJSON())

    return res.status(200).json({
      data: productsNormalized,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_PRODUCT_BY_ID_ERROR - ${err}`
    })
  }
}

export const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const promise = new Promise<IProduct>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_PRODUCT_FORMIDABLE_PARSE'
        })

        if (!fields.title || !fields.description || !files || !fields.price || fields.published === undefined) {
          return res.status(422).json({
            data: null,
            error: 'FIELDS_MISSING'
          })
        }

        const productExists = await ProductModel.exists({ title: fields.title })

        if (productExists) {
          return res.status(409).json({
            data: null,
            error: 'PRODUCT_EXISTS'
          })
        }

        const imageTitle = slugify(fields.title as string)

        const cloudinaryData = await cloudinary
          .uploader
            .upload(
            // @ts-expect-error
              files.image.filepath,
              { folder: 'products', public_id: `${imageTitle}` }
            )

        const newProduct = new ProductModel({
          title: fields.title,
          description: fields.description,
          price: fields.price,
          image: {
            url: cloudinaryData.url,
            publicId: cloudinaryData.public_id,
            width: cloudinaryData.width,
            height: cloudinaryData.height,
            format: cloudinaryData.format,
          },
          category: 'none',
          published: fields.published
        })

        if (!newProduct) {
          return res.status(403).json({
            data: null,
            error: 'CREATE_PRODUCT_MODEL'
          })
        }

        const categoryExists = await CategoryModel.exists({ title: fields.category })

        if (fields.category) {
          const categoryFounded: any = await CategoryModel.updateOne(
            { title: categoryExists ? fields.category : 'none' },
            { $push: { products: newProduct._id }
          })

          if (categoryFounded) {
            newProduct.category = categoryFounded._id
          }
        }

        const productPopulated = await (await newProduct.save())
          .populate('category', 'title -_id')
          .then((doc: any) => {
            const docObj = doc.toJSON()
            docObj.category = doc.category.title

            return docObj
          })

        if (!productPopulated) {
          return res.status(403).json({
            data: null,
            error: 'CREATE_PRODUCT_POPULATED'
          })
        }

        return resolve(productPopulated)
      })
    })

    const product = await promise

    return res.status(200).json({
      data: product,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_PRODUCT - ${err}`
    })
  }
}

export const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    const product = req.body as IProduct

    if (!id) {
      return res.status(422).json({
        data: null,
        error: 'QUERY_ID_MISSING'
      })
    }

    if (product.image || product.createdAt || product.updatedAt || product.id) {
      return res.status(403).json({
        data: null,
        error: 'FIELD_NOT_ALLOWED'
      })
    }
    console.log('productExists <')

    const productExists = await ProductModel.exists({ _id: id }).catch(err => console.error('err', err))

    console.log('productExists >', productExists)

    if (!productExists) {
      return res.status(409).json({
        data: null,
        error: 'PRODUCT_NOT_EXISTS'
      })
    }

    // if (
    //     !product.title ||
    //     !product.description ||
    //     !product.image ||
    //     !product.price ||
    //     !product.id ||
    //     product.published === undefined
    //   ) {
    //   return res.status(422).json({
    //     data: null,
    //     error: 'FIELDS_MISSING'
    //   })
    // }

    const productToUpdate = { ...product }

    if (product.category) {
      const categoryFinded = await CategoryModel.findOne({ title: product.category })
  
      if (!categoryFinded) {
        return res.status(404).json({
          data: null,
          error: 'CATEGORY_NOT_EXIST'
        })
      }

      productToUpdate.category = categoryFinded.id || categoryFinded._id
    }

    const productUpdated = await ProductModel.findByIdAndUpdate(
      id,
      productToUpdate,
      { new: true }
    ).populate('category', 'title -_id')

    const productsNormalized = normalizeProductCategoryTitle(productUpdated.toJSON())

    return res.status(200).json({
      data: productsNormalized,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_PRODUCT - ${err}`
    })
  }
}

export const deleteProductById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, image, category } = req.body

    if (!id || !image || !category) {
      return res.status(422).json({
        data: null,
        error: 'FIELDS_MISSING'
      })
    }

    const categoryUpdated: any = await CategoryModel.findOneAndUpdate(
      { title: category },
      { $pull: { products: id } },
      { new: true }
    )

    if (!categoryUpdated) {
      return res.status(500).json({
        data: null,
        error: 'CATEGORY_NOT_UPDATED'
      })
    }

    cloudinary.uploader.destroy(image.publicId, (err, result) => {
      if (err) {
        return res.status(500).json({
          data: null,
          error: `CLOUDINARY_DESTROY - ${err}`
        })
      }

      console.log('cloudinary destroy - result', result)
    })

    const productDeleted = await ProductModel.findByIdAndDelete(id)

    if (!productDeleted) {
      return res.status(500).json({
        data: null,
        error: 'PRODUCT_NOT_DELETED'
      })
    }
  
    return res.status(200).json({
      data: true,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `DELETE_PRODUCT_CONTROLLLER - ${err}`
    })
  }
}
