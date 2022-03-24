class ToDoList {
  constructor(addButton, deleteButton, editButton, msgEl, inputText, listEl) {
    this.addButton = addButton;
    this.deleteButton = deleteButton;
    this.editButton = editButton;
    this.msgEl = msgEl;
    this.inputText = inputText;
    this.listEl = listEl;
  }

  getData() {
    if(localStorage.toDoList) 

    return JSON.parse(localStorage.toDoList);

    return false;
  }

  validate(name, id = false) {
    let answer = true;

    if(name.length >= 5) {
      const toDoList = this.getData();

      if(toDoList) {
        for (let i = 0; i < toDoList.length; i++) {

          if(
              toDoList[i].name === name && 
              toDoList[i].id != id
            ) {
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

    if(validToDo === true) {
      toDoList.push(toDo);
      localStorage.setItem("toDoList", JSON.stringify(toDoList));
      this.inputText.value = "";
      this.msgEl.innerText = "";
      this.inputText.removeAttribute("style");
      this.listToHtml(toDoList);
    } else {
      this.notify(validToDo.msg, this.inputText);
    }
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

  find(id) {
    const toDoList = this.getData();
    let foundToDo = false;
    const foundInd = toDoList.findIndex( toDo => toDo.id == id );
      
    if(foundInd > -1) foundToDo = toDoList[foundInd];

    return foundToDo;
  }
    
  update(id, newVal, activeInput) {
    let answer = true;
    const toDoList = this.getData(); 
    const founInd = toDoList.findIndex( toDo => toDo.id == id );

    if(founInd > -1) {
      const validToDo = this.validate(newVal, id);

      if(validToDo === true) {
        toDoList[founInd].name = newVal;
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
      } else {
        this.notify(validToDo.msg, activeInput);
        answer = false;
      }
    }

    return answer;
  }

  edit(target, id) {
    const toDoParent = target.parentElement.parentElement.parentElement;
    const toDoInput = toDoParent.querySelector(".to-do-text");
    const undoIcon = toDoParent.querySelector(".undo-icon");
    toDoInput.disabled = false;
    toDoInput.focus();
    toDoInput.addEventListener("keyup", ( {keyCode} ) => {
      this.msgEl.innerText = "";
      this.inputText.removeAttribute("style");
      this.inputText.value = "";

      if(keyCode === 13) {
        const updated = this.update(id, toDoInput.value, toDoInput);

        if(updated) {
          toDoInput.disabled = true;
          this.msgEl.innerHTML = "";
          toDoInput.removeAttribute("style");
        }
      }
    });

    undoIcon.addEventListener("click", () => {
      this.msgEl.innerText = "";
      const foundToDo = this.find(id);

      if(foundToDo) {
        toDoInput.value = foundToDo.name;
        toDoInput.removeAttribute("style");
      }

      toDoInput.disabled = true;
    });
  }

  createTodo(toDo) {
    const li = document.createElement("li");
    const navDiv = document.createElement("div");
    const spanEdit = document.createElement("span");
    const spanDelete = document.createElement("span");
    const spanCheck = document.createElement("span");
    const input = document.createElement("input");
    const doneDiv = document.createElement("div");
    const spanUndo = document.createElement("span");
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
    spanUndo.setAttribute("class", "undo-icon");
    spanUndo.innerHTML = `<i class="fa fa-undo" aria-hidden="true"></i>`;
    doneDiv.append(spanUndo);
    doneDiv.append(spanCheck);
    li.append(doneDiv);
    this.listEl.append(li);

    spanEdit.addEventListener("click", ({target}) => this.edit(target, toDo.id));
    spanDelete.addEventListener("click", () => this.delete(toDo.id));
    spanCheck.addEventListener("click", () => this.setDone(toDo.id));
  }

  delete(id) {
    const toDoList = this.getData();
    const newToDos = toDoList.filter( item => item.id !== id );
    localStorage.setItem("toDoList", JSON.stringify(newToDos));
       
    if(newToDos.length < 1 ) {
      localStorage.removeItem("toDoList");
      this.notify("To-do list is empty");
    }

    this.listToHtml(newToDos);
  }

  listToHtml(todos) {
    this.listEl.innerHTML = "";
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