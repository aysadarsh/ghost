const { z } = require('zod')

const storeSchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long'),
  brand: z.string().min(1, 'brand is required')
})

module.exports = storeSchema
