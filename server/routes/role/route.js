"use strict"
const express = require('express')
const router = express.Router()
const {z, ZodError } = require('zod')

const auth = require('../utilities/authMiddleware')
const Model = require('../../models/role')

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


module.exports = router
