import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Admin</h1>
        <p className="muted mono" style={{ fontSize: "0.78rem", marginBottom: "var(--sp-5)" }}>
          single-user · password gated
        </p>
        <LoginForm next={searchParams?.next ?? "/admin"} />
      </div>
    </div>
  );
}
