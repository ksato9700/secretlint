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
}) => {
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
        .then((output: string) => {
            if (output) {
                const outputFilePath = cliOptions.outputFilePath;
                if (outputFilePath !== undefined) {
                    fs.writeFileSync(outputFilePath, output, "utf-8");
                    output = ""; // Return empty to console
                }
                throw new Error(output);
            }
            return output;
        });
};
