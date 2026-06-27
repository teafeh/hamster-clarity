import { supabase } from "../../shared/lib/supabase.ts";

export const betaService = {
  async join(token: string) {
    const { data, error } = await supabase
      .from("waitlist")
        .update({
        beta_tester: true,
        })
        .eq("beta_token", token)
        .eq("beta_tester", false)
        .select()
        .single();

    if (error) throw error;

    return data;
  },
};