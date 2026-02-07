import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/ai";
import { firestore } from "@/lib/firebase-admin";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const { message, documentId, history } = await req.json();

        if (!documentId) {
            return NextResponse.json({ error: "ID du document requis" }, { status: 400 });
        }

        // 1. Récupérer le contenu du document dans Firestore
        const docRef = firestore.collection("documents").doc(documentId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
        }

        const docData = docSnap.data();
        if (docData?.user_id !== userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        // 2. Extraire le texte (si stocké dans Firestore comme analysis_result ou un champ content)
        const documentContent = docData?.content || docData?.analysis_result || "";

        // 3. Appeler l'IA via Groq
        const aiResponse = await analyzeDocument(
            documentContent,
            `Réponds à la question suivante en te basant sur le texte du mémoire fourni :\n\nQuestion: ${message}`
        );

        // 4. (Optionnel) Sauvegarder l'interaction dans Firestore
        try {
            await firestore.collection("history").add({
                user_id: userId,
                action: "AI_CHAT",
                details: `Question sur le document: ${docData?.title}`,
                created_at: new Date(),
            });
        } catch (hError) {
            console.warn("Chat history log failed:", hError);
        }

        return NextResponse.json({
            response: aiResponse,
            suggestions: ["Peux-tu approfondir ?", "Donne-moi un exemple", "Comment reformuler ?"]
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
    }
}
