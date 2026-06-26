import { redirect } from "next/navigation";

export default function Acessar() {
  // Assim que o usuário volta do login, isso devolve ele para a tela principal
  redirect("/");
}