const { z } = require('zod')

const licenceSchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long'),
  state: z.string().min(1, 'state is required')
})

module.exports = licenceSchema
