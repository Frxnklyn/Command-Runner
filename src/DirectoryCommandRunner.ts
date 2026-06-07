import type {
  CommandInterface,
  CommandResultInterface,
  CommandRunnerOptionsInterface,
  DirectoryCommandRunnerInterface,
} from "@frxnklyn/command-contracts";
import { DirectoryManager } from "@frxnklyn/file-manager/directory-manager";
import { NodeCommandRunner } from "./NodeCommandRunner.js";

/**
 * Kombiniert den DirectoryManager mit Command-Ausfuehrung. Die Klasse verwaltet
 * ihr Directory selbst und verwendet ihren aktuellen Pfad als Standard-CWD.
 *
 * @author Frxnklyn
 */
export class DirectoryCommandRunner
  extends DirectoryManager
  implements DirectoryCommandRunnerInterface
{
  constructor(path?: string) {
    super(path);
  }

  static run(
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface>;
  static run(
    path: string,
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface>;
  static run(
    pathOrCommand: string | CommandInterface,
    commandOrOptions?: CommandInterface | CommandRunnerOptionsInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    if (typeof pathOrCommand === "string") {
      return new DirectoryCommandRunner(pathOrCommand).run(
        commandOrOptions as CommandInterface,
        options,
      );
    }

    return new DirectoryCommandRunner().run(
      pathOrCommand,
      commandOrOptions as CommandRunnerOptionsInterface | undefined,
    );
  }

  run(
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    return NodeCommandRunner.run(
      {
        ...command,
        cwd: command.cwd ?? this.getPath(),
      },
      options,
    );
  }
}
