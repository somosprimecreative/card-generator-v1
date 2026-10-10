"use client";
/* eslint-disable @next/next/no-img-element -- official brand SVG must be served as the supplied asset. */

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import type { AuthFailureCode } from "@/lib/auth/types";
import styles from "./pixel-login.module.css";

const messages: Partial<Record<AuthFailureCode, string>> = {
  invalid_credentials: "E-mail ou senha inválidos.",
  unlinked_member: "Este acesso ainda não está vinculado à equipe Prime.",
  pending_invite: "Seu convite ainda está pendente. Fale com a gestão da Prime.",
  inactive: "Este acesso está inativo. Fale com a gestão da Prime.",
  removed: "Este acesso não está mais disponível.",
  workspace_missing: "Não foi possível localizar o ambiente da sua equipe.",
  connection: "Não foi possível conectar agora. Tente novamente em instantes.",
  configuration: "A autenticação compartilhada ainda não foi configurada neste ambiente.",
};

function ThemeIcon({ dark }: { dark: boolean }) {
  const Component = dark ? Sun : Moon;
  return <Component className="icon" size={16} strokeWidth={1.75} aria-hidden="true" />;
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  const Component = visible ? Eye : EyeOff;
  return <Component className="icon" size={16} strokeWidth={1.75} aria-hidden="true" />;
}

export function PixelLogin({ initialError }: { initialError?: AuthFailureCode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(initialError ? messages[initialError] : "");
  const [mounted, setMounted] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  // Keep the first client tree equal to SSR; next-themes applies the root token before paint.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const dark = mounted && resolvedTheme === "dark";
  const theme = dark ? "dark" : "light";

  function submit() {
    if (!email.trim() || !password.trim() || pending) return;
    setError("");
    startTransition(async () => {
      const result = await loginAction({ email, password });
      if (!result.ok) {
        setError(messages[result.code] ?? "Não foi possível iniciar sua sessão.");
        return;
      }
      router.refresh();
    });
  }

  return <main className="login-shell">
    <div className="login-accent" aria-hidden="true" />
    <section className="login-card" aria-labelledby="login-title">
      <button className="login-theme-toggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Alternar tema" title="Alternar tema">
        <ThemeIcon dark={dark}/>
      </button>
      <img className="login-brand" src={`/brand/pixel/signature/lockup-wide-${theme === "dark" ? "light" : "ink"}.svg`} alt="Pixel, um produto Prime Creative" />
      <p className="eyebrow">Acesso da Prime</p>
      <h1 id="login-title">Entre no Pixel</h1>
      <p className="login-copy">Acesse suas criações e gere novas peças com o perfil autorizado da sua equipe.</p>
      <form className="login-form" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <label><span>E-mail profissional</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@primecreative.com" required /></label>
        <div className="login-password"><label htmlFor="pixel-password">Senha</label><span className="password-field"><input id="pixel-password" type={passwordVisible ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required /><button className="password-toggle" type="button" aria-label={passwordVisible ? "Ocultar senha" : "Exibir senha"} aria-pressed={passwordVisible} onClick={() => setPasswordVisible((visible) => !visible)}><VisibilityIcon visible={passwordVisible}/></button></span></div>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="button vermilion login-submit" type="submit" disabled={!email.trim() || !password.trim() || pending}>{pending ? "Entrando..." : "Entrar"}</button>
      </form>
      <nav className={styles.legalLinks} aria-label="Documentos legais">
        <Link href="/privacidade">Política de Privacidade</Link>
        <Link href="/termos">Termos de Uso</Link>
      </nav>
    </section>
  </main>;
}
