export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // This wrapper ensures the children (the login cards) can center themselves
    <div className="w-full min-h-screen">
      {children}
    </div>
  );
}