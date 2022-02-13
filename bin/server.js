const app = require('../app')
const db = require('../model/db')
// const path = require('path')
const createFolderIsNotExist = require('../helpers/create-dir')
require('dotenv').config()

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    // const PUBLIC_IMG_DIR = path.join(
    //   process.env.PUBLIC_DIR_NAME,
    //   process.env.IMG_DIR_NAME
    // )
    const UPLOAD_DIR = process.env.UPLOAD_DIR_NAME
    // await createFolderIsNotExist(PUBLIC_IMG_DIR)
    await createFolderIsNotExist(UPLOAD_DIR)

    console.log(`CORS-enabled web server listening on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server is not running. Error message: ${err.message}`)
  process.exit(1)
})
