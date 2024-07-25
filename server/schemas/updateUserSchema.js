const { z } = require('zod')

const userSchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  roles: z.array(z.string().min(1, 'invalid role')).nonempty('Roles array cannot be empty')
})

module.exports = userSchema
