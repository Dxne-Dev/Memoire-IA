import { firestore } from './firebase-admin';

// Interfaces matching the data model
export interface User {
    id: string; // Firestore ID is string
    email: string;
    password_hash: string;
    name?: string;
    created_at: Date | string;
    is_admin: boolean;
    theme_preference?: string;
}

export interface Document {
    id: string;
    user_id: string;
    title: string;
    filename: string;
    mimetype?: string;
    size?: number;
    upload_date: Date | string;
    status: 'uploaded' | 'analyzed' | 'error';
    analysis_result?: string;
}

export interface History {
    id: string;
    user_id: string;
    action: string;
    details?: string;
    created_at: Date | string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await firestore.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date if necessary
        created_at: (data.created_at as any)?.toDate ? (data.created_at as any).toDate() : data.created_at,
    } as User;
}

export async function getUserById(id: string): Promise<User | null> {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
        id: doc.id,
        ...data,
        created_at: (data.created_at as any)?.toDate ? (data.created_at as any).toDate() : data.created_at,
    } as User;
}
