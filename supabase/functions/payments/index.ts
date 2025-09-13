import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number;
  currency: string;
  payment_method: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  description?: string;
  service_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.pathname.split('/').pop();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    switch (action) {
      case "process":
        return await processPayment(req, supabase);
      case "verify":
        return await verifyPayment(req, supabase);
      case "history":
        return await getPaymentHistory(req, supabase);
      case "export":
        return await exportPayments(req, supabase);
      default:
        return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

async function processPayment(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const {
    amount,
    currency,
    payment_method,
    customer_email,
    customer_name,
    customer_phone,
    description,
    service_id,
  }: PaymentRequest = await req.json();

  // Input validation
  if (!amount || !currency || !payment_method || !customer_email || !customer_name) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (amount <= 0) {
    return new Response(JSON.stringify({ error: "Amount must be greater than 0" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Generate payment reference
  const paymentReference = `GP${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Store payment record
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      reference_number: paymentReference,
      amount: amount,
      currency: currency,
      payment_method: payment_method,
      customer_email: customer_email,
      customer_name: customer_name,
      customer_phone: customer_phone || null,
      description: description || null,
      service_id: service_id || null,
      status: "pending",
    })
    .select()
    .single();

  if (paymentError) {
    console.error("Database error:", paymentError);
    return new Response(JSON.stringify({ error: "Failed to initialize payment" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Process payment based on method
  let paymentResult;
  switch (payment_method.toLowerCase()) {
    case "stripe":
      paymentResult = await processStripePayment(payment, amount, currency);
      break;
    case "paypal":
      paymentResult = await processPayPalPayment(payment, amount, currency);
      break;
    case "paynow":
      paymentResult = await processPaynowPayment(payment, amount, currency);
      break;
    case "ecocash":
      paymentResult = await processEcocashPayment(payment, amount, currency, customer_phone);
      break;
    default:
      return new Response(JSON.stringify({ error: "Unsupported payment method" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
  }

  // Update payment status
  await supabase
    .from("payments")
    .update({
      status: paymentResult.success ? "completed" : "failed",
      transaction_id: paymentResult.transaction_id,
      gateway_response: paymentResult.response,
      processed_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  // Log activity
  await supabase
    .from("activity_logs")
    .insert({
      action: "payment_processed",
      details: {
        payment_id: payment.id,
        reference: paymentReference,
        amount: amount,
        status: paymentResult.success ? "completed" : "failed",
      },
    });

  return new Response(
    JSON.stringify({
      success: paymentResult.success,
      payment_id: payment.id,
      reference: paymentReference,
      transaction_id: paymentResult.transaction_id,
      message: paymentResult.message,
    }),
    {
      status: paymentResult.success ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function verifyPayment(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return new Response(JSON.stringify({ error: "Payment reference required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: payment, error } = await supabase
    .from("payments")
    .select("*")
    .eq("reference_number", reference)
    .single();

  if (error || !payment) {
    return new Response(JSON.stringify({ error: "Payment not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ payment }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getPaymentHistory(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const status = url.searchParams.get("status");

  let query = supabase
    .from("payments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: payments, error, count } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch payment history" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      payments,
      total: count,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function exportPayments(req: Request, supabase: any): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");
  const format = url.searchParams.get("format") || "csv";

  let query = supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (startDate) {
    query = query.gte("created_at", startDate);
  }
  if (endDate) {
    query = query.lte("created_at", endDate);
  }

  const { data: payments, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch payments for export" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (format === "csv") {
    const csv = generateCSV(payments);
    return new Response(csv, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="payments.csv"',
      },
    });
  }

  return new Response(JSON.stringify({ payments }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Mock payment processors (replace with actual implementations)
async function processStripePayment(payment: any, amount: number, currency: string) {
  // Mock implementation - replace with actual Stripe integration
  return {
    success: true,
    transaction_id: `stripe_${Date.now()}`,
    message: "Payment processed successfully",
    response: { mock: true },
  };
}

async function processPayPalPayment(payment: any, amount: number, currency: string) {
  // Mock implementation - replace with actual PayPal integration
  return {
    success: true,
    transaction_id: `paypal_${Date.now()}`,
    message: "Payment processed successfully",
    response: { mock: true },
  };
}

async function processPaynowPayment(payment: any, amount: number, currency: string) {
  // Mock implementation - replace with actual Paynow integration
  return {
    success: true,
    transaction_id: `paynow_${Date.now()}`,
    message: "Payment processed successfully",
    response: { mock: true },
  };
}

async function processEcocashPayment(payment: any, amount: number, currency: string, phone?: string) {
  // Mock implementation - replace with actual EcoCash integration
  return {
    success: true,
    transaction_id: `ecocash_${Date.now()}`,
    message: "Payment processed successfully",
    response: { mock: true },
  };
}

function generateCSV(payments: any[]): string {
  const headers = [
    "Reference",
    "Amount",
    "Currency",
    "Payment Method",
    "Customer Name",
    "Customer Email",
    "Status",
    "Created At",
    "Processed At",
  ];

  const rows = payments.map(payment => [
    payment.reference_number,
    payment.amount,
    payment.currency,
    payment.payment_method,
    payment.customer_name,
    payment.customer_email,
    payment.status,
    payment.created_at,
    payment.processed_at || "",
  ]);

  return [headers, ...rows].map(row => row.join(",")).join("\n");
}

serve(handler);