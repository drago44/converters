# Processes Layer

**Purpose**: Complex cross-feature business processes, orchestration of multiple features.

## When to use

- Processes spanning multiple features
- Complex scenarios with many steps
- Orchestration of business logic between different entities

## Examples

- Multi-step wizard
- Complex checkout process
- User onboarding

## Rules

- Optional layer (if not needed — don't use)
- No direct access to entities (only through features)
- Orchestrates features, does not duplicate their logic

## Dependencies

- Can use: pages, features, shared
- Cannot use: app, processes (other processes), entities (directly)
