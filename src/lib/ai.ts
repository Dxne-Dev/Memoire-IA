export async function analyzeReferenceDocument(text: string) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

  if (!GROQ_API_KEY && !GEMINI_API_KEY && !OPENAI_API_KEY) {
    throw new Error(
      "Absence de clé API. Créez `.env` et ajoutez VITE_GROQ_API_KEY=votre_cle"
    )
  }

  // Ne prendre que les 30 000 premiers caractères pour ne pas exploser les limites de contexte
  const shortText = text.substring(0, 30000)

  const prompt = `
Tu es un expert académique qui analyse un modèle de mémoire.
Extrais les informations clés du texte suivant en format JSON strict.

Structure attendue :
{
  "pages": 40,
  "parts": 3,
  "style": "descriptif court du style et ton académique détecté (ex: revue de littérature empirique)",
  "narrative_variables": "Liste des informations contextuelles spécifiques mentionnées dans l'intro/mémoire (ex: 'Mention de l'université, nom de l'entreprise d'accueil pour le stage, durée du stage, ville, technologies, etc.'). Ce sont les éléments personnels que le nouvel étudiant devra fournir pour que son mémoire ait le même niveau de détail.",
  "summary": "Résumé en 2 phrases de l'essence, la problématique et la méthodologie de ce mémoire."
}

Texte du document (tronqué si trop long) :
"""
${shortText}
"""
`

  // 1. Groq (Privilégié si présent, car extrêmement rapide et la clé est fournie)
  if (GROQ_API_KEY) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })
    
    const data = await res.json()
    if (data.error) throw new Error("Groq Error: " + data.error.message)
    return JSON.parse(data.choices[0].message.content)
  }

  // 2. OpenAI
  if (OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })
    
    const data = await res.json()
    if (data.error) throw new Error("OpenAI Error: " + data.error.message)
    return JSON.parse(data.choices[0].message.content)
  }

  // 3. Gemini
  if (GEMINI_API_KEY) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      }),
    })
    
    const data = await res.json()
    if (data.error) throw new Error("Gemini Error: " + data.error.message)
    return JSON.parse(data.candidates[0].content.parts[0].text)
  }
}

export async function chatWithMentor(project: any, activeSection: any, prevMessages: any[]) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!GROQ_API_KEY && !OPENAI_API_KEY) {
    throw new Error("Clé API manquante pour le chat (Groq ou OpenAI requise).")
  }

  // Construction du contexte (System Prompt)
  const analysis = project.reference_analysis || {}
  let systemPrompt = `Tu es le "Mentor IA", un assistant expert en rédaction de mémoires universitaires.
L'étudiant travaille sur le mémoire intitulé : "${project.title || 'Non défini'}".
Sujet / Domaine : "${project.field_of_study || 'Non spécifié'}".
Problématique : "${project.problem_statement || 'Non définie'}".

Analyse du modèle de référence de l'étudiant : 
- Style attendu : ${analysis.style || 'Académique'}
- Type d'informations attendues dans ce genre de document : ${analysis.narrative_variables || 'Contexte de stage, université, lieu...'}
- ${analysis.summary || 'Pas de résumé disponible.'}

Tu dois le guider pas à pas dans la rédaction.`

  if (activeSection) {
    systemPrompt += `\nActuellement, l'étudiant se concentre sur la section : "${activeSection.title}". Ton but est d'abord de récolter sa propre matière (ses informations réelles) avant de générer quoi que ce soit.`
  }

  systemPrompt += `\n\nINSTRUCTION CRITIQUE STRICTE : Ton unique réponse doit être un objet JSON valide suivant exactement cette structure :
{
  "message": "Texte court, formel et encourageant pour introduire tes questions ou répondre à l'étudiant.",
  "questions": [
    "Question 1 (ex: Dans quel cabinet as-tu fait ton stage ?)",
    "Question 2 (ex: Quelle est la problématique exacte ?)"
  ]
}
Note : L'array 'questions' peut être vide si tu penses avoir toutes les informations nécessaires.
Ne rédige JAMAIS le texte complet de la section dans ce chat. Contente-toi d'interroger l'étudiant sur sa réalité contextuelle (en te basant sur les informations attendues du modèle).`

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...prevMessages.map(m => {
      // Pour éviter de renvoyer du JSON brut dans l'historique de l'IA si c'était déjà du JSON formatté
      let safeContent = m.content;
      try {
        const parsed = JSON.parse(m.content);
        if (parsed.message) safeContent = parsed.message + "\nQuestions : " + (parsed.questions?.join(", ") || "");
      } catch (e) {}
      return { role: m.role, content: safeContent };
    })
  ]

  if (GROQ_API_KEY) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: apiMessages,
        response_format: { type: 'json_object' }
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error("Groq Error: " + data.error.message)
    return data.choices[0].message.content
  }

  if (OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        response_format: { type: 'json_object' }
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error("OpenAI Error: " + data.error.message)
    return data.choices[0].message.content
  }
}

