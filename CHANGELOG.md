# Changelog

All notable changes to this project will be documented in this file.

## [0.0.0.1] - 2026-05-14

### Fixed

- **Hero and program images now load correctly after admin upload.** Images uploaded via the admin panel were not appearing on the home page. The `SafeImage` component was initializing from the first rendered value and ignoring subsequent prop updates, so once the CMS data loaded asynchronously the image stayed frozen on the placeholder. Added a sync effect so the displayed image always reflects the latest URL from the database.
- **Honours section on mobile is now readable.** The marquee was sizing every card as half the container width regardless of screen size, producing extremely narrow cards on phones. The section now shows a single full-width card on screens below 640 px. The section header also stacks vertically on small screens so the heading and "View all letters" link no longer fight for space.
