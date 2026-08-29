import { Suspense } from 'react';
import { NewDoubtForm } from './form';

function FormLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="p-8 text-center flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default function NewDoubt() {
  return (
    <Suspense fallback={<FormLoading />}>
      <NewDoubtForm />
    </Suspense>
  );
}
