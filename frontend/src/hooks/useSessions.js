import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";


export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session have been created Succesfully"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed To Create The Room")
  })

  return result;
}

export const useActiveSessions = () => {
  const result = useQuery({
    querykey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  })

  return result;
}

export const useMyRecentSessions = () => {
  const result = useQuery({
    querykey: ["myRecentSession"],
    queryFn: sessionApi.getMyRecentSession,
  })

  return result;
}


export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enable: !!id,
    refetchInterval:5000,
  })

  return result;
};


export const useJoinSession = (id) => {
   return useMutation({
    mutationKey: ["joinSession"],
     mutationFn: () => sessionApi.joinSession(id),
     onSuccess: () => toast.success("session successfully!"),
     onError: (error) => toast.error(error.response?.data?.message || "Failed to join Session"),
   })
}


export const useEndSession = (id) => {
   return useMutation({
    mutationKey: ["endSession"],
     mutationFn: () => sessionApi.endSession(id),
     onSuccess: () => toast.success("session is succesfully Ended"),
     onError: (error) => toast.error(error.response?.data?.message || "Session End Failed"),
   })
}