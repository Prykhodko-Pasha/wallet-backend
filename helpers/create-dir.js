const fs = require('fs').promises

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}
const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder, { recursive: true })
  }
}

module.exports = createFolderIsNotExist
