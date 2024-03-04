const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
// Configure to log messages to console based on the tiny configuration.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const phone = phonebook.find(person => person.id === id)
    if (phone) {
        response.json(phone)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    var currentTime = new Date();
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p>
    <p>${currentTime}</>`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // Reject the request if the name or number is missing
    if (!body.name) {
        response.status(404).json({
            error: "name missing"
        })
    }

    // Reject the request if the name is already exists in the phonebook
    if (phonebook.find(person=> person.name === body.name)) {
        response.status(404).json({
            error: 'name must be unique'
        })
    }

    // use a random big value as id to avoid creating duplicate ids
    const newPerson = {
        id: Math.round(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }
    phonebook = phonebook.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const phone = phonebook.find(person => person.id === id)
    if (phone) {
        phonebook = phonebook.filter(person => person.id !== id)
        response.json(phonebook)
        response.status(204).end()
    }
    else {
        response.status(404).end()
    }
})

PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
} )