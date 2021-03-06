# Secretlint [![Actions Status](https://github.com/secretlint/secretlint/workflows/test/badge.svg)](https://github.com/secretlint/secretlint/actions?query=workflow%3A"test")

Secretlint is pluggable linting tool to prevent commit secret/credential file.

## Purpose

- Scan files and if the file has secret and report it
- Prevent to commit secret/credential files
- Fix invalid  file?

## Motivation

- [git-secrets](https://github.com/awslabs/git-secrets) is useful, but it is hard to setup per project.
	- It main use-case is globally installation
	- Secretlint want to install for a project and customize setting per project.
- [repo-security-scanner](https://github.com/UKHomeOffice/repo-security-scanner), [Gitleaks](https://github.com/zricethezav/gitleaks) and [truffleHog](https://github.com/dxa4481/truffleHog) is good scan tools
	- We need to flexible customize that include ignore by comment, ignore like gitinore
- [detect-secrets](https://github.com/Yelp/detect-secrets) is similar tools, but it apply opt-out approach
	- If you want to disable plugin, use `--no-<plugin>`
	    - Secretlint adopt opt-in approach  
    - We need to custom plugin by user
		- See [Bring-your own-plugins (BYOP), via --custom-plugins option by KevinHock · Pull Request #255 · Yelp/detect-secrets](https://github.com/Yelp/detect-secrets/pull/255)

## Usage

We need to your contribution!

- <https://github.com/secretlint/secretlint/issues>

## Architecture

### Opt-in instead of Opt-out

Secretlint adopt opt-in approach.

In our experience, linting tools that report various errors by default is difficult to use.
Opt-in approach help to introduce Secretlint increasing.

### A documentation per a Rule

We think a rule as a documentation.

Each rule should have reasonable documentation.

- [ ]  How?

### Why Node.js?

- Package Manager
	- Require pacakge manager to realize flexible pluggable system
	- Node.js has npm and yarn as package manager
	- Package manger help to install custom plugin/rule by user
- Exist Reference Implementation
	- Node.js already has pluggable linting tools like ESLint, textlint, stylelint etc
	- So Node.js user familiar with pluggable linting tools
	- Previously, I created textlint as same approach, so I familiar with Node.js

If you interesting in Docker support, please see [Docker support · Issue #7](https://github.com/secretlint/secretlint/issues/7)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
