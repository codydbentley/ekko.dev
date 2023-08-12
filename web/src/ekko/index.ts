/**
 * ekko.dev types
 */

export interface System {
  apps: Application[]
}

export interface WindowOptions {
  icon: string
  title: string
  resizable: boolean
  width: number
  height: number
}

export interface Application {
  id: string
  window: WindowOptions
  component: unknown
}
