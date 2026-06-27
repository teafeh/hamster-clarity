import { supabase } from "../../shared/lib/supabase.ts"

export const waitlistService = {
  async findByEmail(email: string) {
    const { data, error } = await supabase
      .from("waitlist")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (error) throw error

    return data
  },

  async join(data: {
  email: string
  business_type: string
  timezone: string
  source: string
}) {
  const betaToken = crypto.randomUUID()

  const { data: row, error } = await supabase
    .from("waitlist")
    .insert({
      email: data.email,
      business_type: data.business_type,
      timezone: data.timezone,
      source: data.source,
      beta_token: betaToken,
    })
    .select()
    .single()

  if (error) throw error

  return row
},
}