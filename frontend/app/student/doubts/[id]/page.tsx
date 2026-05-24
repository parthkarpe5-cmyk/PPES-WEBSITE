'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function StudentDoubtRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const doubtId = params.id as string | undefined;
    if (doubtId) {
      router.replace(`/faculty/doubts/${doubtId}`);
    } else {
      router.replace('/faculty/doubts');
    }
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C] text-white">
      Redirecting to faculty doubts...
    </div>
  );
}
