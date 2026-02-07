import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";
import { analyzeDocument } from "@/lib/ai";

// Use require because pdf-parse and mammoth are legacy-style libraries
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value
        if (!token) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
        }

        // 1. Lire le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let content = "";
        if (file.type === "application/pdf") {
            const data = await pdf(buffer);
            content = data.text;
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
            try {
                const result = await mammoth.extractRawText({ buffer });
                content = result.value;
            } catch (docxError) {
                console.error("DOCX Parsing Error:", docxError);
                content = "Erreur lors de l'extraction du texte du fichier DOCX.";
            }
        } else {
            content = "Format de fichier non supporté pour l'extraction de texte (PDF et DOCX uniquement).";
        }

        // 2. Créer l'entrée dans Firestore
        const docRef = firestore.collection("documents").doc();
        const docId = docRef.id;

        // 3. Lancer une première analyse IA
        let analysisResult = "Analyse en cours...";
        try {
            analysisResult = await analyzeDocument(content.substring(0, 10000)); // Limiter la taille pour l'analyse initiale
        } catch (aiError) {
            console.error("AI Analysis Error during upload:", aiError);
            analysisResult = "Le document a été uploadé, mais l'analyse initiale a échoué. Vous pouvez réessayer via le chat.";
        }

        await docRef.set({
            id: docId,
            user_id: userId,
            title: title || file.name,
            filename: file.name,
            mimetype: file.type,
            size: file.size,
            description: description || "",
            content: content, // Stocker le texte extrait pour le chat
            analysis_result: analysisResult,
            status: "analyzed",
            upload_date: new Date(),
        });

        // 4. Logger l'action (Ignorer si l'index history est manquant)
        try {
            await firestore.collection("history").add({
                user_id: userId,
                action: "UPLOAD_DOCUMENT",
                details: `Upload de ${file.name}`,
                created_at: new Date(),
            });
        } catch (hError) {
            console.warn("History log failed (maybe index missing):", hError);
        }

        return NextResponse.json({
            success: true,
            docId: docId,
            message: "Document uploadé et analysé avec succès"
        });

    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: error.message || "Erreur lors de l'upload" }, { status: 500 });
    }
}
