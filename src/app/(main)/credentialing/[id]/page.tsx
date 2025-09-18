
'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, AlertTriangle, FileCheck2, FileClock, FileX2, Upload, Search, Database, Check, ArrowLeft, SquareMenu, SquareMenuIcon, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import mockApi, { type DocumentStatus, type VerificationCentre } from '@/lib/mock-data';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { OcrOutput } from '@/components/custom/OcrOutput';
import { VerificationOutput } from '@/components/custom/VerificationOutput';
import { Chip } from '@mui/material';
import { ArrowRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import DocumentPopup from '@/components/credentialing/DocumentPopup'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



const getDocumentIcon = (status: DocumentStatus['status']) => {
    switch (status) {
        case 'Verified':
            return { icon: FileCheck2, color: 'text-green-500' };
        case 'Pending':
            return { icon: FileClock, color: 'text-yellow-500' };
        case 'New':
            return { icon: FileClock, color: 'text-yellow-500' };
        case 'Flagged':
            return { icon: FileX2, color: 'text-red-500' };
        default:
            return { icon: FileClock, color: 'text-yellow-500' };
    }
};

const getStatusDetails = (status: DocumentStatus['status']) => {
    switch (status) {
        case 'Verified':
            return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, badge: 'default' as const, text: "Verified" };
        case 'Pending':
            return { icon: <Clock className="h-5 w-5 text-yellow-500" />, badge: 'secondary' as const, text: "Pending" };
        case 'Flagged':
            return { icon: <AlertTriangle className="h-5 w-5 text-red-500" />, badge: 'destructive' as const, text: "Flagged" };
        default:
            return { icon: <Clock className="h-5 w-5 text-yellow-500" />, badge: 'secondary' as const, text: "Pending" };
    }
};

