---
status: complete
---

# Task 006 — Onboarding hint banner

## Summary
Show a dismissible first-use banner that explains how to interact with the app. Use localStorage to ensure it only appears once.

## Implementation Steps
1. In `src/components/home-page-client.tsx`:
   - Add `const [showHint, setShowHint] = useState(false)`
   - Add `useEffect` on mount: if `localStorage.getItem("sun-tracker:onboarded")` is null, `setShowHint(true)`
   - Add `handleDismiss` function: `localStorage.setItem("sun-tracker:onboarded", "1")`, `setShowHint(false)`
   - Render a banner between the `<Suspense>` block and the stats strip:
     ```tsx
     {showHint && (
       <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
         <span>Click anywhere on the map or search for a place to explore sun data.</span>
         <button type="button" onClick={handleDismiss} aria-label="Dismiss hint" className="text-amber-600 hover:text-amber-800">✕</button>
       </div>
     )}
     ```

## Acceptance Criteria
- [ ] Banner appears on first page load
- [ ] Clicking ✕ dismisses the banner permanently (does not reappear after refresh)
- [ ] Banner does not appear on subsequent visits
- [ ] No new test failures
