<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Planner architecture
- Keep the planner session and query cache in a shared provider, with separate overview, schedule, and student routes, so navigation preserves identity and data.
- Store real student and lesson records in owner-scoped Cloud tables; signed-out sample records are fictional and completion changes are temporary.
- Keep all planner visual roles and responsive layout rules in the global design system to maintain a cohesive appearance.
