from logging import DEBUG
import gevent
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler

from flask import Flask, render_template, request

from flask_socketio import SocketIO,send,emit,join_room,leave_room


app= Flask('chatApp',static_folder='static',template_folder='templates')
app.config['SECRET_KEY']='super_secret_key'
socketio=SocketIO(app,async_mode='gevent')



@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('message')
def handel_message(msg):
    print(f'Server has received message: {msg}')

@socketio.event
def joinRoom(msg):
    print(msg)
    join_room(msg['room'])
    emit("roomJoined",{
        'user':request.sid,
        'room':msg['room'],
    },to=msg['room'])

@socketio.event
def leaveRoom(msg):
    emit('roomLeftPersonal',
         {
             'room':msg['room'],
             'user':request.sid,
                             })
    leave_room(msg['room'])
    emit('roomLeft',{'room':msg['room'],'user':request.sid},to=msg['room'])

@socketio.event
def sendMsg(msg):
    emit("sendToAll",{
        "msg":msg['msg'],
        "user":request.sid,
    },to=msg['room'])

if __name__=="__main__":
    # app.run(debug=True,threaded=True)
    # socketio.run(app)
    # 打印启动信息
    print(f" * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)")
    # 使用 gevent 的 WSGIServer 启动应用
    server = pywsgi.WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()