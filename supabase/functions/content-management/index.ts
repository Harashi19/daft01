import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Extract admin info from token
  const authHeader = req.headers.get("authorization");
  let admin_id: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const sessionData = JSON.parse(new TextDecoder().decode(decode(token)));
      if (new Date(sessionData.expires_at) >= new Date()) {
        admin_id = sessionData.admin_id;
      }
    } catch (error) {
      console.error("Token verification error:", error);
    }
  }

  // Require authentication for non-GET requests
  if (req.method !== "GET" && !admin_id) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const entity = pathParts[pathParts.length - 2]; // services, news, faqs
  const action = pathParts[pathParts.length - 1]; // list, create, update, delete

  try {
    switch (entity) {
      case "services":
        return await handleServices(req, supabase, action, admin_id);
      case "news":
        return await handleNews(req, supabase, action, admin_id);
      case "faqs":
        return await handleFAQs(req, supabase, action, admin_id);
      default:
        return new Response(JSON.stringify({ error: "Invalid entity" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Content management error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

async function handleServices(req: Request, supabase: any, action: string, admin_id: string | null): Promise<Response> {
  switch (action) {
    case "list":
      const { data: services, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (servicesError) {
        return new Response(JSON.stringify({ error: "Failed to fetch services" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ services }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "create":
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const createData = await req.json();
      const { data: newService, error: createError } = await supabase
        .from("services")
        .insert({
          title: createData.title,
          description: createData.description,
          price: createData.price,
          image_url: createData.image_url,
          is_active: createData.is_active ?? true,
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: "Failed to create service" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Log activity
      await supabase
        .from("activity_logs")
        .insert({
          action: "service_created",
          admin_id,
          details: { service_id: newService.id, title: newService.title },
        });

      return new Response(JSON.stringify({ service: newService }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "update":
      if (req.method !== "PUT") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updateData = await req.json();
      const { id, ...updateFields } = updateData;

      const { data: updatedService, error: updateError } = await supabase
        .from("services")
        .update(updateFields)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        return new Response(JSON.stringify({ error: "Failed to update service" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("activity_logs")
        .insert({
          action: "service_updated",
          admin_id,
          details: { service_id: id, title: updatedService.title },
        });

      return new Response(JSON.stringify({ service: updatedService }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "delete":
      if (req.method !== "DELETE") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const url = new URL(req.url);
      const serviceId = url.searchParams.get("id");

      if (!serviceId) {
        return new Response(JSON.stringify({ error: "Service ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId);

      if (deleteError) {
        return new Response(JSON.stringify({ error: "Failed to delete service" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("activity_logs")
        .insert({
          action: "service_deleted",
          admin_id,
          details: { service_id: serviceId },
        });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    default:
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
  }
}

async function handleNews(req: Request, supabase: any, action: string, admin_id: string | null): Promise<Response> {
  switch (action) {
    case "list":
      const { data: news, error: newsError } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (newsError) {
        return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ news }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "create":
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const createData = await req.json();
      const { data: newPost, error: createError } = await supabase
        .from("news_posts")
        .insert({
          title: createData.title,
          content: createData.content,
          excerpt: createData.excerpt,
          image_url: createData.image_url,
          is_published: createData.is_published ?? true,
          published_at: createData.is_published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: "Failed to create news post" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("activity_logs")
        .insert({
          action: "news_post_created",
          admin_id,
          details: { post_id: newPost.id, title: newPost.title },
        });

      return new Response(JSON.stringify({ post: newPost }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    // Add update and delete cases similar to services...
    default:
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
  }
}

async function handleFAQs(req: Request, supabase: any, action: string, admin_id: string | null): Promise<Response> {
  switch (action) {
    case "list":
      const { data: faqs, error: faqsError } = await supabase
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true });

      if (faqsError) {
        return new Response(JSON.stringify({ error: "Failed to fetch FAQs" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ faqs }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "create":
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const createData = await req.json();
      const { data: newFAQ, error: createError } = await supabase
        .from("faqs")
        .insert({
          question: createData.question,
          answer: createData.answer,
          category: createData.category,
          sort_order: createData.sort_order ?? 0,
          is_active: createData.is_active ?? true,
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: "Failed to create FAQ" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("activity_logs")
        .insert({
          action: "faq_created",
          admin_id,
          details: { faq_id: newFAQ.id, question: newFAQ.question },
        });

      return new Response(JSON.stringify({ faq: newFAQ }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    // Add update and delete cases similar to services...
    default:
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
  }
}

serve(handler);