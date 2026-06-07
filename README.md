# @frxnklyn/command-runner

Konkrete Node.js-Implementierung von `CommandRunnerInterface` aus `@frxnklyn/command-contracts`.

`NodeCommandRunner` ist die Variante ohne gespeicherten Pfad. Er fuehrt genau einen strukturierten Command mit `node:child_process.execFile` aus. Er liefert `stdout`, `stderr`, Exit-Code und Erfolgsstatus als strukturiertes Ergebnis zurueck.

`PathAwareCommandRunner` und `DirectoryCommandRunner` sind Varianten mit gespeichertem Pfad. Dadurch benoetigt `run(...)` kein `cwd`. Ein direkt am Command gesetztes `cwd` gewinnt weiterhin.

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

Diese Variante speichert ein `DirectoryInterface` statt eines String-Pfads. Der aktuelle Pfad wird bei jedem `run(...)` neu gelesen. Veraendert sich das Directory, verwendet der naechste Command automatisch dessen neuen Pfad.

```ts
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";

const runner = new DirectoryCommandRunner(directory);

await runner.run({ command: "git", args: ["status"] });

directory.moveTo("packages/example");
await runner.run({ command: "git", args: ["status"] });
```

Statischer Aufruf mit `DirectoryInterface`:

```ts
await DirectoryCommandRunner.run(directory, {
  command: "git",
  args: ["status"],
});
```

Der Runner erbt bewusst nicht vom `DirectoryManager`: Er scannt keine Dateien, verwaltet keine Ordner und enthaelt keine Git-Logik. Sein einziger Zweck ist die Ausfuehrung uebergebener Commands.

## Interne Dependency

Fuer lokale Entwicklung verweisen die `devDependencies` auf `../npm-command-contracts` und `../npm-directory-contracts`. Konsumenten muessen beide Peer Dependencies bereitstellen.

## Build

```bash
npm install
npm run build
```
