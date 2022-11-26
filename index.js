const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

let persons = [
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
  ]

app.use(cors())
app.use(morgan(':method :url :res[content-length] - :response-time ms :postContent'))
app.use(express.static('build'))

morgan.token('postContent', function(req, res) {
    requestContent = req.body
    return JSON.stringify(requestContent);
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send('<p>Phonebook has info for ' + persons.length + ' people</p>' +
                 '<p>' + date + '</p>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)
    if (person) response.json(person)
    else response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    const duplicateName = persons.find(per => per.name === person.name)

    if (!person.name || !person.number) {
        response.status(400).json({
            error: "Name or number must not be empty."
        })
    } else if (duplicateName) {
        response.status(400).json({
            error: "Name must be unique"
        })
    } else {
        person.id = Math.floor(Math.random() * 100000)
        persons = persons.concat(person)
        console.log(person)
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(per => per.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || "3001"
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
