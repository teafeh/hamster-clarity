import { supabase } from "@/lib/supabase.ts";

export async function joinWaitlist(email: string) {
    const { error } = await supabase.functions.invoke(
        "join-waitlist",
        {
            body: { email }
        }
    );

    if (error) throw error;
}