//import from module
import {TaskManager} from "./taskManager.js";
import {render, refreshTaskCard} from "./render.js";

let actionCode;
//define tasks object contain all tasks
const tasks = new TaskManager();

//data validate function
function dataValidate(inputs) {
    let valid = true;
    for (let i = 0; i < inputs.length - 1; i++) {
        const input = document.getElementById(inputs[i].children[1].id);
        const errorMsg = document.getElementById(inputs[i].children[2].id);
        let subValid = true;
        switch (input.id) {
            case 'taskNameInput':
                subValid = input.value.trim() !== '' && input.value.length <= 8;
                valid = valid && subValid;
                break;
            case 'taskDescriptionTextarea':
                subValid = input.value.trim() !== '' && input.value.length <= 15;
                valid = valid && subValid;
                break;
            case 'assignedToMultipleSelect':
                subValid = input.selectedIndex !== -1;
                valid = valid && subValid;
                break;
            case 'dateInput':
                subValid = input.value > formatDateStr(new Date());
                valid = valid && subValid;
                break;
            case 'statusSelect':
                subValid = input.selectedIndex !== 0;
                valid = valid && subValid;
                break;
        }

        showErrorMsg(subValid, errorMsg);
    }
    return valid;
}

//transfer current date to YYYY-MM-DD string
function formatDateStr(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const day = currentDate.getDate() < 9 ? `0${currentDate.getDate()}` : currentDate.getDate();
    return `${year}-${month}-${day}`;
}

//reset Task form clean input disable error message
function resetForm() {
    let errorMsg = document.getElementsByClassName('errorMsg');
    for (let i = 0, length = errorMsg.length; i < length; i++) {
        errorMsg[i].style.display = 'none';
    }
    document.getElementById("taskForm").reset();
}

//error message function display/hide message depend on condition
function showErrorMsg(valid, msg) {
    valid ? msg.style.display = 'none' : msg.style.display = 'block';
}

window.addEventListener("load", () => {
    //clock
    setInterval(() => {
        const d = new Date();
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let dateReading = `&#128198 ${d.toLocaleDateString(
            'default', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}`;
        let timeReading = `&#8986 ${d.toLocaleTimeString('default', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            dayPeriod: 'long'
        })}`
        let timeZoneReading = `&#128205 ${timezone}`
        document.getElementById("dateContainer").innerHTML = dateReading
        document.getElementById("clockContainer").innerHTML = timeReading
        document.getElementById("timezoneContainer").innerHTML = timeZoneReading
    }, 500);
    //render when window load
    if (window.localStorage.getItem('tasks') !== null) {
        const tasks_back = JSON.parse(window.localStorage.getItem('tasks'));
        tasks.id = tasks_back._id;
        tasks.task = tasks_back._task;
    }
    for (let i = 0; i < tasks.task.length; i++) {
        render(tasks.task[i]);
    }
});

document.getElementById('addBtn').addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById('addTaskModalTitle').innerHTML = 'New Task';
    actionCode = -1;
    resetForm();
});

//validate Form at submission
document.getElementById("submit").addEventListener('click', (event) => {
    event.preventDefault();
    const inputs = document.getElementsByClassName('form-group');

    //get task info from input form assign into array use as parameters of addTask function
    if (dataValidate(inputs)) {
        const taskInfo = [];
        for (let i = 0; i < inputs.length - 1; i++) {
            //generate task info
            if (inputs[i].children[1].id === 'assignedToMultipleSelect') {
                const options = inputs[i].children[1].options;
                const selectValueArr = [];
                for (let j = 0; j < options.length; j++) {
                    if (options[j].selected)
                        selectValueArr.push(options[j].value);
                    else
                        selectValueArr.push('');
                }
                taskInfo.push(selectValueArr);
                inputs[i].children[1].selectedIndex = -1;
            } else if (inputs[i].children[1].id === 'statusSelect') {
                taskInfo.push(inputs[i].children[1].value);
                inputs[i].children[1].selectedIndex = 0;
            } else {
                taskInfo.push(inputs[i].children[1].value);
                inputs[i].children[1].value = '';
            }
        }
        if (actionCode === -1)
            //create new task
            tasks.addTask(taskInfo);
        else
            //update exist task
            tasks.updateTask(taskInfo, actionCode);

        // hide modal after valid submission
        $('addTaskModal').modal('hide');
        // $('body').removeClass('modal-open');
        // $('.modal-backdrop').remove();
        window.localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshTaskCard();
    }
}, false);

//clear button to reset form
document.getElementById('clear').addEventListener('click', resetForm);

//set task status to Done update local storage data render task card
document.getElementById('accordionTasks').addEventListener("click", (event) => {
    const eventTarget = event.target.id.substring(0, event.target.id.indexOf('-'));
    const taskId = event.target.id.substring(event.target.id.indexOf('-') + 1);
    const taskIndex = tasks.task.findIndex((element) => element.id === parseInt(taskId));

    if (eventTarget === 'doneBtn') {
        if (confirm('Are you sure want to mark this task as done?')) {
            tasks.doneTask(taskIndex);
            window.localStorage.setItem('tasks', JSON.stringify(tasks));
            refreshTaskCard();
        }1
    } else if (eventTarget === 'deleteBtn') {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.deleteTask(taskIndex);
            window.localStorage.setItem('tasks', JSON.stringify(tasks));
            refreshTaskCard();
        } else {
            alert('Action cancelled. Task was not deleted.');
        }
    } else if (eventTarget === 'editBtn') {
        actionCode = taskIndex;
        document.getElementById('addTaskModalTitle').innerHTML = 'Edit Task';
        console.log('Edit button clicked!');
        $("#addTaskModal").modal("show")
        document.getElementById('taskNameInput').value = tasks.task[taskIndex].name;
        document.getElementById('taskDescriptionTextarea').value = tasks.task[taskIndex].description;
        document.getElementById('dateInput').value = tasks.task[taskIndex].dueDate;
        document.getElementById('statusSelect').value = tasks.task[taskIndex].status;
        const options = document.getElementById('assignedToMultipleSelect').options;
        for (let i = 0; i < options.length; i++) {
            if (tasks.task[taskIndex].assignedTo[i] !== '')
                options[i].selected = true;
        }
    }
});


