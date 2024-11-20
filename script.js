document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.getElementById('addTaskButton');

    const PRIORITY_ORDER = {
        "Alta": 1,
        "Media": 2,
        "Baja": 3,
        "Sin categoría": 4
    };

    // Cargar tareas del almacenamiento local
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task.text, task.category, task.completed, false));
    };

    // Guardar tareas en el almacenamiento local
    const saveTasks = () => {
        const tasks = Array.from(taskList.children).map(item => ({
            text: item.querySelector('.task-text').innerText,
            category: item.dataset.category,
            completed: item.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Añadir tarea a la lista en la posición correcta según la prioridad
    const addTaskToList = (taskText, category = 'Sin categoría', completed = false, save = true) => {
        const listItem = document.createElement('li');
        listItem.dataset.category = category;
        if (completed) listItem.classList.add('completed');

        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <span class="task-category">${category}</span>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Eliminar</button>
        `;

        // Insertar tarea en la posición correcta
        const items = Array.from(taskList.children);
        const index = items.findIndex(item => 
            PRIORITY_ORDER[item.dataset.category] > PRIORITY_ORDER[category]
        );

        if (index === -1) {
            taskList.appendChild(listItem); 
        } else {
            taskList.insertBefore(listItem, items[index]); 
        }

        // Alternar tachado al hacer clic en el texto
        listItem.querySelector('.task-text').addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveTasks();
        });

        // Botón eliminar
        listItem.querySelector('.delete-btn').addEventListener('click', () => {
            listItem.remove();
            saveTasks();
        });

        // Botón editar
        listItem.querySelector('.edit-btn').addEventListener('click', () => {
            const newText = prompt('Editar tarea:', taskText);
            if (newText) {
                listItem.querySelector('.task-text').innerText = newText;
                saveTasks();
            }
        });

        if (save) saveTasks();
    };

    // Agregar tarea nueva
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const category = document.getElementById('taskCategory').value;
        if (taskText !== "") {
            addTaskToList(taskText, category);
            taskInput.value = "";
        }
    });


    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    loadTasks();
});



