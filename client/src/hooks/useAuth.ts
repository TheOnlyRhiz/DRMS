import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to avoid unnecessary refetches
    enabled: !!localStorage.getItem("token"), // Only fetch if token exists
    networkMode: 'online', // Don't block on slow network
  });

  const hasToken = !!localStorage.getItem("token");

  return {
    user,
    isLoading: isLoading && hasToken, // Only show loading if we have a token
    isAuthenticated: !!user || hasToken, // Consider authenticated if we have token even without user data yet
    refetch,
  };
}
