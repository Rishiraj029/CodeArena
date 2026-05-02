import Session from "../models/Session.js"
import { chatClient, StreamClient } from "../lib/stream.js"

export async function createSession(req, res){
  try {
    const {problem, difficulty} = req.body;
    const userId = req.user._id
    const clerkId = req.user.clerkId

    if(!problem || !difficulty){
      return res.status(400).json({message: "Problem and Difficulty are required"});
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const session = await Session.create(
      {problem,difficulty,host:userId,callId }
);
 
   await streamClient.video.call("default",callId).getOrCreate({
    data: {
      created_by_id:clerkId,
      custom: { problem,difficulty,sessionId:session._id.toString() }
    },
   });

  const channel = chatClient.channel("messaging", callId, {
    name: `${problem} Session`,
    created_by_id:clerkId,
    members:[clerkId]
   })
  
   await channel.create();
  
  res.status(201).json({session})
  
  } catch (error) {
    console.log("Error in creating Session", error.message);
    res.status(500).json({ message: "Internal server error" });
    
  }
}


export async function getActiveSessions(_, res){
  try {
   const session =  await Session.find({status: "active"}).populate("host","name profileImage email clerkId")
   .sort({createdAt:-1})
   .limit(20);

   res.status(200).json({sessions})
  } catch (error) {
    console.log("Error in getActiveSession controller:", error.message);
    res.status(500).json({ message:"Internal Server Error" });
  }
}


export async function getMyRecentSessions(req, res){
  try {
    const userId = req.user._id;

  const sessions = await Session.find({
      status:"completed",
      $or: [{host:userId}, {participant:userId}]
    }).sort({ createdAt:-1 })
    .limit(20);

    res.status(200).json({sessions})
  } catch (error) {
    console.log("Error in getMyRecentSession controller:", error.message);

  }
}

export async function getSessionById(req, res){
   try {
   const { id } =  req.params;

   const session = await Session.findById(id)
   .populate("host","name email profileImage clerkId")
   .populate("participant", "name email profileImage clerkId")

   if(!session) return res.status(404).json({message: "Session not found"})

    res.status(200).json({session})
   } catch (error) {
    console.log("Error in getSessionById controller:", error.message);

    
   }
}


export async function joinSession(req, res){
  try {
    const {id} = req.params
    const userId = req.user._id
    const clerkId = req.user.clerkId

    const session = await Session.findById(id)

    if(!session) return res.status(404).json({message: "Session not found"});

    if(session.participant) return res.status(404).json({message:"Session is full"})

    session.participant = userId
    await session.save()

    const channel = chatClient.channel("messaging", session.callId)

    await channel.addMemebers([clerkId])

    res.status(200).json({session})

  } catch (error) {
    
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message:"Internal Server Error" });
    
  }
}


export async function endSession(req, res){
  try {
   const {id} = req.params
   const userId = req.user._id

   const session = await Session.findById(id);

   if (!sessions) return res.status(404).json({message: "Session not found" })

    if(session.host.toString() !== userId.toString()){
      return res.status(404).json({message: "Only the host can end the session"})
    }

    session.status = "completed"
    await session.save()

   
    const call = streamClient.video.call("default", session.callId)
    await  call.delete({hard:true})
    
    const channel = chatClient.channel("messaging", session.callId)
    await channel.delete()


    res.status(200).json({session, message: "Session ended succesfully" });

   

  } catch (error) {
 
    console.log("Error in end Session controller has occured: ", error.message);
    res.status(500).json({message: "Internal Server Error"});
    
  }
}