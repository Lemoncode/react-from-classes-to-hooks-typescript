# react-from-classes-to-hooks-typescript

Simple applications examples: migrations from class based components to hooks.

## Examples

Under each example folder you will find two subfolders:
- 00_start: Starting point (using state + classes).
- 01_migrated: Application fully migrated to hooks.

## 00_login-page

In this application we present a login page (class based + state) and a second page that shows the logged in user (make use
of context + hoc to inject to login name as a prop).

In the migration process:
  - Migrate the login page from classes to stateless using hooks (created useLogin) and use the context using the (_useContext_) effect.
  - Migrate the page B, remove the usage of an HOC to inject the login context and use the effect _useContext_


