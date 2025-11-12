# Shared UI

**Purpose**: UI-kit, basic components without business logic.

## Component categories

- `inputs/` — Button, Input, Checkbox, Radio, Select
- `layout/` — Container, Grid, Flex, Divider
- `feedback/` — Alert, Toast, Modal, Spinner, Progress
- `display/` — Card, Badge, Avatar, Icon
- `navigation/` — Tabs, Breadcrumbs, Pagination

## Component structure

```
ui/
  Button/
    Button.vue        # Component
    Button.types.ts   # Props types
    index.ts          # Export
  Input/
    Input.vue
    Input.types.ts
    index.ts
```

## Example

```vue
<!-- Button.vue -->
<script setup lang="ts">
import type { ButtonProps } from './Button.types'

const props = defineProps<ButtonProps>()
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="['btn', `btn-${variant}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
```

## Rules

- No business logic, only UI behavior
- Reusable across all screens
- Styled via props (variant, size, etc.)
- Accessibility (a11y, ARIA)
- TypeScript typed props/emits
