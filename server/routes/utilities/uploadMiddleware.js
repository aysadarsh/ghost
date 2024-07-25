const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    console.log(file)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.mp3' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.png' && ext !== '.csv' && ext !== '.pdf' && ext !== '.docx' && ext !== '.dot' && ext !== '.eml' && ext !== '.docm') {
      return callback(new Error('Only images, csv, pdf, docs and mp3 allowed'))
    }
    callback(null, true)
  }
})

module.exports = upload
