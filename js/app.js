window.addEventListener("DOMContentLoaded", () => {
    const addInput = document.querySelector("#add");
    const addItemBtn = document.querySelector("#addBtn");
    const searchItem = document.querySelector("#search");
    const todoList = document.querySelector(".todo-list");

    //render todo item

    function renderTodoItem(id, date, label, done) {
        todoList.innerHTML +=
            `<div id="${id}" class="todo-list__item">
                <input type="checkbox" data-checkbox="${id}">
                <div class="todo-list__item_label">
                    <p data-done="${done}">${label}</p>
                    <span>${date}</span>
                </div>
                <button type="button" data-remove="${id}" class="todo-list__item_remove"></button>
            </div>`;

        addRemoveListeners();
        addDoneListeners();
    };

    //add new item

    function addItem() {
        const state = {
            id:`item${Math.random().toFixed(3)}`,
            label: addInput.value,
            date: `Date: ( ${new Date().toISOString().slice(0, 10)} )`+`${new Date()}`.slice(15, 24),
            done: false
        };

        const { id, date, label } = state;

        if (label.length) {
            localStorage.setItem(id, JSON.stringify(state));
            renderTodoItem(id, date, label);
        } else {
            showError(addInput, "Oh, no.. You did not enter the task name");
        }

        addInput.value = "";
    };

    addItemBtn.addEventListener("click", (e) => {
        e.preventDefault();

        addItem();
        todoCounter();
    });

    //remove item

    function renderRemoveControls(removeItem) {
        removeItem.insertAdjacentHTML("afterend",
            `<div class="todo-list__item_remove_controls hidden">
                <span>Are you sure?</span>
                <button type="button" class="todo-list__item_remove_confirm">Yes</button>
                <button type="button" class="todo-list__item_remove_cancel">No</button>
            </div>`
        );

        const removeControls = removeItem.nextElementSibling;
        const confirm = removeControls.querySelector(".todo-list__item_remove_confirm");
        const cancel = removeControls.querySelector(".todo-list__item_remove_cancel");

        confirm.addEventListener("click", () => {
            localStorage.removeItem(removeItem.dataset.remove);
            removeItem.parentElement.remove();
            todoCounter();
        });

        cancel.addEventListener("click", () => {
            removeControls.classList.add("hidden");
            removeItem.classList.remove("hidden");
        });

        removeControls.classList.remove("hidden");
    };

    function addRemoveListeners() {
        const removeItemBtn = [...document.querySelectorAll(".todo-list__item_remove")].map(remove => {
            remove.addEventListener("click", function() {
                this.classList.add("hidden");
                renderRemoveControls(this);
            });
        });

        return removeItemBtn;
    };

    //toggle done status

    function addDoneListeners() {
        const checkbox = [...document.querySelectorAll("input[type='checkbox']")].map(item => {
            const label = item.nextElementSibling.querySelector("p");
            const doneStatus = JSON.parse(localStorage.getItem(item.dataset.checkbox));

            item.addEventListener("click", () => {
                onToggleDone(item, label, doneStatus);
            });

            if (doneStatus.done) {
                item.setAttribute("checked", "checked");
                label.classList.add("done");
            } else {
                item.removeAttribute("checked");
                label.classList.remove("done");
            }
        });

        return checkbox;
    };

    function onToggleDone(item, label, status) {
        status.done = !status.done;
        label.classList.toggle("done");
        localStorage[item.dataset.checkbox] = JSON.stringify(status);
    };

    //render todo list

    function renderTodoList() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const { id, date, label, done } = JSON.parse(localStorage.getItem(key));

            renderTodoItem(id, date, label, done);
        }
    };
    renderTodoList();

    //search item

    searchItem.addEventListener("keyup", function() {
        const value = this.value.trim();
        const todoList = [...document.querySelectorAll(".todo-list__item")].map(item => {
            if (value.length) {
                if (item.innerText.search(value) == -1) {
                    item.classList.add("hidden");
                }
            } else {
                item.classList.remove("hidden");
            }
        });

        return todoList;
    });

    //show hide error

    function showError(error, errorMsg) {
        error.placeholder = errorMsg;
        error.classList.add("active");

        setTimeout(() => {
            error.placeholder = "What needs to de done?";
            error.classList.remove("active");
        }, 1500);
    };

    //todo counter

    function todoCounter() {
        const todoConnter = document.querySelector(".todo-counter");
        const todoListItem = document.querySelectorAll(".todo-list__item_label p");
        const todoCompleat = [...todoListItem].filter(item => item.classList.contains("done")).length;
        const todoPending = todoListItem.length - todoCompleat;

        todoConnter.innerHTML = `
            <span>Total: ${todoListItem.length}</span>
            <span>Compleat: ${todoCompleat}</span>
            <span>Pending: ${todoPending}</span>
        `;
    };
    todoCounter();

    todoList.addEventListener("change", () => {
        todoCounter();
    });
});
