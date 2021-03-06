import fs from "fs";
import { createEngine, SecretLintEngineOptions } from "@secretlint/node";
import { searchFiles } from "./search";

export type SecretLintOptions = {
    cwd: string;
    filePathOrGlobList: string[];
    outputFilePath?: string;
    ignoreFilePath?: string;
};
export const runSecretLint = async ({
    cliOptions,
    engineOptions
}: {
    cliOptions: SecretLintOptions;
    engineOptions: SecretLintEngineOptions;
}): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const filePathList = await searchFiles(cliOptions.filePathOrGlobList, {
        cwd: cliOptions.cwd,
        ignoreFilePath: cliOptions.ignoreFilePath
    });
    if (filePathList.length === 0) {
        throw new Error("Not found target files");
    }
    const engine = await createEngine(engineOptions);
    return engine
        .executeOnFiles({
            filePathList
        })
        .then(output => {
            // TODO: if has error, this should be stderr
            const outputFilePath = cliOptions.outputFilePath;
            if (outputFilePath !== undefined) {
                fs.writeFileSync(outputFilePath, output, "utf-8");
                // Return empty to console
                return {
                    exitStatus: 0,
                    stdout: null,
                    stderr: null
                };
            }
            return {
                exitStatus: 1,
                stdout: output,
                stderr: null
            };
        })
        .catch(error => {
            return {
                exitStatus: 1,
                stdout: null,
                stderr: error
            };
        });
};
