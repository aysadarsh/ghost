const { z } = require('zod')

const userSchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'invalid role')
})

module.exports = userSchema
