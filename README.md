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
  

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend


