document.addEventListener('DOMContentLoaded',()=>{
    const chatContent = document.querySelector('#chatContent');
    let socket=io();
    socket.on('connect',()=>{
        socket.send('client has been connected!');
    });

    document.querySelector('#joinRoom').addEventListener('submit',(event)=>{
        //阻止默认表单的提交行为
        event.preventDefault();
        socket.emit('joinRoom',{
        room:document.querySelector('#roomNum').value
        });
  
    });
    socket.on("roomJoined",(msg,cb)=>{
        addMsgToChatCot(`${msg.user} 已加入房间: ${msg.room}`);
    });
    document.querySelector('#leaveRoom').addEventListener('click',()=>{
        socket.emit('leaveRoom',{
            room: document.querySelector('#roomNum').value,
        });
    });
    socket.on("roomLeftPersonal",(msg)=>{
        addMsgToChatCot(`您已退出房间: ${msg.room}`);
    });
    socket.on('roomLeft',(msg)=>{
        addMsgToChatCot(`${msg.user}已退出房间: ${msg.room}`);
    })

    document.querySelector('#submitForm').addEventListener('submit',(event)=>{
        event.preventDefault();
        socket.emit('sendMsg',{
            msg:document.querySelector('#chatMsg').value,
            room:document.querySelector('#roomNum').value,
        });
        document.querySelector('#chatMsg').value="";
    });
    socket.on("sendToAll",(msg,cb)=>{
        addMsgToChatCot(`${msg.user}发送了: ${msg.msg}`);
    });

});


function addMsgToChatCot(msg){
    const chatContent = document.querySelector('#chatContent');
    // 创建一个新的 <li> 元素
    let li = document.createElement('li');
    // 设置 <li> 元素的内容
    li.innerText=msg;
    // 将 <li> 元素追加到 chatContent 列表中
    chatContent.appendChild(li);
}