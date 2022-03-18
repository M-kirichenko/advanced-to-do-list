class ToDoList{
    constructor(addButton, deleteButton, editButton, msgEl,inputText){
        this.addButton = addButton;
        this.deleteButton = deleteButton;
        this.editButton = editButton;
        this.msgEl = msgEl;
        this.inputText = inputText;
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
    notify(type, msg, elementRef){
        let msgColor;
        if(type==="warning"&&elementRef) {
            msgColor = "red";
            elementRef.style.cssText = `border-bottom: 1px solid ${msgColor}`;
        }
        else if(type==="success") {
            msgColor = "green";
            elementRef.style.cssText = "border-bottom: 1px solid black";
            setTimeout(()=>this.msgEl.innerText = "", 1000);
        }
        this.msgEl.style.color = msgColor;
        this.msgEl.innerText = msg;
    }
    add(){
        this.addButton.onclick = ()=>{
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
                this.notify("success", `To-do #${toDo.id} was successfuly added`, this.inputText);
                this.inputText.value = "";
            }
            else this.notify("warning", validToDo.msg, this.inputText);
        }
    }
    edit(){

    }
    delete(){

    }
    use(){
       this.add();
    }
}
const inputText = document.querySelector("#to-do-input");
const addButton = document.querySelector("#to-do-add");
const deleteButton = document.querySelectorAll(".delete-icon");
const editButton = document.querySelector(".edit-icon");
const msgEl = document.querySelector("#msg");

const toDoList = new ToDoList(addButton, deleteButton, editButton, msgEl, inputText);
toDoList.use();