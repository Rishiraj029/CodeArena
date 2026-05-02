import Session from "../models/Session.js"
import { chatClient, streamClient } from "../lib/stream.js"

export async function createSession(req, res){
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and Difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 1. Provision Stream call
    let call;
    try {
      call = streamClient.video.call("default", callId);
      await call.getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty }
        },
      });
    } catch (streamErr) {
      console.log("Error provisioning Stream call:", streamErr.message);
      return res.status(500).json({ message: "Failed to provision video call" });
    }

    // 2. Provision chat channel
    let channel;
    try {
      channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId]
      });
      await channel.create();
    } catch (chatErr) {
      // Rollback Stream call if chat channel creation fails
      try {
        await call.delete({ hard: true });
      } catch (delErr) {
        console.log("Error cleaning up Stream call after chat channel failure:", delErr.message);
      }
      console.log("Error provisioning chat channel:", chatErr.message);
      return res.status(500).json({ message: "Failed to provision chat channel" });
    }

    // 3. Create Session in DB
    let session;
    try {
      session = await Session.create({ problem, difficulty, host: userId, callId });
      // Patch Stream call with sessionId after DB session is created
      try {
        await call.update({ custom: { problem, difficulty, sessionId: session._id.toString() } });
      } catch (patchErr) {
        console.log("Warning: Could not update Stream call with sessionId:", patchErr.message);
      }
    } catch (dbErr) {
      // Rollback Stream call and chat channel if DB session creation fails
      try {
        await call.delete({ hard: true });
      } catch (delErr) {
        console.log("Error cleaning up Stream call after DB failure:", delErr.message);
      }
      try {
        await channel.delete();
      } catch (delChanErr) {
        console.log("Error cleaning up chat channel after DB failure:", delChanErr.message);
      }
      console.log("Error creating Session in DB:", dbErr.message);
      return res.status(500).json({ message: "Failed to create session" });
    }

    res.status(201).json({ session });
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

   res.status(200).json({session})
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

    if (session.status !== "active") {
      return res.status(400).json({message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as a participant" });
    }

    if(session.participant) return res.status(409).json({message:"Session is full"})

    session.participant = userId
    await session.save()

    const channel = chatClient.channel("messaging", session.callId)

    await channel.addMembers([clerkId])

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

   if (!session) return res.status(404).json({message: "Session not found" })

    if(session.host.toString() !== userId.toString()){
      return res.status(404).json({message: "Only the host can end the session"})
    }

    
    const call = streamClient.video.call("default", session.callId)
    await  call.delete({hard:true})
    
    const channel = chatClient.channel("messaging", session.callId)
    await channel.delete()

    session.status = "completed";
    await session.save();

    res.status(200).json({session, message: "Session ended succesfully" });

   

  } catch (error) {
 
    console.log("Error in end Session controller has occured: ", error.message);
    res.status(500).json({message: "Internal Server Error"});
    
  }
}