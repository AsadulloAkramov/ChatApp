(function(){
    let socket = io();
    const app = document.querySelector('.app');
    let uname;

    app.querySelector('.chat-screen #send-message').addEventListener('click' ,()=>{
        let message = app.querySelector('.chat-screen #message-input').value ;
        if(message.length ==0){

            return ;
        }
        renderMessage("other" ,{
            username:uname,
            text:message
        })
      socket.emit('chat' ,{
        username:uname,
        text:message
      })
      app.querySelector('.chat-screen #message-input').value =""
    })


    function renderMessage(type , message){
        let messageContainer = app.querySelector('.chat-screen .messages');
        if(type =="my"){
                let el = document.createElement("div");
                el.setAttribute('class' ,'message my-message');
                el.innerHTML =`
                    <div> 
                        <div class="name"> You </div>
                        <div class="text"> ${message.text} </div>
                    </div>
                ` ;
                messageContainer.appendChild(el);
        }


        else if(type=="other"){
            let el = document.createElement("div");
            el.setAttribute('class' ,'message other-message');
            el.innerHTML =`
                <div> 
                    <div class="name"> ${message.username} </div>
                    <div class="text"> ${message.text} </div>
                </div>
            ` ;
            messageContainer.appendChild(el);
        }
        else if(type=="update")
        {
            let el = document.createElement("div");
            el.setAttribute('class' ,'update');
            el.innerText =message;
            messageContainer.appendChild(el);
        }
        // scroll chat to the end
       messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})()