import { firestore } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function logAction(user_id: string, action: string, details?: string) {
  try {
    return firestore.collection('history').add({
      user_id,
      action,
      details: details || null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error('Failed to log action:', e);
    return null;
  }
}
