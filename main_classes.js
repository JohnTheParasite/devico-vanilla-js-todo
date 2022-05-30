class App {
  constructor() {
    this.todoList = new TodoList(this);
    this.removeAllDoneButton = document.getElementById("removeAllDone");
    this.footer = document.getElementById("footer");
    this.itemsLeftCounter = document.getElementById("itemsLeft");
    this.toggleArrowButton = document.getElementById("arrow");
    this.elAllFilter = document.getElementById("allFilter");
    this.elActiveFilter = document.getElementById("activeFilter");
    this.elCompletedFilter = document.getElementById("completedFilter");
    this.currentFilter = "All";

    this.elAllFilter.addEventListener("click", () => {
      this.applyFilter("All");
    });

    this.elActiveFilter.addEventListener("click", () => {
      this.applyFilter("Active");
    });

    this.elCompletedFilter.addEventListener("click", () => {
      this.applyFilter("Completed");
    });

    this.removeAllDoneButton.addEventListener("click", () => {
      this.removeAllDone();
    });

    this.toggleArrowButton.addEventListener("click", () => {
      this.selectAll();
    });

    this.refreshAppearance();
  }

  refreshAppearance() {
    this.refreshArrow();
    this.refreshFooter();
    this.applyFilter(this.currentFilter);
  }

  refreshFooter() {
    let listItems = this.todoList.itemList.length;
    let listItemsDone = this.todoList.itemList.filter((el) => el.item.done).length;

    if (listItems === 0) {
      this.footer.classList.add("hidden");
    } else {
      this.footer.classList.remove("hidden");
    }

    if (listItemsDone === 0) {
      this.removeAllDoneButton.classList.add("hidden");
    } else {
      this.removeAllDoneButton.classList.remove("hidden")
    }

    this.itemsLeftCounter.innerText = listItems - listItemsDone + " items left"
  }

  refreshArrow() {
    let listItems = this.todoList.itemList.length;
    let listItemsDone = this.todoList.itemList.filter((el) => el.item.done).length;

    this.toggleArrowButton.classList.remove("invisible");
    this.toggleArrowButton.classList.remove("darker");

    if (listItems === 0) {
      this.toggleArrowButton.classList.add("invisible");
    } else if (listItems === listItemsDone) {
      this.toggleArrowButton.classList.add("darker");
    }
  }

  applyFilter(name) {
    this.currentFilter = name;

    this.elAllFilter.classList.remove("active");
    this.elActiveFilter.classList.remove("active");
    this.elCompletedFilter.classList.remove("active");

    this["el" + name + "Filter"].classList.add("active");

    let listItems = this.todoList.itemList;
    let listItemsDone = this.todoList.itemList.filter((el) => el.item.done);

    listItems.forEach((el) => {
      el.item.element.classList.remove("hidden")
    });

    if (name === "Active") {
      listItemsDone.forEach((el) => {
        el.item.element.classList.add("hidden");
      })
    } else if (name === "Completed") {
      listItems.forEach((el) => {
        el.item.element.classList.add("hidden")
      });
      listItemsDone.forEach((el) => {
        el.item.element.classList.remove("hidden");
      })
    }
  }

  removeAllDone() {
    const listItemsDone = this.todoList.itemList.filter((el) => el.item.done);
    listItemsDone.forEach((el) => {
      el.item.element.remove();
      this.todoList.removeTodo(el.id);
    });
    this.refreshAppearance();
  }

  selectAll() {
    let listItems = this.todoList.itemList;
    let listItemsDone = this.todoList.itemList.filter((el) => el.item.done);

    if (listItemsDone.length < listItems.length) {
      listItems.forEach((el) => {
        el.item.done = true;
        el.item.element.classList.add("done");
        el.item.checkboxElement.checked = true;
      })
    } else {
      listItems.forEach((el) => {
        el.item.done = false;
        el.item.element.classList.remove("done");
        el.item.checkboxElement.checked = false;
      })
    }

    this.refreshAppearance();
  }
}

class TodoList {

  constructor(app) {
    this.appInstance = app;
    this.todoList = document.getElementById("todoList");
    this.addInput = document.getElementById("todoInput");
    this.itemId = 1;
    this.itemList = [];

    this.addInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.createTodo();
        this.appInstance.refreshAppearance();
      }
    });
  }

  createTodo() {
    let newId = this.itemId++;
    const item = new TodoItem(this, newId, this.addInput.value.trim());
    this.itemList.push({ id: newId, item: item })
  }

  removeTodo(id) {
    const indexToDelete = this.itemList.findIndex((item) => item.id === id);
    if (indexToDelete >= 0) {
      this.itemList.splice(indexToDelete, 1);
    }
    this.appInstance.refreshAppearance();
  }
}

class TodoItem {

  constructor(list, itemId, content) {
    this.listInstance = list;
    this.content = content;
    this.done = false;
    this.id = itemId;
    this.element = undefined;
    this.previewElement = undefined;
    this.checkboxElement = undefined;
    this.itemNameElement = undefined;
    this.editInputElement = undefined;

    this.create()
  }

  create() {
    if (this.content === "") {
      return;
    }

    let li = document.createElement("li");
    li.classList.add("list-item");

    let previewDiv = document.createElement("div");
    previewDiv.classList.add("preview");

    let checkbox = document.createElement("input");
    checkbox.classList.add("checkbox");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", (event) => {
      if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
        this.toggleComplete(event.target);
      }
    });

    let itemName = document.createElement("p");
    itemName.classList.add("paragraph");
    itemName.textContent = this.content;
    itemName.addEventListener("dblclick", () => {
      this.previewElement.classList.add("hidden");
      this.editInputElement.classList.remove("hidden");
      this.editInputElement.focus();
    })

    let remove = document.createElement("div");
    remove.classList.add("remove");
    remove.innerHTML = "×";
    remove.addEventListener("click", (event) => {
      this.removeTodo(event.target);
    });

    let editInput = document.createElement("input");
    editInput.value = this.content;
    editInput.classList.add("edit");
    editInput.classList.add("hidden");
    editInput.type = "text";
    const eventFunction = this.editElement.bind(this);
    editInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const newItem = event.target.value.trim();
        if (newItem === "") {
          event.target.removeEventListener("focusout", eventFunction);
        }
        this.editElement(event);
      }
    })
    editInput.addEventListener("focusout", eventFunction);

    previewDiv.appendChild(checkbox);
    previewDiv.appendChild(itemName);
    previewDiv.appendChild(remove);

    li.appendChild(previewDiv);
    li.appendChild(editInput);

    this.listInstance.todoList.appendChild(li);
    this.element = li;
    this.previewElement = previewDiv;
    this.checkboxElement = checkbox;
    this.itemNameElement = itemName;
    this.editInputElement = editInput;

    this.listInstance.addInput.value = "";
  }

  toggleComplete() {
    this.element.classList.toggle("done");
    this.done = !this.done;
    this.listInstance.appInstance.refreshAppearance();
  }

  removeTodo() {
    this.element.remove();
    this.listInstance.removeTodo(this.id);
  }

  editElement() {
    this.content = this.editInputElement.value.trim();

    if (this.content === "") {
      this.element.remove();
      this.listInstance.appInstance.refreshAppearance();
      return
    }

    this.itemNameElement.textContent = this.content;
    this.previewElement.classList.remove("hidden");
    this.editInputElement.classList.add("hidden");
  }
}

new App();
