import { supabase } from "@/lib/supabase";

export async function joinWaitlist(email: string) {
    const { error } = await supabase.functions.invoke(
        "join-waitlist",
        {
            body: { email }
        }
    );

    if (error) throw error;
}