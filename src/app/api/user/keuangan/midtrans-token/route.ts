import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { order_id, gross_amount, item_name, customer_details } = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY is not set");

    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      item_details: [
        {
          id: order_id,
          price: gross_amount,
          quantity: 1,
          name: item_name,
        },
      ],
      customer_details: customer_details || {
        first_name: "Wali Santri",
        last_name: "Al-Imam",
        email: "demo@alimam.com",
        phone: "08123456789",
      },
    };

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Midtrans API Error:", data);
      return NextResponse.json({ success: false, message: data.error_messages?.join(", ") || "Gagal mendapatkan token" }, { status: response.status });
    }

    return NextResponse.json({ success: true, token: data.token, redirect_url: data.redirect_url });
  } catch (error: any) {
    console.error("Midtrans Token Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
