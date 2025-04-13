import type React from "react";
// Extend the Window interface to include StripePricingTable
interface Window {
  StripePricingTable?: any;
}

// Declare the custom element for JSX
declare namespace JSX {
  interface IntrinsicElements {
    "stripe-pricing-table": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        "pricing-table-id": string;
        "publishable-key": string;
        "client-reference-id"?: string;
      },
      HTMLElement
    >;
  }
}
