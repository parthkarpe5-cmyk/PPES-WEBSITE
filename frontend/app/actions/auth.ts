"use server";

export async function loginAction(formData: FormData, role: string) {
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  console.log(`Logging in ${role}:`, identifier);
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}