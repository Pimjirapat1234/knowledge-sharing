import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Demo state switcher — reads ?state=X from URL to force UI state.
 * Implements PRD §11.3 six UI states:
 *   loading | empty | partial | error | error-blocking | success | (none = happy path)
 *
 * Usage in views:
 *   const ui = useUiState()
 *   <LoadingSkeleton v-if="ui.isLoading" />
 *   <EmptyState v-else-if="ui.isEmpty" />
 *   <ErrorState v-else-if="ui.isError" :recoverable="true" />
 */
export type UiState =
  | 'loading'
  | 'empty'
  | 'partial'
  | 'error'
  | 'error-blocking'
  | 'success'

export function useUiState() {
  const route = useRoute()
  const state = computed(() => (route.query.state as UiState | undefined) ?? null)

  return {
    state,
    isLoading: computed(() => state.value === 'loading'),
    isEmpty: computed(() => state.value === 'empty'),
    isPartial: computed(() => state.value === 'partial'),
    isError: computed(() => state.value === 'error'),
    isErrorBlocking: computed(() => state.value === 'error-blocking'),
    isSuccess: computed(() => state.value === 'success'),
    isHappyPath: computed(() => state.value === null),
  }
}