export default function CredentialingWorkflowPage({ params }: { params: { id: string } }) {
    const [documents, setDocuments] = useState<DocumentStatus[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<DocumentStatus | null>(null);
    const [verificationCentre, setVerificationCentre] = useState<VerificationCentre | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentUploadType, setDocumentUploadType] = useState('userUploaded')
    const [showDocument, setShowDocument] = useState(false)
    const imgSuccess = selectedDocument?.fileType === 'CV' || selectedDocument?.fileType === 'npi' || selectedDocument?.fileType === 'board_certification' || selectedDocument?.fileType === 'license_board' || selectedDocument?.fileType === 'MEDICAL_TRAINING_CERTIFICATE'


    const documentType = selectedDocument?.fileType.split('/')[0];
    const imagePath = `/images/${documentType}.jpg`;
    const { id } = use(params);
    const router = useRouter();

    const { toast } = useToast();

    const [formData, setFormData] = useState<any>({});

    const handleAddToMailList = () => {
        toast({ title: "Email", description: "Add to mail list successful!" });
        return;
    }

    const handleDocumentPopup = () => {
        setShowDocument(true)
    }

    const handleDocumentDownload = () => {
        console.log('document download')
    }

    useEffect(() => {
        const fetchDocUploadNameData = async (uploadIds: any) => {
            if (!id) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/api/forms/${documentUploadType === 'userUploaded' ? 'upload-info' : 'upload-info-psv'}`, {
                    params: { 'appId': id, 'formId': '', 'uploadIds': uploadIds.join(',') },
                });

                let docData = Object.values(res.data?.files);
                // Reorder depending on upload type
                if (documentUploadType === 'psvFetched') {
                    docData = docData.sort((a: any, b: any) => {
                        if (a.fileType === 'board_certification') return -1;
                        if (b.fileType === 'board_certification') return 1;
                        return 0;
                    });
                } else {
                    docData = docData.sort((a: any, b: any) => {
                        if (a.fileType === 'MEDICAL_TRAINING_CERTIFICATE') return -1;
                        if (b.fileType === 'MEDICAL_TRAINING_CERTIFICATE') return 1;
                        return 0;
                    });
                }
                setDocuments(docData);
                if (docData.length > 0) {
                    setSelectedDocument(docData[0] as any);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching upload docs info:", error);
                toast({ title: "Error", description: "Failed to load upload docs info" });
            } finally {
                setLoading(false);
            }
        };

        const fetchFormData = async () => {
            if (!id) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/api/forms/`, {
                    params: { 'appId': id, 'formId': '' },
                });
                setFormData(res.data);

                const uploadIds = Object.entries(res.data)
                    .filter(([key, _]) => key.endsWith('-upload-id'))
                    .map(([_, value]) => value);


                fetchDocUploadNameData(uploadIds);
            } catch (error) {
                // console.log(error, 'error fetching form data');
                let docData = await mockApi.getDocumentsStatus(id);
                if (documentUploadType === 'psvFetched') {
                    docData = docData.sort((a: any, b: any) => {
                        if (a.fileType === 'board_certification') return -1;
                        if (b.fileType === 'board_certification') return 1;
                        return 0;
                    });
                } else {
                    docData = docData.sort((a: any, b: any) => {
                        if (a.fileType === 'MEDICAL_TRAINING_CERTIFICATE') return -1;
                        if (b.fileType === 'MEDICAL_TRAINING_CERTIFICATE') return 1;
                        return 0;
                    });
                }
                setDocuments(docData);
                if (docData.length > 0) {
                    setSelectedDocument(docData[0] as any);
                }
                setLoading(false);
                // toast({ title: "Error", description: "Failed to load form data." });
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [id, documentUploadType]);


    const handleDownload = async (type: String) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/download?id=${params.id}&type=${type}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to download');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${type.toUpperCase()}_${params.id}.pdf`; // dynamic filename
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const handleDocumentDropdown = (e) => {
        setDocumentUploadType(e);
    }

    useEffect(() => {
        async function loadVerificationCenter() {
            if (selectedDocument) {
                const vcData = await mockApi.getVerificationCentreForDoc(selectedDocument.fileType);
                setVerificationCentre(vcData || null);
            }
        }
        loadVerificationCenter();
    }, [selectedDocument]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!selectedDocument) {
        return (
            <div className="space-y-6">
                <Button asChild variant="ghost" className="mb-4 px-0">
                    <Link href="/credentialing"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Credentialing</Link>
                </Button>
                <p>No documents found for this application.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <Button asChild variant="ghost" className="mb-4 px-0">
                    <Link href="/credentialing"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Credentialing</Link>
                </Button>
                <div className='flex justify-between'>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Credentialing Workflow for {id}</h1>
                    <Button size="sm">Send to Committee</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Documents
                        <Chip
                            label='Total Documents: 9'
                            color='default'
                            size="small"
                            variant="outlined"
                            sx={{ ml: 2 }}
                        />
                        <Chip
                            label='Verified Documents: 4'
                            color='primary'
                            size="small"
                            variant="outlined"
                            sx={{ ml: 2 }}
                        />
                        <Chip
                            label='In Progress: 5'
                            color='default'
                            size="small"
                            variant="outlined"
                            sx={{ ml: 2 }}
                        />
                        {/* <Chip
                        label='Pending Documents: 5'
                        color='default'
                        size="small"
                        variant="outlined"
                        sx={{ ml: 2 }}
                    /> */}
                        {/* <Chip
                        label='Flagged Documents: 4'
                        color='error'
                        size="small"
                        variant="outlined"
                        sx={{ ml: 2 }}
                    /> */}

                    </CardTitle>
                    <CardDescription>Select a document to view its verification progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        <div>
                            <Select defaultValue="userUploaded" onValueChange={handleDocumentDropdown}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="User Uploaded" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="userUploaded">Provider Submitted</SelectItem>
                                    <SelectItem value="psvFetched">PSV-Fetched</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {documents.map(doc => {
                                const { icon: Icon, color } = getDocumentIcon(doc.status);
                                return (
                                    <button
                                        key={doc.fileType}
                                        onClick={()=>{setSelectedDocument(doc)}}
                                        className={cn(
                                            "flex-1 min-w-[200px] flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                            selectedDocument.fileType === doc.fileType ? 'border-primary bg-accent' : 'bg-card hover:bg-accent/50'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-6 w-6 ${color}`} />
                                            <span className="text-sm font-semibold">{doc.fileType.toUpperCase() === 'MEDICAL_TRAINING_CERTIFICATE' ? 'MEDICAL_TRAINING_CERT' : doc.fileType.toUpperCase()}</span>
                                        </div>
                                        <div className="w-full mt-2">
                                            <Progress value={doc.progress} />
                                        </div>
                                        <Badge variant={getStatusDetails(doc.status).badge} className="mt-2">{doc.status}</Badge>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Verification Progress for: <span className="text-primary">{selectedDocument.fileType.toUpperCase()}</span></CardTitle>
                    <CardDescription>Details from each stage of the verification pipeline.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Upload className="h-5 w-5 text-primary" />
                                    <h4>{documentUploadType === 'psvFetched' ? 'API Fetched' : 'Original Upload'}</h4>
                                </div>
                                {imgSuccess && <Image
                                    src={imagePath}
                                    alt={`${selectedDocument.filename} Scan`}
                                    width={600}
                                    height={400}
                                    className="rounded-md border aspect-[3/2] object-cover cursor-pointer" data-ai-hint="medical license document"
                                    onClick={() => handleDownload(selectedDocument.fileType)} />}

                                <p className="text-sm text-slate-600">
                                    <span className="font-medium">File Name:</span> {selectedDocument.filename}
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                <Button size="sm" className="flex-1 w-full" variant='outline' onClick={handleDocumentPopup}>View</Button>
                                <Button size="sm" className="flex-1 w-full" variant='outline' onClick={handleDocumentDownload}>Download</Button>
                            </div>
                        </div>

                        <DocumentPopup filePath={imagePath} showDocument={showDocument} setShowDocument={setShowDocument} />

                        <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-lg">
                                        <Search className="h-5 w-5 text-primary" />
                                        <h4>OCR/LLM Output</h4>
                                    </div>
                                    <div className="max-h-96 overflow-auto pr-2">
                                        <OcrOutput data={selectedDocument.ocrData} type={selectedDocument.fileType} />
                                    </div>
                                </div>
                            </div>

                            {/* <OcrOutput data={selectedDocument.ocrData} type={selectedDocument.fileType}/> */}
                            <div className='space-y-2'>
                                <div className='flex justify-between gap-2'>
                                    <Button variant='outline'onClick={() => { router.push(`/credentialing/${id}/verify`) }} className='flex-1 h-9' >Modify</Button>
                                    <Button variant='destructive' className='flex-1 h-9'>Reject</Button>

                                </div>
                                <Button className='w-full h-9'>Approve</Button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div className='space-y-2'>
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Database className="h-5 w-5 text-primary" />
                                    <h4>Verification</h4>
                                </div>
                                <div className="max-h-96 overflow-auto pr-2">
                                    <VerificationOutput pdfData={selectedDocument.pdfMatch} ocrData={selectedDocument.ocrData} type={selectedDocument.fileType} />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <div className='flex justify-between gap-2'>
                                    <Button variant='outline' className='flex-1 h-9'>Modify</Button>
                                    <Button variant='destructive' className='flex-1 h-9'>Reject</Button>

                                </div>
                                <Button className='w-full h-9'>Approve</Button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                            <div className="flex items-center gap-2 font-semibold text-lg">
                                <MessageCircle className="h-5 w-5 text-primary" />
                                <h4>Comments</h4>
                            </div>
                            <div className="overflow-auto pr-2 flex-1 space-y-2 flex flex-col justify-between">

                                <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full flex flex-col">
                                    <div className='flex items-center gap-1 cursor-pointer'><SquareMenuIcon className="h-3 w-3 text-primary" /><p className='text-[13px] text'>Previous Comments</p></div>
                                    {/* <p><strong>Organization:</strong> {verificationCentre.name}</p>
                                    <p><strong>Address:</strong> {verificationCentre.address}</p>
                                    <p><strong>Contact:</strong> {verificationCentre.email}</p>
                                    <Separator className="my-2 bg-border" /> */}
                                    <div className="space-y-2 h-full flex flex-col">
                                        <Textarea placeholder="Add a comment or log interaction..." className='flex-1' />
                                    </div>
                                </div>

                                <div className='w-full flex gap-2'>
                                    <Button size="sm" className="flex-1" variant='outline' onClick={handleAddToMailList}>Save</Button>
                                    <Button size="sm" className="flex-1" variant='destructive' onClick={handleAddToMailList}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
