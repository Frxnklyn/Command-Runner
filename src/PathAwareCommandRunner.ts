import type {
  CommandInterface,
  CommandResultInterface,
  CommandRunnerOptionsInterface,
  PathAwareCommandRunnerInterface,
} from "@frxnklyn/command-contracts";
import { NodeCommandRunner } from "./NodeCommandRunner.js";

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
