const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {z, ZodError} = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min()
})

router.post('/login', async (req, res) => {
  try {
    console.log(req.body.email)

    const validSchema = LoginSchema.safeParse(req.body)
    if (!validSchema.success) {
      const errors = validSchema.error.format()
      
      res.status(400)
      return res.send({ errors: errors })
    }

    const find = await User.findOne({ email: req.body.email })

    if (!find) {
      res.status(400)
      return res.send({ fail: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(req.body.password, find.password)

    if (!validPassword) {
      res.status(400)
      return res.send({ fail: 'Invalid email or password' })
    }

    const token = jwt.sign({ _id: find?._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24
    })

    // const user = find

    // const { password, ...newUser } = user

    // console.log(find, newUser, 'chaslkdjasldkjasldjasldkjasldjaslkdjasl')

    const response = { token: token, user: find }

    return res.send(response)
  } catch (e) {
    if(e instanceof ZodError)
      return res.status(400).json({
        message: 'Validation error',
        errors:e.flatten()
      })  
    res.status(500)

    return res.send({ message: 'Server error' })
  }
})

module.exports = router
