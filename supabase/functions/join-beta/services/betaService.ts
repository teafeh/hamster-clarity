import { supabase } from "../../shared/lib/supabase.ts";

export const betaService = {
  async join(token: string) {
    const { data: existing, error } = await supabase
  .from("waitlist")
  .select("*")
  .eq("beta_token", token)
  .maybeSingle();

if (error) throw error;

if (!existing) {
  throw new Error("Invalid invitation.");
}

if (existing.is_beta_tester) {
  return {
    alreadyJoined: true,
    user: existing,
  };
}

const { data: updated, error: updateError } =
  await supabase
    .from("waitlist")
    .update({
      is_beta_tester: true,
      beta_joined_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .select()
    .single();

if (updateError) throw updateError;

return {
  alreadyJoined: false,
  user: updated,
};

  },
};