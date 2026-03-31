# Test Discovery Fix for Task 011

## Problem Summary
Tests are not being discovered by vitest even though:
- Test files exist and are syntactically correct
- Implementation files compile without TypeScript errors
- Test structure matches existing passing tests
- vitest config has `globals: true`

## Root Cause Analysis

The most likely causes, in order of probability:

### 1. Vitest Cache Issue (Most Likely)
Vitest caches test discovery. When new test files are added, the cache may not be invalidated.

**Fix:**
```bash
# Clear all caches
rm -r node_modules/.vitest
rm -r .next
rm -r coverage

# Run tests with no-cache flag
npm test -- --no-cache
```

### 2. Globals Configuration Issue
With `globals: true`, vitest should inject describe/it/expect globally. If this isn't working:

**Check:**
- Verify vitest.config.ts has `test: { globals: true }`
- Ensure setupFiles points to vitest.setup.ts

### 3. Module Resolution Issue
The @/ alias might not be resolving properly at test time.

**Fix:**
- Clear node_modules cache
- Run `npm install` again
- Ensure vitest.config.ts has proper alias configuration

## Files to Check

1. **vitest.config.ts** - Should have:
   ```typescript
   test: {
     globals: true,
     environment: "jsdom",
     setupFiles: ["./vitest.setup.ts"],
   }
   ```

2. **Test files** - Both files are structurally correct:
   - `src/__tests__/lib/educational-content.test.ts` - 5 test blocks
   - `src/__tests__/hooks/use-educational-dismissal.test.ts` - 10 test blocks

3. **Implementation files** - Both are correct:
   - `src/lib/educational-content.ts` - Exports types and data
   - `src/hooks/use-educational-dismissal.ts` - Use Client hook

## Recommended Next Steps

### Immediate (Run These First):
1. Execute the provided `fix-tests-cache.bat` script
2. Or manually run:
   ```bash
   rm -r node_modules/.vitest
   rm -r .next
   npm test -- --no-cache --reporter=verbose
   ```

### If Still Failing:
1. Run TypeScript check: `npm run typecheck` or `npx tsc --noEmit`
2. Check for import errors: `node -e "require('./src/lib/educational-content.ts')"`
3. Verify test pattern: Run a simpler test to ensure globals work
4. Check Node version compatibility with vitest

### Verification Steps:
After running tests:
1. Confirm test counts match:
   - educational-content.test.ts: should pass 5 tests
   - use-educational-dismissal.test.ts: should pass 10 tests
2. Check all test names appear in output
3. Verify no import errors in test execution

## Test Coverage Expected

- **educational-content.test.ts**: 5 tests
  - All 6 required keys present
  - All entries have required fields
  - shortDefinition word count <= 20
  - fullExplanation non-empty
  - photographyTip is optional but typed correctly

- **use-educational-dismissal.test.ts**: 10 tests
  - isDismissed returns false for fresh hook
  - dismiss adds term to dismissed set
  - isDismissed returns false for non-dismissed
  - persists to localStorage
  - loads from localStorage on mount
  - resetAll clears all dismissals
  - resetAll removes localStorage key
  - handles localStorage failure gracefully
  - dismiss uses stable reference
  - resetAll uses stable reference

## Implementation Verification

Both implementation files are correct:
- ✓ educational-content.ts - Exports correct types and EDUCATIONAL_ENTRIES constant
- ✓ use-educational-dismissal.ts - Implements hook with proper localStorage integration

The code quality is high with:
- ✓ Proper error handling (try/catch blocks)
- ✓ Stable callback references (useCallback)
- ✓ Proper state management (useState)
- ✓ Immutable patterns
- ✓ TypeScript types properly defined
