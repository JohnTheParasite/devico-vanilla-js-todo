let list = document.getElementById("TodoList");
let addInput = document.getElementById("TodoInput");
let el_removeAllDone = document.getElementById("RemoveAllDone");

addInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    createTodo();
  }
});

el_removeAllDone.addEventListener("click", (event) => {
  let listItemsDone = document.querySelectorAll(".list-item.done");
  listItemsDone.forEach((el) => {
    el.remove();
  });
  refreshFooter();
});

function createTodo() {
  let itemText = addInput.value.trim();
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

  list.appendChild(li);

  addInput.value = "";

  refreshFooter();

};

function removeTodo(target) {
  target.parentElement.remove();
  refreshFooter();
};

function toggleComplete(target) {
  target.parentElement.classList.toggle("done");

  refreshFooter();
};

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

