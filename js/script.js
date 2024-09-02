document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null;

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            if (task.status === 'concluida') {
                taskElement.classList.add('completed');
            }

            taskElement.innerHTML = `
                <div class="task-id">ID: ${task.id}</div>
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${task.description}</div>
                <div class="task-status">${task.status === 'pendente' ? 'Pendente' : 'Concluída'}</div>
                <div class="task-date">Criada em: ${new Date(task.creationDate).toLocaleString()}</div>
                <div class="task-controls">
                    <button class="edit" onclick="editTask('${task.id}')">Editar</button>
                    <button class="delete" onclick="deleteTask('${task.id}')">Excluir</button>
                </div>
            `;

            taskList.appendChild(taskElement);
        });
    };

    const addOrUpdateTask = (title, description, status) => {
        if (editingTaskId) {
            // Atualizar tarefa existente
            const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].title = title;
                tasks[taskIndex].description = description;
                tasks[taskIndex].status = status;
                editingTaskId = null; // Limpar a variável após edição
            }
        } else {
            // Adicionar nova tarefa
            const task = {
                id: Date.now().toString(),  // Gerando um ID único para cada tarefa
                title,
                description,
                status,
                creationDate: new Date()
            };
            tasks.push(task);
        }
        saveTasks();
        renderTasks();
    };

    window.editTask = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('status').value = task.status;
            editingTaskId = id; // Armazenar o ID da tarefa que está sendo editada
        }
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;
        addOrUpdateTask(title, description, status);
        taskForm.reset();
    });

    renderTasks();
});
