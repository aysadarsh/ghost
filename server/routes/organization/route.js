"use strict"
const express = require('express')
const router = express.Router()
const {z, ZodError } = require('zod')

const auth = require('../utilities/authMiddleware')
const Model = require('../../models/organization')
const validSchema = require('../../schemas/organization')

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
      find.name = new RegExp(`^${search}`, 'i') 
    }

    if(req.query.organization)
    {
      find.organization = req.query.organization
    }

    if(req.query.filterBy && req.query.filter)
    {
      find[req.query.filterBy] =  req.query.filter
    }

    const get = await Model.find(find).populate('state')
      .sort({ [sortBy]: sort })
      .skip(skip)
      .limit(limit)

    const total = await Model.countDocuments(find)

    let totalPages = Math.ceil(parseInt(total) / parseInt(limit)) 

    console.log(total, limit)

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
      return res.status(400).send({ message: 'Invalid organization' })
    }

    // // check if same name already exists
    // const alreadyExists = await Model.findOne({ name: validatedData.data.name })
    // if (alreadyExists) {
    //   return res.status(400).send({ message: 'organization already exists' })
    // }

    
    const update = await Model.findByIdAndUpdate(id, req.body)

    console.log(validatedData, "dlkasjdklasjhdklajs")

    return res.status(200).send(update)
  } catch (e) {
    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors: e.flatten()
      })  
    console.log(e,"error")
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
    // console.log(validatedData, "Check validated data")
    //  check if organization name already exists
    const alreadyExists = await Model.findOne({ name: validatedData?.data?.name })

    if (alreadyExists) {
      return res.status(400).json({ message: 'Organization already exists!' })
    }

    const newEntry = new Model(req.body)
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