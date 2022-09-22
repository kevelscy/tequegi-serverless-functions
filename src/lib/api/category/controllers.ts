import { NextApiRequest, NextApiResponse } from 'next'

import { normalizeCategoryProductsTitle } from 'lib/utils/normalizeCategoryProductsTitle'
import { CategoryModel } from 'lib/db/models/Category'
import { ProductModel } from 'lib/db/models/Product'

export const getAllCategories = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('getAllCategories api')
    const categories = await CategoryModel.find().populate('products', 'title -_id')
    const categoriesNormalized = categories.map(category => normalizeCategoryProductsTitle(category.toJSON()))

    return res.status(200).json({
      data: categoriesNormalized,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_ALL_CATEGORIES_ERROR - ${err}`
    })
  }
}

export const getCategoryById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(422).json({
        data: null,
        error: 'FIELDS_MISSING'
      })
    }

    const categoryFounded = await CategoryModel.findById(id).populate('products', 'title')

    if (!categoryFounded) {
      return res.status(404).json({
        data: null,
        error: 'CATEGORY_NOT_FOUND'
      })
    }

    const categoriesNormalized = normalizeCategoryProductsTitle(categoryFounded.toJSON())

    return res.status(200).json({
      data: categoriesNormalized,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_CATEGORY_BY_ID_ERROR - ${err}`
    })
  }
}

export const createCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const category = req.body

    if (!category.title || !category.description || category.published === undefined) {
      return res.status(422).json({
        data: null,
        error: 'FIELDS_MISSING'
      })
    }

    const categoryExists = await CategoryModel.exists({ title: category.title })

    if (categoryExists) {
      return res.status(409).json({
        data: null,
        error: 'CATEGORY_EXISTS'
      })
    }

    const newCategory = new CategoryModel({
      title: category.title,
      description: category.description,
      published: category.published,
      products: category.products || []
    })
    
    if (!newCategory) {
      return res.status(403).json({
        data: null,
        error: 'NEW_CATEGORY_ERROR'
      })
    }

    await newCategory.save()

    return res.status(200).json({
      data: newCategory,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_CATEGORY - ${err}`
    })
  }
}

export const updateCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, title, description, published } = req.body

    if (!id || !title || !description || !published === undefined) {
      return res.status(422).json({
        data: null,
        error: 'ID_FIELD_MISSING'
      })
    }

    const categoryUpdated = await CategoryModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        published
      },
      { new: true }
    ).populate('products', 'title')

    const categoriesNormalized = normalizeCategoryProductsTitle(categoryUpdated.toJSON())

    if (!categoryUpdated) {
      return res.status(500).json({
        data: null,
        error: 'CATEGORY_UPDATED_ERROR'
      })
    }

    return res.status(200).json({
      data: categoriesNormalized,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_CATEGORY - ${err}`
    })
  }
}

export const deleteCategoryById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    
    if (!id) {
      return res.status(422).json({
        data: null,
        error: 'FIELDS_MISSING'
      })
    }

    const categoryFinded = await CategoryModel.findById(id)

    if (categoryFinded) {
      if (categoryFinded.title === 'none') {
        return res.status(403).json({
          data: null,
          error: 'CATEGORY_NONE_CAN_NOT_BE_DELETE'
        })
      }
    }
  
    const categoryDeleted = await CategoryModel.findByIdAndDelete(id)
  
    if (!categoryDeleted) {
      return res.status(500).json({
        data: null,
        error: 'CATEGORY_NOT_DELETED'
      })
    }

    const categoryDefaultFinded = await CategoryModel.findOne({ title: 'none' })

    if (!categoryDefaultFinded) {
      return res.status(500).json({
        data: null,
        error: 'CATEGORY_NONE_NOT_FINDED'
      })
    }

    await ProductModel.updateMany(
      { category: id },
      { category: categoryDefaultFinded._id || categoryDefaultFinded.id },
      { new: true }
    )

    return res.status(200).json({
      data: true,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `DELETE_CATEGORY - ${err}`
    })
  }
}
