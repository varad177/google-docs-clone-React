

import { Server } from 'socket.io'


import dotenv from "dotenv"
dotenv.config()

import Connection from './database/db.js'
import { getDocument, updateDocument } from './controller/documentController.js'


const PORT = process.env.PORT || 9000

Connection()


const io = new Server(PORT, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST']
    }
})


io.on('connection', Socket => {

    Socket.on('get-document', async documentId => {
        const data = "";

        const document = await getDocument(documentId)
        Socket.join(documentId);

        //load document data pass kr dega front end me 

        Socket.emit('load-document', document.data);



        Socket.on('send-changes', delta => {
            Socket.broadcast.to(documentId).emit('receive-changes', delta)
        })

        Socket.on('save-document', async data => {
            await updateDocument(documentId, data)
        })

    })


})



