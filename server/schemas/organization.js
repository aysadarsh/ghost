const { z } = require('zod')

const organizationSchema = z.object({
  name: z.string().min(1, 'Name must be at least 3 characters long'),
  industry: z.string().min(1, 'Industry required'),
  registredAddress: z.string().min(1, 'Address required'),
  pincode: z.string().min(1, 'Pincode required'),
  state: z.string().min(1, 'state required'),
  city: z.string().min(1, 'city required'),
  costType: z.string().min(1, 'Cost type required'),
  amount: z.string().min(1, 'Amount required'),
  billingCycle: z.string().min(1, 'Billing cycle required'),
  paymentMode: z.string().min(1, 'Payment mode required')
})

module.exports = organizationSchema
