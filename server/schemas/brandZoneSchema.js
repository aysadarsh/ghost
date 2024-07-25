const { z } = require('zod')

const licenceSchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long'),
  brand: z.string().min(1, 'Brand is required')
})

module.exports = licenceSchema
