import { z } from "zod";

function cleanEnvValue(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  return value.trim().replace(/^["']|["']$/g, "");
}

function normalizeUrlValue(value: unknown): unknown {
  const cleaned = cleanEnvValue(value);
  if (typeof cleaned !== "string" || !cleaned) {
    return cleaned;
  }
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }
  return `https://${cleaned}`;
}

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(normalizeUrlValue, z.string().url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(cleanEnvValue, z.string().min(1)),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(cleanEnvValue, z.string().min(1).optional()),
  ADMIN_REVALIDATE_TOKEN: z.preprocess(cleanEnvValue, z.string().min(1).optional()),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid environment variables: ${issues}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getAdminRevalidateToken(): string {
  const token = getEnv().ADMIN_REVALIDATE_TOKEN;
  if (!token) {
    throw new Error("Missing ADMIN_REVALIDATE_TOKEN.");
  }
  return token;
}

export function getServiceRoleKey(): string {
  const key = getEnv().SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }
  return key;
}
