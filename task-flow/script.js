const taskInput = document.getElementById("taskInput")
const addBtn = document.getElementById("addBtn")
const taskList = document.getElementById("taskList")
const taskCounter = document.getElementById("taskCounter")
const activeCounter = document.getElementById("activeCounter")
const filterButtons = document.querySelectorAll(".filter-btn")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let currentFilter = "all"

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(function(task) {
            return task.completed === false
        })
    }

    if (currentFilter === "completed") {
        return tasks.filter(function(task) {
            return task.completed === true
        })
    }

    return tasks
}

function updateCounters() {
    const activeTasksCount = tasks.filter(function(task) {
        return task.completed === false
    }).length

    taskCounter.textContent = `Всего задач: ${tasks.length}`
    activeCounter.textContent = `Активных задач: ${activeTasksCount}`
}

function renderTasks() {
    taskList.innerHTML = ""

    const filteredTasks = getFilteredTasks()

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement("p")
        emptyState.classList.add("empty-state")

        if (currentFilter === "all") {
            emptyState.textContent = "Пока задач нет"
        } else if (currentFilter === "active") {
            emptyState.textContent = "Активных задач нет"
        } else {
            emptyState.textContent = "Выполненных задач нет"
        }

        taskList.appendChild(emptyState)
    }

    filteredTasks.forEach(function(task) {
        const taskCard = document.createElement("div")
        taskCard.classList.add("task-card")

        if (task.completed) {
            taskCard.classList.add("completed")
        }

        const taskText = document.createElement("p")
        taskText.classList.add("task-text")
        taskText.textContent = task.text

        const taskActions = document.createElement("div")
        taskActions.classList.add("task-actions")

        const doneBtn = document.createElement("button")
        doneBtn.classList.add("done-btn")
        doneBtn.textContent = task.completed ? "Undo" : "Done"

        doneBtn.addEventListener("click", function() {
            task.completed = !task.completed
            saveTasks()
            renderTasks()
        })

        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.textContent = "Delete"

        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item !== task
            })

            saveTasks()
            renderTasks()
        })

        taskActions.appendChild(doneBtn)
        taskActions.appendChild(deleteBtn)

        taskCard.appendChild(taskText)
        taskCard.appendChild(taskActions)

        taskList.appendChild(taskCard)
    })

    updateCounters()
}

addBtn.addEventListener("click", function() {
    const taskText = taskInput.value.trim()

    if (taskText === "") {
        return
    }

    const newTask = {
        text: taskText,
        completed: false
    }

    tasks.push(newTask)
    taskInput.value = ""

    saveTasks()
    renderTasks()
})

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addBtn.click()
    }
})

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active")
        })

        button.classList.add("active")
        renderTasks()
    })
})

renderTasks()