# @frxnklyn/command-runner

Konkrete Node.js-Implementierung von `CommandRunnerInterface` aus `@frxnklyn/command-contracts`.

`NodeCommandRunner` fuehrt genau einen strukturierten Command mit `node:child_process.execFile` aus. Er liefert `stdout`, `stderr`, Exit-Code und Erfolgsstatus als strukturiertes Ergebnis zurueck.

`PathAwareCommandRunner` ist ein Composition-Wrapper um einen beliebigen `CommandRunnerInterface`. Er speichert optional ein Standard-CWD. Ein direkt am Command gesetztes `cwd` gewinnt immer.

```ts
import { NodeCommandRunner } from "@frxnklyn/command-runner";

const runner = new NodeCommandRunner();
const result = await runner.run({
  command: "git",
  args: ["status"],
  cwd: "C:/dev/my-repo",
});
```

```ts
import {
  NodeCommandRunner,
  PathAwareCommandRunner,
} from "@frxnklyn/command-runner";

const runner = new PathAwareCommandRunner(new NodeCommandRunner());
runner.setCwd("C:/dev/my-repo");

await runner.run({
  command: "git",
  args: ["status"],
});
```

Der Runner erbt bewusst nicht vom `DirectoryManager`: Er scannt keine Dateien, verwaltet keine Ordner und enthaelt keine Git-Logik. Sein einziger Zweck ist die Ausfuehrung uebergebener Commands.

## Interne Dependency

Fuer lokale Entwicklung verweist `devDependencies` auf `../npm-command-contracts`. Konsumenten muessen `@frxnklyn/command-contracts` bereitstellen; die Peer Dependency verweist auf das GitHub-Repository.

## Build

```bash
npm install
npm run build
```
