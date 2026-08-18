import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitSolution,
  getMySubmissions,
  getSubmissionById,
  getUserProfile,
  getUserActivity,
} from "../api/submissions";

export function useMySubmissions(filters = {}) {
  return useQuery({
    queryKey: ["submissions", "me", filters],
    queryFn: () => getMySubmissions(filters),
  });
}

export function useSubmissionById(id) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
  });
}

export function useUserProfile(userId) {
  return useQuery({
    queryKey: ["users", userId, "profile"],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserActivity(userId) {
  return useQuery({
    queryKey: ["users", userId, "activity"],
    queryFn: () => getUserActivity(userId),
    enabled: !!userId,
  });
}

export function useSubmitSolution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSolution,
    onSuccess: () => {
      // Invalidate submission list so it refreshes
      queryClient.invalidateQueries({ queryKey: ["submissions", "me"] });
    },
  });
}
