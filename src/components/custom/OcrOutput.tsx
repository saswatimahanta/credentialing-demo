import { Badge } from "@/components/ui/badge";

export const OcrOutput = ({ data, type, providerName, specialty }: { data: any; type: string; providerName?: string; specialty?: string; }) => {



    if (!data) return <p className="text-sm text-muted-foreground">No OCR data available</p>;
    const t = (type || '').toLowerCase();
    if (t === "dea") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Registrant Name:</strong> {data["Registrant Name"] || 'N/A'}</p>
                <p><strong>DEA Registration Number:</strong> {data["DEA Registration Number"] || 'N/A'}</p>
                <p><strong>Business Address:</strong> {data["Business Address"] || 'N/A'}</p>
                <p><strong>Controlled Substance Schedules:</strong> {data["Controlled Substance Schedules"] || 'N/A'}</p>
                <p><strong>Business Activity:</strong> {data["Business Activity"] || 'N/A'}</p>
                <p><strong>Issue Date:</strong> {data["Issue Date"] || 'N/A'}</p>
                <p><strong>Expiration Date:</strong> {data["Expiration Date"] || 'N/A'}</p>
            </div>
        );
    }
    if (t === "sanctions") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Sanction Status:</strong> {data["Sanction Status"] || 'N/A'}</p>
                <p><strong>Sanction Details:</strong> {data["Sanction Details"] || 'N/A'}</p>
                <p><strong>Comment 1:</strong> {data["Comment 1"] || 'N/A'}</p>
                <p><strong>Comment 2:</strong> {data["Comment 2"] || 'N/A'}</p>
                <p><strong>NPI:</strong> {data["NPI"] || 'N/A'}</p>
                <p><strong>Provider Name:</strong> {data["Provider Name"] || 'N/A'}</p>
            </div>
        );
    }
    if (t === "cv") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Provider Name:</strong> {data["Provider Name"] || 'N/A'}</p>
                <p><strong>Medical Education:</strong> {data["Medical Education"] || 'N/A'}</p>
                <p><strong>Postgraduate Training:</strong> {data["Postgraduate Training"] || 'N/A'}</p>
                <p><strong>Board Certification:</strong> {data["Board Certification"] || 'N/A'}</p>
                <p><strong>Most Recent Work History:</strong> {data["Most Recent Work History"] || 'N/A'}</p>
            </div>
        );
    }
    if (t === "malpractice_insurance") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>Insured Name:</strong> {data["Insured Name"] || 'N/A'}</p>
                <p><strong>Insurer Name:</strong> {data["Insurer Name"] || 'N/A'}</p>
                <p><strong>Policy Number:</strong> {data["Policy Number"] || 'N/A'}</p>
                <p><strong>Policy Effective Date:</strong> {data["Policy Effective Date"] || 'N/A'}</p>
                <p><strong>Policy Expiration Date:</strong> {data["Policy Expiration Date"] || 'N/A'}</p>
                <p><strong>Liability Limit (Per Claim):</strong> {data["Liability Limit (Per Claim)"] || 'N/A'}</p>
                <p><strong>Liability Limit (Aggregate):</strong> {data["Liability Limit (Aggregate)"] || 'N/A'}</p>
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
                <p><strong>abmsuid:</strong> 813890 <Badge variant="outline" className="ml-2">99%</Badge></p>
                <p><strong>Name:</strong> Munther Ayed Hijazin <Badge variant="outline" className="ml-2">98%</Badge></p>
                <p><strong>DOB:</strong> 1988 <Badge variant="outline" className="ml-2">95%</Badge></p>
                <p><strong>Education:</strong> MD (Doctor of Medicine) <Badge variant="outline" className="ml-2">94%</Badge></p>
                <p><strong>Address:</strong> Simi Valley, CA 93063-6321 (United States) <Badge variant="outline" className="ml-2">90%</Badge></p>
                <p><strong>Certification Board:</strong> American Board of Psychiatry & Neurology <Badge variant="outline" className="ml-2">93%</Badge></p>
                <p><strong>Certification Type:</strong> Neurology - General <Badge variant="outline" className="ml-2">92%</Badge></p>
                <p><strong>Status:</strong> active <Badge variant="outline" className="ml-2">96%</Badge></p>
                <p><strong>Duration:</strong> MOC <Badge variant="outline" className="ml-2">89%</Badge></p>
                <p><strong>Occurrence:</strong> Recertification <Badge variant="outline" className="ml-2">88%</Badge></p>
                <p><strong>Start Date:</strong> 10/30/2017 <Badge variant="outline" className="ml-2">91%</Badge></p>
                <p><strong>End Date:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Reverification Date:</strong> 3/1/2026 <Badge variant="outline" className="ml-2">90%</Badge></p>
                <p><strong>Participating in MOC:</strong> TRUE <Badge variant="outline" className="ml-2">100%</Badge></p>
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
                <p><strong>Recipient Name:</strong> {providerName || 'N/A'} <Badge variant="outline" className="ml-2">94%</Badge></p>
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
