import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface FocusedFlowLayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

/**
 * FocusedFlowLayout - Enforces single scroll authority for task-focused screens.
 * 
 * This layout pattern prevents scroll bleed on mobile by:
 * - Locking the viewport (no body scroll)
 * - Only allowing the content area to scroll
 * - Keeping header and footer truly anchored
 * 
 * Use for: Multi-step flows, forms, chats, payment screens, modals
 */
export function FocusedFlowLayout({
  children,
  headerContent,
  footerContent,
  showBottomNav = false,
  className,
}: FocusedFlowLayoutProps) {
  return (
    <div className="fixed inset-0 flex flex-col h-dvh overflow-hidden bg-background">
      {/* Header zone - truly anchored */}
      {headerContent && (
        <div className="flex-none z-10">
          {headerContent}
        </div>
      )}

      {/* Scrollable content - ONLY this element scrolls */}
      <div 
        className={`flex-1 overflow-y-auto overflow-x-hidden overscroll-contain ${className || ""}`}
      >
        {children}
      </div>

      {/* Footer zone - truly anchored */}
      {footerContent && (
        <div className="flex-none z-10">
          {footerContent}
        </div>
      )}

      {/* Bottom nav - truly anchored */}
      {showBottomNav && (
        <div className="flex-none">
          <BottomNav inline />
        </div>
      )}
    </div>
  );
}
