import { useState , useEffect} from 'react'
import axios from 'axios'
import personService from '../services/persons'
import './index.css'

const Filter = (props) => {
  return(
    <div>
        filter shown with <input value={props.value} onChange={props.onChange}/>
    </div>
  )
}

const PersonFormLable = (props) => {
  return(
    <div>
          {props.lable}: <input value={props.value} onChange={props.onChange}/>
    </div>
  )
}


const PersonForm = (props) => {
  return(
    <form>
        {props.items.map(item=>
        <PersonFormLable key={item.lable} lable={item.lable} value={item.value} onChange={item.onChange}/>)}
        <div>
          <button type='submit' onClick={props.buttonClick} >add</button>
        </div>
      </form>
  )
}

const Persons = ({persons, filterWith, onDelete}) => {

  return(
    <div>
        {persons.map(person => {
          if (person.name.toLowerCase().includes(filterWith.toLowerCase())){
            return <p key={person.id}>{person.name} {person.number} <button onClick={()=>onDelete(person)}>delete</button></p>
          }
        })}
    </div>
  )
}

const Notification = ({message}) => {
  if (message.text === null) {
    return null
  }
  if (message.type === 'info') {
    return(
      <div>
        <p className='alertNotification'>{message.text}</p>
      </div>
    )
  }
  if (message.type === 'error'){
    return(
      <div>
        <p className='errorNotification'>{message.text}</p>
      </div>
    )
  }
  
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterWith, setFilterWith] = useState('')

  const defaultAlertMessage = {
    text: null,
    type: 'info'
  }
  const [alertMessage, setAlterMessage] = useState(defaultAlertMessage)

  const hook = () => {
    personService.getALL().then(initalPerson => setPersons(initalPerson))
  }
  
  useEffect(hook, [])
  
  const addName = (event) => {
    event.preventDefault()

    let newNameObject = {
      name: newName,
      number: newNumber,
    }

    // Prevent the user from being able to add names that already exist in the phonebook.
    for (const person of persons) {
      if (person.name === newNameObject.name) {
        alert(`${newName} is already added to phonebook`)
        return 0
      }
    }
    personService
      .create(newNameObject)
      .then(returnedPerson=>{
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setAlterMessage({...defaultAlertMessage, text: `Added ${returnedPerson.name}`})
        setTimeout(() => {
          setAlterMessage(defaultAlertMessage)
        }, 5000);
      }).catch(error=>{
        console.log(error);
        setAlterMessage({
          text: error.response.data.error,
          type: 'error'
        })
        setTimeout(() => {
          setAlterMessage(defaultAlertMessage)
        }, 5000);
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterWith(event.target.value)
  }
  
  const handleDeletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      console.log(`Delete ${person.name}`)
      personService.cdelete(person.id)
        .then(returnedInfo=>{
          console.log(returnedInfo)
          setPersons(persons.filter(p=>p.id !== person.id))
          setAlterMessage({...defaultAlertMessage, text: `Deleted ${returnedInfo.name}`})
          setTimeout(() => {
            setAlterMessage(defaultAlertMessage)
          }, 5000);
        })
    }
    else {
      console.log(`Keep ${person.name}`)
    }
    
  }

  const formItems = [
    {lable: 'name', value: newName, onChange: handleNameChange},
    {lable: 'number', value: newNumber, onChange: handleNumberChange}
  ]

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage}/>
      <Filter value={filterWith} onChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm items={formItems} buttonClick={addName}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filterWith={filterWith} onDelete={handleDeletePerson}/>
    </div>
  )
}

export default App