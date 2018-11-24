# repo-config

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/repo-config.svg)](https://npmjs.org/package/repo-config)
[![CircleCI](https://circleci.com/gh/C45tr0/repo-config/tree/master.svg?style=shield)](https://circleci.com/gh/C45tr0/repo-config/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/C45tr0/repo-config?branch=master&svg=true)](https://ci.appveyor.com/project/C45tr0/repo-config/branch/master)
[![Codecov](https://codecov.io/gh/C45tr0/repo-config/branch/master/graph/badge.svg)](https://codecov.io/gh/C45tr0/repo-config)
[![Downloads/week](https://img.shields.io/npm/dw/repo-config.svg)](https://npmjs.org/package/repo-config)
[![License](https://img.shields.io/npm/l/repo-config.svg)](https://github.com/C45tr0/repo-config/blob/master/package.json)

<!-- toc -->
* [repo-config](#repo-config)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @repo-config/core
$ repo-config COMMAND
running command...
$ repo-config (-v|--version|version)
@repo-config/core/1.0.0 linux-x64 node-v10.13.0
$ repo-config --help [COMMAND]
USAGE
  $ repo-config COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`repo-config hello [FILE]`](#repo-config-hello-file)
* [`repo-config help [COMMAND]`](#repo-config-help-command)

## `repo-config hello [FILE]`

describe the command here

```
USAGE
  $ repo-config hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ repo-config hello
  hello world from ./src/hello.ts!
```

_See code: [commands/hello.ts](https://github.com/repo-config/core/blob/master/src/commands/hello.ts)_

## `repo-config help [COMMAND]`

display help for repo-config

```
USAGE
  $ repo-config help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->
