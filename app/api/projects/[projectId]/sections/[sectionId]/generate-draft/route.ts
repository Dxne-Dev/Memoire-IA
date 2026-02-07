import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getProjectById, getSectionMessages, updateSectionDraft } from '@/lib/project-utils';
import { analyzeDocument } from '@/lib/ai';
import { firestore } from '@/lib/firebase-admin';

export async function POST(
    req: NextRequest,
    { params }: { params: { projectId: string, sectionId: string } }
) {
    try {
        const { projectId, sectionId } = await params;
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const project = await getProjectById(projectId);

        if (!project || project.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
        }

        // Récupérer la bibliothèque
        const docsSnapshot = await firestore.collection('documents')
            .where('user_id', '==', decoded.userId)
            .limit(10)
            .get();

        const libraryContext = docsSnapshot.docs.length > 0
            ? "BIBLIOTHÈQUE (SOURCES) :\n" + docsSnapshot.docs.map(doc => {
                const data = doc.data();
                return `- "${data.title}" : ${data.analysis_result?.substring(0, 800) || "Contenu non analysé"}`;
            }).join('\n')
            : "";

        const section = project.structure.find(s => s.id === sectionId);
        if (!section) return NextResponse.json({ error: 'Section introuvable' }, { status: 404 });

        // 1. Récupérer l'historique
        const history = await getSectionMessages(projectId, sectionId);

        if (history.length === 0) {
            return NextResponse.json({ error: 'Aucune discussion préalable pour générer un brouillon' }, { status: 400 });
        }

        // 2. Demander à l'IA de rédiger basé sur l'échange
        const rédactionPrompt = `Basé sur la discussion suivante, rédige un premier jet (draft) académique pour la section "${section.title}" du mémoire "${project.title}".
Respecte le ton académique, les idées de l'étudiant, et structure bien le texte.

RÈGLES DE RÉDACTION :
1. ADAPTATION TOTALE : Si la discussion indique que les informations réelles (ex: nom de l'entreprise) divergent du modèle initial, utilise UNIQUEMENT les informations de l'étudiant.
2. EFFACEMENT DES PLACEHOLDERS : Ne mentionne jamais les données du template (ex: RCG) si l'étudiant a fourni ses propres données (ex: Sarl-Boo).
4. CITATION : Utilise le contexte de la bibliothèque ci-dessous pour sourcer tes arguments. Cite les documents pertinents.

${libraryContext}

Discussion :
${history.map(m => `${m.role}: ${m.content}`).join('\n')}`;

        const context = "Tu es un rédacteur académique expert. Ta mission est de transformer une discussion informelle en un texte de mémoire structuré, cite les sources de la bibliothèque quand c'est pertinent.";

        const generatedDraft = await analyzeDocument(rédactionPrompt, context);

        // 3. Sauvegarder le draft
        await updateSectionDraft(projectId, sectionId, generatedDraft);

        return NextResponse.json({ draft: generatedDraft });
    } catch (error) {
        console.error('Error generating draft:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
