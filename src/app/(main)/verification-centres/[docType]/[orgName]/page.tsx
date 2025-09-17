
'use client';
import { useEffect, useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDown, Mail, ArrowLeft } from "lucide-react"
import mockApi, { type VerificationCentre, type Application } from '@/lib/mock-data';
import Link from 'next/link';

export default function VerificationCentreProvidersPage({ params }: { params: { docType: string, orgName: string } }) {
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [organisation, setOrganisation] = useState<VerificationCentre | null>(null);
    const [providers, setProviders] = useState<Application[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
    const [emailBody, setEmailBody] = useState('');

    const { docType, orgName } = use(params);
    
    const decodedDocType = decodeURIComponent(docType);
    const decodedOrgName = decodeURIComponent(orgName);

    useEffect(() => {
        const fetchData = async () => {
            const orgData = await mockApi.getVerificationCentreByName(decodedOrgName);
            const providerData =  await mockApi.getUnverifiedProvidersForOrg(decodedOrgName);

            console.log('Fetching data for org:', decodedOrgName, 'and docType:', decodedDocType);
            console.log('orgData -> ', orgData);
            console.log('providerData -> ', providerData);

            setOrganisation(orgData || null);
            setProviders(providerData);
            setSelectedProviders(providerData.map(p => p.id));
        };
        fetchData();
    }, [decodedOrgName]);

    const handleGenerateEmail = () => {
        const selectedProviderDetails = providers
            .filter(p => selectedProviders.includes(p.id))
            .map(p => `- ${p.name} (ID: ${p.providerId}, NPI: ${p.npi})`)
            .join('\n');

        const body = `Subject: Provider Verification Request for ${decodedDocType}

Dear ${decodedOrgName},

We are writing to request primary source verification for the following providers regarding their ${decodedDocType}:
${selectedProviderDetails}

Attached are the signed releases. Please let us know if you require any further information.

Thank you,
Credentialing Department`;
        
        setEmailBody(body);
        setIsEmailDialogOpen(true);
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedProviders(checked ? providers.map(p => p.id) : []);
    };
    
    const handleSelectRow = (providerId: string, checked: boolean) => {
        if (checked) {
            setSelectedProviders([...selectedProviders, providerId]);
        } else {
            setSelectedProviders(selectedProviders.filter(id => id !== providerId));
        }
    };

    const isAllSelected = selectedProviders.length > 0 && selectedProviders.length === providers.length;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/verification-centres"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Verification Centres</Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Pending Verifications for <span className="text-primary">{decodedOrgName}</span></h1>
        <p className="text-muted-foreground">Document Type: <span className="font-semibold">{decodedDocType}</span></p>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Unverified Providers</CardTitle>
                <CardDescription>
                    Select providers to include in the verification request.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                  checked={isAllSelected}
                                  onCheckedChange={handleSelectAll}
                                  aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead>Provider Name</TableHead>
                            <TableHead>Provider ID</TableHead>
                            <TableHead>NPI</TableHead>
                            <TableHead>Market</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {providers.map((provider) => (
                            <TableRow key={provider.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedProviders.includes(provider.id)}
                                        onCheckedChange={(checked) => handleSelectRow(provider.id, !!checked)}
                                        aria-label={`Select ${provider.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{provider.name}</TableCell>
                                <TableCell>{provider.providerId}</TableCell>
                                <TableCell>{provider.npi}</TableCell>
                                <TableCell>{provider.market}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1"><FileDown className="h-4 w-4" /> Generate Excel</Button>
                <Button size="sm" className="h-8 gap-1" onClick={handleGenerateEmail} disabled={selectedProviders.length === 0}><Mail className="h-4 w-4" /> Generate Email for Selected</Button>
            </CardFooter>
        </Card>

       <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
            <DialogTitle>Draft Email to {decodedOrgName}</DialogTitle>
            <DialogDescription>
                Review and send the verification request email.
            </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Textarea
                    rows={15}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Send Email</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </div>
  );
}
