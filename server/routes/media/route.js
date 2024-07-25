const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {z, ZodError} = require('zod')

const auth = require('../utilities/authMiddleware')
const upload = require('../utilities/uploadMiddleware')
const Model = require('../../models/media')
const validSchema = require('../../schemas/mediaSchema')

router.get('/', auth, async (req, res) => {
  try {
    const sortBy = req.query.sortBy ?? '_id'
    const limit = req.query.limit ?? 0
    const page = req.query.page ?? 1
    const search = req.query.search ?? null
    const sort = req.query.sort ?? 'desc'
    const skip = (page - 1) * limit
    let find = {}

    if (search && search !== '') {
      find = { name: new RegExp(`^${search}`, 'i') }
    }

    const get = await Model.find(find)
      .sort({ [sortBy]: sort })
      .skip(skip)
      .limit(limit)

    const total = await Model.countDocuments(find)

    let totalPages = Math.ceil(parseInt(total) / ( parseInt(limit)??1)) 
    
    const data = { data: get, metadata: { total: total, page: page, totalPages: totalPages } }

    return res.status(200).send(data)
  } catch (e) {
    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors: e.flatten()
      })  
    res.status(500)

    return res.send({ message: 'Server error' })
  }
})

router.post('/upload', [auth,upload.single("file")], async (req, res) => {
  try{
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({ message: 'File uploaded successfully', filename: req.file.filename, path: '/public/uploads/'+req.file.filename});
  
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

router.post('/create', auth, async (req, res) => {
  try {
    // console.log(req.body, 'check body')
    const validatedData = validSchema.safeParse(req.body)
    if(!validatedData?.success)
      {
        return res.status(400).json({
          message: 'Validation error',
          errors: validatedData.error.flatten()
        })  
      }

    //  check if industry name already exists
    const alreadyExists = await Model.findOne({ name: validatedData.data.name })

    if (alreadyExists) {
      return res.status(400).json({ message: 'Name already exists!' })
    }

    const newEntry = new Model(validatedData.data)
    await newEntry.save()

    return res.status(201).send(newEntry)
  } catch (e) {
    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors: e.flatten()
      })  

    res.status(500)

    return res.send({ message: 'Server error' })
  }
})

module.exports = router
