<h1 align="center">sentences-per-line</h1>

<p align="center">Packages to enforce the number of sentences per line in Markdown files. 📐</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<img alt="All Contributors: 3 👪" src="https://img.shields.io/badge/all_contributors-3_👪-21bb42.svg" />
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

sentences-per-line's packages allow you to enforce that no line in your Markdown files contains more than one sentence.
This is useful because:

- Shorter lines result in simpler, easier-to-understand Git diffs
- Longer lines are harder to read in source code

```diff
- First sentence. Second sentence.
+ First sentence.
+ Second sentence.
```

## Packages

This monorepo provides:

- [`eslint-plugin-sentences-per-line`](./packages/eslint-plugin-sentences-per-line): [ESLint](https://eslint.org/) plugin to enforce sentences per line in Markdown files.
- [`markdownlint-sentences-per-line`](./packages/markdownlint-sentences-per-line): [Markdownlint](https://github.com/DavidAnson/markdownlint) rule to enforce sentences per line in Markdown files.
- [`prettier-plugin-sentences-per-line`](./packages/prettier-plugin-sentences-per-line): [Prettier](https://prettier.io) plugin to enforce sentences per line in Markdown files.
- [`sentences-per-line`](./packages/sentences-per-line): Utility functions to detect the number of sentences per line in Markdown files.

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💖

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/andrewrynhard"><img src="https://avatars.githubusercontent.com/u/3383143?v=4?s=100" width="100px;" alt="Andrew Rynhard"/><br /><sub><b>Andrew Rynhard</b></sub></a><br /><a href="#ideas-andrewrynhard" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/michaelfaith"><img src="https://avatars.githubusercontent.com/u/8071845?v=4?s=100" width="100px;" alt="michael faith"/><br /><sub><b>michael faith</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/sentences-per-line/issues?q=author%3Amichaelfaith" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/commits?author=michaelfaith" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💙 This package was templated with [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
