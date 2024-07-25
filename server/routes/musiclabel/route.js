const express = require('express')
const router = express.Router()
const { ZodError } = require('zod')

const auth = require('../utilities/authMiddleware')
const Model = require('../../models/musiclebel')
const validSchema = require('../../schemas/musiclabelSchema')
// const LicenceModel = require("../../models/licence") 

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

    const get = await Model.find(find).populate('licence')
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
    console.log(e)
    return res.send({ message: 'Server error' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const get = await Model.findById(id)

    const data = { data: get }

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

router.put('/:id', auth, async (req, res) => {
  try {
    const validatedData = validSchema.safeParse(req.body)
    if(!validatedData?.success)
      {
        return res.status(400).json({
          message: 'Validation error',
          errors: validatedData.error.flatten()
        })  
      }
    const id = req.params.id
    const get = await Model.findById(id)
    if (!get) {
      return res.status(400).send({ message: 'Invalid music label' })
    }

    // check if same name already exists
    // const alreadyExists = await Model.findOne({ name: validatedData.data.name })
    // if (alreadyExists) {
    //   return res.status(400).send({ message: 'Music label already exists' })
    // }

    const update = await Model.findByIdAndUpdate(id, { name: validatedData.data.name, licence: validatedData.data.licence})

    return res.status(200).send(update)
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
    console.log(req.body)
    //  check if industry name already exists
    const alreadyExists = await Model.findOne({ name: validatedData.data.name })

    if (alreadyExists) {
      return res.status(400).json({ message: 'Music Label already exists!' })
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
