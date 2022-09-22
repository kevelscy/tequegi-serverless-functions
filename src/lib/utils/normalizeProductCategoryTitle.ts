export const normalizeProductCategoryTitle = (productToNormalize) => {
  const userToReturn = {...productToNormalize}

  if (userToReturn.category) {
    userToReturn.category = productToNormalize.category.title
  } else {
    userToReturn.category = null
  }

  return userToReturn
}