export async function generatePlan(project: any) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!GROQ_API_KEY && !OPENAI_API_KEY) {
    throw new Error("Clé API manquante pour générer le plan.")
  }

  const analysis = project.reference_analysis || {}
  const prompt = `Tu es un professeur expert en méthodologie de recherche. 
Crée un plan structuré pour un NOUVEAU mémoire en t'inspirant FORTEMENT de la structure du modèle de référence fourni, mais en l'adaptant au NOUVEAU contexte de l'étudiant.

NOUVEAU CONTEXTE DE L'ÉTUDIANT :
Titre : "${project.title || 'Non défini'}"
Filière/Sujet : "${project.field_of_study || 'Non spécifié'}"
Problématique : "${project.problem_statement || 'Non définie'}"

MODÈLE DE RÉFÉRENCE (à mimétiser pour la structure) : 
Style: ${analysis.style || 'Universitaire'}
Analyse du modèle: ${analysis.summary || 'Pas de modèle fourni. Fais un plan standard.'}

Ton objectif : Génère un plan de mémoire qui suit le squelette/découpage du modèle de référence, mais dont les titres de sections sont adaptés et spécifiques à la problématique du NOUVEAU contexte. Ne fais pas que copier les titres, adapte-les au sujet de l'étudiant.

Retourne UN SEUL OBJET JSON strict contenant un tableau "sections", chaque section ayant un "title" court et percutant.
Exemple de format attendu :
{
  "sections": [
    { "title": "Introduction Générale" },
    { "title": "Revue de Littérature sur [Sujet]" },
    { "title": "Méthodologie" },
    { "title": "Résultats et Analyse" },
    { "title": "Conclusion" }
  ]
}`

  const fetchWithKey = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return JSON.parse(data.choices[0].message.content)
  }

  if (GROQ_API_KEY) return await fetchWithKey('https://api.groq.com/openai/v1/chat/completions', GROQ_API_KEY, 'llama-3.3-70b-versatile')
  if (OPENAI_API_KEY) return await fetchWithKey('https://api.openai.com/v1/chat/completions', OPENAI_API_KEY, 'gpt-4o-mini')
}

export async function generateSectionContent(project: any, activeSection: any, prevMessages: any[]) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!GROQ_API_KEY && !OPENAI_API_KEY) {
    throw new Error("Clé API manquante pour générer la section.")
  }

  const analysis = project.reference_analysis || {}
  const systemPrompt = `Tu es un expert académique en rédaction de mémoire universitaire.
Tu as été sollicité pour générer un premier jet COMPLET et BIEN STRUCTURÉ pour la section intitulée "${activeSection.title}".
Le sujet complet du mémoire est : "${project.title}".
Problématique : "${project.problem_statement}".
Le ton doit être formel, clair et académique (${analysis.style || 'Universitaire'}).

Éléments clés de contexte tirés du modèle de référence : ${analysis.narrative_variables || 'Structure classique de mémoire'}

Prends en compte cet historique de discussion entre l'élève et son mentor (Toi). L'élève t'a donné ses propres informations réelles (son université, son stage, etc.) :`
  
  const conversation = prevMessages.map(m => `${m.role === 'user' ? 'Étudiant' : 'Mentor'} : ${m.content}`).join('\n')

  const userPrompt = `Historique :
${conversation}

En te basant sur ce qui a été discuté ci-dessus, Rédige maintenant le contenu exhaustif de la section "${activeSection.title}". Formate ta réponse en beau Markdown.`

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  const fetchWithKey = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.choices[0].message.content
  }

  if (GROQ_API_KEY) return await fetchWithKey('https://api.groq.com/openai/v1/chat/completions', GROQ_API_KEY, 'llama-3.3-70b-versatile')
  if (OPENAI_API_KEY) return await fetchWithKey('https://api.openai.com/v1/chat/completions', OPENAI_API_KEY, 'gpt-4o-mini')
}
