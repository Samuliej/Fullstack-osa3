const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        minlength: 3,
        required: [true, 'User name required' ]
    },
    number: {
        type: String,
        validate: {
            validator: function(num) {
                return /\d{3}-\d{5}/.test(num)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        minlength: 8,
        required: [true, 'User number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedOBject) => {
        returnedOBject.id = returnedOBject._id.toString()
        delete returnedOBject._id
        delete returnedOBject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)