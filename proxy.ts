// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// A página inicial "/" fica liberada para mostrar a tela de boas vindas
const isPublicRoute = createRouteMatcher(["/", "/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Se a rota NÃO for pública (como a página do calendário), ele protege e manda pro login
  if (!isPublicRoute(req)) {
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