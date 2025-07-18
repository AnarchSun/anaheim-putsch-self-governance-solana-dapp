// FILE: src/app/account/[address]/page.tsx
'use client';

import AccountDetailFeature from '@/components/account/account-detail-feature';
import React from 'react';

export default function AccountDetailPage() {
  return (
      // Add a simple div with spacing to structure the page content.
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Account Dashboard</h1>
        <AccountDetailFeature />
      </div>
  );
}