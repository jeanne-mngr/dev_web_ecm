import './App.css'
import { useEffect, useState } from "react";

const URL = "http://localhost:5000/tasks/";

function AddTask(text) {
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: text }),
  })
  .then( response => {response.json(); })
  .then( data => { return data; });
}

async function GetAllTask({updateFunction}) {
  const response = await fetch(URL);
  const data = await response.json()
  updateFunction(data);
}

async function DeleteTask(id) {
  await fetch(`${URL}${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

async function DoneTask(id) {
  await fetch(`${URL}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ done: true }),
  });
}

export default function Board() {
  const [tasksToDisplay, setTasksToDisplay] = useState([]);
  const [title, setTitle] = useState("");  
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };

  useEffect(() => {
    GetAllTask({updateFunction: setTasksToDisplay});
  })

  return (
    <>
      <h1>TODO LIST</h1>
      <div className="addTask">
        <label htmlFor="name">Entrer le titre de la tâche</label>
        <input
          type="text"
          name="name"
          id="name"
          value={title}
          onChange={handleChange} />
        <button onClick={(e) => {
          e.preventDefault();
          AddTask(title);
        }}> Ajouter une tache </button>
      </div>
        <div className='grid'>

      {tasksToDisplay.map((task) => (
            <div key={task.id} className="taskCard"> 
              <h3 className='titre'>
                Titre : {task.title}
              </h3>
              {task.done ?
              <div > Tache faite </div>
              : <> À Faire </>
              } 
              <div className='button-card'>
                <button
                  onClick={(e) => {
                  e.preventDefault();
                  DeleteTask(task.id);
                } }>
                  Supprimer
                </button>
                {!task.done ?
                  <button
                    onClick={(e) => {
                    e.preventDefault();
                    DoneTask(task.id);
                  } }>
                    Valider la tache
                  </button>
                  : <></>
                }
              </div>
            </div>
  
        ))}
        </div>
    </>
  );
}