---
task: 003
feature: helios-chrono-ui
status: complete
depends_on: [2]
---

# Task 003: Login Page

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Build the `/login` page styled per the stitch design: "Helios Chrono" branding, bracket-style inputs, gradient Sign In button, Continue as Guest, Create Account link. Reuses existing `useAuth` hook entirely.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```tsx
// [useAuth hook return — src/hooks/use-auth.ts:12-17]
interface UseAuthReturn extends AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}
```

```tsx
// [Existing AuthModal pattern — src/components/auth/auth-modal.tsx:24-49]
async function handleSubmit(e: React.FormEvent): Promise<void> {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);
  try {
    if (mode === "signin") {
      const { error: signInError } = await signIn(email, password);
      if (signInError) setError(signInError);
      else onClose();
    } else {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) setError(signUpError);
      else setSuccessMessage("Account created — check your email to confirm.");
    }
  } finally {
    setIsSubmitting(false);
  }
}
```

```tsx
// [next/navigation redirect pattern]
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/"); // redirect after sign-in
```

### Key Patterns in Use
- All form components are `"use client"`.
- Input bracket style: no full border-box; use `bg-surface-container-low` background + `border-b-2 border-primary` on focus, `border-b border-outline-variant` at rest.
- Labels: `text-secondary text-xs font-medium tracking-widest uppercase` above each input.
- Primary button: `bg-gradient-to-r from-primary to-primary-container text-white rounded-xl`.
- Secondary button (Continue as Guest): `bg-surface-container text-on-surface rounded-xl`.

### Architecture Decisions Affecting This Task
- Login page lives at `/login` — if user is already signed in, redirect to `/` immediately.
- "Continue as Guest" simply navigates to `/` without signing in (guest state = no user).
- "Create Account" toggles the form to signup mode (same page, no separate route).
- No TopBar/BottomNav on login page — it is a standalone full-screen page with its own layout override.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/shell/top-bar.tsx` | Glassmorphic TopBar with branding and desktop nav |
| `src/components/shell/bottom-nav.tsx` | 4-tab mobile BottomNav |
| `src/app/layout.tsx` | Updated with TopBar + BottomNav |
| `src/app/analemma/page.tsx` | Placeholder |
| `src/app/landmarks/page.tsx` | Placeholder |
| `src/app/observatory/page.tsx` | Placeholder |

**Context for this task:**
Shell is in place. Login page needs its own layout (no shell nav) — use a separate layout file or a `className="min-h-screen"` wrapper that overrides the shell visually.

---

## Implementation Steps

1. **Create `src/app/login/layout.tsx`** — Server Component that renders `{children}` inside a `min-h-screen bg-surface flex items-center justify-center` wrapper. This prevents the global TopBar/BottomNav from appearing on the login page by wrapping before the parent layout — use `metadata` export here too.

2. **Create `src/components/login/login-form.tsx`** (`"use client"`):
   - State: `mode: 'signin' | 'signup'`, `email`, `password`, `error`, `successMessage`, `isSubmitting`.
   - On mount: if `user` (from `useAuth`) is non-null, call `router.push('/')`.
   - Layout:
     - Centre card: `bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-[0_8px_48px_rgba(11,28,48,0.08)]`.
     - Top: sun icon (lucide `Sun` in `text-primary text-4xl`) centred.
     - Title: "Helios Chrono" in `font-headline text-2xl font-bold text-on-surface`.
     - Subtitle: "PRECISION SOLAR TRACKING" in `text-secondary text-xs tracking-widest uppercase`.
     - Field label: "OBSERVER ID / EMAIL" — bracket input (see pattern above).
     - Field label: "ACCESS KEY / PASSWORD" — bracket input with type="password".
     - "FORGOT KEY?" link right-aligned in `text-xs text-primary`.
     - Sign In button: full-width gradient.
     - Divider text: "OR CONTINUE AS" in `text-secondary text-xs` centred.
     - Continue as Guest button: full-width secondary style.
     - Footer: "New to the observatory? Create Account" link toggles to signup mode.

3. **Create `src/app/login/page.tsx`** — Server Component that renders `<LoginForm />`.

4. **Update `src/components/shell/top-bar.tsx`**:
   - Add a user icon button that links to `/login` when `user` is null, or shows a sign-out option when `user` is non-null.

5. **Run `/verify`**.

_Requirements: FR-1 Login Page_
_Skills: /build-website-web-app — Next.js page + form pattern_

---

## Acceptance Criteria
- [x] `/login` renders without TopBar/BottomNav.
- [x] Signed-in user visiting `/login` is redirected to `/`.
- [x] Sign In calls `useAuth().signIn`; errors display in the form.
- [x] Sign Up toggles mode, calls `useAuth().signUp`, shows confirmation message.
- [x] Continue as Guest navigates to `/` without signing in.
- [x] No visible border lines on the login card or inputs at rest.
- [x] Primary button has gradient fill matching `#9d4300 → #f97316`.
- [ ] `/verify` passes. (Blocked by pre-existing lint errors in root scripts and pre-existing failing animation tests.)

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/app/login/layout.tsx` | Standalone full-screen login layout with metadata | done |
| `src/app/login/page.tsx` | Login route page rendering `LoginForm` | done |
| `src/components/login/login-form.tsx` | Sign-in/sign-up/guest flow with Helios Chrono styling and redirect behavior | done |
| `src/components/shell/top-bar.tsx` | Added auth-aware login icon/sign-out action and hidden state on `/login` | done |
| `src/components/shell/bottom-nav.tsx` | Hidden on `/login` for standalone login experience | done |
| `src/__tests__/components/login-form.test.tsx` | Added auth flow, redirect, and guest navigation tests | done |
| `src/__tests__/components/top-bar.test.tsx` | Added top bar login/sign-out/login-route visibility tests | done |

**Decisions made:**
- Hid shell nav on `/login` at component level (`TopBar` and `BottomNav`) to guarantee no login-route nav rendering.
- Kept auth behavior fully delegated to existing `useAuth` methods (`signIn`, `signUp`, `signOut`).
- Matched required primary gradient exactly with `#9d4300 -> #f97316` on submit CTA.

**Context for next task:**
- Login flow is now route-based at `/login`; modal auth remains intact and can coexist.
- Added regression tests for new login and top-bar auth behavior.
- Verification blockers are outside task scope: root lint errors in utility scripts and existing animation test failures.

**Open questions:**
- Should the global `/verify` requirement be considered strict for each task when unrelated pre-existing tests/lint failures exist?

## Status
COMPLETE
