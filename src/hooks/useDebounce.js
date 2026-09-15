import { useEffect, useState } from 'react'

// Returns a debounced copy of `value` that only updates after `delay`
// milliseconds have passed without `value` changing.
//
// The input stays instant (it is driven by `value`), while whatever reads the
// returned value — here, the doctor filter — waits until the user pauses
// typing. Each new keystroke re-runs the effect, and the cleanup cancels the
// previous timer before the next one starts, so only one timer is ever pending
// and the filter runs once instead of on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
