import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";


export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session have been created Succesfully");
      // Invalidate active sessions cache so it refetches immediately
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed To Create The Room")
  })

  return result;
}

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
    refetchInterval: 3000, // Refetch every 3 seconds to stay in sync
    refetchOnWindowFocus: true, // Refetch when user switches back to tab
  })

  return result;
}

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["myRecentSession"],
    queryFn: sessionApi.getMyRecentSession,
  })

  return result;
}


export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval:5000,
  })

  return result;
};


export const useJoinSession = () => {
   const queryClient = useQueryClient();
   return useMutation({
    mutationKey: ["joinSession"],
     mutationFn: sessionApi.joinSession,
     onSuccess: () => {
       toast.success("session successfully!");
       // Invalidate active sessions cache when user joins
       queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
     },
     onError: (error) => toast.error(error.response?.data?.message || "Failed to join Session"),
   })
}


export const useEndSession = () => {
   const queryClient = useQueryClient();
   return useMutation({
    mutationKey: ["endSession"],
     mutationFn: sessionApi.endSession,
     onSuccess: () => {
       toast.success("session is succesfully Ended");
       // Invalidate active sessions cache when session ends
       queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
     },
     onError: (error) => toast.error(error.response?.data?.message || "Session End Failed"),
   })
}