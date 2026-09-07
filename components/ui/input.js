import * as React from 'react'
import { cn } from '../../lib/utils'
export const Input=React.forwardRef(function Input({className,type='text',...props},ref){return <input ref={ref} type={type} className={cn('flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50',className)} {...props}/>})
