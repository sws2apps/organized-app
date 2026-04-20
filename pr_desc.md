# Description

This PR introduces comprehensive improvements to the meeting scheduling pages. While substantial in scale, all changes are fully scoped to the Meeting Schedules feature segment aiming to standardize layouts, improve performance, solve minor UI bugs, and accelerate the user's scheduling workflows. 

### 🚀 Workflow & Auto-Selection Improvements
- **Smart Week Auto-Selection**: Midweek and Weekend scheduling pages now automatically snap to the next chronologically incomplete week on load (instead of a blank screen). If all future weeks are fully assigned, it gracefully falls back to the nearest logical week.
- **Autofill Jump**: Immediately after the Autofill tool completes processing, the editor UI correctly auto-routes the user to the very first week of the newly autofilled batch to encourage seamless sequential reviewing.

### 🎨 UI Parity & Component Restructures
- **Weekend Editor Layout Parity**: Brought the Weekend Editor precisely up to structural parity with the Midweek Editor styling, standardizing grid positioning and enforcing consistent `360px` maximum field widths for inputs.
- **Extracted Shared Styling**: Centralized major layout elements (e.g., `StyledNavigationArrowButton`, `DoubleFieldContainer`, `PrimaryFieldContainer`, `SecondaryFieldContainer`) into a `shared_styles` module to prevent circular dependencies between Midweek and Weekend editors and significantly reduce UI duplication.
- **Animation Bug Fixes**: Completely replaced the heavy `@media` queries surrounding the "Go to current week" button functionality with a lightweight CSS Grid `0fr / 1fr` toggle, permanently eliminating layout jumping and element overlapping issues across both mobile and desktop viewports.

### ✨ Visual & Aesthetic Polishes 
- **Current Week Date Tabs**: Added a "Current Week" icon directly onto the target date tabs to provide immediate visual mapping.
- **Progress Indicators**: Implemented visual progress status indicators on the parent scheduling week tabs to reflect task assignments.
- **Improved Meeting Viewer & Time Badges**: Overhauled the raw meeting schedules viewing screen to cleanly feature easy-to-read "time badge" layouts.
- **Conditional Role Rendering**: Implemented conditional overrides into the meeting viewers/printout screen to automatically hide any empty roles (e.g., Student, Assistant, Conductor) if no one is assigned to them, structurally uncluttering the aesthetic without removing the database records.
- **Crisp Form Alignment**: Realigned overarching field label positionings across toolbars to sit perfectly flush.
- **Badge Adjustments**: Refined the "Last Update" badge sizing scale to deliver a tighter, more professional visual hierarchy.

## Type of change

- [x] New feature (non-breaking change which adds functionality)
- [x] Bug fix (non-breaking change which fixes an issue)
- [x] Refactoring (improving code without adding new functionality)

# Checklist:

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] Any dependent changes have been merged and published in downstream modules
