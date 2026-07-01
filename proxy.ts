import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Colocamos o "/acessar" e as rotas antigas na lista pública para NUNCA mais dar loop
const isPublicRoute = createRouteMatcher([
  "/", 
  "/acessar", 
  "/sign-in(.*)", 
  "/sign-up(.*)", 
  "/api(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
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