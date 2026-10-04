# Components & props detailed design

Status: Implemented, with known gaps

Requirements: [Components & props](components_requirement.md)

## Implementation goal

One `LabDemoPage` with three `LabDemoSection` cards. The sample components (`Greeting`, `Callout`, `Badge`) are private to the file, so the topic stays self-contained.

## Source map

| Source | Responsibility |
| --- | --- |
| [`ComponentsScreen.tsx`](../../../../../src/features/react/components/ComponentsScreen.tsx) | Screen and the private `Greeting`, `Callout`, and `Badge` components |
| [`LabDemoSection.tsx`](../../../../../src/common/theme/LabDemoSection.tsx) | Page and card layout |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactComponents` |

## Ownership and state

- `ComponentsScreen` owns `name`, `isStrong`, and `unread` with `useState`; they reset when the topic is reopened.
- The sample components are stateless: they receive everything as props, which is the point of the topic.

## Composition

`Callout` takes `children: ReactNode` and only adds styling, the same pattern `LabDemoSection` uses for every demo. `Badge` returns `null` when the count is zero, so the caller does not need to check.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| The badge uses `error` with `on-primary` text | Correct contrast in both themes, but not a matched role pair | Add an `on-error` token |

## Verification

- Automated: `ComponentsScreen.test.tsx` (props, tone switch, conditional badge); `ContentView.test.tsx` renders the topic in the three-pane layout.
- Manual: CMP-AC-01 to CMP-AC-04 with the keyboard and VoiceOver, in light and dark mode.
