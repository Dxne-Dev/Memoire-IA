import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json([], { status: 200 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const docs = await prisma.documents.findMany({ where: { user_id: decoded.userId }, orderBy: { upload_date: 'desc' } })
    return NextResponse.json(docs)
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}
