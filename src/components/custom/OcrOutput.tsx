import { Badge } from "@/components/ui/badge";
import { randomUUID } from "crypto";

export const OcrOutput = ({ data, type, provider, specialty }: { data: any; type: string; provider?: {providerName: 'string', providerAddress: 'string', providerSpecialty: 'string'}; specialty?: string; }) => {

    if (!data) return <p className="text-sm text-muted-foreground">No OCR data available</p>;
    const t = (type || '').toLowerCase();
    if (t === "dea") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Registrant Name:</strong> {provider?.providerName || 'In Progress'}</p>
                <p><strong>DEA Registration Number:</strong> {Math.random().toString(36).substring(2, 16).toUpperCase()}</p>
                <p><strong>Business Address:</strong> {provider?.providerAddress || 'In Progress'}</p>
                <p><strong>Controlled Substance Schedules:</strong> II, III, IV, V</p>
                <p><strong>Business Activity:</strong> {provider?.providerSpecialty}</p>
                <p><strong>Issue Date:</strong> 01-26-2021</p>
                <p><strong>Expiration Date:</strong> 01-26-2027</p>
            </div>
        );
    }
    if (t === "sanctions") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Sanction Status:</strong> {data["Sanction Status"] || 'N/A'}</p>
                <p><strong>Sanction Details:</strong> {data["Sanction Details"] || 'N/A'}</p>
                {Boolean(data["Comment 1"]) && (<p><strong>Comment 1:</strong> {data["Comment 1"]}</p>)}
                {Boolean(data["Comment 2"]) && (<p><strong>Comment 2:</strong> {data["Comment 2"]}</p>)}
                <p><strong>NPI:</strong> {data["NPI"] || 'N/A'}</p>
                <p><strong>Provider Name:</strong> {data["Provider Name"] || 'N/A'}</p>
            </div>
        );
    }
    if (t === "cv") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Provider Name:</strong> {provider?.providerName || 'N/A'}</p>
                <p><strong>Medical Education:</strong> University of Washington</p>
                <p><strong>Postgraduate Training:</strong> Residency: University of Washington Medical Center, {provider?.providerSpecialty}</p>
                <p><strong>Board Certification:</strong> American Board of {provider?.providerSpecialty}, Certified</p>
                <p><strong>Most Recent Work History:</strong> Harborview Medical Center, Emergency Physician</p>
            </div>
        );
    }
    if (t === "malpractice_insurance") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Insured Name:</strong> {provider?.providerName|| 'In Progress'}</p>
                <p><strong>Insurer Name:</strong> Frankenmuth Mutual Ins. Co.</p>
                <p><strong>Policy Number:</strong> {Math.random().toString(36).substring(2, 16).toUpperCase()}</p>
                <p><strong>Policy Effective Date:</strong> 07/07/2021</p>
                <p><strong>Policy Expiration Date:</strong> 07/07/2026</p>
                <p><strong>Liability Limit (Per Claim):</strong> $1,000,000</p>
                <p><strong>Liability Limit (Aggregate):</strong> $3,000,000</p>
            </div>
        );
    }
    if (t === "dl") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>First Name:</strong> {data.fn || 'N/A'} <Badge variant="outline" className="ml-2">{(data.fn_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Last Name:</strong> {data.ln || 'N/A'} <Badge variant="outline" className="ml-2">{(data.ln_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>DL Number:</strong> {data.dl || 'N/A'} <Badge variant="outline" className="ml-2">{(data.dl_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Date of Birth:</strong> {data.dob || 'N/A'} <Badge variant="outline" className="ml-2">{(data.dob_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Expiry Date:</strong> {data.exp || 'N/A'} <Badge variant="outline" className="ml-2">{(data.exp_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                {/* <p><strong>Class:</strong> {data.class || 'N/A'} <Badge variant="outline" className="ml-2">{(data.class_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Sex:</strong> {data.sex || 'N/A'} <Badge variant="outline" className="ml-2">{(data.sex_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Hair:</strong> {data.hair || 'N/A'} <Badge variant="outline" className="ml-2">{(data.hair_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Eyes:</strong> {data.eyes || 'N/A'} <Badge variant="outline" className="ml-2">{(data.eyes_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Height:</strong> {data.hgt || 'N/A'} <Badge variant="outline" className="ml-2">{(data.hgt_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Weight:</strong> {data.wgt || 'N/A'} <Badge variant="outline" className="ml-2">{(data.wgt_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p> */}
            </div>
        );
    }

    if (t === "npi") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>NPI:</strong> {data.npi || 'N/A'} <Badge variant="outline" className="ml-1">{(data.npi_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p className="flex"><strong>Enumeration Date:</strong> {data["Enumeration Date"] || 'N/A'} <Badge variant="outline" className="ml-1">{(data["Enumeration_Date_confident_score"] * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Status:</strong> {data.Status || 'N/A'} <Badge variant="outline" className="ml-2">{(data["Status_confident_score"] * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Primary Practice Address:</strong> {data["Primary Practice Address"] || 'N/A'} <Badge variant="outline" className="ml-1">{(data["Primary_Practice_Address_confident_score"] * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
            </div>
        );
    }

    if (t === "passport") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>First Name:</strong> {data.fn || 'N/A'} <Badge variant="outline" className="ml-2">{(data.fn_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Last Name:</strong> {data.ln || 'N/A'} <Badge variant="outline" className="ml-2">{(data.ln_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Passport Number:</strong> {data.dl || 'N/A'} <Badge variant="outline" className="ml-2">{(data.dl_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
            </div>
        );
    }

    if (t === "degree") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>License Type</strong> {data.type || 'N/A'} <Badge variant="outline" className="ml-2">{(data.type_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>IssueDate</strong> {data.issueDate || 'N/A'} <Badge variant="outline" className="ml-2">{(data.issueDate_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Institution</strong> {data.institution || 'N/A'} <Badge variant="outline" className="ml-1">{(data.institution_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Specialty</strong> {specialty || data.specialty || 'N/A'}</p>
            </div>
        );
    }

    // ABMS Board Certification mock (board_certification)
    if (t === "board_certification") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>abmsuid:</strong> {data?.abmsuid || 'N/A'} <Badge variant="outline" className="ml-2">99%</Badge></p>
                <p><strong>Name:</strong> {data?.abms_name || 'N/A'} <Badge variant="outline" className="ml-2">98%</Badge></p>
                <p><strong>DOB:</strong> {data?.abms_dob || 'N/A'} <Badge variant="outline" className="ml-2">95%</Badge></p>
                <p><strong>Education:</strong> {data?.abms_education || 'N/A'} <Badge variant="outline" className="ml-2">94%</Badge></p>
                <p><strong>Address:</strong> {data?.abms_address || 'N/A'} <Badge variant="outline" className="ml-2">90%</Badge></p>
                <p><strong>Certification Board:</strong> {data?.abms_certification_board || 'N/A'} <Badge variant="outline" className="ml-2">93%</Badge></p>
                <p><strong>Certification Type:</strong> {data?.abms_certification_type}<Badge variant="outline" className="ml-2">92%</Badge></p>
                <p><strong>Status:</strong> {data?.abms_status || 'N/A'} <Badge variant="outline" className="ml-2">96%</Badge></p>
                <p><strong>Duration:</strong> {data?.abms_duration || 'N/A'} <Badge variant="outline" className="ml-2">89%</Badge></p>
                <p><strong>Occurrence:</strong> {data?.abms_occurence || 'N/A'} <Badge variant="outline" className="ml-2">88%</Badge></p>
                <p><strong>Start Date:</strong> 10/30/2017 <Badge variant="outline" className="ml-2">91%</Badge></p>
                <p><strong>End Date:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Reverification Date:</strong> 3/1/2026 <Badge variant="outline" className="ml-2">90%</Badge></p>
                <p><strong>Participating in MOC:</strong> {data?.abms_participating_in_moc} <Badge variant="outline" className="ml-2">100%</Badge></p>
            </div>
        );
    }

    // License Board (license_board) — sourced from API ocrData
    if (t === "license_board") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>License:</strong> {data["LicenseBoard_ExtractedLicense"] ?? 'N/A'}</p>
                <p><strong>Name:</strong> {data["LicenseBoard_Extracted_Name"] ?? 'N/A'}</p>
                <p><strong>License Type:</strong> {data["LicenseBoard_Extracted_License_Type"] ?? 'N/A'}</p>
                <p><strong>Primary Status:</strong> {data["LicenseBoard_Extracted_Primary_Status"] ?? 'N/A'}</p>
                <p><strong>Specialty:</strong> {data["LicenseBoard_Extracted_Specialty"] ?? 'N/A'}</p>
                <p><strong>Qualification:</strong> {data["LicenseBoard_Extracted_Qualification"] ?? 'N/A'}</p>
                <p><strong>School Name:</strong> {data["LicenseBoard_Extracted_School_Name"] ?? 'N/A'}</p>
                <p><strong>Graduation Year:</strong> {data["LicenseBoard_Extracted_Graduation_Year"] ?? 'N/A'}</p>
                <p><strong>Previous Names:</strong> {data["LicenseBoard_Extracted_Previous_Names"] ?? 'N/A'}</p>
                <p><strong>Address:</strong> {data["LicenseBoard_Extracted_Address"] ?? 'N/A'}</p>
                <p><strong>Issuance Date:</strong> {data["LicenseBoard_Extracted_Issuance_Date"] ?? 'N/A'}</p>
                <p><strong>Expiration Date:</strong> {data["LicenseBoard_Extracted_Expiration_Date"] ?? 'N/A'}</p>
                <p><strong>Current Date/Time:</strong> {data["LicenseBoard_Extracted_Current_Date_Time"] ?? 'N/A'}</p>
                <p><strong>Professional URL:</strong> {data["LicenseBoard_Extracted_Professional_Url"] ?? 'N/A'}</p>
                <p><strong>Disciplinary Actions:</strong> {data["LicenseBoard_Extracted_Disciplinary_Actions"] ?? 'N/A'}</p>
                <p><strong>Public Record Actions:</strong> {data["LicenseBoard_Extracted_Public_Record_Actions"] ?? 'N/A'}</p>
            </div>
        );
    }

    // Medical Training Certificate mock
    if (t === "medical_training_certificate") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>University / Issuer:</strong> University of California <Badge variant="outline" className="ml-2">95%</Badge></p>
                <p><strong>Campus:</strong> Irvine <Badge variant="outline" className="ml-2">96%</Badge></p>
                <p><strong>Recipient Name:</strong> {provider?.providerName || 'N/A'} <Badge variant="outline" className="ml-2">94%</Badge></p>
                <p><strong>Degree:</strong> Doctor of Psychology <Badge variant="outline" className="ml-2">93%</Badge></p>
                <p><strong>Field of Study:</strong> Engineering <Badge variant="outline" className="ml-2">90%</Badge></p>
                <p><strong>Date of Conferral:</strong> June 17, 1989 <Badge variant="outline" className="ml-2">91%</Badge></p>
                <p><strong>Signatories:</strong> George Deukmejian, I <Badge variant="outline" className="ml-2">85%</Badge></p>
                <p><strong>Seal Detected:</strong> University of Califon <Badge variant="outline" className="ml-2">80%</Badge></p>
                <p><strong>Document Type:</strong> Degree Certificate <Badge variant="outline" className="ml-2">99%</Badge></p>
            </div>
        );
    }

    // fallback for unknown types
    return (
        <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
            <p><strong>License Type:</strong> {data?.type || 'N/A'} <Badge variant="outline" className="ml-2">{data?.confidence?.type || 'N/A'}%</Badge></p>
            <p><strong>License Number:</strong> {data?.number || 'N/A'} <Badge variant="outline" className="ml-2">{data?.confidence?.number || 'N/A'}%</Badge></p>
            <p><strong>Issue Date:</strong> {data?.issueDate || 'N/A'} <Badge variant="outline" className="ml-2">{data?.confidence?.issueDate || 'N/A'}%</Badge></p>
            <p><strong>Expiry Date:</strong> {data?.expiryDate || 'N/A'} <Badge variant="outline" className="ml-2">{data?.confidence?.expiryDate || 'N/A'}%</Badge></p>
        </div>
    );
};
