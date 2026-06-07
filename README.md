# @frxnklyn/command-runner

Konkrete Node.js-Implementierung von `CommandRunnerInterface` aus `@frxnklyn/command-contracts`.

`NodeCommandRunner` ist die Variante ohne gespeicherten Pfad. Er fuehrt genau einen strukturierten Command mit `node:child_process.execFile` aus. Er liefert `stdout`, `stderr`, Exit-Code und Erfolgsstatus als strukturiertes Ergebnis zurueck.

`PathAwareCommandRunner` speichert einen String-Pfad. `DirectoryCommandRunner` erweitert den vorhandenen `DirectoryManager` und ist dadurch selbst ein vollstaendiges Directory. Beide Varianten benoetigen bei `run(...)` kein `cwd`. Ein direkt am Command gesetztes `cwd` gewinnt weiterhin.

```ts
import { NodeCommandRunner } from "@frxnklyn/command-runner";

const runner = new NodeCommandRunner();
const result = await runner.run({
  command: "git",
  args: ["status"],
  cwd: "C:/dev/my-repo",
});
```

Fuer einen einzelnen Aufruf muss keine Instanz erstellt werden:

```ts
const result = await NodeCommandRunner.run({
  command: "node",
  args: ["--version"],
});
```

```ts
import { PathAwareCommandRunner } from "@frxnklyn/command-runner";

const runner = new PathAwareCommandRunner("C:/dev/my-repo");

await runner.run({
  command: "git",
  args: ["status"],
});
```

Das Standard-CWD kann auch direkt beim Erstellen gesetzt werden:

```ts
const runner = new PathAwareCommandRunner("C:/dev/my-repo");
await runner.run({ command: "git", args: ["status"] });
```

Statischer Aufruf mit String-Pfad:

```ts
await PathAwareCommandRunner.run("C:/dev/my-repo", {
  command: "git",
  args: ["status"],
});
```

## DirectoryCommandRunner

Diese Variante erweitert `DirectoryManager`. Sie erstellt und verwaltet Ordner selbst und verwendet ihren eigenen aktuellen Pfad fuer Commands.

```ts
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";

const runner = new DirectoryCommandRunner("C:/dev/my-repo");

await runner.run({ command: "git", args: ["status"] });

runner.moveTo("packages/example");
await runner.run({ command: "git", args: ["status"] });
```

Ohne Pfad startet der Runner im Standardpfad des `DirectoryManager`:

```ts
const runner = new DirectoryCommandRunner();
runner.addFolder("generated");
```

Statische Aufrufe:

```ts
await DirectoryCommandRunner.run({
  command: "git",
  args: ["status"],
});

await DirectoryCommandRunner.run("C:/dev/my-repo", {
  command: "git",
  args: ["status"],
});
```

`NodeCommandRunner` und `PathAwareCommandRunner` bleiben reine Command-Runner. Nur `DirectoryCommandRunner` kombiniert bewusst Directory- und Command-Funktionalitaet.

## Interne Dependency

Fuer lokale Entwicklung verweisen die `devDependencies` auf `../npm-command-contracts`, `../npm-directory-contracts` und `../File-Manager`. Konsumenten muessen diese Peer Dependencies bereitstellen.

## Build

```bash
npm install
npm run build
```
