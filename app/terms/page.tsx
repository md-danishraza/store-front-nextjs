import SectionTitle from '@/components/global/SectionTitle'
import React from 'react'

function page() {
  return (
    <div>
      <SectionTitle text='terms and conditions'/>
      <p className='text-lg tracking-wide leading-8  text-muted-foreground font-secondary '>
      Welcome to StoreFront. By accessing or using our website and services, you agree to abide by the following terms and conditions. All purchases made through our platform are subject to product availability and acceptance of your order. We strive to display accurate product information, including pricing and images, but inadvertent errors may occur. In such instances, we reserve the right to correct errors and update information. Customers are responsible for ensuring that their account details are kept confidential. Unauthorized use or breach of our website and systems may result in the suspension or termination of your account. By using our platform, you agree not to misuse our services or resell products purchased here. We reserve the right to modify these terms at any time without prior notice. Continued use of the website constitutes acceptance of any changes.
      </p>
    </div>
  )
}

export default page
