class ToDoList{
  constructor(addButton, deleteButton, editButton, msgEl, inputText, listEl){
    this.addButton = addButton;
    this.deleteButton = deleteButton;
    this.editButton = editButton;
    this.msgEl = msgEl;
    this.inputText = inputText;
    this.listEl = listEl;
  }

  getData() {
    if(localStorage.toDoList) return JSON.parse(localStorage.toDoList);

    return false;
  }

  validate(name) {
    let answer = true;
    if(name.length >= 5){
      const toDoList = this.getData();
      if(toDoList) {

        for (let i = 0; i < toDoList.length; i++) {

          if(toDoList[i].name === name) {
            answer = {};
            answer.valid = false;
            answer.msg = `To-do: ${name} already exists`;
            break;
          }
        }
      }
    } else {
      answer = {};
      answer.valid = false;
      answer.msg = "To-do must have at least 5 symbols length";
    }
    return answer;
  }

  notify(msg, elementRef) {
    elementRef ? elementRef.style.cssText = "border-bottom: 1px solid red" : false;
    this.msgEl.innerText = msg;
  }

  add() {
    let toDoList = this.getData();
    const toDo = {};

    if(toDoList) {
      const lastId = toDoList[toDoList.length - 1].id;
      toDo.id = lastId + 1;
      toDo.name = this.inputText.value;
      toDo.done = false;
    } else {
      toDoList = [];
      toDo.id = 1;
      toDo.name = this.inputText.value;
      toDo.done = false;
    }

    const validToDo = this.validate(toDo.name);

    if(validToDo === true){
      toDoList.push(toDo);
      localStorage.setItem("toDoList", JSON.stringify(toDoList));
      this.inputText.value = "";
      this.msgEl.innerText = "";
      this.inputText.style.cssText = "border-bottom: 1px solid black";
      this.listToHtml(toDoList);
    }

    else this.notify(validToDo.msg, this.inputText);
  }

  setDone(id) {
    const updateTodos = this.getData();
    const foundInd = updateTodos.findIndex(toDo => toDo.id == id);

    if(foundInd > -1) {
      updateTodos[foundInd].done = !updateTodos[foundInd].done;
    }

    localStorage.setItem("toDoList", JSON.stringify(updateTodos));
    this.listToHtml(updateTodos);
  }

  createTodo(toDo) {
    const li = document.createElement("li");
    const navDiv = document.createElement("div");
    const spanEdit = document.createElement("span");
    const spanDelete = document.createElement("span");
    const spanCheck = document.createElement("span");
    const input = document.createElement("input");
    const doneDiv = document.createElement("div");
    navDiv.setAttribute("class", "edit-delete");
    spanEdit.setAttribute("class", "edit-icon");
    spanEdit.innerHTML = `<i class="fa fa-edit"></i>`;
    spanDelete.setAttribute("class", "delete-icon");
    spanDelete.innerHTML = `<i class="fa fa-trash-o"></i>`;
    spanCheck.setAttribute("class", "check-done");
    spanCheck.innerHTML = `<i class="fa fa-check-circle"></i>`;
    navDiv.append(spanEdit);
    navDiv.append(spanDelete);
    li.append(navDiv);
    input.setAttribute("value", toDo.name);

    if(toDo.done) {
      input.classList.add("to-do-done", "to-do-text")
    } else {
      input.setAttribute("class", "to-do-text");
    }

    input.setAttribute("disabled", true);
    li.append(input);
    doneDiv.setAttribute("class", "done");
    doneDiv.append(spanCheck);
    li.append(doneDiv);

    spanCheck.addEventListener("click", () => this.setDone(toDo.id));


    this.listEl.append(li);
  }

  listToHtml(todos) {
    this.listEl.innerHTML = "";

    todos.sort( (a, b) => a.done > b.done ? 1 : -1 );

    todos.forEach( toDo => this.createTodo(toDo) );
  }

  use() {
    const toDoList = this.getData();//retrive initial data

    if(toDoList) this.listToHtml(toDoList);//render initial data
    else this.notify("To-do list is empty");

    this.addButton.onclick = () => this.add();//add todo
  }
}
const inputText = document.querySelector("#to-do-input");
const addButton = document.querySelector("#to-do-add");
const deleteButton = document.querySelectorAll(".delete-icon");
const editButton = document.querySelectorAll(".edit-icon");
const msgEl = document.querySelector("#msg");
const listEl = document.querySelector("#to-do-list > ul");

const toDoList = new ToDoList(addButton, deleteButton, editButton, msgEl, inputText, listEl);
toDoList.use();