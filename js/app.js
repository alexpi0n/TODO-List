window.addEventListener("DOMContentLoaded", () => {

    const addItemBtn = document.querySelector("#add");
    const searchItem = document.querySelector("#search");
    const todoList = document.querySelector(".todo-list");

    function renderTodoItem(itemId, itemLabel) {
        todoList.innerHTML +=
            `<div id="${itemId}" class="todo-list__item">
                <p>${itemLabel}</p>
                <span>${itemId}</span>
                <button
                    type="button"
                    id="${itemId}"
                    class="todo-list__item_remove">
                </button>
            </div>`;
        addRemoveItemListeners();
    };

    function addItem() {
        data = {
            label: document.querySelector("#input"),
            id: `Date: ${new Date().toISOString().slice(0, 10)}
                [ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ]`,
            error: "Oh, no.. You did not enter the task name"
        };

        const { label, id, error } = data;

        if (label.value.length) {
            renderTodoItem(id, label.value);
            localStorage.setItem(id, label.value);
        } else {
            showError(label, error);
        }

        label.value = "";
    };

    addItemBtn.addEventListener("click", () => {
        addItem();
    });

    function showError(error, errorMsg) {
        error.placeholder = errorMsg;
        error.classList.add("active");

        setTimeout(() => {
            error.placeholder = "What needs to de done?";
            error.classList.remove("active");
        }, 1500);
    };

    function addRemoveItemListeners() {
        const removeItemBtn = document.querySelectorAll(".todo-list__item_remove");

        for (remove of [...removeItemBtn]) {
            remove.addEventListener("click", function() {
                localStorage.removeItem(this.id);
                this.parentElement.remove();
            });
        }
    };

    function renderTodoList () {
        for (let i = 0; i < localStorage.length; i++) {
            let id = [localStorage.key(i)].filter(item => {
                if (item.includes("Date")) {
                    renderTodoItem(item, localStorage.getItem(item));
                }
            });
        }
    };
    renderTodoList();

    searchItem.addEventListener("keyup", function() {
        const todoList = document.querySelectorAll(".todo-list__item");
        const value = this.value.trim();

        [...todoList].forEach(item => {
            if (value.length) {
                if (item.innerText.search(value) == -1) {
                    item.classList.add("hidden");
                }
            } else {
                item.classList.remove("hidden");
            }
        });
    });
});
