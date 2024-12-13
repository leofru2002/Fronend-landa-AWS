const API_BASE_URL = 'https://vtydmxkaqj.execute-api.us-east-1.amazonaws.com'; 

let tasks = []; // Variable global para almacenar las tareas

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const tasksTableBody = document.getElementById('tasks-table');

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (taskId) {
      await updateTask(taskId, { title, description });
    } else {
      await createTask({ title, description });
    }

    taskForm.reset();
    document.getElementById('task-id').value = ''; // Limpia el ID oculto
    loadTasks();
  });

  async function loadTasks() {
    tasks = await getTasks(); // Carga las tareas y las almacena en la variable global
    tasksTableBody.innerHTML = '';
    tasks.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editTask('${task.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">Eliminar</button>
        </td>
      `;
      tasksTableBody.appendChild(row);
    });
  }

  window.editTask = (id) => {
    const task = tasks.find(task => task.id === id); // Busca la tarea por ID en la lista global
    if (!task) {
      alert('Tarea no encontrada');
      return;
    }
    document.getElementById('task-id').value = task.id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
  };

  window.deleteTask = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  loadTasks(); // Cargar las tareas al inicio
});

async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.body.tasks || [];
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return [];
  }
}

async function createTask(task) {
  try {
    await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
  } catch (error) {
    console.error('Error al crear la tarea:', error);
  }
}

async function updateTask(id, task) {
  try {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
  }
}
