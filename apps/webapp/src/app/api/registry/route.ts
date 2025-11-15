import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const starting_after = searchParams.get("starting_after") || undefined;

    // Fetch balance transactions with expanded source data
    const balanceTransactions = await stripe.balanceTransactions.list({
      limit: Math.min(limit, 100), // Stripe max is 100 per request
      ...(starting_after && { starting_after }),
      expand: ["data.source", "data.source.charge", "data.source.customer"],
    });

    // Fetch current balance
    const balance = await stripe.balance.retrieve();

    // Fetch all payment links and their products (avoiding deep expansion)
    const paymentLinkProducts: string[] = [];
    try {
      const paymentLinksResponse = await stripe.paymentLinks.list({
        limit: 100,
      });

      // Get products from the first active payment link
      for (const link of paymentLinksResponse.data) {
        if (link.active && paymentLinkProducts.length === 0) {
          try {
            // List line items for this payment link (separate API call)
            const lineItems = await stripe.paymentLinks.listLineItems(link.id, {
              limit: 10,
            });

            if (lineItems.data && lineItems.data.length > 0) {
              for (const item of lineItems.data) {
                // Get the price ID
                const priceId =
                  typeof item.price === "string" ? item.price : item.price?.id;

                if (priceId) {
                  try {
                    // Retrieve the price with product expanded (only 1 level deep)
                    const price = await stripe.prices.retrieve(priceId, {
                      expand: ["product"],
                    });

                    const product = price.product;
                    if (
                      product &&
                      typeof product === "object" &&
                      !product.deleted
                    ) {
                      const qty = item.quantity || 1;
                      if (qty > 1) {
                        paymentLinkProducts.push(`${product.name} (x${qty})`);
                      } else {
                        paymentLinkProducts.push(product.name);
                      }
                    }
                  } catch (e) {
                    console.error(`Error fetching price ${priceId}:`, e);
                  }
                }
              }

              if (paymentLinkProducts.length > 0) {
                break; // Stop after first active link with products
              }
            }
          } catch (e) {
            console.error(`Error processing payment link ${link.id}:`, e);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching payment links:", e);
    }

    // Process transactions and fetch additional details
    const transactionsWithDetails = await Promise.all(
      balanceTransactions.data.map(
        async (transaction: Stripe.BalanceTransaction) => {
          let customerEmail: string | null = null;
          let customerName: string | null = null;
          const productNames: string[] = [];
          let chargeId: string | null = null;

          // Extract charge information
          const source = transaction.source;
          if (source && typeof source === "object") {
            // Handle Charge objects
            if ("object" in source && source.object === "charge") {
              chargeId = source.id;
              const charge = source as Stripe.Charge;

              // Get customer email from charge
              if (charge.billing_details?.email) {
                customerEmail = charge.billing_details.email;
              }
              if (charge.billing_details?.name) {
                customerName = charge.billing_details.name;
              }

              // If customer exists on charge, fetch customer details
              if (charge.customer) {
                try {
                  const customerId =
                    typeof charge.customer === "string"
                      ? charge.customer
                      : charge.customer.id;
                  const customer = await stripe.customers.retrieve(customerId);
                  if (customer && !customer.deleted) {
                    customerEmail = customerEmail || customer.email || null;
                    customerName = customerName || customer.name || null;
                  }
                } catch (e) {
                  console.error("Error fetching customer:", e);
                }
              }

              // Try to get product from payment intent
              if (charge.payment_intent) {
                try {
                  const piId =
                    typeof charge.payment_intent === "string"
                      ? charge.payment_intent
                      : charge.payment_intent.id;

                  // Try to find checkout session (without deep expansion to avoid errors)
                  try {
                    const checkoutSessions =
                      await stripe.checkout.sessions.list({
                        payment_intent: piId,
                        limit: 1,
                      });

                    if (checkoutSessions.data.length > 0) {
                      const session = checkoutSessions.data[0];

                      // List line items separately to avoid expansion depth issues
                      try {
                        const lineItems =
                          await stripe.checkout.sessions.listLineItems(
                            session.id,
                            { limit: 10 }
                          );

                        for (const item of lineItems.data) {
                          const priceId =
                            typeof item.price === "string"
                              ? item.price
                              : item.price?.id;

                          if (priceId) {
                            try {
                              const price = await stripe.prices.retrieve(
                                priceId,
                                {
                                  expand: ["product"],
                                }
                              );

                              const product = price.product;
                              if (
                                product &&
                                typeof product === "object" &&
                                !product.deleted
                              ) {
                                const qty = item.quantity || 1;
                                if (qty > 1) {
                                  productNames.push(
                                    `${product.name} (x${qty})`
                                  );
                                } else {
                                  productNames.push(product.name);
                                }
                              }
                            } catch (e) {
                              console.error(
                                `Error fetching price ${priceId}:`,
                                e
                              );
                            }
                          }

                          // Fallback to description
                          if (productNames.length === 0 && item.description) {
                            productNames.push(item.description);
                          }
                        }
                      } catch (e) {
                        console.error(
                          "Error listing checkout session line items:",
                          e
                        );
                      }
                    }
                  } catch (e) {
                    console.error("Error fetching checkout session:", e);
                  }

                  // If no products found, try payment intent metadata and latest charge
                  if (productNames.length === 0) {
                    try {
                      const pi = await stripe.paymentIntents.retrieve(piId, {
                        expand: ["latest_charge"],
                      });

                      if (pi.metadata?.product_name) {
                        productNames.push(pi.metadata.product_name);
                      }
                      if (pi.description) {
                        productNames.push(pi.description);
                      }

                      // Check if this is from a payment link
                      if (pi.metadata?.payment_link) {
                        try {
                          const paymentLink =
                            await stripe.paymentLinks.retrieve(
                              pi.metadata.payment_link,
                              {
                                expand: ["line_items.data.price.product"],
                              }
                            );

                          if (paymentLink.line_items?.data) {
                            for (const item of paymentLink.line_items.data) {
                              if (
                                item.price &&
                                typeof item.price === "object"
                              ) {
                                const product = item.price.product;
                                if (
                                  product &&
                                  typeof product === "object" &&
                                  !product.deleted
                                ) {
                                  productNames.push(product.name);
                                }
                              }
                            }
                          }
                        } catch (e) {
                          console.error("Error fetching payment link:", e);
                        }
                      }
                    } catch (e) {
                      console.error("Error fetching payment intent:", e);
                    }
                  }
                } catch (e) {
                  console.error("Error processing payment intent:", e);
                }
              }

              // Fallback to charge description or metadata
              if (productNames.length === 0) {
                // Try to get products from charge metadata first
                if (charge.metadata?.product_name) {
                  productNames.push(charge.metadata.product_name);
                }

                // If still no products, use charge description
                if (productNames.length === 0 && charge.description) {
                  productNames.push(charge.description);
                }

                // Last resort: Use products from payment links
                if (
                  productNames.length === 0 &&
                  paymentLinkProducts.length > 0
                ) {
                  productNames.push(...paymentLinkProducts);
                }

                // If STILL no products, just show the amount as a generic label
                if (productNames.length === 0) {
                  productNames.push(
                    `$${(transaction.amount / 100).toFixed(2)} charge`
                  );
                }
              }
            }

            // Handle Payment Intent string references
            // Note: source.object is the source type (e.g., "charge"), not payment_intent
            // Payment intents are referenced through charges
          }

          return {
            id: transaction.id,
            amount: transaction.amount,
            available_on: transaction.available_on,
            created: transaction.created,
            currency: transaction.currency,
            description: transaction.description,
            fee: transaction.fee,
            fee_details: transaction.fee_details,
            net: transaction.net,
            status: transaction.status,
            type: transaction.type,
            source: transaction.source,
            reporting_category: transaction.reporting_category,
            // Additional details
            customer_email: customerEmail,
            customer_name: customerName,
            product_names: productNames.length > 0 ? productNames : null,
            charge_id: chargeId,
          };
        }
      )
    );

    // Format the response
    return NextResponse.json({
      balance: {
        available: balance.available.map((bal: Stripe.Balance.Available) => ({
          amount: bal.amount,
          currency: bal.currency,
          source_types: bal.source_types,
        })),
        pending: balance.pending.map((bal: Stripe.Balance.Pending) => ({
          amount: bal.amount,
          currency: bal.currency,
          source_types: bal.source_types,
        })),
        connect_reserved: balance.connect_reserved?.map(
          (bal: Stripe.Balance.ConnectReserved) => ({
            amount: bal.amount,
            currency: bal.currency,
            source_types: bal.source_types,
          })
        ),
      },
      transactions: {
        data: transactionsWithDetails,
        has_more: balanceTransactions.has_more,
        ...(balanceTransactions.has_more && {
          next_starting_after:
            balanceTransactions.data[balanceTransactions.data.length - 1]?.id,
        }),
      },
    });
  } catch (error: unknown) {
    console.error("Stripe API error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: error.message,
          type: error.type,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "An error occurred while fetching Stripe data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
