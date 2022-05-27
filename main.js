const elList = document.getElementById("todoList");
const elAddInput = document.getElementById("todoInput");
const elRemoveAllDone = document.getElementById("removeAllDone");
const elAllFilter = document.getElementById("allFilter");
const elActiveFilter = document.getElementById("activeFilter");
const elCompletedFilter = document.getElementById("completedFilter");
const elArrow = document.getElementById("arrow");
let currentFilter = "All";

elAddInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    createTodo();
  }
});

elRemoveAllDone.addEventListener("click", () => {
  let listItemsDone = document.querySelectorAll(".list-item.done");
  listItemsDone.forEach((el) => {
    el.remove();
  });
  refreshAppearance();
});

elAllFilter.addEventListener("click", () => {
  applyFilter("All");
});

elActiveFilter.addEventListener("click", () => {
  applyFilter("Active");
});

elCompletedFilter.addEventListener("click", () => {
  applyFilter("Completed");
});

elArrow.addEventListener("click", () => {
  selectAll();
});

function createTodo() {
  let itemText = elAddInput.value.trim();
  if (itemText === "") {
    return;
  }

  let li = document.createElement("li");
  li.classList.add("list-item")

  let previewDiv = document.createElement("div");
  previewDiv.classList.add("preview");

  let checkbox = document.createElement("input");
  checkbox.classList.add("checkbox");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", (event) => {
    if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
      toggleComplete(event.target);
    }
  });

  let itemName = document.createElement("p");
  itemName.classList.add("paragraph");
  itemName.textContent = itemText;
  itemName.addEventListener("dblclick", (event) => {
    const elItem = event.target.closest(".list-item");
    const elPreview = elItem.querySelector(".preview");
    const elEdit = elItem.querySelector(".edit");

    elPreview.classList.add("hidden");
    elEdit.classList.remove("hidden");
    elEdit.focus();
  })

  let remove = document.createElement("div");
  remove.classList.add("remove");
  remove.innerHTML = "×";
  remove.addEventListener("click", (event) => {
    removeTodo(event.target);
  });

  let editInput = document.createElement("input");
  editInput.value = itemText;
  editInput.classList.add("edit");
  editInput.classList.add("hidden");
  editInput.type = "text";
  editInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const newItem = event.target.value.trim();
      if (newItem === "") {
        event.target.removeEventListener("focusout", editElement);
      }
      editElement(event);
    }
  })
  editInput.addEventListener("focusout", editElement);

  previewDiv.appendChild(checkbox);
  previewDiv.appendChild(itemName);
  previewDiv.appendChild(remove);

  li.appendChild(previewDiv);
  li.appendChild(editInput);

  elList.appendChild(li);

  elAddInput.value = "";
  refreshAppearance();
}

function editElement(event) {
  const newItem = event.target.value.trim();
  const elItem = event.target.closest(".list-item");

  if (newItem === "") {
    elItem.remove();
    refreshAppearance();
    return
  }

  const elPreview = elItem.querySelector(".preview");
  const elEdit = elItem.querySelector(".edit");
  const itemName = elItem.querySelector(".paragraph");

  itemName.textContent = newItem;
  elPreview.classList.remove("hidden");
  elEdit.classList.add("hidden");
}

function removeTodo(target) {
  target.closest(".list-item").remove();
  refreshAppearance();
}

function toggleComplete(target) {
  let LiElement = target.closest(".list-item");
  LiElement.classList.toggle("done");
  refreshAppearance();
}

function selectAll() {
  let listItems = document.querySelectorAll(".list-item");
  let listItemsDone = document.querySelectorAll(".list-item.done");

  if (listItemsDone.length < listItems.length) {
    listItems.forEach((el) => {
      el.classList.add("done");
      let checkbox = el.querySelector(".checkbox")
      checkbox.checked = true;
    })
  } else {
    listItems.forEach((el) => {
      el.classList.remove("done")
      let checkbox = el.querySelector(".checkbox")
      checkbox.checked = false;
    })
  }

  refreshAppearance();
}

function refreshAppearance() {
  refreshArrow();
  refreshFooter();
  applyFilter(currentFilter);
}

function refreshFooter() {
  const elFooter = document.getElementById("footer");
  const elItemsLeft = document.getElementById("itemsLeft");
  let listItems = document.querySelectorAll(".list-item").length;
  let listItemsDone = document.querySelectorAll(".list-item.done").length;

  if (listItems === 0) {
    elFooter.classList.add("hidden");
  } else {
    elFooter.classList.remove("hidden");
  }

  if (listItemsDone === 0) {
    elRemoveAllDone.classList.add("hidden");
  } else {
    elRemoveAllDone.classList.remove("hidden")
  }

  elItemsLeft.innerText = listItems - listItemsDone + " items left"
}

function refreshArrow() {
  let listItems = document.querySelectorAll(".list-item").length;
  let listItemsDone = document.querySelectorAll(".list-item.done").length;

  elArrow.classList.remove("invisible");
  elArrow.classList.remove("darker");

  if (listItems === 0) {
    elArrow.classList.add("invisible");
  } else if (listItems === listItemsDone) {
    elArrow.classList.add("darker");
  }
}

function applyFilter(name) {
  const filters = [].slice.call(document.getElementById("filters").children);
  if (!filters) {
    return
  }

  currentFilter = name;

  filters.forEach((el) => {
    if (el.innerText === name) {
      el.classList.add("active")
    } else {
      el.classList.remove("active")
    }
  });

  let listItems = document.querySelectorAll(".list-item")
  let listItemsDone = document.querySelectorAll(".list-item.done")

  listItems.forEach((el) => {
    el.classList.remove("hidden")
  });

  if (name === "Active") {
    listItemsDone.forEach((el) => {
      el.classList.add("hidden");
    })
  } else if (name === "Completed") {
    listItems.forEach((el) => {
      el.classList.add("hidden")
    });
    listItemsDone.forEach((el) => {
      el.classList.remove("hidden");
    })
  }
}

refreshAppearance();


