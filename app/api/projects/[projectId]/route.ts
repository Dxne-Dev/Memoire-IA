import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getProjectById } from '@/lib/project-utils';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const { projectId } = await params;
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const project = await getProjectById(projectId);

        if (!project) {
            return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
        }

        if (project.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
