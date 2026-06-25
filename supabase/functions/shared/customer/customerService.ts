import { supabase } from "../lib/supabase.ts";

export async function getCustomer(customerId: string) {
  const { data, error } = await supabase
    .from("customers")
    .select(`
      *,
      business:businesses(*)
    `)
    .eq("id", customerId)
    .single();

  if (error) throw error;

  return data;
}