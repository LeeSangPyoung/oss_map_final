// ContextMenu 패키지 타입 정의

export interface ContextMenuItem {
  id: string;
  label: string;
  action: string;
  icon?: string;
  disabled?: boolean;
  children?: ContextMenuItem[];
}

export interface DefaultContextMenuOptions {
  enabled?: boolean;
  items?: ContextMenuItem[];
  position?: 'fixed' | 'relative';
  theme?: 'light' | 'dark';
}

export interface EditContextMenuOptions {
  enabled?: boolean;
  items?: ContextMenuItem[];
  position?: 'fixed' | 'relative';
  theme?: 'light' | 'dark';
}

export interface ContextMenuResult {
  success: boolean;
  message: string;
  error?: string;
  menuConfig?: any;
} 