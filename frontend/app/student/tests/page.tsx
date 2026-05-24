import { Button } from '@/components/ui/button';
import Link from 'next/link';

const TESTS = [
  {
    id: '1',
    title: 'Science Quiz: Photosynthesis',
    description: 'A basic quiz covering the essentials of photosynthesis and plant biology.',
    durationMinutes: 30,
    questionCount: 15,
  },
  {
    id: '2',
    title: 'Mathematics: Algebra Basics',
    description: 'Test your understanding of linear equations and basic algebraic functions.',
    durationMinutes: 45,
    questionCount: 20,
  },
];

export default function StudentTestsPage() {
  return (
    <div className="min-h-screen bg-[#0A101F] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#2FA8CC]">Assessments</p>
          <h1 className="text-4xl font-black tracking-tight">Student Tests</h1>
          <p className="max-w-2xl text-white/60">Pick an available test, review the details, and start your assessment inside the student portal.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TESTS.map((test) => (
            <article key={test.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#2FA8CC]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2FA8CC]">
                  {test.durationMinutes} Mins
                </span>
                <span className="text-xs font-semibold text-white/40">{test.questionCount} Questions</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{test.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{test.description}</p>
              <div className="mt-6">
                <Button asChild className="h-11 rounded-xl bg-[#2FA8CC] px-5 font-semibold text-white hover:bg-[#1F4E79]">
                  <Link href={`/student/tests/${test.id}`}>Start Test</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}