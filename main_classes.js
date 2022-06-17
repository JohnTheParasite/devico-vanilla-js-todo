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
    let listItemsDone = this.todoList.itemList.filter((el) => el.done).length;

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
    let listItemsDone = this.todoList.itemList.filter((el) => el.done).length;

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
    let listItemsDone = this.todoList.itemList.filter((el) => el.done);

    listItems.forEach((el) => {
      el.element.classList.remove("hidden")
    });

    if (name === "Active") {
      listItemsDone.forEach((el) => {
        el.element.classList.add("hidden");
      })
    } else if (name === "Completed") {
      listItems.forEach((el) => {
        el.element.classList.add("hidden")
      });
      listItemsDone.forEach((el) => {
        el.element.classList.remove("hidden");
      })
    }
  }

  removeAllDone() {
    const listItemsDone = this.todoList.itemList.filter((el) => el.done);
    listItemsDone.forEach((el) => {
      this.todoList.deleteItemFromData(el.id);
    });
  }

  selectAll() {
    let listItems = this.todoList.itemList;
    let listItemsDone = this.todoList.itemList.filter((el) => el.done);

    if (listItemsDone.length < listItems.length) {
      listItems.forEach((el) => {
        this.todoList.changeItemInData(el.id, true, el.content);
      })
    } else {
      listItems.forEach((el) => {
        this.todoList.changeItemInData(el.id, false, el.content);
      })
    }
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
        const newItem = { id: this.itemId++, done: false, content: this.addInput.value.trim() };
        this.createTodo(newItem);
        this.putItemToData(newItem);
      }
    });

    this.renderList(true);
  }

  renderList(init = false) {
    const todoItems = this.getData();
    this.itemId = 1;
    if (todoItems.length) {
      this.itemId = Math.max(...todoItems.map(el => el.id)) + 1;
      todoItems.forEach((el) => {
        this.createTodo(el);
      })
    }
    if (!init) {
      this.appInstance.refreshAppearance();
    }
  }

  getData() {
    const storageData = window.localStorage.getItem("todoItems");
    return (storageData === null) ? [] : JSON.parse(storageData);
  }

  deleteItemFromData(id) {
    const storageList = this.getData();
    const indexToDelete = storageList.findIndex((item) => item.id === id);
    if (indexToDelete >= 0) {
      storageList.splice(indexToDelete, 1);
    }
    window.localStorage.setItem("todoItems", JSON.stringify(storageList));
    this.clear();
    this.renderList();
  }

  putItemToData(item) {
    const storageList = this.getData();
    storageList.push(item);
    window.localStorage.setItem("todoItems", JSON.stringify(storageList));
    this.clear();
    this.renderList();
  }

  changeItemInData(id, done, content) {
    const storageList = this.getData();
    const item = storageList.find((item) => item.id === id);
    if (item) {
      item.id = id;
      item.done = done;
      item.content = content;
    }
    window.localStorage.setItem("todoItems", JSON.stringify(storageList));
    this.clear();
    this.renderList();
  }

  clear() {
    this.itemList.forEach((el) => {
      el.element.remove();
    })
    this.itemList = [];
  }

  createTodo(newTodo) {
    const item = new TodoItem(this, newTodo.id, newTodo.done, newTodo.content);
    this.itemList.push(item)
  }
}

class TodoItem {

  constructor(list, id, done, content) {
    this.listInstance = list;
    this.content = content;
    this.done = done;
    this.id = id;
    this.element = undefined;
    this.previewElement = undefined;
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
    checkbox.checked = this.done;
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
    remove.addEventListener("click", () => {
      this.listInstance.deleteItemFromData(this.id);
    });

    let editInput = document.createElement("input");
    editInput.value = this.content;
    editInput.classList.add("edit");
    editInput.classList.add("hidden");
    editInput.type = "text";
    const eventFunction = this.editElement.bind(this);
    editInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.target.removeEventListener("focusout", eventFunction);
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
    this.editInputElement = editInput;

    this.toggleDoneClass();

    this.listInstance.addInput.value = "";
  }

  toggleComplete() {
    this.done = !this.done;
    this.listInstance.changeItemInData(this.id, this.done, this.content);
  }

  toggleDoneClass() {
    if (this.done) {
      this.element.classList.add("done");
    } else {
      this.element.classList.remove("done");
    }
  }

  editElement() {
    this.content = this.editInputElement.value.trim();

    if (this.content === "") {
      this.listInstance.deleteItemFromData(this.id);
      return
    }
    this.listInstance.changeItemInData(this.id, this.done, this.content);
  }
}

new App();
