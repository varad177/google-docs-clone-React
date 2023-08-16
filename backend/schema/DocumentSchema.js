

import mongoose from "mongoose";

const DucementSchema = mongoose.Schema({

    _id: {
        type: String,
        require: true
    },
    data: {
        type: Object,
        require: true
    },

})



const document = mongoose.model('googleDocs', DucementSchema)

export default document; 