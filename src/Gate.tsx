import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import "./gate.css";

const PASSWORD_SHA256 = "5d02eb00bbaa8e54422950c9cbff122fb34231d7d08109b843d29ac81d34ffe5";
const UNLOCK_KEY = "plot-x-brand:unlocked";

async function sha256(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

function isUnlocked() {
  try {
    return localStorage.getItem(UNLOCK_KEY) === PASSWORD_SHA256;
  } catch {
    return false;
  }
}

export default function Gate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (checking) return;
    setChecking(true);
    const hash = await sha256(value.trim().toLowerCase());
    setChecking(false);
    if (hash !== PASSWORD_SHA256) {
      setError(true);
      inputRef.current?.select();
      return;
    }
    try {
      localStorage.setItem(UNLOCK_KEY, PASSWORD_SHA256);
    } catch {
      // Storage can be unavailable (e.g. private mode); unlock for this visit only.
    }
    setUnlocked(true);
  }

  return (
    <main className="gate-screen">
      <div className="gate">
        <h1 className="gate-title">Plot x Brand</h1>
        <form className="gate-form" onSubmit={submit} autoComplete="off">
          <label htmlFor="gate-password">Password</label>
          <div className="gate-field">
            <input
              ref={inputRef}
              id="gate-password"
              name="password"
              type={show ? "text" : "password"}
              value={value}
              autoFocus
              aria-invalid={error}
              aria-describedby={error ? "gate-error" : undefined}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
            />
            <button
              type="button"
              className="gate-toggle"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              aria-controls="gate-password"
              onClick={() => setShow((s) => !s)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.6" />
                {show && <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
          <button type="submit" className="gate-submit" disabled={checking}>
            Enter
          </button>
          <p className="gate-error" id="gate-error" role="alert">
            {error ? "That password isn’t right. Try again." : ""}
          </p>
        </form>
      </div>
    </main>
  );
}
