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
import { formatCustomDate, providersWithCertificates } from "@/app/(main)/credentialing/[id]/page"

const DocumentDrawer = ({ documents, providerName }) => {
    // const [modDocuments, setModDocuments] = useState(documents)
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
                    <div className="p-2">
                        <Image
                            src='/images/Packet-1.png'
                            alt={`Scan`}
                            width={600}
                            height={400}
                            className="rounded-md border object-cover cursor-pointer"
                            data-ai-hint="medical license document"
                        />
                        {/* <p>Generated on: {formatCustomDate(new Date()) }</p> */}
                    </div>
                    <div className="p-1">
                        <Image
                            src='/images/Packet-2.png'
                            alt={`Scan`}
                            width={600}
                            height={400}
                            className="rounded-md border object-cover cursor-pointer"
                            data-ai-hint="medical license document"
                        />
                        {/* <p>Generated on: {formatCustomDate(new Date()) }</p> */}
                    </div>
                    {documents.filter(doc => doc.fileType!="sanctions").map((doc) => (
                    <div key={doc.fileType} className="border rounded-md p-2">
                       <Image
                        //    src={doc?.fileType === 'MEDICAL_TRAINING_CERTIFICATE' && providersWithCertificates.includes(providerName) ? ('/images/' + providerName?.replace(/\s+/g, "-") + ".png") :`/images/${doc.fileType}.jpg`}
                           src = {
                                doc.fileUrl ||(["Roger Tran", "Ahmed Alsadek"].includes(providerName)
                                ? `/images/${providerName}_${doc.fileType}.png`
                                : (doc?.fileType === 'MEDICAL_TRAINING_CERTIFICATE' && providersWithCertificates.includes(providerName) ? `/images/${providerName?.replace(/\s+/g, "-")}.png`
                                    : ( `/images/${doc.fileType}.jpg`)

                                ))
                            }
                           alt={`${doc.fileType} Scan`}
                           width={600}
                           height={400}
                           className="rounded-md object-cover cursor-pointer"
                           data-ai-hint="medical license document"
                           tabIndex={0}

                       />
                            <p className='text-[7px] ml-[23px] mb-[9px]'>Generated on: {doc.lastChecked}</p>
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