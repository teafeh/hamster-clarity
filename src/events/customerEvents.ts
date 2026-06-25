import { supabase } from "@/lib/supabase"

export const customerEvents = {
  async onCreated(customerId: string) {
    return supabase.functions.invoke("customer-created", {
      body: {
        customerId,
      },
    })
  },
}