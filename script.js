document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        let hasCompleted = false;
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.index = index;

            const checkbox = document.createElement('div');
            checkbox.className = 'checkbox';
            checkbox.addEventListener('click', () => toggleCompleted(index));

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.addEventListener('click', () => editTask(index, taskItem));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);

            if (task.completed) {
                hasCompleted = true;
            }
        });
        clearCompletedBtn.classList.toggle('hidden', !hasCompleted);
    };

    const addTask = (text) => {
        if (text.trim() === '') return;
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    };

    const updateTask = (index, newText) => {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    };

    const toggleCompleted = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    const clearCompleted = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };

    const editTask = (index, taskItem) => {
        const taskText = taskItem.querySelector('span');
        const currentText = tasks[index].text;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';

        taskItem.replaceChild(input, taskText);
        input.focus();

        const save = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                updateTask(index, newText);
            } else {
                taskItem.replaceChild(taskText, input);
            }
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                save();
            } else if (e.key === 'Escape') {
                taskItem.replaceChild(taskText, input);
            }
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    renderTasks();
});