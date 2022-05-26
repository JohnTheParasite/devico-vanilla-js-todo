let el_list = document.getElementById("TodoList");
let el_addInput = document.getElementById("TodoInput");
let el_removeAllDone = document.getElementById("RemoveAllDone");
let currentFilter = "All";

el_addInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    createTodo();
  }
});

el_removeAllDone.addEventListener("click", () => {
  let listItemsDone = document.querySelectorAll(".list-item.done");
  listItemsDone.forEach((el) => {
    el.remove();
  });
  refreshAppearance();
});

function createTodo() {
  let itemText = el_addInput.value.trim();
  if (itemText === "") {
    return;
  }

  let li = document.createElement("li");
  li.classList.add("list-item")

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

  let remove = document.createElement("div");
  remove.classList.add("remove");
  remove.innerHTML = "×";
  remove.addEventListener("click", (event) => {
    removeTodo(event.target);
  });

  li.appendChild(checkbox);
  li.appendChild(itemName);
  li.appendChild(remove);

  el_list.appendChild(li);

  el_addInput.value = "";
  refreshAppearance();
}

function removeTodo(target) {
  target.parentElement.remove();
  refreshAppearance();
}

function toggleComplete(target) {
  target.parentElement.classList.toggle("done");
  refreshAppearance();
}

function selectAll() {
  let listItems = document.querySelectorAll(".list-item");
  let listItemsDone = document.querySelectorAll(".list-item.done");

  if (listItemsDone.length < listItems.length) {
    listItems.forEach((el) => {
      el.classList.add("done");
      el.firstChild.checked = true;
    })
  } else {
    listItems.forEach((el) => {
      el.classList.remove("done")
      el.firstChild.checked = false;
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
  let el_footer = document.getElementById("footer");
  let el_itemsLeft = document.getElementById("ItemsLeft");
  let el_removeAllDone = document.getElementById("RemoveAllDone");
  let listItems = document.querySelectorAll(".list-item").length;
  let listItemsDone = document.querySelectorAll(".list-item.done").length;

  if (listItems === 0) {
    el_footer.classList.add("hidden");
  } else {
    el_footer.classList.remove("hidden");
  }

  if (listItemsDone === 0) {
    el_removeAllDone.classList.add("hidden");
  } else {
    el_removeAllDone.classList.remove("hidden")
  }

  el_itemsLeft.innerText = listItems - listItemsDone + " items left"
}

function refreshArrow() {
  let el_arrow = document.getElementById("Arrow");
  let listItems = document.querySelectorAll(".list-item").length;
  let listItemsDone = document.querySelectorAll(".list-item.done").length;

  el_arrow.classList.remove("invisible");
  el_arrow.classList.remove("darker");

  if (listItems === 0) {
    el_arrow.classList.add("invisible");
  } else if (listItems === listItemsDone) {
    el_arrow.classList.add("darker");
  }
}

function applyFilter(name) {
  let filters = [].slice.call(document.getElementById("filters").children);
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

  listItems.forEach((el) => { el.classList.remove("hidden") });

  if (name === "Active") {
    listItemsDone.forEach((el) => {
      el.classList.add("hidden");
    })
  } else if (name === "Completed") {
    listItems.forEach((el) => { el.classList.add("hidden") });
    listItemsDone.forEach((el) => {
      el.classList.remove("hidden");
    })
  }
}

refreshAppearance();


