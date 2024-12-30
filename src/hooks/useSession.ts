import { SessionData } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Import your axios instance

export const fetchSession = async () => {
  const response = await axios.get("/api/session");
  return response.data;
};
export const useSession = () => {
  return useQuery<SessionData>({
    queryKey: ["session"],
    queryFn: fetchSession,
  });
};
