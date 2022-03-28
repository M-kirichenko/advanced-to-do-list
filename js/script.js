class ToDoList {
  _api_base = "http://localhost:8000";
  constructor(addButton, deleteButton, editButton, msgEl, inputText, listEl) {
    this.addButton = addButton;
    this.deleteButton = deleteButton;
    this.editButton = editButton;
    this.msgEl = msgEl;
    this.inputText = inputText;
    this.listEl = listEl;
  }

  getData() {
     return fetch(`${this._api_base}/allTasks`)
    .then(response => response.json());
  }
  
  validate(text, id = false) {

    if(text.length >= 5) {
      const toDoList = this.getData();

      return toDoList.then(({data}) => {
        if(data.length) {
          for (let i = 0; i < data.length; i++) {
            if(
                data[i].text === text && 
                data[i].id != id
              ) {
                return `To-do: ${text} already exists`;
            }
          }
        }
        return true;
      });

    } else {
      return "To-do must have at least 5 symbols length";
    }
  }

  notify(msg, elementRef) {
    elementRef ? elementRef.style.cssText = "border-bottom: 1px solid red" : false;
    this.msgEl.innerText = msg;
  }

  async add() {
    const toDo = {text: this.inputText.value, isCheck: false};
    const validToDo = await this.validate(toDo.text);

    if(validToDo === true) {
      this.inputText.removeAttribute("style");

      fetch(`${this._api_base}/createTask`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toDo)
      })
      .then( response => response.json() )
      .then( ({data}) => {
        this.inputText.value = "";
        this.msgEl.innerText = "";
        this.listToHtml(data)
      });
    } else this.notify(validToDo);
  }
  
  async setIsCheck(id) {
    let isCheck;
    const found = await this.find(id);

    if(found) isCheck = !found.isCheck;

    this.updateRequest( {id, isCheck} );
  }

  async find(id) {
    const toDoList = this.getData();

    return await toDoList.then( ({data}) => {
      const foundInd = data.findIndex(toDo => toDo.id == id );

      if(foundInd > -1) return data[foundInd];

      return false;
    });
  }
    
  async update(id, newVal, activeInput) {
    let answer = true;
    const toDoList = this.getData(); 

    const found = await this.find(id);

    if(found) {
      const validToDo = await this.validate(newVal, id);

      if(validToDo === true) {
        this.updateRequest({id, text: newVal});
      } else {
        this.notify(validToDo, activeInput);
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
      
      foundToDo.then(toDo => {
        if(toDo) {
          toDoInput.value = toDo.text;
          toDoInput.removeAttribute("style");
        }
        
        toDoInput.disabled = true;
      });
    });
  }

  updateRequest(toDo){
    fetch(`${this._api_base}/updateTask`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toDo)
    }).
    then( response => response.json() )
    .then( ({data}) => {
      this.inputText.value = "";
      this.msgEl.innerText = "";
      this.listToHtml(data)
    });
  }

  createTodo(toDo) {
    const li = document.createElement("li");
    const navDiv = document.createElement("div");
    const spanEdit = document.createElement("span");
    const spanDelete = document.createElement("span");
    const spanCheck = document.createElement("span");
    const input = document.createElement("input");
    const isCheckDiv = document.createElement("div");
    const spanUndo = document.createElement("span");
    navDiv.setAttribute("class", "edit-delete");
    spanEdit.setAttribute("class", "edit-icon");
    spanEdit.innerHTML = `<i class="fa fa-edit"></i>`;
    spanDelete.setAttribute("class", "delete-icon");
    spanDelete.innerHTML = `<i class="fa fa-trash-o"></i>`;
    spanCheck.setAttribute("class", "check-isCheck");
    spanCheck.innerHTML = `<i class="fa fa-check-circle"></i>`;
    navDiv.append(spanEdit);
    navDiv.append(spanDelete);
    li.append(navDiv);
    input.setAttribute("value", toDo.text);

    if(toDo.isCheck) {
      input.classList.add("to-do-done", "to-do-text")
    } else {
      input.setAttribute("class", "to-do-text");
    }
    
    input.setAttribute("disabled", true);
    li.append(input);
    isCheckDiv.setAttribute("class", "done");
    spanUndo.setAttribute("class", "undo-icon");
    spanUndo.innerHTML = `<i class="fa fa-undo" aria-hidden="true"></i>`;
    isCheckDiv.append(spanUndo);
    isCheckDiv.append(spanCheck);
    li.append(isCheckDiv);
    this.listEl.append(li);

    spanCheck.addEventListener("click", ({target}) => {
        let inp = target.parentElement.parentElement.parentElement;
        inp = inp.querySelector(".to-do-text");

        if(!inp.disabled) this.notify("finish editing first", inp);
        else this.setIsCheck(toDo.id);
    });

    spanDelete.addEventListener("click", () => this.delete(toDo.id));

    spanEdit.addEventListener("click", ({target}) => {
        if(!toDo.isCheck) this.edit(target, toDo.id)
    });
  }

  delete(id) {
    fetch(`${this._api_base}/deleteTask?id=${id}`, {
      method: 'DELETE',
    })
    .then( response => response.json() )
    .then( ({data}) => {
      this.listToHtml(data);

      if(!data.length) this.notify("To-do list is empty");
    });
  }

  listToHtml(todos) {
    this.listEl.innerHTML = "";
    todos.sort( (a, b) => a.isCheck > b.isCheck ? 1 : -1 );
    todos.forEach(toDo =>  this.createTodo(toDo));
  }

  use() {
    const toDoList = this.getData();//retrive initial data
    toDoList.then( ({data}) => {
      if(data.length) this.listToHtml(data);
      else this.notify("To-do list is empty");
    });
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