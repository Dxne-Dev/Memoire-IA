import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getProjectById, saveSectionMessage, getSectionMessages } from '@/lib/project-utils';
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
        const { message } = await req.json();

        if (!message) return NextResponse.json({ error: 'Message requis' }, { status: 400 });

        const project = await getProjectById(projectId);
        if (!project || project.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Projet introuvable ou non autorisé' }, { status: 404 });
        }

        // 1.5 Récupérer la bibliothèque de l'étudiant
        const docsSnapshot = await firestore.collection('documents')
            .where('user_id', '==', decoded.userId)
            .limit(10) // Limiter pour ne pas exploser le contexte
            .get();

        const libraryContext = docsSnapshot.docs.length > 0
            ? "RÉFÉRENCES DE LA BIBLIOTHÈQUE DE L'ÉTUDIANT :\n" + docsSnapshot.docs.map(doc => {
                const data = doc.data();
                return `- [ID:${doc.id}] "${data.title}" : ${data.analysis_result?.substring(0, 500) || "Contenu non analysé"}`;
            }).join('\n')
            : "La bibliothèque est vide.";

        const section = project.structure.find(s => s.id === sectionId);
        if (!section) return NextResponse.json({ error: 'Section introuvable' }, { status: 404 });

        // 1. Sauvegarder le message utilisateur
        await saveSectionMessage(projectId, sectionId, {
            role: 'user',
            content: message
        });

        // 2. Récupérer l'historique pour le contexte
        const history = await getSectionMessages(projectId, sectionId);

        // 3. Préparer le prompt pour l'IA (Mentor Mode de Type "Maçon")
        const context = `Tu es un Mentor IA spécialisé dans l'ACCOMPAGNEMENT PROACTIF. 
Ton rôle est de construire le mémoire de l'étudiant à partir d'un moule vide.

RÈGLES D'OR DE COMPORTEMENT (STRICTES) :
1. LE MODÈLE EST UN FANTÔME (GHOST) : Tout ce qui vient du template (ex: "${section.title}" ou "Cabinet RCG") n'est qu'un EXEMPLE MORT. Il n'a aucune valeur de vérité.
2. PRIORITÉ ABSOLUE À L'UTILISATEUR : Si l'étudiant te donne une information (ex: "Sarl-Boo"), elle remplace IMMÉDIATEMENT et SILENCIEUSEMENT toute donnée contradictoire du modèle.
3. INTERDICTION DE QUESTIONNER LA COHÉRENCE : Ne demande JAMAIS de justifier le lien entre le modèle et la réalité de l'étudiant. Ne dis jamais "Cela soulève des questions sur la pertinence".
4. POSTURE DE MAÇON : Tu es là pour poser des briques. SI l'utilisateur donne une info, dis "C'est noté, on adapte pour [Son Info]" et pose tout de suite la question suivante pour personnaliser davantage la section.
5. CONCISION & FLUIDITÉ : Ne fais pas de longs rappels historiques. Salue l'utilisateur brièvement et sois proactif dans la suite de l'entretien.
6. ÉTAPE PAR ÉTAPE : Pose 1 SEULE QUESTION à la fois pour ne pas submerger l'utilisateur.

Section actuelle : "${section.title}"
Projet : "${project.title}"
Bibliothèque de sources : ${libraryContext}`;

        const aiPrompt = `Historique de la discussion pour cette section :\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nÉtudiant: ${message}`;

        // Utilisation de analyzeDocument comme driver IA
        const aiResponse = await analyzeDocument(aiPrompt, context);

        // 4. Sauvegarder la réponse de l'IA
        const savedAiMessage = await saveSectionMessage(projectId, sectionId, {
            role: 'assistant',
            content: aiResponse
        });

        return NextResponse.json(savedAiMessage);
    } catch (error) {
        console.error('Error in section chat:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function GET(
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
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const messages = await getSectionMessages(projectId, sectionId);
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching section messages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
