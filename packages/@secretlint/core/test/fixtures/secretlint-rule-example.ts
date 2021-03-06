import { SecretLintRuleCreator, SecretLintSource } from "@secretlint/types";

export const creator: SecretLintRuleCreator = {
    meta: {
        recommended: true,
        type: "scanner"
    },
    create(context) {
        const t = context.createTranslator({
            message: {
                en: "found secret: {{ID}}",
                ja: "secret: {{ID}} がみつかりました"
            }
        });
        return {
            file(source: SecretLintSource) {
                const pattern = /secret/gi;
                let match;
                while ((match = pattern.exec(source.content)) !== null) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length];
                    context.report({
                        message: t("message", {
                            ID: matchString
                        }),
                        range
                    });
                }
            }
        };
    }
};
export default creator;
