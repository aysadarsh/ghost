// seed.js
require('dotenv').config({ path: './.env' })
const mongoose = require('mongoose')
const Role = require('./models/role')
const User = require('./models/user')

mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const defaultPassword = 'P@55w0rd'

const seedDB = async () => {
  const roles = [{ name: 'super-admin' }, { name: 'admin' }, { name: 'media-manager' }]

  try {
    for (let roleData of roles) {
      const role = new Role(roleData)
      await role.save()
    }

    //   seed users
    const superAdmin = await Role.find({ name: 'super-admin' })
    const admin = await Role.find({ name: 'admin' })
    const mediaManager = await Role.find({ name: 'media-manager' })

    const users = [
      {
        name: 'Adarsh Yadav',
        username: 'superadmin',
        password: defaultPassword,
        email: 'test@superamin.com',
        roles: [superAdmin._id]
      }
    ]

    for (let userData of users) {
      const user = new User(userData)
      await user.save()
    }
  } catch (error) {
    console.error('Error seeding roles:', error)
  } finally {
    mongoose.connection.close()
  }
}

const userSeed = async () => {
  try {
    for (let userData of users) {
    }
    console.log('Db seeded successfully.')
  } catch (error) {
    console.error('Error seeding roles:', error)
  } finally {
    mongoose.connection.close()
  }
}

seedDB()
