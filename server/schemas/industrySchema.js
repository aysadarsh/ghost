const { z } = require('zod')

const industrySchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long')
})

module.exports = industrySchema
