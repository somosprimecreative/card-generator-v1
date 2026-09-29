"use client";
/* eslint-disable @next/next/no-img-element -- official brand SVG must be served as the supplied asset. */

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { loginAction } from "@/app/actions/auth";
import type { AuthFailureCode } from "@/lib/auth/types";

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
  return <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></> : <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>}</svg>;
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{visible ? <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></> : <><path d="m3 3 18 18"/><path d="M10.6 6.1A10.8 10.8 0 0 1 12 6c6.1 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3.1 3.8M6.2 6.2A17.8 17.8 0 0 0 2.5 12s3.4 6 9.5 6c1.5 0 2.8-.3 4-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>}</svg>;
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
    </section>
  </main>;
}
