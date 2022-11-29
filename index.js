require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :res[content-length] - :response-time ms :postContent'))
app.use(express.static('build'))


morgan.token('postContent', function(req, res) {
    requestContent = req.body
    return JSON.stringify(requestContent);
})


app.get('/info', (request, response) => {
    const date = new Date()
    const query = Person.find()
    query.count(function (err, count) {
        if (err) console.log(err)
        else { 
            response.send('<p>Phonebook has info for ' + count + ' people</p>' +
                 '<p>' + date + '</p>') }
    })
}) 


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) response.json(person)
        else response.status(404).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
    const personInfo = request.body    

    if (!personInfo.name || !personInfo.number) {
        response.status(400).json({
            error: "Name or number must not be empty."
        })
    } else {
        const person = new Person({
            id: personInfo.id,
            name: personInfo.name,
            number: personInfo.number,
        })
        console.log(person)
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
      id: body.id,
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}


app.use(unknownEndpoint)


// Virheiden käsittely lisättiin samalla 3.15 tehtävän yhteydessä
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}


app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})