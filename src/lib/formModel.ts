import z from 'zod'

interface from {
  schema: any[]
  zSchema: any[]
}

const MAX_FILE_SIZE = 50000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const ACCEPTED_MEDIA_TYPES = ['audio/mpeg']

const ACCEPTED_DOC_TYPES = ['text/csv']

const fileSchema = z
  .any()
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
  .refine(
    (file) => !file || ACCEPTED_MEDIA_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png, and .gif formats are supported.'
  )

export const Industry: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter organization name')
    })
  ]
}

export const State: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter state name')
    })
  ]
}

export const Licence: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter licence name')
    })
  ]
}

export const City: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      state: {
        title: 'State',
        type: 'select',
        value: '',
        table: 'state',
        options: [],
        optionfield: 'name'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter state name'),
      state: z.string().min(1, 'Please select state name')
    })
  ]
}

export const MusicLabel: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      state: {
        title: 'Licence',
        type: 'select',
        value: '',
        table: 'licence',
        options: [],
        optionfield: 'name'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter state name'),
      state: z.string().min(1, 'Please select state name')
    })
  ]
}

export const Organization: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      industry: {
        title: 'Industry',
        type: 'select',
        value: '',
        table: 'industry',
        options: [],
        optionfield: 'name'
      }
    },
    {
      registredAddress: { title: 'Registred Address', type: 'textarea', value: '' },
      state: {
        title: 'State',
        type: 'select',
        value: '',
        table: 'state',
        options: [],
        optionfield: 'name'
      },
      city: {
        title: 'City',
        type: 'select',
        value: '',
        table: 'city',
        filter: 'state',
        options: [],
        optionfield: 'name'
      },
      pincode: { title: 'Pincode', type: 'text', value: '' }
    },
    {
      // contacts: { title: 'contacts', type: 'text', value: '' },
      costType: { title: 'Cost Type', type: 'select', value: '', options: ['Fixed', 'Perstore'] },
      amount: { title: 'Amount', type: 'text', value: '' },
      billingCycle: {
        title: 'Billing Cycle',
        type: 'select',
        value: '',
        options: ['Monthly', 'Quarterly', 'Half-yearly', 'Yearly']
      },
      paymentMode: {
        title: 'Payment Mode',
        type: 'select',
        value: '',
        options: ['Prepaid', 'Postpaid', 'Others']
      },
      prepaidPer: {
        title: 'Prepaid Per',
        type: 'texts',
        value: ''
      },
      postpaidPer: {
        title: 'Postpaid Per',
        type: 'text',
        value: ''
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter organization name'),
      industry: z.string().min(1, 'Please select industry')
    }),
    z.object({
      registredAddress: z.string().min(1, 'Please enter Address'),
      pincode: z.string().min(1, 'Please enter pincode'),
      state: z.string().min(1, 'Please select state'),
      city: z.string().min(1, 'Please select city')
    }),
    z.object({
      costType: z.string().min(1, 'Please select cost type'),
      amount: z.string().min(1, 'Please enter amount'),
      billingCycle: z.string().min(1, 'Please select billing cycle'),
      paymentMode: z.string().min(1, 'Please select payment mode')
    })
  ]
}

export const Brand: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      organization: {
        title: 'Organization',
        type: 'select',
        value: '',
        table: 'organization',
        options: [],
        optionfield: 'name'
      },
      storeCount: { title: 'No of stores', type: 'text', value: '' },
      brief: {
        title: 'Brief',
        type: 'textarea',
        value: ''
      },
      contractType: {
        title: 'Contract Type',
        type: 'select',
        value: '',
        options: ['Demo', 'Live']
      },
      contractDocument: { title: 'Contract Document', type: 'hidden', value: '' },
      file: {
        title: 'Contract Document',
        type: 'file',
        value: '',
        affected: 'contractDocument',
        accept: 'application/pdf,application/vnd.ms-excel,application/msword'
      },
      contractStartDate: { title: 'Contract Start Date', type: 'date', value: '' },
      contractEndDate: { title: 'Contract End Date', type: 'date', value: '' },

      state: {
        title: 'State',
        type: 'select',
        value: '',
        table: 'state',
        options: [],
        optionfield: 'name'
      },
      city: {
        title: 'City',
        type: 'select',
        value: '',
        table: 'city',
        options: [],
        optionfield: 'name'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter brand name'),
      organization: z.string().min(1, 'Please select organization'),
      storeCount: z.string().min(1, 'Please enter no of store'),
      brief: z.string().min(1, 'Please enter brief'),
      contractType: z.string().min(1, 'Please select contract type'),
      state: z.string().min(1, 'Please select state'),
      city: z.string().min(1, 'Please select city')
    })
  ]
}

export const BrandZone: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      brand: {
        title: 'Brand',
        type: 'select',
        value: '',
        table: 'brand',
        options: [],
        optionfield: 'name'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter brand zone name'),
      brand: z.string().min(1, 'Please select brand')
    })
  ]
}

export const Store: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      address: { title: 'Address', type: 'textarea', value: '' },
      brand: {
        title: 'Brand',
        type: 'select',
        value: '',
        table: 'brand',
        options: [],
        optionfield: 'name'
      },
      brandZone: {
        title: 'Brand Zone',
        type: 'select',
        value: '',
        table: 'brandZone',
        options: [],
        optionfield: 'name'
      },
      state: {
        title: 'State',
        type: 'select',
        value: '',
        table: 'state',
        options: [],
        optionfield: 'name'
      },
      city: {
        title: 'city',
        type: 'select',
        value: '',
        table: 'city',
        options: [],
        optionfield: 'name'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter store name'),
      address: z.string().min(1, 'Please select address'),
      brand: z.string().min(1, 'Please select brand'),
      state: z.string().min(1, 'Please select state'),
      city: z.string().min(1, 'Please select city')
    })
  ]
}

export const User: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      email: { title: 'Email', type: 'email', value: '' },
      username: { title: 'Username', type: 'text', value: '' },
      password: { title: 'Password', type: 'password', value: '' },
      brand: {
        title: 'Brand',
        type: 'select',
        value: '',
        table: 'brand',
        options: [],
        optionfield: 'name'
      },
      brandZone: {
        title: 'Brand Zone',
        type: 'select',
        value: '',
        table: 'brandZone',
        options: [],
        optionfield: 'name'
      },
      store: {
        title: 'Store',
        type: 'select',
        value: '',
        table: 'store',
        options: [],
        optionfield: 'name'
      },
      role: {
        title: 'Role',
        type: 'select',
        value: '',
        table: 'role',
        options: [],
        optionfield: 'name'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter brand name'),
      email: z.string().min(1, 'Please enter email').email(),
      username: z.string().min(1, 'Please enter username'),
      password: z.string().min(1, 'Please enter password'),
      brand: z.string().min(1, 'Please select brand zone'),
      role: z.string().min(1, 'Invalid role')
    })
  ]
}

export const Media: from = {
  schema: [
    {
      name: { title: 'Name', type: 'text', value: '' },
      media: { title: 'Audio file', type: 'hidden', value: '' },
      file: {
        title: 'Audio file',
        type: 'file',
        value: '',
        affected: 'media',
        accept: '.mp3'
      }
    }
  ],
  zSchema: [
    z.object({
      name: z.string().min(1, 'Please enter brand name'),
      file: fileSchema
    })
  ]
}
