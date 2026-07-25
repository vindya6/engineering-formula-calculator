import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";

import { FORMULAS } from "./formulas";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const AskInput = z.object({
  query: z.string().trim().min(3).max(600),
});

const ResponseSchema = z.object({
  formulaId: z.string(),
  reason: z.string(),
  extracted: z.array(z.object({ key: z.string(), value: z.number() })),
  explanation: z.string(),
});

export const askFormulaAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AskInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3.6-flash");

    const catalog = FORMULAS.map(f => ({
      id: f.id,
      name: f.name,
      subject: f.subject,
      expression: f.expression,
      variables: f.variables.map(v => ({ key: v.key, name: v.name, unit: v.unit })),
    }));

    const system = `You are Formula Assistant, an engineering tutor for first-year students. Given a student's natural-language problem, pick the single BEST formula from the provided catalog. Extract any numeric values the student gave using the exact variable "key" strings from that formula. Explain briefly why this formula fits.
Respond ONLY with valid JSON matching the schema. If unsure, still pick the closest formula.
Formula catalog: ${JSON.stringify(catalog)}`;

    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: ResponseSchema }),
        system,
        prompt: `Student says: "${data.query}"`,
      });
      return output;
    } catch (err) {
      if (NoObjectGeneratedError.isInstance(err)) {
        return {
          formulaId: "",
          reason: "The assistant couldn't confidently pick a formula. Try rephrasing with the quantities and units.",
          extracted: [],
          explanation: err.text ?? "",
        };
      }
      throw err;
    }
  });
