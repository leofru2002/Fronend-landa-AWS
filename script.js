const API_BASE_URL = 'https://vtydmxkaqj.execute-api.us-east-1.amazonaws.com'; 

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
    loadTasks();
  });

  async function loadTasks() {
    const tasks = await getTasks();
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
    const task = tasks.find(task => task.id === id);
    document.getElementById('task-id').value = task.id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
  };

  window.deleteTask = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  loadTasks();
});

async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.body.tasks;
}

async function createTask(task) {
  await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
}

async function updateTask(id, task) {
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
}

async function deleteTask(id) {
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
}
