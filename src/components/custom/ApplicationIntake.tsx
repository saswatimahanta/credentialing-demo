'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Mail, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from '../ui/alert';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const intakeModes = [
  { name: 'Roster Intake', icon: LinkIcon, default: false, description:'Upload rosters directly'},
  { name: 'Manual Entry', icon: FileText, default: true, description: 'Enter data field by field.'},
  { name: 'Bulk Documents Upload', icon: LinkIcon, default: false, description:'Upload documents for multiple providers at once' },
  { name: 'Enrollment Form Intake', icon: LinkIcon, default: false, description: "Upload and extract data from a provider's forms" },
  { name: 'CAQH Integration', icon: Upload, default: false, description: 'Pull data from CAQH ProView.' },
  { name: 'Email Parsing', icon: Mail, default: false, description:'Extract from email attachments.'},
  { name: 'Availity API', icon: LinkIcon, default: false, description:'Sync directly via Availity.' },
];

interface ApplicationIntakeProps {
  onRosterIntakeComplete?: () => void;
  onBulkDocumentIntakeComplete?: ()=> void
}

export default function ApplicationIntake({ onRosterIntakeComplete, onBulkDocumentIntakeComplete }: ApplicationIntakeProps) {
  const [selectedMode, setSelectedMode] = useState('Roster Intake');
  const [rosterFile, setRosterFile] = useState<File | null>(null);
  const { toast } = useToast(); // Destructure correctly
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterSuccess, setRosterSuccess] = useState(false);
  const [multipleFiles, setMultipleFiles] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkSuccess, setBulkSuccess] = useState(false)

  const openIntakeFormUrl = async () => {
    const id = uuidv4();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      await axios.post(`${API_BASE_URL}/api/forms/create-form`, {
        formId: id,
        typeForm: 'manual',
      });

      const url = `${window.location.origin}/applications/intake/form?formId=${id}`;
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize form. Please try again.",
      });
    }
  };

  const copyFormUrl = async () => {
    const id = uuidv4();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      await axios.post(`${API_BASE_URL}/api/forms/create-form`, {
        formId: id,
        typeForm: 'manual',
      });

      const url = `${window.location.origin}/applications/intake/form?formId=${id}&embed=true`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Form link copied to clipboard!",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to create sharable form link.",
      });
    }
  };

  const uploadExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.[0]) return;

    const file = files[0];

    if (file) {
      setRosterFile(file);
      setRosterSuccess(false);
    }
  };

  const uploadMultipleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files); // convert FileList → array
    setMultipleFiles(selectedFiles);
    setBulkSuccess(false)
    // 👉 You could also send them to a backend here using FormData
  };
  const processBulkFiles = () => {
    setBulkLoading(true)
    setBulkSuccess(false)

    setTimeout(() => {
      onBulkDocumentIntakeComplete?.()
      setBulkLoading(false)
      setBulkSuccess(true)
    }, 2000)
  }
  const processRosterFile = async () => {
    if (!rosterFile) return;

    setRosterLoading(true);
    setRosterSuccess(false);

    try {
      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post(`${API_BASE_URL}/api/applications`, {
        providerId: `${Date.now()}_002`,
        formId: uuidv4(),
        name: 'Dr. Sarah Johnson',
        providerLastName: 'Lautner',
        npi: uuidv4(),
        email: 'saswati.mahanta@hilabs.com',
        phone: '1234567890',
        specialty: 'Internal Medicine',
        address: 'Somewhere in the world',
        source: "Roster Intake",
        status: "New",
        market: "CA",
        assignee: "Barry Allen",
        progress: 29,
      });
      await axios.post(`${API_BASE_URL}/api/applications`, {
        providerId: `dr_roster_${Date.now()}_001`,
        formId: uuidv4(),
        name: 'Dr. Michael Chen',
        providerLastName: 'Doe',
        npi: uuidv4(),
        email: 'saswati.mahanta@hilabs.com',
        phone: '1234567890',
        specialty: 'Intal Medicine',
        address: 'Somewhere in the world',
        source: "Roster Intake",
        status: "New",
        market: "CA",
        assignee: "Barry Allen",
        progress: 98,
      });

      setRosterSuccess(true);
      setRosterFile(null);

      // Reset file input
      const fileInput = document.getElementById('roster-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      // Notify parent that roster intake completed so it can refresh / reveal records
      onRosterIntakeComplete?.();

    } catch (error) {
      console.error('Error processing roster file:', error);
    } finally {
      setRosterLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex w-[66rem] p-3 overflow-auto space-x-6">
        {intakeModes.map((mode) => (
          <Card key={mode.name} className={`cursor-pointer hover:shadow-lg transition-shadow min-w-[15rem] ${selectedMode === mode.name ? 'border-primary ring-2 ring-primary' : ''}`} onClick={() => setSelectedMode(mode.name)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">{mode.name}</CardTitle>
              <mode.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {mode.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {selectedMode === 'Manual Entry' && (
          <Card className="text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Provider Application Intake</CardTitle>
              <CardDescription>Begin the credentialing process by filling out the provider application form.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={openIntakeFormUrl}>
                Start Filling Application <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">or</p>
              <Button variant="link" className="mt-2" onClick={copyFormUrl}>
                Share Web Form Link with Provider
              </Button>
            </CardContent>
          </Card>
        )}
        {selectedMode === 'Roster Intake' && (
          <Card className="text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Roster Automation Intake</CardTitle>
              <CardDescription>
                Upload your roster automation Excel file to automatically process and add
                provider applications to the credentialing system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="npi-upload-id"
                type="file"
                className="hidden"
                onChange={uploadExcelFile}
              />
              <label
                htmlFor="npi-upload-id"
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white cursor-pointer hover:bg-primary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </label>
              {rosterFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Uploaded: {rosterFile?.name}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-4"></p>
              <Button variant="link" className="mt-2" onClick={processRosterFile}>
                Process Roster File
              </Button>

              {rosterLoading && (
                <div>
                  <p>
                    Processing roster file and creating provider applications...
                  </p>
                </div>
              )}

              {rosterSuccess && (
                <div className='bg-green-100 text-left p-4 rounded-md'>
                  <p className='font-bold'>
                    Roster Processing Complete!
                  </p>
                  <p>
                    Successfully added 2 provider applications from the roster file:
                  </p>
                  <br />
                  <ul>
                    <li>Dr. Sarah Johnson - Internal Medicine</li>
                    <li>Dr. Michael Chen - Cardiology</li>
                  </ul>
                  <br />
                  <p>
                    You can now view these applications in the Applications tab.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedMode === 'Bulk Documents Upload' && (
          <Card className="text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Bulk Upload Documents</CardTitle>
              <CardDescription>Upload documents for multiple providers at once</CardDescription>
            </CardHeader>
            <CardContent>
             <Input
                id="npi-upload-id"
                type="file"
                className="hidden"
                multiple
                onChange={uploadMultipleFiles}
              />
              <label
                htmlFor="npi-upload-id"
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white cursor-pointer hover:bg-primary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </label>
                {multipleFiles.length>0 && <p className="text-sm text-muted-foreground mt-2">
                  Uploaded: {multipleFiles.map((f) => f?.name).join(", ")}
                </p>}
                <Button variant="link" className="mt-2" onClick={processBulkFiles}>
                  Process Bulk Files
                </Button>
                {bulkLoading && (
                  <div>
                    <p>
                      Processing files and creating provider applications...
                    </p>
                  </div>
                )}

                {bulkSuccess && (
                  <div className='bg-green-100 text-left p-4 rounded-md'>
                    <p className='font-bold'>
                      Bulk Document Upload Complete!
                    </p>
                    <p>
                      Successfully added 2 provider applications processed from the documents:
                    </p>
                    <br />
                    <ul>
                      <li>Dr. Roger Tran - Family Medicine</li>
                      <li>Dr. Ahmed Alsadek - Internal Medicine</li>
                    </ul>
                    <br />
                    <p>
                      You can now view these applications in the Applications tab.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {selectedMode !== 'Manual Entry' && selectedMode !== 'Roster Intake' && selectedMode !== 'Bulk Documents Upload' && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedMode}</CardTitle>
              <CardDescription>This feature is not yet implemented.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Integration with {selectedMode} is planned for a future release.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
