import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const TO_EMAIL = process.env.CONTACT_TO_EMAIL

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  if (!process.env.RESEND_API_KEY || !TO_EMAIL) {
    res.status(500).json({ error: "Email service is not configured." })
    return
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {}
    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim()
    const message = String(body.message ?? "").trim()

    if (!name || !email || !message) {
      res.status(400).json({ error: "All fields are required." })
      return
    }

    const { error } = await resend.emails.send({
      // Resend's shared test sender works without domain verification.
      // Swap for an address on your own verified domain to send from your brand.
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      res.status(502).json({ error: "Could not send your message." })
      return
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error("[v0] Contact handler error:", err)
    res.status(500).json({ error: "Something went wrong." })
  }
}
