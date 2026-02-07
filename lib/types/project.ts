export interface Project {
    id: string;
    userId: string;
    title: string;
    fieldOfStudy?: string;
    templateDocId?: string; // ID du document 'template' uploadé si existant
    createdAt: Date;
    updatedAt: Date;
    structure: SectionMetadata[]; // L'ordre et la hiérarchie des sections
}

export interface SectionMetadata {
    id: string;
    title: string;
    order: number;
    status: 'pending' | 'in_progress' | 'completed';
}

export interface SectionData {
    id: string; // Même ID que dans metadata
    projectId: string;
    content: string; // Le brouillon rédigé de cette section
    lastSummary?: string; // Résumé par l'IA des échanges précédents pour le contexte
    updatedAt: Date;
}

export interface SectionMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
