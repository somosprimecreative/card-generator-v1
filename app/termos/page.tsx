import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Termos de Uso · Pixel", description: "Termos de Uso do Pixel, produto da Prime Creative." };

export default function TermsPage() { return <LegalPage kind="terms" />; }
