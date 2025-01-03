import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const db = await mongoose.connect("mongodb://localhost:27018/aj-chat")
        console.log("db connection established:", db.connection.host, db.connection.port);

    } catch (error) {
        console.error("error connecting", error);
        process.exit(1);
    }
}