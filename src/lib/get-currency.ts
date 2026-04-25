import { cookies } from "next/headers";

export async function getCurrency(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("clothio-currency-code")?.value ?? "USD";
}