import supabase from "./SupabaseClient";

export async function testSupabaseConnection() {
  try {
    // Try to fetch a single row from any table
    const { data, error } = await supabase
      .from("sucursales") // Testing connection with sucursales table
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error.message);
      return false;
    }

    // Also test one of the new tables
    const { data: palitosData, error: palitosError } = await supabase
      .from("palitos")
      .select("*")
      .limit(1);

    if (palitosError) {
      console.error("Error fetching from new table:", palitosError.message);
      // Continue even if this fails, as the connection was already confirmed
    } else {
      console.log("New table connection successful!");
    }

    console.log("Supabase connection successful!");
    console.log("Test data:", data);
    return true;
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return false;
  }
}
