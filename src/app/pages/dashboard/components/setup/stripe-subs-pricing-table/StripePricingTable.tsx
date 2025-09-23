import React, {FC, useEffect, useRef} from 'react'

interface StripePricingTableProps {
  pricingTableId: string | undefined
  publishableKey: string | undefined
  onSubscriptionSelected?: (priceId: string) => void
}

const StripePricingTable: FC<StripePricingTableProps> = ({
  pricingTableId,
  publishableKey,
  onSubscriptionSelected,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Stripe Pricing Table script
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/pricing-table.js'
    script.async = true
    document.body.appendChild(script)

    // Clean up function
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (tableContainerRef.current) {
      // Clear any existing pricing table
      tableContainerRef.current.innerHTML = ''

      // Create the stripe-pricing-table element
      const stripePricingTable = document.createElement('stripe-pricing-table')
      if (pricingTableId) {
        stripePricingTable.setAttribute('pricing-table-id', pricingTableId)
      }
      if (publishableKey) {
        stripePricingTable.setAttribute('publishable-key', publishableKey)
      }

      // Add horizontal layout attribute
      stripePricingTable.setAttribute('pricing-table-layout', 'horizontal')

      // Add event listener for price selection if callback provided
      if (onSubscriptionSelected) {
        stripePricingTable.addEventListener('priceSelect', (event: any) => {
          onSubscriptionSelected(event.detail?.price?.id)
        })
      }

      // Append to container
      tableContainerRef.current.appendChild(stripePricingTable)

      // Add custom CSS to ensure horizontal layout
      const style = document.createElement('style')
      style.textContent = `
        .PricingTable-grid {
          display: grid;
          grid-template-columns: repeat(1fr 1fr 1fr); 
          gap: 20px;
         }
        /* Responsive adjustments */
        @media (max-width: 992px) {
          stripe-pricing-table .StripeElement {
            flex-wrap: wrap !important;
          }
        }
      `
      document.head.appendChild(style)
    }
  }, [pricingTableId, publishableKey, onSubscriptionSelected])

  return (
    <div className='card shadow-sm my-7'>
      <div className='card-header'>
        <h3 className='card-title fw-bold'>Subscription Plans</h3>
      </div>
      <div className='card-body'>
        <div
          ref={tableContainerRef}
          className='stripe-pricing-table-container'
          style={{
            width: '100%',
            overflowX: 'auto',
          }}
        />
      </div>
    </div>
  )
}

export default StripePricingTable
