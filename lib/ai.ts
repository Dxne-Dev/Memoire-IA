import Groq from 'groq-sdk';

export const analyzeDocument = async (text: string, userPrompt?: string) => {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    const systemPrompt = `Tu es un expert académique et un assistant de recherche rigoureux. 
Ta mission est d'analyser des extraits de mémoires, thèses ou articles académiques.
Ton objectif est de fournir une analyse critique, constructive et pédagogique.

Directives:
1. Analyse la structure, la clarté, la pertinence des arguments et la qualité de la rédaction.
2. Identifie les points forts et les faiblesses.
3. Suggère des améliorations concrètes (reformulations, approfondissements, citations manquantes).
4. Adopte un ton professionnel, encourageant mais exigeant.
5. Si le texte contient des erreurs méthodologiques évidentes, signale-les avec tact.

Réponds toujours en format Markdown structuré.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt ? `${userPrompt}\n\nTexte à analyser:\n${text}` : `Analyse ce texte:\n${text}`
                }
            ],
            model: "llama-3.3-70b-versatile", // Modèle performant et recommandé sur Groq
            temperature: 0.5,
            max_tokens: 2048,
        });

        return completion.choices[0]?.message?.content || "Aucune analyse générée.";
    } catch (error) {
        console.error("Erreur lors de l'appel à l'IA:", error);
        throw new Error("L'analyse IA a échoué.");
    }
};
