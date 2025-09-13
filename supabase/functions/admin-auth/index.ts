import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode, decode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LoginRequest {
  username: string;
  password: string;
}

interface VerifyTokenRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    switch (path) {
      case "login":
        return await handleLogin(req, supabase);
      case "verify":
        return await handleVerifyToken(req, supabase);
      case "logout":
        return await handleLogout(req, supabase);
      default:
        return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Admin auth error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

async function handleLogin(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { username, password }: LoginRequest = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Username and password required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get admin user
  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .eq("is_active", true)
    .single();

  if (adminError || !admin) {
    // Log failed login attempt
    await supabase
      .from("activity_logs")
      .insert({
        action: "failed_login_attempt",
        details: { username, ip: req.headers.get("x-forwarded-for") },
      });

    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify password using bcrypt-like comparison (simplified for demo)
  const passwordMatch = await verifyPassword(password, admin.password_hash);
  
  if (!passwordMatch) {
    await supabase
      .from("activity_logs")
      .insert({
        action: "failed_login_attempt",
        details: { username, ip: req.headers.get("x-forwarded-for") },
      });

    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Create session token
  const sessionData = {
    admin_id: admin.id,
    username: admin.username,
    role: admin.role,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };

  const token = encode(JSON.stringify(sessionData));

  // Update last login
  await supabase
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", admin.id);

  // Log successful login
  await supabase
    .from("activity_logs")
    .insert({
      action: "admin_login",
      admin_id: admin.id,
      details: { username, ip: req.headers.get("x-forwarded-for") },
    });

  return new Response(
    JSON.stringify({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        full_name: admin.full_name,
      },
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function handleVerifyToken(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { token }: VerifyTokenRequest = await req.json();

  if (!token) {
    return new Response(JSON.stringify({ error: "Token required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const sessionData = JSON.parse(new TextDecoder().decode(decode(token)));
    
    // Check if token is expired
    if (new Date(sessionData.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Token expired" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin still exists and is active
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, username, role, full_name")
      .eq("id", sessionData.admin_id)
      .eq("is_active", true)
      .single();

    if (error || !admin) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        valid: true,
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
          full_name: admin.full_name,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function handleLogout(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // In a real implementation, you might invalidate the token in a blacklist table
  // For now, we'll just log the logout action
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const sessionData = JSON.parse(new TextDecoder().decode(decode(token)));
      await supabase
        .from("activity_logs")
        .insert({
          action: "admin_logout",
          admin_id: sessionData.admin_id,
          details: { username: sessionData.username },
        });
    } catch (error) {
      console.error("Error logging logout:", error);
    }
  }

  return new Response(
    JSON.stringify({ success: true, message: "Logged out successfully" }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Simplified password verification (in production, use bcrypt)
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // This is a simplified implementation
  // In production, use proper bcrypt verification
  return password === hash; // For demo purposes
}

serve(handler);