import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createProject, getProjectsByUser } from '@/lib/project-utils';
import { SectionMetadata } from '@/lib/types/project';
import { analyzeDocument } from '@/lib/ai';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        if (!decoded.userId) return NextResponse.json({ error: 'Token invalide' }, { status: 401 });

        const projects = await getProjectsByUser(decoded.userId);
        return NextResponse.json(projects);
    } catch (error: any) {
        console.error('Projects GET Error:', error);
        return NextResponse.json({
            error: 'Erreur lors de la récupération des projets',
            message: error.message
        }, { status: 500 });
    }
}

const pdf = require("pdf-parse");
const mammoth = require("mammoth");

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const fieldOfStudy = formData.get("fieldOfStudy") as string;
        const file = formData.get("file") as File | null;

        if (!title) return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 });

        let structure: SectionMetadata[] = [
            { id: 'intro', title: 'Introduction', order: 1, status: 'pending' },
            { id: 'revue', title: 'Revue de littérature', order: 2, status: 'pending' },
            { id: 'methode', title: 'Méthodologie', order: 3, status: 'pending' },
            { id: 'resultats', title: 'Résultats', order: 4, status: 'pending' },
            { id: 'discussion', title: 'Discussion', order: 5, status: 'pending' },
            { id: 'conclusion', title: 'Conclusion', order: 6, status: 'pending' },
        ];

        if (file) {
            // Analyse du template pour extraire la structure
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            let text = "";

            if (file.type === "application/pdf") {
                const data = await pdf(buffer);
                text = data.text;
            } else if (file.name.endsWith(".docx")) {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            }

            if (text) {
                const analysisPrompt = `Analyse ce mémoire et extrait son plan (chapitres principaux). 
Réponds uniquement avec un tableau JSON de ce format : [{"id": "identifiant_unique", "title": "Titre du chapitre"}].
Texte du mémoire :\n${text.substring(0, 15000)}`; // Limite pour le contexte

                const aiResponse = await analyzeDocument(analysisPrompt, "Tu es un extracteur de structure académique. Réponds uniquement en JSON.");

                try {
                    // Nettoyage de la réponse IA pour extraire le JSON
                    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        const extracted = JSON.parse(jsonMatch[0]);
                        structure = extracted.map((s: any, index: number) => ({
                            id: s.id || `section_${index}`,
                            title: s.title,
                            order: index + 1,
                            status: 'pending'
                        }));
                    }
                } catch (e) {
                    console.error("Failed to parse AI structure", e);
                }
            }
        }

        const project = await createProject(decoded.userId, title, structure);

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
