import { firestore } from './firebase-admin';
import { Project, SectionMetadata, SectionMessage } from './types/project';

/**
 * Crée un nouveau projet de mémoire dans Firestore.
 */
export async function createProject(userId: string, title: string, initialStructure: SectionMetadata[] = []) {
    const projectRef = firestore.collection('projects').doc();
    const now = new Date();

    const project: Project = {
        id: projectRef.id,
        userId: userId,
        title: title,
        createdAt: now,
        updatedAt: now,
        structure: initialStructure
    };

    await projectRef.set(project);
    return project;
}

/**
 * Récupère un projet par son ID.
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
    const doc = await firestore.collection('projects').doc(projectId).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
        ...data,
        id: doc.id,
        createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate() : data.createdAt,
        updatedAt: (data.updatedAt as any)?.toDate ? (data.updatedAt as any).toDate() : data.updatedAt,
    } as Project;
}

/**
 * Récupère tous les projets d'un utilisateur.
 */
export async function getProjectsByUser(userId: string): Promise<Project[]> {
    try {
        let snapshots;
        try {
            snapshots = await firestore.collection('projects')
                .where('userId', '==', userId)
                .orderBy('updatedAt', 'desc')
                .get();
        } catch (indexError: any) {
            if (indexError.message?.includes('index')) {
                console.warn('Projects index missing, falling back to memory sort.');
                snapshots = await firestore.collection('projects')
                    .where('userId', '==', userId)
                    .get();
            } else {
                throw indexError;
            }
        }

        const projects = snapshots.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate() : data.createdAt,
                updatedAt: (data.updatedAt as any)?.toDate ? (data.updatedAt as any).toDate() : data.updatedAt,
            } as Project;
        });

        // Tri mémoire au cas où
        projects.sort((a, b) => {
            const timeA = new Date(a.updatedAt).getTime();
            const timeB = new Date(b.updatedAt).getTime();
            return timeB - timeA;
        });

        return projects;
    } catch (error) {
        console.error('Error in getProjectsByUser:', error);
        throw error;
    }
}

/**
 * Sauvegarde un message dans la conversation d'une section spécifique.
 */
export async function saveSectionMessage(projectId: string, sectionId: string, message: Omit<SectionMessage, 'id' | 'timestamp'>) {
    const conversationRef = firestore
        .collection('projects')
        .doc(projectId)
        .collection('sections')
        .doc(sectionId)
        .collection('messages');

    const newMessage = {
        ...message,
        timestamp: new Date()
    };

    const docRef = await conversationRef.add(newMessage);

    // Mettre à jour la date du projet
    await firestore.collection('projects').doc(projectId).update({
        updatedAt: new Date()
    });

    return { id: docRef.id, ...newMessage };
}

/**
 * Récupère l'historique des messages d'une section.
 */
export async function getSectionMessages(projectId: string, sectionId: string): Promise<SectionMessage[]> {
    try {
        let snapshots;
        try {
            snapshots = await firestore
                .collection('projects')
                .doc(projectId)
                .collection('sections')
                .doc(sectionId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .get();
        } catch (indexError: any) {
            if (indexError.message?.includes('index')) {
                console.warn('Section messages index missing, falling back to memory sort.');
                snapshots = await firestore
                    .collection('projects')
                    .doc(projectId)
                    .collection('sections')
                    .doc(sectionId)
                    .collection('messages')
                    .get();
            } else {
                throw indexError;
            }
        }

        const messages = snapshots.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: (data.timestamp as any)?.toDate ? (data.timestamp as any).toDate() : data.timestamp,
            } as SectionMessage;
        });

        // Tri mémoire
        messages.sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeA - timeB;
        });

        return messages;
    } catch (error) {
        console.error('Error in getSectionMessages:', error);
        throw error;
    }
}

/**
 * Met à jour le brouillon (draft) d'une section.
 */
export async function updateSectionDraft(projectId: string, sectionId: string, content: string) {
    const sectionRef = firestore
        .collection('projects')
        .doc(projectId)
        .collection('sections')
        .doc(sectionId);

    await sectionRef.set({
        content,
        updatedAt: new Date()
    }, { merge: true });
}

/**
 * Récupère les données d'une section (content, etc.)
 */
export async function getSectionData(projectId: string, sectionId: string) {
    const doc = await firestore
        .collection('projects')
        .doc(projectId)
        .collection('sections')
        .doc(sectionId)
        .get();

    if (!doc.exists) return null;
    return doc.data();
}
