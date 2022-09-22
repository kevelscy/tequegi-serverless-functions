import { ReactNode } from 'react'

export type TPublicRoute = '/' | '/auth/signin' | '/auth/signup'
export type TAdminRoute = '/admin' | '/admin/tienda' | '/admin/productos' | '/admin/categorias' | '/admin/usuarios' | '/admin/pedidos'

export interface RouteAdminNavigationDrawer {
  to: TAdminRoute
  label: string
  isBottomNav: boolean
  icon: ReactNode
}