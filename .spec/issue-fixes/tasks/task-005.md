---
status: complete
---

# Task 005 — Fix geocoding language (English only)

## Summary
The Nominatim geocoding API returns results in the local language of the searched country. Add `accept-language=en` to force English results.

## Implementation Steps
1. In `src/app/api/geocode/route.ts`, after the existing `url.searchParams.set("limit", ...)` line, add:
   ```ts
   url.searchParams.set("accept-language", "en");
   ```

## Acceptance Criteria
- [ ] Searching "Kuwait" returns English place names (e.g., "Kuwait City, Kuwait")
- [ ] Searching "Tokyo" returns English place names (e.g., "Tokyo, Japan")
- [ ] No new test failures
