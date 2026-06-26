import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define que todas as rotas do app estão protegidas (exigem login)
const isProtectedRoute = createRouteMatcher(["(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignora arquivos estáticos e internos do Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Sempre roda para rotas de API
    "/(api|trpc)(.*)",
    // Rota interna obrigatória do Clerk
    "/__clerk/:path*"
  ],
};