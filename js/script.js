class ToDoList{
    constructor(addButton, deleteButton, editButton, msgEl, inputText, listEl){
        this.addButton = addButton;
        this.deleteButton = deleteButton;
        this.editButton = editButton;
        this.msgEl = msgEl;
        this.inputText = inputText;
        this.listEl = listEl;
    }

    getData(){
        if(localStorage.toDoList) return JSON.parse(localStorage.toDoList);
        return false;
    }

    validate(name){
        let answer = true;
        if(name.length >= 5){
            const toDoList = this.getData();
            if(toDoList){
                for (let i = 0; i < toDoList.length; i++) {
                    if(toDoList[i].name === name){
                        answer = {};
                        answer.valid = false;
                        answer.msg = `To-do: ${name} already exists`;
                        break;
                    }
                }
            }
        }

        else {
            answer = {};
            answer.valid = false;
            answer.msg = "To-do must have at least 5 symbols length";
        }
        
        return answer;
    }
    notify(msg, elementRef){
        elementRef ? elementRef.style.cssText = "border-bottom: 1px solid red" : false;
        this.msgEl.innerText = msg;
    }
    add(){
        let toDoList = this.getData();
        const toDo = {};

        if(toDoList){
            const lastId = toDoList[toDoList.length - 1].id;
            toDo.id = lastId + 1;
            toDo.name = this.inputText.value;
            toDo.done = false;
        }

        else{
            toDoList = [];
            toDo.id = 1;
            toDo.name = this.inputText.value;
            toDo.done = false;
        }

        const validToDo = this.validate(toDo.name);

        if(validToDo === true) {
            //if validation fails returns object with errors that's why i check it strictly
            toDoList.push(toDo);
            localStorage.setItem("toDoList", JSON.stringify(toDoList));
            this.inputText.value = "";
            this.msgEl.innerText = "";
            this.inputText.style.cssText = "border-bottom: 1px solid black";
            this.listToHtml(toDoList);
        }

        else this.notify(validToDo.msg, this.inputText);
    }

    createTodo(toDo){
        const li = document.createElement("li");
        const navDiv = document.createElement("div");
        const spanEdit = document.createElement("span");
        const spanDelete = document.createElement("span");
        const input = document.createElement("input");
        const doneDiv = document.createElement("div");

        navDiv.setAttribute("class", "edit-delete");

        spanEdit.setAttribute("class", "edit-icon");
        spanEdit.innerHTML = `<i class="fa fa-edit"></i>`;

        spanDelete.setAttribute("class", "delete-icon");
        spanDelete.innerHTML = `<i class="fa fa-trash-o"></i>`;


        navDiv.append(spanEdit);
        navDiv.append(spanDelete);

        li.append(navDiv);

        input.setAttribute("class", "to-do-text");
        input.setAttribute("value", toDo.name);
        input.setAttribute("disabled", true);

       
        li.append(input);

        doneDiv.setAttribute("class", "done");
        doneDiv.innerHTML = ` <i class="fa fa-check-circle"></i>`;

        li.append(doneDiv);

        spanEdit.addEventListener("click", () => this.delete(toDo.id));
        spanDelete.addEventListener("click", () => this.delete(toDo.id));
        
        this.listEl.append(li);
    }
    edit(){

    }
    delete(id){
        let toDoList = this.getData();
        const newToDos = toDoList.filter(item => item.id !== id ? true : false);

        localStorage.setItem("toDoList", JSON.stringify(newToDos));
        toDoList = this.getData();
        
        if(toDoList.length < 1 ) {
            localStorage.removeItem("toDoList");
            this.notify("To-do list is empty");
        }

        this.listToHtml(toDoList);
    }

    listToHtml(todos){
        this.listEl.innerHTML = "";
        todos.forEach(toDo => this.createTodo(toDo));
    }

    use(){
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