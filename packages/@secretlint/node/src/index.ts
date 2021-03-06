import fs from "fs";
import utils from "util";
import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createFormatter } from "@secretlint/formatter";
import { SecretLintCoreDescriptor } from "@secretlint/types";

const readFile = utils.promisify(fs.readFile);
export type SecretLintEngineOptions = {
    /**
     * If configFilePath is not defined, search config file from cwd(current working dir)
     */
    configFilePath?: string;
    /**
     * If cwd is not defined, cwd(current working dir) is current working dir.
     */
    cwd?: string;
    /**
     * If color is false, disable ANSI-color of the output.
     * Default: true
     */
    color?: boolean;
    /**
     * Specify formatter name for output
     */
    formatter: string;
};

const lintFile = async (filePath: string, options: SecretLintCoreDescriptor) => {
    return readFile(filePath, "utf-8").then(content => {
        return lintSource(
            {
                filePath: filePath,
                content: content
            },
            options
        );
    });
};

const executeOnContent = async ({
    content,
    filePath,
    config,
    options
}: {
    content: string;
    filePath: string;
    config: SecretLintCoreDescriptor;
    options: SecretLintEngineOptions;
}) => {
    const result = await lintSource(
        {
            filePath: filePath,
            content: content
        },
        config
    );
    const formatter = createFormatter({
        color: options.color,
        formatterName: options.formatter
    });
    return formatter.format([result]);
};

const executeOnFiles = async ({
    filePathList,
    config,
    options
}: {
    filePathList: string[];
    config: SecretLintCoreDescriptor;
    options: SecretLintEngineOptions;
}) => {
    const resultPromises = filePathList.map(filePath => {
        return lintFile(filePath, config);
    });
    const results = await Promise.all(resultPromises);
    const formatter = createFormatter({
        color: options.color,
        formatterName: options.formatter
    });
    return formatter.format(results);
};

/**
 * Create SecretLint Engine and return the instance.
 * The engine load config file(.secretlintrc) automatically
 * @param options
 */
export const createEngine = async (options: SecretLintEngineOptions) => {
    const loadedResult = loadConfig({
        cwd: options.cwd,
        configFilePath: options.configFilePath
    });
    if (!loadedResult.ok) {
        throw new Error(loadedResult.errors.map(error => error.stack).join("\n\n"));
    }
    return {
        /**
         * Lint a content and return the formatted results
         * @param content
         * @param filePath
         */
        executeOnContent: ({ content, filePath }: { content: string; filePath: string }) => {
            return executeOnContent({
                content,
                filePath,
                config: loadedResult.config,
                options: options
            });
        },
        /**
         * Lint files and return the formatted results
         * @param filePathList
         */
        executeOnFiles: ({ filePathList }: { filePathList: string[] }) => {
            return executeOnFiles({
                filePathList,
                config: loadedResult.config,
                options: options
            });
        }
    };
};
