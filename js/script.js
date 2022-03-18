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
                    if(toDoList[i].name==name){
                        answer = {};
                        answer.valid = false;
                        answer.msg = "To-do already exists";
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
        elementRef?elementRef.style.cssText = "border-bottom: 1px solid red":false;
        this.msgEl.innerText = msg;
    }
    add(){
        let toDoList = this.getData();
        const toDo = {};
        if(toDoList){
            const lastId = toDoList[toDoList.length-1].id;
            toDo.id = lastId+1;
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
            toDoList.push(toDo);
            localStorage.setItem("toDoList", JSON.stringify(toDoList));
            this.inputText.value = "";
            this.msgEl.innerText="";
            this.inputText.style.cssText="border-bottom: 1p solid black";
            this.listEl.innerHTML = this.listToHtml(toDoList);
        }
        else this.notify(validToDo.msg, this.inputText);
    }
    edit(){

    }
    delete(){

    }
    listToHtml(todos){
        let list = "";
        todos.forEach(toDo=>{
            list+=`
                <li>
                    <div class="edit-delete">
                        <span class="edit-icon"><i class="fa fa-edit"></i></span>
                        <span class="delete-icon"><i class="fa fa-trash-o"></i></span>
                    </div>
                <input class="to-do-text" value="${toDo.name}" disabled>
                    <div class="done">
                        <i class="fa fa-check-circle"></i>
                    </div>
                </li>`;
        });
        return list;
    }
    use(){
        const toDoList = this.getData();
        if(toDoList) this.listEl.innerHTML = this.listToHtml(toDoList);
        else this.notify("To-do list is empty");
        this.addButton.onclick = ()=>this.add();
    }
}
const inputText = document.querySelector("#to-do-input");
const addButton = document.querySelector("#to-do-add");
const deleteButton = document.querySelectorAll(".delete-icon");
const editButton = document.querySelector(".edit-icon");
const msgEl = document.querySelector("#msg");
const listEl = document.querySelector("#to-do-list > ul");

const toDoList = new ToDoList(addButton, deleteButton, editButton, msgEl, inputText, listEl);
toDoList.use();