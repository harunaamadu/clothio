import { Metadata } from 'next'
import React from 'react'

const metadata: Metadata = {
  title: `Authentication | ${process.env.WEBSITE_NAME}`,
  description: "Sign in to your account or create a new one to access exclusive features and offers.",
}

const AUthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 p-6">{children}</main>
  )
}

export default AUthLayout