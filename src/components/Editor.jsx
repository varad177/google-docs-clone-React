import React, { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { Box } from "@mui/material";
import "quill/dist/quill.js";
import styled from "@emotion/styled";

import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
];

const Components = styled(Box)`
  background: #f5f5f5;
`;

const Editor = () => {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    const { id } = useParams()

    useEffect(() => {
        const quillServer = new Quill("#container", {
            theme: "snow",
            modules: {
                toolbar: toolbarOptions,
            },
        });
        quillServer.disable()
        quillServer.setText("Loading The Document")
        setQuill(quillServer);
    }, []);

    useEffect(() => {
        const socketServer = io("http://localhost:9000");
        setSocket(socketServer);

        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {

        if (socket === null || quill === null) return;
        const handlechange = (delta, oldDelta, source) => {
            // source me changes aa kaha se rhe hai vo hota hai
            if (source !== "user") return;

            socket && socket.emit("send-changes", delta); //emit se changes send kr skte hai
            //delta me sare changes hote hai
        };

        quill && quill.on("text-change", handlechange);

        return () => {
            quill && quill.off("text-change", handlechange);
        };
    }, [quill, socket]);

    useEffect(() => {

        if (socket === null || quill === null) return;
        const handlechange = (delta) => {

            quill.updateContents(delta)

        };

        socket && socket.on("receive-changes", handlechange);

        return () => {
            socket && socket.off("receive-changes", handlechange);
        };
    }, [quill, socket]);


    useEffect(() => {
        if (quill === null || socket === null) return

        socket && socket.once('load-document', document => {
            quill && quill.setContents(document);
            quill && quill.enable();
        })

        socket && socket.emit('get-document', id);

    }, [quill, socket, id])


    useEffect(() => {
        if (quill === null || socket === null) return

      const Interval =   setInterval(() => {

           socket &&  socket.emit('save-document', quill.getContents())

        }, 2000)

        return () =>{
            clearInterval(Interval)
        }

    }, [socket, quill])
    return (
        <Components>
            <Box className="container" id="container"></Box>
        </Components>
    );
};

export default Editor;
