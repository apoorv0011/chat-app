const express=require ('express') //inintialize our express application
const path=require('path')
const app=express()
const PORT=process.env.PORT || 4000
const server=app.listen(PORT,()=>console.log(`💬 sever on port ${PORT}`) )

const io=require('socket.io')(server) //Initialize the web socket server this is a static thing
app.use(express.static(path.join(__dirname,'public'))) /*We can directly pass in the public folder name or the public folder path but for this a package is there in express named path 2nd line __dirname is for currently working directory*/ 
 
let socketsConnected=new Set() //We are using set because each socket id is unique, we donmt want duplicate values of our socket ids in our set.


io.on('connection',onConnected)//listen on a event for this io
    


function onConnected(socket){
    console.log(socket.id) //id of the socket which is cnnected to a web socket server
    socketsConnected.add(socket.id) //Set would connect the socket id now
    
    io.emit('clients-total', socketsConnected.size)//So that we can show the emitted part client side
    
    socket.on('disconnect',()=>{
        console.log('Socket disconnected',socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit('chat-message',data)
    })
}