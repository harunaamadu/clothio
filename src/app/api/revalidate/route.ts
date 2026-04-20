import { revalidateTag } from "next/cache"
import { NextResponse }  from "next/server"
import { headers }       from "next/headers"
import { createHmac }    from "crypto"

// ─── Sanity webhook handler ───────────────────────────────────────────────────
//
// Sanity Studio calls this endpoint whenever a document is published, updated,
// or deleted. It verifies the HMAC signature, then invalidates the Next.js
// "sanity" cache tag so the next request re-fetches fresh data.
//
// Setup in Sanity:
//   manage.sanity.io → project → API → Webhooks → Add webhook
//   URL:     https://<your-domain>/api/revalidate
//   Dataset: production
//   Trigger: Create / Update / Delete
//   Secret:  <any strong string> → save to SANITY_WEBHOOK_SECRET in .env.local
//   HTTP method: POST
//   HMAC signature header: sanity-webhook-signature

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? ""

// Verify Sanity's HMAC-SHA256 signature
async function isValidSignature(body: string, signature: string): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.warn("[revalidate] SANITY_WEBHOOK_SECRET not set — skipping signature check")
    return true // allow in dev if secret not configured
  }

  try {
    const expected = createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex")

    // Sanity sends "sha256=<hex>"
    const provided = signature.replace(/^sha256=/, "")
    return expected === provided
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const body      = await req.text()
    const headerMap = await headers()
    const signature = headerMap.get("sanity-webhook-signature") ?? ""

    // Reject requests with invalid signatures
    if (!(await isValidSignature(body, signature))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body) as {
      _type?: string
      _id?:   string
      operation?: "create" | "update" | "delete"
    }

    // Always revalidate the global sanity tag — every fetch in queries.ts
    // uses { next: { tags: ["sanity"] } } so this one call clears everything.
    revalidateTag("sanity")

    console.log(
      `[revalidate] Revalidated after ${payload.operation ?? "change"} on`,
      payload._type, payload._id
    )

    return NextResponse.json({
      revalidated: true,
      type:        payload._type,
      id:          payload._id,
      operation:   payload.operation,
      timestamp:   new Date().toISOString(),
    })
  } catch (err) {
    console.error("[revalidate] Error:", err)
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 })
  }
}

// Sanity sometimes sends a GET ping to verify the endpoint is live
export async function GET() {
  return NextResponse.json({ ok: true, message: "Sanity revalidation webhook is ready." })
}