require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/note')
const app = express()

app.use(express.static('dist'))

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
    Person.find({}).then(people=>{
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const phone = phonebook.find(person => person.id === id)
    // if (phone) {
    //     response.json(phone)
    // }
    // else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
        .then(person=>{
            response.json(person)
        })
        .catch(error=>next(error))
})

app.get('/info', (request, response) => {
    let currentTime = new Date()
    Person.countDocuments({}).then(count=>{
        response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</>`)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    // Reject the request if the name or number is missing
    if (body.name === undefined) {
        return response.status(404).json({
            error: "name missing"
        })
    }

    // Reject the request if the name is already exists in the phonebook
    
    // if (Person.find({name: body.name})) {
    //     return response.status(404).json({
    //         error: 'name must be unique'
    //     })
    // }
    Person.findOne({name: body.name}).then(result=>{
        if (result){
            return response.status(404).json({
                        error: 'name must be unique'
                    })
        }
        else {
            const newPerson = new Person({
                name: body.name,
                number: body.number
            })
            newPerson.save().then(savedPerson=>{
                response.json(savedPerson)
            }).catch(error=>next(error))
        }
    })

    // use a random big value as id to avoid creating duplicate ids
    // const newPerson = {
    //     id: Math.round(Math.random() * 1000000),
    //     name: body.name,
    //     number: body.number
    // }
    
    // phonebook = phonebook.concat(newPerson)
    // response.json(newPerson)
    
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const phone = phonebook.find(person => person.id === id)
    // if (phone) {
    //     phonebook = phonebook.filter(person => person.id !== id)
    //     response.json(phonebook)
    //     response.status(204).end()
    // }
    // else {
    //     response.status(404).end()
    // }
    Person.findByIdAndDelete(request.params.id)
        .then(result=>{
            response.status(204).end()
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
  

PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
} )