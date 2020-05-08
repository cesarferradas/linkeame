const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (val) => val.includes('@') && val.includes('.'),
      message: (props) => `${props.value} is not a valid email`,
    },
    unique: true,
  },
  passwordHash: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  plan: {
    type: String,
    enum: ['free', 'standard', 'pro'],
    default: 'free',
  },
}, { timestamps: true })

UserSchema.options.toJSON = {
  transform: (doc, ret) => ({
    id: ret._id,
    name: ret.name,
    email: ret.email,
    is_verified: ret.isVerified,
    plan: ret.plan,
  }),
}

const User = mongoose.model('User', UserSchema)

module.exports = User
