'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Mail, Link as LinkIcon, Share2, ArrowRight, Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const steps = ["Provider Info", "Education & Training", "Work History", "Licenses & Certs", "Additional Details", "Review", "Submitted"];
const emptyFormData = {
  providerId: "",
  providerName: "",
  providerLastName: "",
  npi: "",
  dob: "",
  email: "",
  phone: "",
  specialty: "",
  address: "",
  degreeType: "",
  university: "",
  year: "",
  experience: "",
  lastOrg: "",
  "work-history-desc": "",
  "dl-number": "",
  "ml-number": "",
  "other-name": "",
  "additional-info": "",
  "info-correct": false,
  "consent-verification": false,
  "training-type": "",
  "dl-upload-id": "",
  "npi-upload-id": "",
  "degree-upload-id": "",
  "training-upload-id": "",
  "cv-upload-id": "",
  "work-history-upload-id": "",
  "ml-upload-id": "",
  "other-upload-id": "",
  "malpractice-upload-id": "",
};

export default function ManualEntryForm() {
  type UploadFileEntry = {
    fileType: string;
    filename: string | null;
    fileId?: string | null;
    status?: string;
    progress?: number;
  };
  type UploadFileMap = Record<string, UploadFileEntry>;
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const formId: string = searchParams?.get('formId') || '';
  const [formData, setFormData] = useState(emptyFormData);

  const [uploadFileData, setUploadFileData] = useState<UploadFileMap>({});
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "A shareable link to this form has been copied to your clipboard.",
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (!files?.[0]) return;

    const file = files[0];
    const fileType = id.replace("-upload-id", ""); // e.g., 'degree'

    const formDataToSend = new FormData();
    formDataToSend.append("formId", formId);
    formDataToSend.append("fileType", fileType);
    formDataToSend.append("file", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/forms/upload-file`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update uploadFileData so the filename shows up
      setUploadFileData((prev) => ({
        ...prev,
        [fileType]: {
          fileType: fileType,
          filename: res.data.filename,
          fileId: res.data.fileId,
        },
      }));

      // Also store file in formData
      setFormData((prev) => ({ ...prev, [id]: res.data.fileId }));

      toast({ title: "Success", description: "File uploaded successfully!" });
    } catch (error) {
      console.error("File upload failed", error);
      toast({ title: "Error", description: "File upload failed" });
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/forms/save-form`, {
        formId,
        typeForm: 'manual',
        data: formData,
      });
      toast({ title: "Saved!", description: "Form data has been saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save form." });
    }
  };

  const handleSubmit = async () => {
    try {
      await handleSave();

      const response = await axios.post(`${API_BASE_URL}/api/applications`, {
        providerId: '12345678',
        formId: formId,
        name: formData.providerName,
        providerLastName: formData.providerLastName,
        npi: formData.npi,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        address: formData.address,
        source: "Manual Entry",
        status: "New",
        market: "CA",
        assignee: "Barry Allen",
        progress: 10,
      });


      handleNext()

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Submission failed.",
      });
    }
  };

  useEffect(() => {
    // Map normalized backend keys to our client-side keys used in UI
    const mapKeyToClientKey = (key: string): string => {
      const k = key?.toUpperCase();
      const mapping: Record<string, string> = {
        'MEDICAL_TRAINING_CERTIFICATE': 'training',
        'TRAINING': 'training',
        'BOARD_CERTIFICATION': 'board_certification',
        'LICENSE_BOARD': 'license_board',
        'CV': 'cv',
        'RESUME': 'cv',
        'CURRICULUM_VITAE': 'cv',
        'NPI': 'npi',
        'DEGREE': 'degree',
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

    // Convert API files shape to our expected map with fileType + filename
    const normalizeFiles = (files: any) => {
      if (!files) return {} as any;
      const entries: Array<[string, any]> = Array.isArray(files)
        ? files.map((f: any) => [f.fileType || f.type || 'unknown', f])
        : Object.entries(files);
      const out: any = {};
      for (const [rawKey, f] of entries) {
        const clientKey = mapKeyToClientKey(f?.fileType || rawKey);
        out[clientKey] = {
          fileType: clientKey,
          filename: f?.filename ?? null,
          fileId: f?.fileId ?? null,
          status: f?.status ?? 'Pending',
          progress: typeof f?.progress === 'number' ? f.progress : 0,
        };
      }
      return out;
    };

    const fetchDocUploadNameData = async (uploadIds: any) => {
      if (!formId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/forms/upload-info`, {
          params: { 'formId': formId, 'uploadIds': uploadIds.join(',') },
        });

        const normalized = normalizeFiles(res.data?.files);
        setUploadFileData(normalized);
      } catch (error) {
        console.error("Error fetching upload docs info:", error);
        toast({ title: "Error", description: "Failed to load upload docs info" });
      } finally {
        setLoading(false);
      }
    };

    const fetchFormData = async () => {
      if (!formId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/forms/`, {
          params: { 'formId': formId },
        });
        setFormData(res.data);

        const uploadIds = Object.entries(res.data)
          .filter(([key, _]) => key.endsWith('-upload-id'))
          .map(([_, value]) => value);

        fetchDocUploadNameData(uploadIds);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load form data." });
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  useEffect(() => {
    console.log("uploadFileData updated:", uploadFileData);
  }, [uploadFileData]);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{steps[currentStep]}</CardTitle>
            <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share Form</Button>
        </div>
        <div className="pt-4">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {steps.map((step, index) => (
              <span key={step} className={`text-center ${index <= currentStep ? 'font-semibold text-primary' : ''}`}>{step}</span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="providerName">First Name</Label>
              <Input id="providerName" value={formData.providerName || ''} onChange={handleChange} placeholder="e.g., John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="providerLastName">Last Name</Label>
              <Input id="providerLastName" value={formData.providerLastName || ''} onChange={handleChange} placeholder="e.g., Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" value={formData.specialty || ''} onChange={handleChange} placeholder="e.g., Cardiology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input id="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g., abc@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone || ''} onChange={handleChange} placeholder="e.g., 09121938432 " />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={formData.dob || ''} onChange={handleChange} placeholder="Enter date of birth" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address || ''} onChange={handleChange} placeholder="e.g., 123 Health St, Medville, CA 90210" />
            </div>
            <hr className="space-y-2 md:col-span-2" />
            <div className="space-y-2">
              <Label htmlFor="npi">NPI</Label>
              <Input id="npi" value={formData.npi || ''} onChange={handleChange} placeholder="e.g., 1234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="npi-upload-id">Upload NPI receipt</Label>
              <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="npi-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
              {uploadFileData['npi']?.filename && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadFileData['npi']?.filename}
                </p>
              )}
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><h3 className="font-semibold">Degree Information</h3></div>
            <div className="space-y-2">
              <Label htmlFor="degreeType">Degree Type</Label>
              <Select onValueChange={(value) => handleSelectChange('degreeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" defaultValue={formData.degreeType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="do">DO</SelectItem>
                  <SelectItem value="mbbs">MBBS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input id="university" value={formData.university || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year of Graduation</Label>
              <Input id="year" value={formData.year || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree-upload-id">Upload Degree Certificate</Label>
              <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="degree-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
              {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'degree')?.filename && (
                <p className="text-sm text-muted-foreground">
                  Selected: {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'degree')?.filename}
                </p>
              )}
            </div>
            <div className="md:col-span-2"><Separator className="my-4" /></div>
            <div className="md:col-span-2"><h3 className="font-semibold">Training Details</h3></div>
            <div className="space-y-2">
              <Label htmlFor="training-type">Certificate Name</Label>
              <Input id="training-type" value={formData['training-type'] || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="training-upload-id">Upload Certificate</Label>
              <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="training-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
              {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'training')?.filename && (
                <p className="text-sm text-muted-foreground">
                  Selected: {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'training')?.filename}
                </p>
              )}
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" value={formData.experience || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastOrg">Last Organization</Label>
              <Input id="lastOrg" value={formData.lastOrg || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cv-upload">Upload CV/Resume</Label>
              <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload CV<Input id="cv-upload" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="work-history-desc">Additional Details</Label>
              <Input id="work-history-desc" value={formData['work-history-desc'] || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="work-history-upload-id">Upload Additional Document</Label>
              <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="work-history-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
              {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'work-history')?.filename && (
                <p className="text-sm text-muted-foreground">
                  Selected: {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'work-history')?.filename}
                </p>
              )}
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
              <h3 className="font-medium text-lg md:col-span-2">Driving License</h3>
              <div className="space-y-2">
                <Label htmlFor="dl-number">License Number</Label>
                <Input id="dl-number" value={formData['dl-number'] || ''} onChange={handleChange} />
              </div>
              <div className="flex items-end">
                <Button variant="secondary" className="w-full">Verify via OTP <Send className="ml-2 h-4 w-4" /></Button>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dl-upload-id">Upload Document</Label>
                <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="dl-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
                {uploadFileData['dl']?.filename && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {uploadFileData['dl']?.filename}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
              <h3 className="font-medium text-lg md:col-span-2">Medical License</h3>
              <div className="space-y-2">
                <Label htmlFor="ml-number">License Number</Label>
                <Input id="ml-number" value={formData['ml-number'] || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ml-upload-id">Upload Document</Label>
                <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="ml-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
                {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'ml')?.filename && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'ml')?.filename}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
              <h3 className="font-medium text-lg md:col-span-2">Other Certificate</h3>
              <div className="space-y-2">
                <Label htmlFor="other-name">Certificate Name</Label>
                <Input id="other-name" value={formData['other-name'] || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other-upload-id">Upload Document</Label>
                <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="other-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
                {Object.values(uploadFileData).find(file => file.fileType === 'other')?.filename && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {
                      Object.values(uploadFileData).find(file => file.fileType === 'other')?.filename
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Malpractice History</h3>
              <div className="space-y-2">
                <Label htmlFor="malpractice-upload-id">Upload Malpractice History Proof</Label>
                <Button asChild variant="outline"><Label className="cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" />Upload File<Input id="malpractice-upload-id" type="file" onChange={handleFileChange} className="hidden" /></Label></Button>
                {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'malpractice')?.filename && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {(Object.values(uploadFileData) as UploadFileEntry[]).find(file => file.fileType === 'malpractice')?.filename}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Additional Details</h3>
              <div className="space-y-2">
                <Label htmlFor="additional-info">Any other relevant information</Label>
                <Input id="additional-info" value={formData['additional-info'] || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}
        {currentStep === 5 && (
          <div className="text-center p-8 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold font-headline mb-4">Final Review & Submission</h2>
            <p className="text-muted-foreground mb-6">Please review all information and confirm your consent before submitting.</p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-2">
                <Checkbox id="info-correct" checked={formData['info-correct'] || false} onCheckedChange={(val) => handleSelectChange('info-correct', Boolean(val))} />
                <Label htmlFor="info-correct" className="text-sm font-normal">I hereby certify that the information provided is true, correct, and complete to the best of my knowledge.</Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="consent-verification" checked={formData['consent-verification'] || false} onCheckedChange={(val) => handleSelectChange('consent-verification', Boolean(val))} />
                <Label htmlFor="consent-verification" className="text-sm font-normal">I authorize FastCred to verify the information provided in this application for credentialing purposes.</Label>
              </div>
            </div>
            <Button size="lg" onClick={handleSubmit} className="mt-8">
              <Check className="mr-2 h-5 w-5" /> Submit Application
            </Button>
          </div>
        )}
        {currentStep === 6 && (
          <div className="text-center p-8 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your application has been submitted. We'll get back to you shortly.
            </p>
            <Check className="h-12 w-12 text-green-500 mx-auto" />
          </div>
        )}
      </CardContent>
      {currentStep != 6 && <CardFooter>
        <div className="flex justify-between w-full">
          <div>
            {currentStep > 0 && <Button variant="outline" onClick={handleBack}>Back</Button>}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleSave}>Save</Button>
            {currentStep < steps.length - 2 && <Button onClick={handleNext}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>}
          </div>
        </div>
      </CardFooter>}
    </Card>
  );
};
