# Batch State Machine - Strict Traceability

## State Diagram

```
Created
  ├─→ ReadyForTransfer
  ├─→ Processing
  ├─→ Recalled
  └─→ Closed

ReadyForTransfer
  ├─→ InTransit
  ├─→ Processing
  ├─→ Recalled
  └─→ Closed

InTransit
  ├─→ Received
  └─→ Recalled

Received
  ├─→ Processing
  ├─→ ReadyForTransfer
  └─→ Recalled

Processing
  ├─→ Processed
  └─→ Recalled

Processed
  ├─→ Sold
  ├─→ ReadyForTransfer
  ├─→ Recalled
  └─→ Closed

Sold
  └─→ Recalled

Recalled
  └─→ Closed

Closed
  └─→ (Terminal)
```

## Strict Compliance Rules

1. **No Reversion**: Once a batch leaves `Created` or `ReadyForTransfer`, it can NEVER return to those initial states.
2. **Terminal Force**: `Closed` is absolute. No further transitions or modifications.
3. **Recallability**: A batch can be `Recalled` from almost any state, but once `Recalled`, it can only move to `Closed`.
4. **Processing**: `Processing` is the active transformation state. `Processed` is the result.
5. **Legal Integrity**: Transitions like `Sold -> Created` are logically and legally impossible in this system.

## Invalid Transitions (Legally Prohibited)

❌ `ReadyForTransfer → Created` (Reversion blocked for audit integrity)
❌ `Processed → Processing` (Double processing blocked)
❌ `Sold → Processed` (Post-sale regression blocked)
❌ `Recalled → Processing` (Quarantined items cannot be processed)
❌ `Any → Created` (History cannot be wiped)

