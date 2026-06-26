// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define que todas as rotas do app estão protegidas
const isProtectedRoute = createRouteMatcher(["(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Se não estiver logado, o Clerk assume o controle e abre a tela própria dele
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