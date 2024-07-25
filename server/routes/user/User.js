const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const z = require('zod')
const { ZodError } = require('zod')

const auth = require('../utilities/authMiddleware')
const User = require('../../models/user')
const Role = require('../../models/role')

const userSchema = require('../../schemas/userSchema')

const updateValidSchema = require('../../schemas/updateUserSchema')

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

    if(req.query.filterBy && req.query.filter)
      {
        find[req.query.filterBy] =  req.query.filter
      }



    const get = await User.find(find).populate('store')
      .sort({ [sortBy]: sort })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(find)

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

router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req._id)

    if (!user) {
      return res.status(500).json({ status: false, error: ['Unauthorised'] })
    }
    const response = { user: user }

    return res.send(response)
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

router.post('/register', async (req, res) => {
  try {
    const validatedData = userSchema.safeParse(req.body)
    if(!validatedData?.success)
      {
        return res.status(400).json({
          message: 'Validation error',
          errors: validatedData.error.flatten()
        })  
      }

    const roles = await Role.find({ name: { $in: validatedData.roles } })
    if (roles.length !== validatedData.roles.length) {
      return res.status(400).json({
        message: 'Some roles are invalid'
      })
    }

    // Map role names to role IDs
    const roleIds = roles.map((role) => role._id)
    validatedData.roles = roleIds

    // create new user
    const user = new User(validatedData)
    await user.save()

    return res.status(201).send(user)
  } catch (e) {
    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors: e.flatten()
      })  
    // Other errors
    res.status(500).send('Server error')
  }
})

router.post('/create', async (req, res) => {
  try {
    console.log(req.body)
    const validatedData = userSchema.safeParse(req.body)
    req.body.roles = [req.body.role]
    const fineData = req.body
    if(!validatedData?.success)
      {
        return res.status(400).json({
          message: 'Validation error',
          errors: validatedData.error.flatten()
        })  
      }
    

    const roles = await Role.find({ _id: { $in: req.body.roles } })
    if (!roles) {
      return res.status(400).json({
        message: 'Some roles are invalid'
      })
    }

    // unique username check
    const findUsername = await User.findOne({username:req.body.username});
    console.log(findUsername, "find username")
    if (findUsername) {
      return res.status(400).json({
        message: 'Username is already taken'
      })
    }

    // unique email check
    const findEmail = await User.findOne({email:req.body.email});
    if (findEmail) {
      return res.status(400).json({
        message: 'Email is already registred'
      })
    }

    console.log(findEmail, {email:req.body.email})

    // Map role names to role IDs
    const roleIds = roles.map((role) => role._id)
    fineData.roles = roleIds

    // create new user
    const user = new User(fineData)
    await user.save()

    return res.status(201).send(user)
  } catch (e) {

    if(e instanceof mongoose.Error.ValidationError)
    {
      return res.status(400).json({
        message: 'Validation error',
        errors: "insert error"
      }) 
    }

    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors: e.error.flatten()
      })  
      console.log(e,  "check")
    // Other errors
    return res.status(500).send('Server error')
  }
})


router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const get = await User.findById(id)

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
    req.body.roles = [req.body.role]
    const validatedData = updateValidSchema.safeParse(req.body)
    if(!validatedData?.success)
      {
        return res.status(400).json({
          message: 'Validation error',
          errors: validatedData.error.flatten()
        })  
      }
    const id = req.params.id
    const get = await User.findById(id)
    if (!get) {
      return res.status(400).send({ message: 'Invalid brand' })
    }

    // // check if same name already exists
    // const alreadyExists = await Model.findOne({ name: validatedData.data.name })
    // if (alreadyExists) {
    //   return res.status(400).send({ message: 'city already exists' })
    // }
    const {_id, ...updatedForm} = req.body
    
    const update = await User.findByIdAndUpdate(id, updatedForm)

    return res.status(200).send(update)
  } catch (e) {
    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors: e.flatten()
      })  
    res.status(500)
    console.log(e, "dkahdkashdjasgdjasgd")

    return res.send({ message: 'Server error' })
  }
})

module.exports = router
