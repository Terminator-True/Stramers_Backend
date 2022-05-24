'use strict'

var mongoose = require('mongoose');
var fs = require('fs');
var https = require('https');
var app = require("./app")
var port = 443

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Stramers')
    .then(()=>{
        console.log("[+] BD connection ok");
        //Crea server
        const server = https.createServer({
            cert: fs.readFileSync('mi_certificado.crt'),
            key: fs.readFileSync('mi_certificado.key')
          },app)

          const io = require("socket.io")(server, {
            cors: {
                origin: "https://192.168.1.76",
                methods: ["GET","POST"]
            }
            }) 
            io.on("connection", function(socket){
                let roomId = Nrooms //Nrooms%2==0 ? Nrooms:Nrooms-1
                console.log("A user connected: "+socket.id)
                waiting.push(socket.id)
                
                socket.on("getInRoom", ()=> {
                    //console.log(socket.id+" connected to "+roomId)
                    socket.join(roomId.toString());
                    socket.room=roomId.toString();
                    socket.emit("room",roomId.toString())
                    console.log(socket.id+" connected to "+socket.room)
                })

                if (waiting.length>1) { 
                    console.log(waiting)
                    io.to(socket.id).emit("firstTurn");
                    let players={}
                    players[waiting[0]] = {
                            inDeck: [],
                            inHand: [],
                            isPlayerA: false
                    }
                    players[waiting[1]] = {
                            inDeck: [],
                            inHand: [],
                            isPlayerA: true
                    }
                    rooms[roomId.toString()]=players
                    players={}
                    waiting.splice(0,2)
                    //console.log(waiting[1])
                    Nrooms++;
                    setTimeout(()=>{
                        io.sockets.in(roomId.toString()).emit("match")
                    },500)
                }
                socket.on("dealDeck", function(roomId,socketId,mazo) {
                    rooms[roomId][socketId].inDeck = shuffle(mazo)
                    if (Object.keys(rooms[roomId]).lenght < 2) return;
                    io.sockets.in(roomId).emit("changeGameState", "Initializing")
                })

                socket.on("dealCards", function(roomId,socketId){
                    for(let i=0; i<3; i++){
                        rooms[roomId][socketId].inHand.push(rooms[roomId][socketId].inDeck.shift());
                    }
                    io.sockets.in(roomId).emit("dealCards",roomId, socketId, rooms[roomId][socketId].inHand);
                    readyCheck++;
                    if(readyCheck === 2){
                        readyCheck=0;
                        setTimeout(() => {
                            io.sockets.in(roomId).emit("changeGameState","Ready")
                        }, 500);
                    }
                })

                socket.on("dealCard", function(roomId,socketId){
                    rooms[roomId][socketId].inHand.push(rooms[roomId][socketId].inDeck.shift());
                    io.sockets.in(roomId).emit("dealCard",roomId, socketId, rooms[roomId][socketId].inHand);
                })
                socket.on("cardPlayed", function(cardName,roomId, socketId){
                    let indexCard=rooms[roomId][socketId].inHand.indexOf(cardName)
                    rooms[roomId][socketId].inHand.splice(indexCard,indexCard+1)
                    io.sockets.in(roomId).emit("cardPlayed", cardName,roomId, socketId);
                })

                socket.on("changeTurn", function(roomId){
                    io.sockets.in(roomId).emit("changeTurn");
                })
                socket.on("disconnecting", function(roomId){
                    delete rooms[socket.room]
                    
                    socket.leave(socket.room);  
                })
            })
            
            server.listen(port)
    })
    .catch(err => console.log(err));