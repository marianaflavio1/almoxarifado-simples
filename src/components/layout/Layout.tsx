import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content overflow-auto">
        {children}
      </main>
    </div>
  );
}
