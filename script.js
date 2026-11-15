"use strict";

/* Shared: footer year and mobile menu */
document.getElementById("year").textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

/* Home: greeting changes with the time of day */
const greeting = document.getElementById("greeting");
if (greeting) {
  const hour = new Date().getHours();
  const word = hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";
  greeting.textContent = word;
}

/* Planner: add, complete and delete tasks (saved in the browser) */
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  const error = document.getElementById("taskError");
  const count = document.getElementById("taskCount");
  const empty = document.getElementById("emptyMsg");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function render(newId) {
    list.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");
      if (task.id === newId) li.classList.add("pop");

      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark task as completed");
      box.addEventListener("change", () => toggleTask(task.id));

      const text = document.createElement("span");
      text.className = "text";
      text.textContent = task.text;

      const del = document.createElement("button");
      del.className = "del";
      del.type = "button";
      del.textContent = "Delete";
      del.addEventListener("click", () => deleteTask(task.id));

      li.append(box, text, del);
      list.appendChild(li);
    });
    const left = tasks.filter((t) => !t.done).length;
    count.textContent = tasks.length ? `${left} of ${tasks.length} still to do` : "";
    empty.hidden = tasks.length > 0;
  }

  function addTask(text) {
    const task = { id: Date.now(), text, done: false };
    tasks.push(task);
    save();
    render(task.id);
  }

  function toggleTask(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      error.textContent = "Type a task first, then press Add task.";
      input.focus();
      return;
    }
    error.textContent = "";
    addTask(text);
    input.value = "";
    input.focus();
  });

  render();
}

/* Contact: form validation */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const success = document.getElementById("formSuccess");
  const rules = {
    name: (v) => (v ? "" : "Please enter your name."),
    email: (v) => {
      if (!v) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "That email doesn't look right. Try name@example.com.";
    },
    phone: (v) => {
      if (!v) return "Please enter your phone number.";
      return /^\d+$/.test(v) ? "" : "Use digits only, with no spaces, plus signs or dashes.";
    },
    message: (v) => (v ? "" : "Please write a short message."),
  };

  function check(field) {
    const el = contactForm.elements[field];
    const msg = rules[field](el.value.trim());
    document.getElementById(field + "Error").textContent = msg;
    el.closest(".field").classList.toggle("invalid", msg !== "");
    return msg === "";
  }

  Object.keys(rules).forEach((field) => {
    contactForm.elements[field].addEventListener("blur", () => check(field));
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    success.textContent = "";
    const results = Object.keys(rules).map(check);
    if (results.every(Boolean)) {
      const first = contactForm.elements.name.value.trim().split(" ")[0];
      success.textContent = `Thanks, ${first}! Your message is on its way. I'll reply soon.`;
      contactForm.reset();
    }
  });
}
