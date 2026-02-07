import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getProjectById, updateSectionDraft } from '@/lib/project-utils';

export async function POST(
    req: NextRequest,
    { params }: { params: { projectId: string, sectionId: string } }
) {
    try {
        const { projectId, sectionId } = await params;
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const { content } = await req.json();

        const project = await getProjectById(projectId);
        if (!project || project.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Projet introuvable ou non autorisé' }, { status: 404 });
        }

        await updateSectionDraft(projectId, sectionId, content);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating draft:', error);
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

        const { getSectionData } = await import('@/lib/project-utils');
        const data = await getSectionData(projectId, sectionId);

        return NextResponse.json(data || { content: "" });
    } catch (error) {
        console.error('Error fetching draft:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
