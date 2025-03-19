// 'use client'

// import * as React from 'react'
// import { X } from 'lucide-react'

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { cn } from '@/libs/utl'

// interface ModalProps {
//   isOpen: boolean
//   onClose: () => void
//   title?: string
//   description?: string
//   children?: React.ReactNode
//   className?: string
//   showCloseButton?: boolean
//   footer?: React.ReactNode
// }

// export function Modal({
//   isOpen,
//   onClose,
//   title,
//   description,
//   children,
//   className,
//   showCloseButton = true,
//   footer
// }: ModalProps) {
//   const [open, setOpen] = React.useState(isOpen)

//   React.useEffect(() => {
//     setOpen(isOpen)
//   }, [isOpen])

//   const handleClose = () => {
//     setOpen(false)
//     onClose()
//   }

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className={cn('sm:max-w-lg bg-white', className)}>
//         {showCloseButton && (
//           <DialogClose className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
//             <X className='h-4 w-4' />
//             <span className='sr-only'>Close</span>
//           </DialogClose>
//         )}

//         {(title || description) && (
//           <DialogHeader>
//             {title && <DialogTitle className='text-xl'>{title}</DialogTitle>}
//             {description && <DialogDescription>{description}</DialogDescription>}
//           </DialogHeader>
//         )}

//         <div className='py-4'>{children}</div>

//         {footer && <DialogFooter>{footer}</DialogFooter>}
//       </DialogContent>
//     </Dialog>
//   )
// }

'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  children?: React.ReactNode
  className?: string
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  footer
}: ModalProps) {
  const [open, setOpen] = React.useState(isOpen)

  React.useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn('sm:max-w-lg bg-white', className)}>
        {showCloseButton && (
          <DialogClose className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </DialogClose>
        )}

        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle className='text-xl'>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className='py-4'>{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
