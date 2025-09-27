

'use client';

import { useEffect, useState } from 'react';
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
import { Chip, CircularProgress } from '@mui/material';
import { ArrowRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams, useRouter } from 'next/navigation';
import DocumentPopup from '@/components/credentialing/DocumentPopup'
import DocumentDrawer from '@/components/credentialing/document-drawer'



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function formatCustomDate(date) {
  const pad = (n) => n.toString().padStart(2, "0");

  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
}

const providersWithCertificates = ['Ahmed Alsadek', 'Lester Summerfield', 'Linda Thompson', 'Rakesh Bhola', 'Richard Bender', 'Roger Tran', 'Sajeet Sawhney', 'Shivanand Pole', 'Vivian Nguyen']

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

export default function CredentialingWorkflowPage() {
    type UIDocument = DocumentStatus & {
        filename?: string | null;
        pdfMatch?: any;
        comments?: any[];
        verificationDetails?: any;
        ocrData?: any;
    };
    const [documents, setDocuments] = useState<UIDocument[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<UIDocument | null>(null);
    const [verificationCentre, setVerificationCentre] = useState<VerificationCentre | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentUploadType, setDocumentUploadType] = useState('userUploaded')
    const [showDocument, setShowDocument] = useState(false)
    const [providerName, setProviderName] = useState('')
    const imgSuccess = (() => {
        const ft = (selectedDocument?.fileType || '').toLowerCase();
        const set = new Set([
            'cv',
            'npi',
            'board_certification',
            'license_board',
            'medical_training_certificate',
            'dea',
            'malpractice_insurance',
            'malpractice',
        ]);
        return set.has(ft);
    })();
    const isNpi = (selectedDocument?.fileType || '').toLowerCase() === 'npi';
    const isSanctions = (selectedDocument?.fileType || '').toLowerCase() === 'sanctions';
    const [runTime, setRunTime] = useState(() => {
    const date = new Date(new Date().getTime() - 2 * 60 * 60 * 1000 * 25);
    return formatCustomDate(date);
    })
    const [runCheckLoader, setRunCheckLoader] = useState(false)

    // Image helpers for thumbnails/preview
    const imageAliasFor = (fileType?: string) => {
        const key = (fileType || '').split('/')[0];
        const k = key.toLowerCase();
        const alias: Record<string, string> = {
            cv: 'CV',
            npi: 'npi',
            dea: 'dea',
            degree: 'degree',
            dl: 'dl',
            license_board: 'license_board',
            board_certification: 'board_certification',
            medical_training_certificate: 'MEDICAL_TRAINING_CERTIFICATE',
            malpractice_insurance: 'coi', // map to certificate of insurance image
            malpractice: 'coi',
            coi: 'coi',
        };
        return alias[k] || key;
    };

    const imageCandidates = (fileType?: string): string[] => {
        const base = imageAliasFor(fileType);
        const unique = Array.from(new Set([
            `/images/${base}.jpg`,
            `/images/${String(base).toLowerCase()}.jpg`,
            `/images/${base}.png`,
            `/images/${String(base).toLowerCase()}.png`,
        ]));
        return unique;
    };

    const primaryImagePath = (fileType?: string) => imageCandidates(fileType)[0];

    const documentType = selectedDocument?.fileType?.split('/')?.[0] || '';
    const imagePath = primaryImagePath(documentType);
    const routeParams = useParams();
    const id = (routeParams as any)?.id as string;
    const router = useRouter();

    const { toast } = useToast();

    const [formData, setFormData] = useState<any>({});
    const [sendingToCommittee, setSendingToCommittee] = useState(false);

    const handleAddToMailList = () => {
        toast({ title: "Email", description: "Add to mail list successful!" });
        return;
    }

    const handleDocumentPopup = () => {
        setShowDocument(true)
    }

    const handleDocumentDownload = () => {
        const link = document.createElement("a");
        link.href = imagePath;
        link.download = imagePath || imagePath.split("/").pop() || "file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleRunCheck = () => {
        setRunCheckLoader(true)
        setTimeout(() => {
            // setRunTime(formatCustomDate(new Date()))
            setDocuments(prev =>
                prev.map(doc =>
                    doc.fileType === selectedDocument?.fileType
                    ? { ...doc, lastChecked: formatCustomDate(new Date()) }
                    : doc
                )
            );

            setRunCheckLoader(false)
            toast({ title: "Check", description: "Check Ran Successfully" });
        }, 5000)
    }

    const handleSanctionsDownload = async () => {
        try {
            const normName = (providerName || '').trim().replace(/\s+/g, '_');
            const candidates = [
                `/sanctions/${id}.xlsx`,
                `/sanctions/${normName}_Optout.xlsx`,
                `/sanctions/${normName}.xlsx`,
            ];
            for (const path of candidates) {
                try {
                    const head = await fetch(path, { method: 'HEAD' });
                    if (head.ok) {
                        const a = document.createElement('a');
                        a.href = path;
                        a.download = path.split('/').pop() || 'sanctions.xlsx';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        return;
                    }
                } catch (e) {
                    // ignore and try next candidate
                }
            }
            toast({ title: 'Download', description: 'Sanctions file not found for this provider.' });
        } catch (e) {
            toast({ title: 'Download', description: 'Failed to download sanctions file.' });
        }
    }

    // Map normalized backend keys to UI-friendly fileType values used across the app
    const mapKeyToFileType = (key: string): string => {
        const k = key?.toUpperCase();
        const mapping: Record<string, string> = {
            'MEDICAL_TRAINING_CERTIFICATE': 'MEDICAL_TRAINING_CERTIFICATE',
            'BOARD_CERTIFICATION': 'board_certification',
            'LICENSE_BOARD': 'license_board',
            'CV': 'CV',
            'RESUME': 'CV',
            'CURRICULUM_VITAE': 'CV',
            'NPI': 'npi',
            'DEA': 'DEA',
            'SANCTIONS': 'sanctions',
            'MALPRACTICE_INSURANCE': 'malpractice_insurance',
            'HOSPITAL_PRIVILEGES': 'hospital_privileges',
            'COI': 'COI',
            'DEGREE': 'degree',
            'TRAINING': 'MEDICAL_TRAINING_CERTIFICATE',
            'WORK_HISTORY': 'work-history',
            'DL': 'dl',
            'DRIVING_LICENSE': 'dl',
            'ML': 'ml',
            'MEDICAL_LICENSE': 'ml',
            'MALPRACTICE': 'malpractice',
            'OTHER': 'other',
        };
        return mapping[k] || key?.toLowerCase();
    };

    // Human-friendly label for file types (UI display)
    const formatFileTypeLabel = (ft: string): string => {
        const key = (ft || '').toLowerCase();
        const labels: Record<string, string> = {
            'board_certification': 'Board Certification',
            'license_board': 'License Board',
            'medical_training_certificate': 'Medical Training Certificate',
            'cv': 'CV',
            'npi': 'NPI',
            'dea': 'DEA',
            'sanctions': 'Sanctions',
            'malpractice_insurance': 'Malpractice Insurance',
            'hospital_privileges': 'Hospital Privileges',
            'coi': 'COI',
            'degree': 'Degree',
            'work-history': 'Work History',
            'dl': 'Driver License',
            'ml': 'Medical License',
            'malpractice': 'Malpractice',
            'other': 'Other',
        };
        return labels[key] || ft?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    // Transform the new API response into an array of document objects consumed by the UI
    const normalizeFilesToDocuments = (files: any): any[] => {
        if (!files) return [];
        const entries: Array<[string, any]> = Array.isArray(files)
            ? files.map((f: any) => [f.fileType || f.type || 'unknown', f])
            : Object.entries(files);

        return entries.map(([rawKey, f], index) => {
            const fileType = mapKeyToFileType(f?.fileType || rawKey);
            const verificationObj = f?.verificationDetails && typeof f?.verificationDetails === 'object'
                ? f?.verificationDetails
                : (typeof f?.verification === 'object' ? f?.verification : {});
            const pf = verificationObj?.pdf_format_match;
            let pdfMatchNormalized: any = {};
            if (pf !== undefined) {
                if (typeof pf === 'string') {
                    pdfMatchNormalized.match = /match|verified/i.test(pf);
                } else if (typeof pf === 'boolean') {
                    pdfMatchNormalized.match = pf;
                }
            }
            if (pdfMatchNormalized.match === undefined && typeof f?.verification === 'string') {
                pdfMatchNormalized.match = /verification|verified|match/i.test(f?.verification);
            }
            pdfMatchNormalized.reason = verificationObj?.verification_summary || verificationObj?.comment || verificationObj?.comment_1 || verificationObj?.comment_2 || (typeof f?.verification === 'string' ? f?.verification : undefined);

            return {
                fileType,
                filename: f?.filename ?? null,
                status: (f?.status as any) || 'Pending',
                progress: typeof f?.progress === 'number' ? f.progress : 0,
                ocrData: f?.ocrData || f?.ocr || {},
                pdfMatch: pdfMatchNormalized,
                comments: f?.comments || [],
                verificationDetails: Object.keys(verificationObj || {}).length ? verificationObj : (f?.verificationDetails || f?.verification_details || null),
                lastChecked: formatCustomDate(
                    new Date(
                        Date.now() - ((index+1) * 24 * 60 * 60 * 1000) - ((index+1) * 60 * 60 * 1000)
                    )
                )

            };
        });
    };

    useEffect(() => {
        const fetchDocUploadNameData = async (uploadIds: any) => {
            if (!id) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/api/forms/${documentUploadType === 'userUploaded' ? 'upload-info' : 'upload-info-psv'}`, {
                    params: { 'appId': id, 'formId': '', 'uploadIds': uploadIds.join(',') },
                });
                const normalized = normalizeFilesToDocuments(res.data?.files);
                // Reorder depending on upload type (keep key documents first)
                const docData = normalized.sort((a: any, b: any) => {
                    const priority = (ft: string) => {
                        if (documentUploadType === 'psvFetched') {
                            return ft === 'board_certification' ? 0 : 1;
                        }
                        return ft === 'MEDICAL_TRAINING_CERTIFICATE' ? 0 : 1;
                    };
                    return priority(a.fileType) - priority(b.fileType);
                });
                setDocuments(docData as any);
                if (docData.length > 0) setSelectedDocument(docData[0] as any);
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
            const response = await fetch(`${API_BASE_URL}/api/documents/download?id=${id}&type=${type}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to download');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${type.toUpperCase()}_${id}.pdf`; // dynamic filename
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const handleDocumentDropdown = (e: string) => {
        setDocumentUploadType(e);
    }

    const handleSendToCommittee = async () => {
        if (sendingToCommittee) return;
        const confirmed = window.confirm('Send this application to Committee Review?');
        if (!confirmed) return;
        try {
            setSendingToCommittee(true);
            const res = await fetch(`${API_BASE_URL}/api/applications/send-to-committee/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to send to committee');
            }
            toast({ title: 'Success', description: 'Application sent to Committee Review.' });
            router.push('/applications');
        } catch (err: any) {
            toast({ title: 'Error', description: err?.message || 'Failed to send to committee.' });
        } finally {
            setSendingToCommittee(false);
        }
    };

    const handleViewAllDocuments = () => {

    }
    useEffect(()=>{console.log('selectedDocument', selectedDocument)}, [selectedDocument])

    useEffect(() => {
        if (documents.length > 0) setSelectedDocument(documents[0] as any);
    }, [documents])
    useEffect(() => {
        async function loadVerificationCenter() {
            if (selectedDocument) {
                const vcData = await mockApi.getVerificationCentreForDoc(selectedDocument.fileType);
                setVerificationCentre(vcData || null);
            }
        }
        loadVerificationCenter();
    }, [selectedDocument]);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/applications`);
                const index = response.data.findIndex((app: any) => app.id === id)
                setProviderName(response.data[index].name)

            } catch (error) {
                console.error('Failed to fetch applications:', error);
            }
        }

        loadData();
    }, []);

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
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Primary Source Verification for {providerName}</h1>
                    <Button size="sm" onClick={handleSendToCommittee} disabled={sendingToCommittee}>
                        {sendingToCommittee ? 'Sending…' : 'Send to Committee'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Documents
                        {(() => {
                            const total = documents.length;
                            const verified = documents.filter(d => (d.status || '').toLowerCase() === 'verified' || d.progress === 100).length;
                            const inProgress = documents.filter(d => (d.status || '').toLowerCase() === 'in progress' || ((d.status || '').toLowerCase() === 'pending' && d.progress > 0 && d.progress < 100) || (!d.status && d.progress > 0 && d.progress < 100)).length;
                            return (
                                <>
                                    <Chip
                                        label={`Total Documents: ${total}`}
                                        color='default'
                                        size="small"
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                    />
                                    <Chip
                                        label={`Verified Documents: ${verified}`}
                                        color='primary'
                                        size="small"
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                    />
                                    <Chip
                                        label={`In Progress: ${inProgress}`}
                                        color='default'
                                        size="small"
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                    />
                                </>
                            );
                        })()}
                    </CardTitle>
                    <CardDescription>Select a document to view its verification progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                            <div className='flex justify-between'>
                                <Select defaultValue="userUploaded" onValueChange={handleDocumentDropdown}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="User Uploaded" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="userUploaded">Provider Submitted</SelectItem>
                                        <SelectItem value="psvFetched">PSV-Fetched</SelectItem>
                                    </SelectContent>
                                </Select>
                                <DocumentDrawer documents={documents.map((doc)=>({fileType: doc?.fileType, lastChecked: doc?.lastChecked}))}/>

                            </div>

                        <div className="flex flex-wrap gap-4">
                            {documents.map(doc => {
                                const { icon: Icon, color } = getDocumentIcon(doc.status);
                                return (
                                    <button
                                        key={doc.fileType}
                                        onClick={() => { setSelectedDocument(doc) }}
                                        className={cn(
                                            "flex-1 min-w-[200px] flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                            selectedDocument.fileType === doc.fileType ? 'border-primary bg-accent' : 'bg-card hover:bg-accent/50'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-6 w-6 ${color}`} />
                                            <span className="text-sm font-semibold">{formatFileTypeLabel(doc.fileType)}</span>
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
                    <CardTitle>Verification Progress for: <span className="text-primary">{formatFileTypeLabel(selectedDocument.fileType)}</span></CardTitle>
                    <CardDescription>
                        <div className='flex justify-between'>
                            <p>Details from each stage of the verification pipeline.</p>
                            <p>Last Check: {selectedDocument?.lastChecked }</p>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={isNpi ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"}>
                        {/* {!isNpi && ( */}
                            <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-lg">
                                        <Upload className="h-5 w-5 text-primary" />
                                        {isSanctions ? (
                                            <h4>Sanctions Evidence</h4>
                                        ) : (
                                            <h4>{documentUploadType === 'psvFetched' ? 'API Fetched' : 'Original Upload'}</h4>
                                        )}
                                    </div>
                                    {documentUploadType==='psvFetched' && runCheckLoader && <CircularProgress />}
                                    {(documentUploadType!=='psvFetched' || !runCheckLoader) && !isSanctions && imgSuccess && (
                                        <Image
                                            src={selectedDocument?.fileType === 'MEDICAL_TRAINING_CERTIFICATE' && providersWithCertificates.includes(providerName) ? ('/images/' + providerName?.replace(/\s+/g, "-") + ".png") : imagePath}
                                            alt={`${selectedDocument?.filename || selectedDocument?.fileType} Scan`}
                                            width={600}
                                            height={400}
                                            className="rounded-md border aspect-[3/2] object-cover cursor-pointer"
                                            data-ai-hint="medical license document"
                                            onClick={handleDocumentPopup}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleDocumentPopup();
                                                }
                                            }}
                                        />
                                    )}

                                    <p className="text-sm text-slate-600">
                                        {!isSanctions ? (
                                            <>
                                                <span className="font-medium">File Name:</span> {selectedDocument?.filename || '—'}
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-medium">Provider:</span> {providerName || '—'}
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className='flex gap-2'>
                                    {isSanctions ? (
                                        <Button size="sm" className="flex-1 w-full" onClick={handleSanctionsDownload}>Download Sanctions File</Button>
                                    ) : (
                                        <>
                                            <Button size="sm" className="flex-1 w-full" variant='outline' onClick={handleDocumentDownload}>Download</Button>
                                            <Button size="sm" className="flex-1 w-full" variant='outline' disabled={runCheckLoader} onClick={handleRunCheck}>{runCheckLoader ? "Running..." : "Run Check"}</Button>
                                        </>
                                    )}
                                </div>
                            </div>


                        {!isNpi && !isSanctions && (
                            <DocumentPopup filePath={imagePath} showDocument={showDocument} setShowDocument={setShowDocument} />
                        )}

                        {!isNpi && (
                            <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                                <div>
                                    <div>
                                        <div className="flex items-center gap-2 font-semibold text-lg">
                                            <Search className="h-5 w-5 text-primary" />
                                            <h4>{isSanctions ? 'LLM Parser Output':'OCR/LLM Output'}</h4>
                                        </div>
                                        {runCheckLoader && <CircularProgress/>}
                                        {!runCheckLoader && <div className="max-h-96 overflow-auto pr-2">
                                            <OcrOutput data={selectedDocument.ocrData} type={selectedDocument.fileType} providerName={providerName} specialty={formData?.speciality || formData?.specialty} />
                                        </div>}
                                    </div>
                                </div>

                                {/* <OcrOutput data={selectedDocument.ocrData} type={selectedDocument.fileType}/> */}
                                <div className='space-y-2'>
                                    <div className='flex justify-between gap-2'>
                                        <Button variant='outline' onClick={() => { router.push(`/credentialing/${id}/verify`) }} className='flex-1 h-9' >Modify</Button>
                                        <Button variant='destructive' className='flex-1 h-9'>Reject</Button>

                                    </div>
                                    <Button className='w-full h-9'>Approve</Button>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div className='space-y-2'>
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Database className="h-5 w-5 text-primary" />
                                    <h4>Verification</h4>
                                </div>
                                {runCheckLoader && <CircularProgress/>}
                                {!runCheckLoader && <div className="max-h-96 overflow-auto pr-2">
                                    <VerificationOutput pdfData={selectedDocument?.pdfMatch || {}} ocrData={selectedDocument?.ocrData || {}} type={selectedDocument.fileType} verificationDetails={selectedDocument?.verificationDetails || {}} />
                                </div>}
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
