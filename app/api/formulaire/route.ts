import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      civilite,
      nom,
      prenom,
      email,
      telephone,
      typeDemande,
      message,
      disponibilites,
    } = body;

    // Validation minimale
    if (!nom || !prenom || !email || !telephone || !civilite || !typeDemande) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        civilite,
        nom,
        prenom,
        email,
        telephone,
        typeDemande,
        message: message ?? "",
        disponibilites: {
          create: (disponibilites ?? []).map(
            (d: { jour: string; heure: number; minute: number }) => ({
              jour: d.jour,
              heure: d.heure,
              minute: d.minute,
            })
          ),
        },
      },
      include: { disponibilites: true },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}