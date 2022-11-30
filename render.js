function createTaskHTML(task) {
    //use different background color for different task status
    let stickyNote = "";
    const taskStatus = task.status.replaceAll(' ', '');

    switch (taskStatus) {
        case 'ToDo':
            stickyNote = "#FFFF90";
            break;
        case 'InProgress':
            stickyNote = "#FCC3C9";
            break;
        case 'Review':
            stickyNote = "#DC88DD";
            break;
        case 'Done':
            stickyNote = "#CAED9D";
            break;
    }

    return `<div class="taskCard" id="taskCard${task.id}" style="background :${stickyNote};">
                <div class="card-header" id="taskHeading${task.id}">
                    <h2 class="mb-0">
                        <button class="btn btn-block text-left" type="button" data-toggle="collapse"
                                data-target="#collapseTask${task.id}" aria-expanded="true" aria-controls="collapseTask${task.id}">
                            ${task.name}&emsp;${task.dueDate}
                        </button>
                    </h2>
                </div>

                <div class="collapse" aria-labelledby="headingTask${task.id}" data-parent="#${taskStatus}" id="collapseTask${task.id}">
                    <div class="card-body">
                        <h3 class="card-title">&#x1F4CC&emsp;${task.name}</h3>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text">Assigned to:<br>&emsp;${task.assignedTo.filter(name => name !== '').join(',<br>&emsp;')}</p>
                        <p class="card-text">Due on:<br>&emsp;${task.dueDate}</p>
                        <p class="card-text">Status:<br>&emsp;${task.status} </p>
                    </div>
                    <div class="card-footer text-right">
                        <button type="button" class="card-button btn btn-success" style="visibility: ${task.status === 'Done' ? "hidden" : "visible"}" id="doneBtn-${task.id}">Mark as done</button>
                        <button type="button" class="card-button btn btn-primary" id="editBtn-${task.id}">Edit</button>
                        <button type="button" class="card-button btn btn-danger" id="deleteBtn-${task.id}">Delete</button>              
                    </div>
                </div>
            </div>`;
}

function render(task) {
    document.getElementById(`${task.status.replaceAll(' ', '')}`).innerHTML = document.getElementById(`${task.status.replaceAll(' ', '')}`).innerHTML + createTaskHTML(task);
}

function refreshTaskCard() {
    window.location.reload();
}


export {render, refreshTaskCard};