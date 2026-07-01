import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Acessar() {
  const { userId, redirectToSignIn } = await auth();
  
  // Se você NÃO estiver logado, o servidor gera uma passagem direta para a nuvem segura do Clerk
  if (!userId) {
    return redirectToSignIn();
  }
  
  // Se você JÁ estiver logado e cair aqui sem querer, o sistema te joga de volta pra Dashboard
  redirect("/");
}