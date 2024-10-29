import { supabase } from "@/utils/supabase";

export const checkSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("No active session");
  }
};
