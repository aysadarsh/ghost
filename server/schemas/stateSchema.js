const { z } = require('zod')

const stateSchema = z.object({
  name: z.string().min(1, 'State name required'),
})

module.exports = stateSchema
