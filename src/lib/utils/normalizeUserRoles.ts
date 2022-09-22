export const normalizeUserRoles = (userToNormalize) => {
  const userToReturn = {...userToNormalize}
  userToReturn.roles = userToNormalize.roles.map(role => role.name)

  return userToReturn
}
