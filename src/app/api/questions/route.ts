import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { turnstileToken, ...questionData } = body;

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Falta el token de validación de seguridad." },
        { status: 400 }
      );
    }

    // 1. Validar el token con los servidores de Cloudflare
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
    });

    const verifyJson = await verifyRes.json();

    if (!verifyJson.success) {
      return NextResponse.json(
        { error: "Validación anti-spam fallida. Cloudflare rechazó la petición." },
        { status: 403 }
      );
    }

    // 2. Si es un humano válido, guardamos la pregunta en Supabase
    const { error: dbError } = await supabase.from("questions").insert([questionData]);

    if (dbError) {
      throw new Error(dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}