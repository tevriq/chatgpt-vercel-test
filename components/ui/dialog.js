import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {X} from 'lucide-react'
import {cn} from '../../lib/utils'

const Dialog=DialogPrimitive.Root
const DialogTrigger=DialogPrimitive.Trigger
const DialogPortal=DialogPrimitive.Portal
const DialogClose=DialogPrimitive.Close
const DialogOverlay=React.forwardRef(({className,...props},ref)=><DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/50',className)} {...props}/>)
DialogOverlay.displayName='DialogOverlay'
const DialogContent=React.forwardRef(({className,children,...props},ref)=><DialogPortal><DialogOverlay/><DialogPrimitive.Content ref={ref} className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border bg-background p-5 shadow-lg',className)} {...props}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-muted-foreground opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-zinc-400"><X className="h-4 w-4"/><span className="sr-only">关闭</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPortal>)
DialogContent.displayName='DialogContent'
const DialogHeader=({className,...props})=><div className={cn('flex flex-col space-y-1.5 text-left',className)} {...props}/>
const DialogFooter=({className,...props})=><div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',className)} {...props}/>
const DialogTitle=React.forwardRef(({className,...props},ref)=><DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight',className)} {...props}/>)
DialogTitle.displayName='DialogTitle'
const DialogDescription=React.forwardRef(({className,...props},ref)=><DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground',className)} {...props}/>)
DialogDescription.displayName='DialogDescription'
export {Dialog,DialogPortal,DialogOverlay,DialogClose,DialogTrigger,DialogContent,DialogHeader,DialogFooter,DialogTitle,DialogDescription}
