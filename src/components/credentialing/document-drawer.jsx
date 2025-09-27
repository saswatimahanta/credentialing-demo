'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

const DocumentDrawer = ({ documents }) => {
    // const [modDocuments, setModDocuments] = useState(documents)
    console.log('documents', documents)
    return (
        <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline">View Files</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[500px] sm:w-[540px] sm:max-w-[50rem]">
            <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="py-6 overflow-y-scroll h-[44rem] space-y-4">
            {/* Drawer body content goes here */}
                    {documents.filter(doc => doc.fileType!="sanctions").map((doc) => (
                    <div>
                       <Image
                           src={`/images/${doc.fileType}.jpg`}
                           alt={`${doc.fileType} Scan`}
                           width={600}
                           height={400}
                           className="rounded-md border object-cover cursor-pointer"
                           data-ai-hint="medical license document"
                           tabIndex={0}

                       />
                            <p>Last updated: {doc.lastChecked}</p>
                    </div>
                ))}
            </div>
            {/* <SheetFooter>
            <Button variant="outline">Submit</Button>
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            </SheetFooter> */}
        </SheetContent>
        </Sheet>
    )
}

export default DocumentDrawer