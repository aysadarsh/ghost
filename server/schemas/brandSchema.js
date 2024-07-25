const { z } = require('zod')

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name required'),
  organization: z.string().min(1, 'Organization required'),
  storeCount: z.string().min(1, 'No of store required'),
  brief: z.string().min(1, 'Brief required'),
  contractType: z.string().min(1, 'Contract type required'),
  state: z.string().min(1, 'State required'),
  city: z.string().min(1, 'City required')
})

module.exports = brandSchema
