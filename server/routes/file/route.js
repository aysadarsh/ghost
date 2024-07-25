const express = require('express')
const router = express.Router()
const { ZodError} = require('zod')
const auth = require('../utilities/authMiddleware')
const upload = require('../utilities/uploadMiddleware')
require('dotenv').config()

  router.post('/upload', [auth,upload.single("file")], async (req, res) => {
    try{
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const filepath = process.env.UPLOAD_PATH + req.file.filename;
      res.json({ message: 'File uploaded successfully', filename: req.file.filename, path:filepath });
    
    } catch (e) {
      if(e instanceof ZodError)
        return res.status(400).json({
          message: 'Validation error',
          errors: e.flatten()
        })  
      res.status(500)
      console.log(e)
      return res.send({ message: 'Server error' })
    }
  })
  

  
  module.exports = router
  