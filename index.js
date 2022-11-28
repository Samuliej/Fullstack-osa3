require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())

/*let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
  ] */

app.use(cors())
app.use(morgan(':method :url :res[content-length] - :response-time ms :postContent'))
app.use(express.static('build'))

morgan.token('postContent', function(req, res) {
    requestContent = req.body
    return JSON.stringify(requestContent);
})

/*app.get('/info', (request, response) => {
    const date = new Date()
    response.send('<p>Phonebook has info for ' + persons.length + ' people</p>' +
                 '<p>' + date + '</p>')
}) */

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(note => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const personInfo = request.body
    //const duplicateName = persons.find(per => per.name === personInfo.name)

    if (!personInfo.name || !personInfo.number) {
        response.status(400).json({
            error: "Name or number must not be empty."
        })
    } /*else if (duplicateName) {
        response.status(400).json({
            error: "Name must be unique"
        }) */
     else {
        const person = new Person({
            name: personInfo.name,
            number: personInfo.number,
        })
        console.log(person)
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(per => per.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
