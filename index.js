let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const storageKey = "tasks";

function showStorageError(message) {
  let status = document.querySelector(".to-do__storage-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "to-do__storage-status";
    status.setAttribute("role", "status");
    formElement.after(status);
  }
  status.textContent = message;
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) return [...items];
    const tasks = JSON.parse(saved);
    if (
      Array.isArray(tasks) &&
      tasks.every((task) => typeof task === "string")
    ) {
      return tasks;
    }
  } catch {
    showStorageError(
      "Не удалось прочитать сохранённые задачи. Показан начальный список.",
    );
  }
  return [...items];
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate",
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  let previousText = item;

  textElement.textContent = item;
  [deleteButton, duplicateButton, editButton].forEach((button) => {
    button.type = "button";
  });

  deleteButton.addEventListener("click", () => {
    clone.remove();
    items = getTasksFromDOM();
    saveTasks(items);
  });

  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
  });

  editButton.addEventListener("click", () => {
    previousText = textElement.textContent;
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    textElement.textContent = textElement.textContent.trim() || previousText;
    items = getTasksFromDOM();
    saveTasks(items);
  });

  textElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      if (event.key === "Escape") textElement.textContent = previousText;
      textElement.blur();
    }
  });

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((element) => tasks.push(element.textContent));
  return tasks;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    const status = document.querySelector(".to-do__storage-status");
    if (status) status.remove();
  } catch {
    showStorageError(
      "Не удалось сохранить задачи в браузере. Изменения доступны до перезагрузки страницы.",
    );
  }
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const itemName = inputElement.value.trim();
  if (!itemName) return;
  listElement.prepend(createItem(itemName));
  items = getTasksFromDOM();
  saveTasks(items);
  inputElement.value = "";
  inputElement.focus();
});

items = loadTasks();
items.forEach((item) => listElement.append(createItem(item)));
