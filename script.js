// elements that we need to select is the plus sign in the action toolbar and the main container to append the created tickets 
//----------------------------------DOM ELEMENTS------------------------
let addbtn = document.querySelector('.add-btn')
let removebtn =document.querySelector('.remove-btn')
let modalCont = document.querySelector('.modal-cont')
let mainCont = document.querySelector('.main-cont')
// let taskAreaCont = document.querySelector('.task-area')
let textAreaCont = document.querySelector('.textArea-cont')
let allPriorityColors = document.querySelectorAll('.priority-color')
let colors =["lightpink","lightgreen","lightblue","black"];
let modalPriorityColor = colors[colors.length-1]; //default = black
const lockClose ="fa-lock"
const lockOpen ="fa-lock-open"
let ticketArr =[]

if(localStorage.getItem("tickets")){
    ticketArr =  JSON.parse(localStorage.getItem("tickets"))
    //Rebuilding the UI from the stored data
    for(let i=0;i<ticketArr.length;i++){
        //Getting each previously created ticket info from the stored data
        const {ticketColor,ticketID,ticketTask} = ticketArr[i];
        createTicket(ticketColor,ticketID,ticketTask);
    }
}


function addNewTicket(ticketColor,ticketTask){
    const id = shortid();
    //Pushing the ticket as an object(Updating the array with only ticketID, ticket color and ticket task )
    ticketArr.push({ticketColor,ticketID: id,ticketTask});
    localStorage.setItem("tickets",JSON.stringify(ticketArr));
    createTicket(ticketColor,id,ticketTask);
}

function getTicketIndex(id){
    for(let i=0;i<ticketArr.length;i++){
        if(ticketArr[i].ticketID=== id){
            return i;
        }
    }
    return -1;
}
 function updateLocalStorage(){
    localStorage.setItem("tickets",JSON.stringify(ticketArr));
 }

//----------------------------STATE FLAGS------------------------
let addTaskFlag= false;
let removeTaskFlag = false;

//--------------------EVENT LISTENERS----------------------------------------
addbtn.addEventListener('click',function(){ // flag was true 
    //flip the flag value
   addTaskFlag= !addTaskFlag;
    // Show or hide the modal
//    if(addTaskFlag){
//     modalCont.style.display = "flex";
//    }
//    else{
//     modalCont.style.display = "none";
//    }   
modalCont.style.display = addTaskFlag? "flex" :"none";

})
removebtn.addEventListener('click',function(){
    removeTaskFlag = !removeTaskFlag;
    if(removeTaskFlag){
        alert("Delete Mode Activated")
        removebtn.style.color ="red";
    }
    else{
        removebtn.style.color="white";
    }
})
//function to remove tickets 
function handleRemoval(ticket,id){
    ticket.addEventListener('click',function(){
        
        if(!removeTaskFlag) return;
        ticket.remove();
        

    let idx = getTicketIndex(id);
    //Remove the ticket from the ticket Array  
    ticketArr.splice(idx,1)
    updateLocalStorage();      
    
    })
}
//function to edit the tickets 
function handleLock(ticket,id) {
/**
select the lock element
figure out the child - i tag is with the class
if the class is open lock -> make it locked and vice versa
*/
const ticketLockElem = ticket.querySelector(".ticket-lock");
let index = getTicketIndex(id);
console.log("Upadating Ticket",id)
//  // icon element
const ticketTaskArea = ticket.querySelector(".task-area");
ticketLockElem.addEventListener("click", function () {
const ticketLockIcon = ticketLockElem.children[0];
if (ticketLockIcon.classList.contains(lockClose)) {
ticketLockIcon.classList.remove(lockClose);
ticketLockIcon.classList.add(lockOpen);
// make the task area editable
ticketTaskArea.setAttribute("contentEditable","true");

} else {
ticketLockIcon.classList.remove(lockOpen);
ticketLockIcon.classList.add(lockClose);
// make the taske area as non editable
ticketTaskArea.setAttribute("contentEditable","false");
}
//update the stored data in the array
ticketArr[index].ticketTask = ticketTaskArea.innerText;
localStorage.setItem("tickets",JSON.stringify(ticketArr));


});
}
//function to change the Priority of the ticket 
function handleColor(ticket,id){
    /***
     * Identify the color band that was clicked
     * Identify the index of the clicked color band in the colors array defined
     * Calculate the next color index that should appear and apply it to ticket
     */
    const index = getTicketIndex(id);
    let ticketColorband = ticket.querySelector(".ticket-color");
    ticketColorband.addEventListener('click',function(){
    let currentColor = ticketColorband.style.backgroundColor;
    let currentColorIndex = 0;
    for(let i=0;i<colors.length;i++){
      if(colors[i]===currentColor)
      {
        currentColorIndex=i;
        break;
      }
    }
    let nextColorIndex = (currentColorIndex+1)%colors.length;
    let newColor = colors[nextColorIndex];
    ticketColorband.style.backgroundColor= newColor;
    ticketArr[index].ticketColor = newColor;
    updateLocalStorage();
    })   
    
    
}
//Filtering Tickets Based on Color
//Select the action color buttons to add the listeners
let toolBoxColors = document.querySelectorAll('.color')
toolBoxColors.forEach(function(color){
//Add Listners to each of the colors in the Action ToolBar
color.addEventListener('click',function(){
//Selecting all the tickets here inorder to apply the filtering to all the currently present tickets 
    let tickets = document.querySelectorAll('.ticket-cont');
    let SelectedColor = color.classList[0];
    tickets.forEach(function(ticket){
    let ticketColor = ticket.querySelector('.ticket-color').style.backgroundColor;
    if(SelectedColor===ticketColor)
    ticket.style.display="";
    else
        ticket.style.display="none";
    })
})
//Double Clicking to display all the colors
color.addEventListener('dblclick',function(){
//Selecting all the tickets here inorder to apply the filtering to all the currently present tickets 
let tickets = document.querySelectorAll('.ticket-cont')
tickets.forEach(function(ticket){
ticket.style.display="";
})
})

})

// function to assemble or create the tickets on the UI
function createTicket(ticketcolor,ticketID,ticketTask){
    const ticketCont = document.createElement('div');
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML= `
            <div class="ticket-color" style="background-color:${ticketcolor}"></div>
            <div class="ticket-id">${ticketID}</div>
            <div class="task-area">${ticketTask}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>`;
      //append the created ticket to the main container
      mainCont.appendChild(ticketCont)   
      //add delete functionality, we will call a handleRemove
      handleRemoval(ticketCont,ticketID)
      //add edit functionality , we will pass the newly created ticket into handleLock function 
      handleLock(ticketCont,ticketID)
      //add functionality to change the priority of the ticket
      handleColor(ticketCont,ticketID)

}

// adding Event Listener for the SHIFT Key to create ticket
document.addEventListener("keydown",function(e){
    const keyPressed = e.key;
    console.log(document.activeElement);
    if(keyPressed === "Shift"){
        const taskContent = textAreaCont.value.trim();
        if(taskContent === ""){
            alert("Please enter a task before creating a ticket")
            return;
        }
        // const ticketID = shortid()
        addNewTicket(modalPriorityColor,taskContent)
        // createTicket(modalPriorityColor,ticketID,taskContent); //call the create ticket function to generate new ticket 
        modalPriorityColor = "black";
     modalCont.style.display= "none";
     addTaskFlag = false;
     textAreaCont.value=""//clear the user text for next input
    }
})

//Handle color selection for the ticket
allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0];
    })
})














