import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'
export const Tabs=TabsPrimitive.Root
export const TabsList=React.forwardRef(function TabsList({className,...props},ref){return <TabsPrimitive.List ref={ref} className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',className)} {...props}/>})
export const TabsTrigger=React.forwardRef(function TabsTrigger({className,...props},ref){return <TabsPrimitive.Trigger ref={ref} className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',className)} {...props}/>})
export const TabsContent=React.forwardRef(function TabsContent({className,...props},ref){return <TabsPrimitive.Content ref={ref} className={cn('mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',className)} {...props}/>})
