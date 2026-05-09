import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import styles from "./LockedModal.module.css";

/*
 * LockedModal — shown when the user clicks the locked Explorer persona on
 * Landing or WeaponSelector. Collects an email (required, validated) and an
 * optional short message, posts to Netlify Forms ("explorer-waitlist"), then
 * surfaces a success or error follow-up state. ESC, backdrop click, and an
 * explicit close button all dismiss; focus is restored to the trigger.
 */

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Element that opened the modal — focus is returned here on close. */
  returnFocusRef?: { current: HTMLElement | null };
};

const FORM_NAME = "explorer-waitlist";

function encode(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}

export default function LockedModal({ open, onClose, returnFocusRef }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  // Reset transient state every time the modal opens, then move focus into it.
  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setEmail("");
    setMessage("");
    // Defer focus until after the dialog has painted.
    const t = window.setTimeout(() => {
      emailRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC closes; restore focus to the trigger on unmount/close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener("keydown", onKey as EventListener);
    return () => window.removeEventListener("keydown", onKey as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    onClose();
    // Return focus on the next tick so the trigger has remounted/repainted.
    window.setTimeout(() => {
      returnFocusRef?.current?.focus();
    }, 0);
  };

  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  // Trap Tab inside the dialog so focus can't escape to the page underneath.
  const onDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": FORM_NAME,
          email,
          message,
        }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onDialogKeyDown}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className={styles.closeBtn}
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        {status === "success" ? (
          <SuccessState titleId={titleId} onClose={close} />
        ) : status === "error" ? (
          <ErrorState
            titleId={titleId}
            onRetry={() => setStatus("idle")}
            onClose={close}
          />
        ) : (
          <FormState
            titleId={titleId}
            email={email}
            message={message}
            onEmailChange={setEmail}
            onMessageChange={setMessage}
            onSubmit={onSubmit}
            submitting={status === "submitting"}
            emailRef={emailRef}
          />
        )}
      </div>
    </div>
  );
}

/* ──────────────────── States ──────────────────── */

type FormStateProps = {
  titleId: string;
  email: string;
  message: string;
  onEmailChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  emailRef: { current: HTMLInputElement | null };
};

function FormState({
  titleId,
  email,
  message,
  onEmailChange,
  onMessageChange,
  onSubmit,
  submitting,
  emailRef,
}: FormStateProps) {
  return (
    <>
      <div className={styles.eyebrow}>// LEVEL 03 · LOCKED</div>
      <h2 id={titleId} className={styles.title}>
        Level locked &mdash; <em>stay tuned!</em>
      </h2>
      <p className={styles.body}>
        Drop your email and I&rsquo;ll let you know when the photography wing
        opens up.
      </p>
      <form
        name={FORM_NAME}
        method="post"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        className={styles.form}
      >
        <input type="hidden" name="form-name" value={FORM_NAME} />
        {/* Honeypot — bots fill this, humans don't. */}
        <p className={styles.honeypot}>
          <label>
            Don&rsquo;t fill this out: <input name="bot-field" />
          </label>
        </p>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>EMAIL</span>
          <input
            ref={emailRef}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={submitting}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>MESSAGE (OPTIONAL)</span>
          <textarea
            name="message"
            rows={3}
            placeholder="Leave a message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            disabled={submitting}
            className={styles.textarea}
          />
        </label>
        <button
          type="submit"
          className={styles.submit}
          disabled={submitting || email.length === 0}
        >
          {submitting ? "Sending…" : "Notify me →"}
        </button>
      </form>
    </>
  );
}

function SuccessState({
  titleId,
  onClose,
}: {
  titleId: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.followup}>
      <div className={styles.eyebrow}>// SUBMITTED</div>
      <h2 id={titleId} className={styles.title}>
        Cheers! <em>I&rsquo;ll be in touch.</em>
      </h2>
      <p className={styles.body}>
        Your email is on the list. Catch you when level 03 unlocks.
      </p>
      <button type="button" className={styles.submit} onClick={onClose} autoFocus>
        Close
      </button>
    </div>
  );
}

function ErrorState({
  titleId,
  onRetry,
  onClose,
}: {
  titleId: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.followup}>
      <div className={`${styles.eyebrow} ${styles.eyebrowError}`}>// ERROR</div>
      <h2 id={titleId} className={styles.title}>
        Couldn&rsquo;t save that.
      </h2>
      <p className={styles.body}>Please try again later.</p>
      <div className={styles.errorActions}>
        <button type="button" className={styles.submitGhost} onClick={onClose}>
          Close
        </button>
        <button type="button" className={styles.submit} onClick={onRetry} autoFocus>
          Try again
        </button>
      </div>
    </div>
  );
}
