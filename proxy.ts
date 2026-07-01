import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Libera a página inicial para mostrar a tela de boas-vindas
const isPublicRoute = createRouteMatcher(["/", "/api(.*)"]);

// CORREÇÃO: Adicionado o "async" aqui
export default clerkMiddleware(async (auth, req) => {
  // 2. Se tentar entrar em qualquer outra página (como a rota /acessar)
  if (!isPublicRoute(req)) {
    // CORREÇÃO: Adicionado o "await" antes do auth.protect()
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*"
  ],
};