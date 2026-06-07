import type {
  CommandInterface,
  CommandResultInterface,
  CommandRunnerOptionsInterface,
  PathAwareCommandRunnerInterface,
} from "@frxnklyn/command-contracts";
import { NodeCommandRunner } from "./NodeCommandRunner.js";

/**
 * Fuehrt Commands mit einem gespeicherten String-Pfad als Standard-CWD aus.
 * Ein direkt am Command gesetztes `cwd` hat Vorrang. Einzelne Ausfuehrungen
 * koennen ohne Instanz ueber `PathAwareCommandRunner.run` gestartet werden.
 *
 * @author Frxnklyn
 */
export class PathAwareCommandRunner implements PathAwareCommandRunnerInterface {
  static run(
    path: string,
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    return NodeCommandRunner.run(
      {
        ...command,
        cwd: command.cwd ?? path,
      },
      options,
    );
  }

  constructor(private path: string) {}

  setPath(path: string): this {
    this.path = path;
    return this;
  }

  getPath(): string {
    return this.path;
  }

  run(
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    return PathAwareCommandRunner.run(this.getPath(), command, options);
  }
}
