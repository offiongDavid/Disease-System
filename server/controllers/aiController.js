import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

export const aiPrediction = async (
  symptoms,
  predictedDisease
) => {

  try {

    const symptomText = Array.isArray(symptoms)
      ? symptoms.join(", ")
      : String(symptoms);

    const prompt = `
You are an intelligent medical AI assistant.

Analyze the symptoms carefully.

Symptoms:
${symptomText}

Rule-based predicted disease:
${predictedDisease}

IMPORTANT:
- If the predicted disease is "Unknown", determine the most likely disease from the symptoms.
- If symptoms strongly match another disease, improve the prediction.
- Confidence must depend on symptom consistency.
- Return High if symptoms strongly align.
- Return Moderate if symptoms partially align.
- Return Low if symptoms are weak or unclear.
- Give practical medication suggestions.
- Give meaningful recommendations.
- Give useful precautions.

Return ONLY valid JSON in this format:

{
  "predictedDisease": "",
  "confidence": "",
  "medication": "",
  "recommendation": "",
  "precautions": ""
}
`;

    const chatCompletion =
      await groq.chat.completions.create({

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        model: "llama-3.3-70b-versatile",

        temperature: 0.4,

      });

    const result =
      chatCompletion.choices[0]
        ?.message?.content;

    console.log("AI RESULT:", result);

    const cleanedResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResult);

  } catch (error) {

    console.log("AI ERROR:", error);

    return {

      predictedDisease:
        predictedDisease !== "Unknown"
          ? predictedDisease
          : "Further Medical Diagnosis Required",

      confidence:
        symptoms.length >= 5
          ? "High"
          : symptoms.length >= 3
          ? "Moderate"
          : "Low",

      medication:
        "Consult a healthcare professional for proper medication.",

      recommendation:
        "Further medical evaluation is advised based on the provided symptoms.",

      precautions:
        "Monitor symptoms closely and seek medical attention if symptoms worsen.",

    };

  }

};