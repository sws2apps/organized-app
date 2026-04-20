# Description

- Automatically selects the next chronologically incomplete week when accessing the Midweek or Weekend scheduling pages instead of defaulting to a blank view.
- Automatically jumps to the initial autofilled week immediately after the Autofill tool completes processing to speed up sequential review.
- Refactored the "Go to current week" button functionality to use an elegant CSS Grid `0fr / 1fr` toggle, permanently eliminating visual bugs, overlaps, and redundant media queries for mobile vs desktop views.
- Brought the Weekend Meeting editor exactly to parity with the Midweek Editor layout, including porting over the quick-navigation toolbar arrows and enforcing consistent `360px` field widths.
- Extracted and centralized standard layout components (such as `StyledNavigationArrowButton`, `DoubleFieldContainer`) into a single `shared_styles` package to reduce UI duplication.
- Systematically hide empty roles (e.g., Student, Assistant, Conductor) in the print and viewer pages via React conditional overrides if they haven't been assigned yet, ensuring an uncluttered, premium reading aesthetic without risking data deletion.

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
