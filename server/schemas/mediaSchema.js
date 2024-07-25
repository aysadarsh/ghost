const { z } = require('zod')

const organizationSchema = z.object({
  name: z.string().min(1, 'Please enter brand name'),
  media: z.string().min(1, 'Please provide media path'),
})

module.exports = organizationSchema
