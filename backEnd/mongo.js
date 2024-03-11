const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1)
}
if (3 < process.argv.length && process.argv.length < 5) {
    console.log('Expect 5 arguments, e.g. "node mongo.js yourpassword Anna 040-1234556"');
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://yunpengdon:${password}@cluster0.fixzgyo.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', phonebookSchema)

// if 5 arguments are given, the new entry to the phonebook will be saved to the database
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({
        name: name,
        number: number,
    })

    newPerson.save().then(result=>{
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close()
    })
}

// If the password is the only parameter given to the program,  the program displays all of the entries in the phonebook

if (process.argv.length === 3) {
    Person.find({}).then(result=>{
        console.log('phonebook:');
        result.forEach(person=> console.log(person.name, person.number))
        mongoose.connection.close()
    })
}








