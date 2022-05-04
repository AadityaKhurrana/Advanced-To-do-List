let addBtn = document.querySelector(".add-btn");
let body = document.querySelector("body");
let modal_Cont = document.querySelector(".modal-cont");
let ticketMain = document.querySelector(".main-cont");
let colorPriority = document.querySelectorAll(".priority-color");
let taskText = document.querySelector(".textarea-cont");
let deleteIt = document.querySelector(".remove-btn");
let navBarColor = document.querySelectorAll(".color");


let deleteFlag = false;
let popUp = false;

let colors = ["pink", "green", "blue", "black"];
let defaultColor = colors[colors.length - 1];
let taskData;
let selectedColor;
let ticketArr=[];

// get all ticket from local Storage
if(localStorage.getItem('tickets'))
{
  ticketArr=JSON.parse(localStorage.getItem('tickets'))
  ticketArr.map(function(e)
  {
    createTicket(e.ticketColor,e.ticketData,e.ticketId);
  })
}


// navbar color filter
// approach: we basically store tickets in array of object when we click on color filter those ticket 
// and remove all ticket from screen and create selected tickets
navBarColor.forEach(function (colElem) {
  colElem.addEventListener("click", function (e) {
    selectedColor = colElem.classList[0];
    //console.log(selectedColor);

    let newTickets=ticketArr.filter(function(ticketObj){
      return selectedColor===ticketObj.ticketColor;
    })

    // remove previous tickets
    let allTickets=document.querySelectorAll('.ticket-cont');
    for(let i=0;i<allTickets.length;i++)
    {
      allTickets[i].remove();
    }

    newTickets.forEach(function(filterObj){
      createTicket(filterObj.ticketColor,filterObj.ticketData,filterObj.ticketId);
    })


  });
});

// take back all tickets

navBarColor.forEach(function (colElem) {
  colElem.addEventListener("dblclick", function (e) {
    // remove
    let allTickets=document.querySelectorAll('.ticket-cont');
    for(let i=0;i<allTickets.length;i++)
    {
      allTickets[i].remove();
    }

    ticketArr.map(function(e){
         createTicket(e.ticketColor,e.ticketData,e.ticketId)
    })
  });
});


// display pop up for enter task
modal_Cont.style.display = "none";
addBtn.addEventListener("click", function (e) {
  // display popup
  if (popUp) {
    modal_Cont.style.display = "none";
    popUp = false;
  } else {
    modal_Cont.style.display = "flex";
    popUp = true;
  }
});
//Changing Priority Colors
colorPriority.forEach(function (colorElem) {
  colorElem.addEventListener("click", function (e) {
    colorPriority.forEach(function (PriorityColorElem) {
      PriorityColorElem.classList.remove("active");
    });
    colorElem.classList.add("active");
    defaultColor = colorElem.classList[0];
  });
});

// generating a ticket
modal_Cont.addEventListener("keydown", function (e) {
  if (e.key === "Shift") {
    createTicket(defaultColor, taskText.value);
    modal_Cont.style.display = "none";
    popUp = false;
    taskText.value = "";
  }
});

function createTicket(ticketColor, taskData , ticketId) {
  let ticket = document.createElement("div");
  let id=ticketId || shortid();
  ticket.setAttribute("class", "ticket-cont");
  ticket.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                      <div class="ticket-id">#${id}</div>
                      <div class="task-area">${taskData}</div>
                      <div class="ticket-lock">
                      <i class="fa-solid fa-lock"></i>
                        </div>`;

  ticketMain.appendChild(ticket);
  handleRemove(ticket);
  handleLock(ticket);
  handleColor(ticket);
  if(!ticketId)
  {
    ticketArr.push({ticketColor, taskData , ticketId:id});
    localStorage.setItem('tickets',JSON.stringify(ticketArr))
  }
  
}
// ticket id is use to make filter and storage easy

// delete tasks
deleteIt.addEventListener("click", function (e) {
  deleteFlag = !deleteFlag;
  if (deleteFlag == true) {
    deleteIt.style.backgroundColor = "#485460";
    deleteIt.classList.add("active");
  } else {
    deleteIt.style.backgroundColor = "#3d3d3d";
    deleteIt.classList.remove("active");
  }
});
function handleRemove(ticket) {
  ticket.addEventListener("click", function () {
    if (deleteFlag == true) {
      ticket.remove();
    }
  });
}

// lock and unlock
function handleLock(ticket) {
  let lockElem = ticket.querySelector(".ticket-lock");
  let ticketLockChildern = lockElem.children[0];
  let taskArea=ticket.querySelector('.task-area');

  ticketLockChildern.addEventListener("click", function (e) {
    if (ticketLockChildern.classList.contains("fa-lock")) {
      ticketLockChildern.classList.remove("fa-lock");
      ticketLockChildern.classList.add("fa-lock-open");
      taskArea.setAttribute('contenteditable','true');
    //   handleColor(ticket)

    } else {
      ticketLockChildern.classList.remove("fa-lock-open");
      ticketLockChildern.classList.add("fa-lock");
      taskArea.setAttribute('contenteditable','false');
    }
  });
}

// color change
function handleColor(ticket)
{
    let ticketColorStrip=ticket.querySelector('.ticket-color');
    ticketColorStrip.addEventListener('click',function(e)
    {
        let stripColor=ticketColorStrip.classList[1];
        let colorIdx=colors.findIndex(function(color){
            return color===stripColor
        })
        colorIdx++;
        let newColorIdx=colorIdx%colors.length
        ticketColorStrip.classList.remove(stripColor);
        ticketColorStrip.classList.add(colors[newColorIdx])
    })
}