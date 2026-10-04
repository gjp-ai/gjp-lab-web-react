# GJPLab web documentation

This directory documents the web lab as it exists today and the behaviour it is intended to provide. Source code remains authoritative for implementation; requirement documents are authoritative for intended product behaviour.

## Layout

- `architecture/` holds project-wide documents that describe the whole app.
- `specs/` mirrors `src/` exactly: the docs for `src/<path>/` live in `doc/specs/<path>/`.
- `templates/` holds the starting point for new requirement and detail design documents.
- `decisions/` records project choices the code alone does not explain, and why they were made.

```
doc/
├── architecture/application.md           project-wide
├── decisions/                            0001-….md, one per decision
├── templates/                            requirement.md, detail_design.md
└── specs/                                mirrors src/
    ├── app/startup/                      ↔ src/app/startup/
    │   └── maintenance_requirement.md / maintenance_detail_design.md
    ├── app/navigation/                   ↔ src/app/navigation/
    │   ├── sidebar_requirement.md / sidebar_detail_design.md   (sidebar and pane layout)
    │   └── catalog_requirement.md / catalog_detail_design.md
    ├── common/codesample/                ↔ src/common/codesample/
    │   └── codesample_detail_design.md
    ├── common/theme/                     ↔ src/common/theme/
    │   └── theme_detail_design.md        (Slate design system)
    └── features/                         ↔ src/features/
        └── <category>/<feature>/
            ├── <feature>_requirement.md
            └── <feature>_detail_design.md
```

The `src/app/` root files (`App`, `ContentView`, `FeatureDestination`) are documented in [application architecture](architecture/application.md) and the sidebar detailed design. `src/common/config/` holds only constants and has no spec.

`<feature>` is the code folder name (for example `fetch`, `browserinfo`). Every screen has both a requirement and a detail design; add them together, starting from [`templates/`](templates/). Shared code with no user-facing behaviour, such as `common/theme/`, has a detail design only.

## Document map

| Area | Requirement | Detailed design |
| --- | --- | --- |
| Agent contract | [`AGENTS.md`](../AGENTS.md): project rules, commands, and conventions | — |
| Application structure | — | [Application architecture](architecture/application.md) |
| Visual system | — | [Slate design system](specs/common/theme/theme_detail_design.md) |
| Runnable code sample | — | [Code sample detailed design](specs/common/codesample/codesample_detail_design.md) (used by the TypeScript topics) |
| Decisions | [Decision records](decisions/README.md): why the project is shaped the way it is | — |
| Maintenance (startup) | [Maintenance requirement](specs/app/startup/maintenance_requirement.md) | [Maintenance detailed design](specs/app/startup/maintenance_detail_design.md) |
| Category sidebar and panes | [Sidebar requirement](specs/app/navigation/sidebar_requirement.md) | [Sidebar detailed design](specs/app/navigation/sidebar_detail_design.md) |
| Category catalogue | [Catalogue requirement](specs/app/navigation/catalog_requirement.md) | [Catalogue detailed design](specs/app/navigation/catalog_detail_design.md) |
| TypeScript → Values & types | [Requirement](specs/features/typescript/basics/basics_requirement.md) | [Detailed design](specs/features/typescript/basics/basics_detail_design.md) |
| TypeScript → Null & undefined | [Requirement](specs/features/typescript/nullish/nullish_requirement.md) | [Detailed design](specs/features/typescript/nullish/nullish_detail_design.md) |
| TypeScript → Arrays, sets & maps | [Requirement](specs/features/typescript/collections/collections_requirement.md) | [Detailed design](specs/features/typescript/collections/collections_detail_design.md) |
| TypeScript → Functions & closures | [Requirement](specs/features/typescript/functions/functions_requirement.md) | [Detailed design](specs/features/typescript/functions/functions_detail_design.md) |
| TypeScript → Objects, classes & enums | [Requirement](specs/features/typescript/classes/classes_requirement.md) | [Detailed design](specs/features/typescript/classes/classes_detail_design.md) |
| TypeScript → Interfaces & generics | [Requirement](specs/features/typescript/generics/generics_requirement.md) | [Detailed design](specs/features/typescript/generics/generics_detail_design.md) |
| TypeScript → Error handling | [Requirement](specs/features/typescript/errors/errors_requirement.md) | [Detailed design](specs/features/typescript/errors/errors_detail_design.md) |
| TypeScript → Promises & async/await | [Requirement](specs/features/typescript/promises/promises_requirement.md) | [Detailed design](specs/features/typescript/promises/promises_detail_design.md) |
| TypeScript → Iterators & generators | [Requirement](specs/features/typescript/iterators/iterators_requirement.md) | [Detailed design](specs/features/typescript/iterators/iterators_detail_design.md) |
| TypeScript → Strings & regex | [Requirement](specs/features/typescript/strings/strings_requirement.md) | [Detailed design](specs/features/typescript/strings/strings_detail_design.md) |
| React → Components & props | [Requirement](specs/features/react/components/components_requirement.md) | [Detailed design](specs/features/react/components/components_detail_design.md) |
| HTTP Client → fetch | [Requirement](specs/features/httpclient/fetch/fetch_requirement.md) | [Detailed design](specs/features/httpclient/fetch/fetch_detail_design.md) |
| Others → Browser & device | [Requirement](specs/features/others/browserinfo/browserinfo_requirement.md) | [Detailed design](specs/features/others/browserinfo/browserinfo_detail_design.md) |
| New features | [Requirement template](templates/requirement.md) | [Detail design template](templates/detail_design.md) |

## Reading paths

- **New contributor:** application architecture → feature requirement and detailed design → related TypeScript sources.
- **Product or QA:** requirements → acceptance criteria → implementation status and known gaps in the detailed design.
- **Implementation agent:** [`AGENTS.md`](../AGENTS.md) → relevant design and requirement documents.

## Documentation contract

Each fact has one owner:

- Requirements describe observable behaviour and avoid prescribing React components.
- Detailed designs explain how the current implementation satisfies—or does not yet satisfy—requirements.
- Architecture documents stable project-wide boundaries and links to feature details instead of duplicating them.

Use repository-relative links and short symbol references rather than copied implementations.

## Status language

| Label | Meaning |
| --- | --- |
| Implemented | Present in source and verifiable from the repository |
| Partial | Some required behaviour exists, with named gaps |
| Planned | Approved requirement with no complete implementation yet |
| Open | Requires product, design, security, or architecture input |

## Maintenance

New feature docs start from the [requirement template](templates/requirement.md) and the [detail design template](templates/detail_design.md), and live at `specs/features/<category>/<feature>/<feature>_requirement.md`, next to `<feature>_detail_design.md`. When a change reverses or adds a project-wide choice, add a [decision record](decisions/README.md).

Update this documentation in the same change when user-visible behaviour, routes or URL shapes, state ownership, environment variables, build/test commands, the toolchain, or material limitations change. Before handoff, verify local Markdown links and report checks that could not run.
