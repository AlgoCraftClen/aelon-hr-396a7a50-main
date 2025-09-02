# Changelog

All notable changes to IAKWE HR will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Email verification system
- Basic authentication flow
- React application scaffolding
- TailwindCSS integration
- Base component structure

### Need Fixing
- API integration issues in Dashboard
- Welcome video loading error
- User authentication methods
- Entity class implementations
- Error handling in API calls
- Data loading states

### Pending
- Complete API entity implementations
- Error handling improvements
- Unit test coverage
- Documentation updates
- Cultural integration features
- Language localization
- Performance optimization

### Technical Debt
- Implement proper error boundaries
- Add loading states
- Improve type safety
- Add input validation
- Enhance error messaging
- Add proper API response handling

## [1.0.0] - 2025-09-02
### Initial Release
- Basic project structure
- Core authentication system
- Email verification flow

## [Unreleased] - 2025-09-03
### Fixed
- Ensure public pages (`Welcome`, `Auth`, `ForgotPassword`, `Pricing`) render without sidebars even when guest/demo mode is active. (Changed routing/layout selection in `src/pages/Layout.jsx`.)
- Removed duplicate `replaceState` enforcement from `src/pages/Welcome.jsx` to avoid redirect race conditions.
 - Suppress Guest Mode top banner on the `Welcome` entry point so the landing page contains only welcome content; updated `src/components/auth/GuestModeWrapper.jsx`.

### Policy Acknowledgement - 2025-09-03
- Per owner instruction: the layout and routing changes made on 2025-09-03 are declared "law" for the project. Any future change that would modify or compromise these layout/routing decisions must pause and obtain explicit permission from the owner before proceeding. This acknowledgement was recorded at 2025-09-03.

### Policy
- All changes to the layout and routing flow are now protected by an explicit approval policy: if any future automated or manual operation would modify the layout/routing decisions implemented on 2025-09-03, the system must stop and request explicit permission before proceeding. This is recorded here per request from the project owner.

