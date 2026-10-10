import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Política de Privacidade · Pixel", description: "Política de Privacidade do Pixel, produto da Prime Creative." };

export default function PrivacyPage() { return <LegalPage kind="privacy" />; }
