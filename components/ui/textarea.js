import * as React from 'react'
import { cn } from '../../lib/utils'
export const Textarea=React.forwardRef(function Textarea({className,...props},ref){return <textarea ref={ref} className={cn('flex min-h-[104px] w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50',className)} {...props}/>})
