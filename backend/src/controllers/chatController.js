import { chatClient } from "../lib/stream.js";


export async function getStreamToken(req, res) {

  try {
    // here we are using clerkId Jo stream mei hei not the mongodb _id -> it should match the id jo hamari stream dashboard mei hei
    const token = chatClient.createToken(req.user.clerkId)

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.image
    })
  } catch (error) {
   console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}