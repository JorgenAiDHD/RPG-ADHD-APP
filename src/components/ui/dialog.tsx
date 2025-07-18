import * as React from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
// Komponent dialogu Shadcn UI.
const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close


const DialogOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;


const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // ADHD-friendly solid background with strong contrast
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4",
          "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700",
          "p-6 shadow-2xl duration-200 rounded-xl",
          // Enhanced animations for ADHD focus
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          // Responsive design for mobile ADHD users
          "sm:max-w-[95vw] sm:w-full max-h-[95vh] overflow-y-auto",
          // ADHD-specific styling
          "backdrop-blur-sm ring-4 ring-blue-500/20 dark:ring-blue-400/20",
          className
        )}
        {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;


const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      // ADHD-friendly header with clear visual hierarchy
      "flex flex-col space-y-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700",
      "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
      "-m-6 mb-6 p-6 rounded-t-xl",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";


const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      // ADHD-friendly footer with clear action separation
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0",
      "pt-4 mt-6 border-t-2 border-gray-200 dark:border-gray-700",
      "bg-gray-50/50 dark:bg-gray-800/50 -m-6 mt-6 p-6 rounded-b-xl",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";



const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        // ADHD-friendly title with strong contrast and clear hierarchy
        "text-2xl font-bold leading-tight tracking-tight",
        "text-gray-900 dark:text-gray-100",
        "flex items-center gap-3",
        className
      )}
      {...props}
    />
  )
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        // ADHD-friendly description with better readability
        "text-base text-gray-600 dark:text-gray-300 leading-relaxed",
        "bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50",
        className
      )}
      {...props}
    />
  )
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

