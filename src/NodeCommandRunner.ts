import { execFile, type ExecFileException } from "node:child_process";
import type {
  CommandInterface,
  CommandResultInterface,
  CommandRunnerInterface,
  CommandRunnerOptionsInterface,
} from "@frxnklyn/command-contracts";

/**
 * Fehler fuer fehlgeschlagene Commands, wenn `throwOnError` aktiviert ist.
 * Das vollstaendige strukturierte Ergebnis bleibt ueber `result` verfuegbar.
 *
 * @author Frxnklyn
 */
export class CommandExecutionError extends Error {
  constructor(public readonly result: CommandResultInterface) {
    super(`Command failed with exit code ${String(result.exitCode)}: ${result.command}`);
    this.name = "CommandExecutionError";
  }
}

/**
 * Fuehrt strukturierte Commands mit Node.js `execFile` ohne fest gespeicherten
 * Pfad aus. Fuer einzelne Ausfuehrungen steht zusaetzlich `NodeCommandRunner.run`
 * als statischer Einstieg zur Verfuegung.
 *
 * @author Frxnklyn
 */
export class NodeCommandRunner implements CommandRunnerInterface {
  private static readonly defaultRunner = new NodeCommandRunner();

  static run(
    command: CommandInterface,
    options?: CommandRunnerOptionsInterface,
  ): Promise<CommandResultInterface> {
    return NodeCommandRunner.defaultRunner.run(command, options);
  }

  run(
    command: CommandInterface,
    options: CommandRunnerOptionsInterface = {},
  ): Promise<CommandResultInterface> {
    return new Promise((resolve, reject) => {
      execFile(
        command.command,
        command.args ?? [],
        {
          cwd: command.cwd,
          env: command.env ? { ...process.env, ...command.env } : process.env,
          timeout: options.timeoutMs,
          encoding: "utf8",
        },
        (error: ExecFileException | null, stdout: string, stderr: string) => {
          const exitCode = error
            ? typeof error.code === "number"
              ? error.code
              : null
            : 0;
          const result: CommandResultInterface = {
            command: command.command,
            args: command.args,
            cwd: command.cwd,
            stdout,
            stderr,
            exitCode,
            success: exitCode === 0,
            ...(error ? { error } : {}),
          };

          if (!result.success && options.throwOnError) {
            reject(new CommandExecutionError(result));
            return;
          }

          resolve(result);
        },
      );
    });
  }
}
