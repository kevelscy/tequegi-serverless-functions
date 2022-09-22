export const normalizeCategoryProductsTitle = (categoryToNormalize) => {
  const userToReturn = {...categoryToNormalize}

  if (userToReturn.products || userToReturn.products.lenght > 0) {
    userToReturn.products = categoryToNormalize.products.map(product => product.title)
  } else {
    userToReturn.products = []
  }

  return userToReturn
}
