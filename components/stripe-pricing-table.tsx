"use client"

import { useEffect } from "react"
import Script from "next/script"

export function StripePricingTable() {
  useEffect(() => {
    if (window.StripePricingTable) {
      const elements = document.querySelectorAll("stripe-pricing-table")
      elements.forEach((element) => {
        element.innerHTML = element.innerHTML
      })
    }
  }, [])

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
      <div className="w-full max-w-6xl mx-auto">
        <stripe-pricing-table
          pricing-table-id="prctbl_1RA7VmBqJiHgClybiFCg6oTI"
          publishable-key="pk_live_51R8xZaBqJiHgClybecxWOsCD9dAPIaNnvEj6vuEEEADt15b4ByouDBsUGpfwIPTugRUAwx0sonp44rWe5xgcljSg00EvCqraGW"
        ></stripe-pricing-table>
      </div>
    </>
  )
}
