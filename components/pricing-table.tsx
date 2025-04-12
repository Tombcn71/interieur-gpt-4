"use client"

import { useEffect } from "react"
import Script from "next/script"
import { useSession } from "next-auth/react"

export function PricingTable() {
  const { data: session } = useSession()

  // This ensures the Stripe component is properly initialized after the script loads
  useEffect(() => {
    // If the script has already loaded, we need to manually initialize the component
    if (window.StripePricingTable && session?.user?.id) {
      const elements = document.querySelectorAll("stripe-pricing-table")
      elements.forEach((element) => {
        // Add the user ID as a custom field
        element.setAttribute("client-reference-id", session.user.id)
        // Force re-render of the component
        element.innerHTML = element.innerHTML
      })
    }
  }, [session])

  if (!session) {
    return <div className="text-center p-8">Please log in to view pricing options</div>
  }

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
      <div className="w-full max-w-6xl mx-auto">
        <stripe-pricing-table
          pricing-table-id="prctbl_1RA7VmBqJiHgClybiFCg6oTI"
          publishable-key="pk_live_51R8xZaBqJiHgClybecxWOsCD9dAPIaNnvEj6vuEEEADt15b4ByouDBsUGpfwIPTugRUAwx0sonp44rWe5xgcljSg00EvCqraGW"
          client-reference-id={session.user.id}
        ></stripe-pricing-table>
      </div>
    </>
  )
}
