/*
To run this project, you need to start the server by : npm run server
Then we need to open our development server: npm start
Steps ->
1. npm run server
2. npm start

*/
// import React from 'react'
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

import { useState, useEffect } from 'react'  // hook

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //Fetch Tasks 
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    
    
    // console.log(data)
    return data
  }
//Fetch Task
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()
  
  
  // console.log(data)
  return data
}
//Add Task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {method: 'POST', headers: { 'Content-type': 'application/json'}, body: JSON.stringify(task)
})

const data = await res.json()  // promise

setTasks([...tasks, data])
  // // console.log(task)
  // const id = Math.floor(Math.random() * 10000) + 1
  // // console.log(id)
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])
}

// Delete Task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE'})

  setTasks(tasks.filter((task) => task.id !== id))
}

// Toggle remainder
// method: PUT. Since, update.
const toggleRemainder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updateTask = {...taskToToggle, reminder: !taskToToggle.reminder}
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updateTask)
  })

  const data = await res.json()
  // console.log(id)
  setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } :task))
}


//{showAddTask && <AddTask onAdd={addTask} /> } - shorter way of using ternary operator if we don't have else part
  return (
    <Router> 
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />   
           
        <Route path="/" exact render={ (props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} /> }  
            {tasks.length > 0 ?<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleRemainder}  />: 'No Tasks to Show' }
          </>
        )} />
        <Route path="/about" component={About} /> 
        <Footer />
      </div>
    </Router>
  );
}
// class App extends React.Component {
//   render() {
//     return (<h2>Hello From a class</h2>)  This looks like html but is JSX
//   }
// }

export default App;


// localhost:3000 - is the development server
// localhost:8000 - is the production build
// // http://localhost:5000/tasks will give the json format of the data