import { PixelApp } from "./PixelApp";
import { PixelLogin } from "@/components/pixel-login";
import { getAuthContext } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const auth = await getAuthContext();
  if (auth.kind !== "active") return <PixelLogin initialError={auth.kind === "unauthenticated" ? undefined : auth.kind} />;
  return <PixelApp member={auth.member} />;
}
