import type {
  CommandInterface,
  CommandResultInterface,
  CommandRunnerInterface,
  CommandRunnerOptionsInterface,
  DirectoryCommandRunnerInterface,
} from "@frxnklyn/command-contracts";
import type { DirectoryInterface } from "@frxnklyn/directory-contracts";
import { NodeCommandRunner } from "./NodeCommandRunner.js";

export class DirectoryCommandRunner implements DirectoryCommandRunnerInterface {
  private readonly commandRunner: CommandRunnerInterface = new NodeCommandRunner();

  constructor(private directory: DirectoryInterface) {}

  setDirectory(directory: DirectoryInterface): this {
    this.directory = directory;
    return this;
  }

  getDirectory(): DirectoryInterface {
    return this.directory;
  }

  setPath(path: string): this {
    this.directory.setPath(path);
    return this;
  }

  getPath(): string {
    return this.directory.getPath();
  }

  run(
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    return this.commandRunner.run(
      {
        ...command,
        cwd: command.cwd ?? this.getPath(),
      },
      options,
    );
  }
}
