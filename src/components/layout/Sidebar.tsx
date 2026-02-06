import { Link, useLocation } from 'react-router-dom';
import { Package, PackagePlus, PackageMinus, History, LayoutDashboard, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
const navigation = [{
  name: 'Estoque',
  href: '/',
  icon: LayoutDashboard
}, {
  name: 'Cadastrar Produto',
  href: '/cadastrar',
  icon: PackagePlus
}, {
  name: 'Registrar Saída',
  href: '/saida',
  icon: PackageMinus
}, {
  name: 'Painel Admin',
  href: '/admin',
  icon: Shield,
  isAdmin: true
}, {
  name: 'Histórico',
  href: '/historico',
  icon: History
}];
export function Sidebar() {
  const location = useLocation();
  return <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sidebar-primary rounded-lg">
            <Package className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Almoxarifado NTS</h1>
            <p className="text-xs text-sidebar-foreground/60">Controle de Estoque</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map(item => {
        const isActive = location.pathname === item.href;
        const isAdmin = 'isAdmin' in item && item.isAdmin;
        return <Link key={item.name} to={item.href} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground', isAdmin && 'border-l-2 border-amber-500')}>
              <item.icon className={cn('h-5 w-5', isAdmin && 'text-amber-500')} />
              {item.name}
            </Link>;
      })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          Sistema Interno v1.0
        </p>
      </div>
    </aside>;
}