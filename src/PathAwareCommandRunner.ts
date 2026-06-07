import type {
  CommandInterface,
  CommandResultInterface,
  CommandRunnerInterface,
  CommandRunnerOptionsInterface,
  PathAwareCommandRunnerInterface,
} from "@frxnklyn/command-contracts";

export class PathAwareCommandRunner implements PathAwareCommandRunnerInterface {
  private cwd?: string;

  constructor(private readonly commandRunner: CommandRunnerInterface) {}

  setCwd(path: string): this {
    this.cwd = path;
    return this;
  }

  getCwd(): string | undefined {
    return this.cwd;
  }

  clearCwd(): this {
    this.cwd = undefined;
    return this;
  }

  run(
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    return this.commandRunner.run(
      {
        ...command,
        cwd: command.cwd ?? this.cwd,
      },
      options,
    );
  }
}
