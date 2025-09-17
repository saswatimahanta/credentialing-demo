import { Badge } from "@/components/ui/badge";

export const OcrOutput = ({ data, type }: { data: any, type: string }) => {



    if (!data) return <p className="text-sm text-muted-foreground">No OCR data available</p>;
    if (type === "dl") {
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

    if (type === "npi") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>NPI:</strong> {data.npi || 'N/A'} <Badge variant="outline" className="ml-1">{(data.npi_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p className="flex"><strong>Enumeration Date:</strong> {data["Enumeration Date"] || 'N/A'} <Badge variant="outline" className="ml-1">{(data["Enumeration_Date_confident_score"] * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Status:</strong> {data.Status || 'N/A'} <Badge variant="outline" className="ml-2">{(data["Status_confident_score"] * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Primary Practice Address:</strong> {data["Primary Practice Address"] || 'N/A'} <Badge variant="outline" className="ml-1">{(data["Primary_Practice_Address_confident_score"] * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
            </div>
        );
    }

    if (type === "passport") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>First Name:</strong> {data.fn || 'N/A'} <Badge variant="outline" className="ml-2">{(data.fn_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Last Name:</strong> {data.ln || 'N/A'} <Badge variant="outline" className="ml-2">{(data.ln_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Passport Number:</strong> {data.dl || 'N/A'} <Badge variant="outline" className="ml-2">{(data.dl_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
            </div>
        );
    }

    if (type === "degree") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>License Type</strong> {data.type || 'N/A'} <Badge variant="outline" className="ml-2">{(data.type_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>IssueDate</strong> {data.issueDate || 'N/A'} <Badge variant="outline" className="ml-2">{(data.issueDate_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
                <p><strong>Institution</strong> {data.institution || 'N/A'} <Badge variant="outline" className="ml-1">{(data.institution_confident_score * 100)?.toFixed(0) || 'N/A'}%</Badge></p>
            </div>
        );
    }

    // ABMS Board Certification mock (board_certification)
    if (type === "board_certification") {
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

    // License Board mock (license_board)
    if (type === "license_board") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>License:</strong> A 64753 <Badge variant="outline" className="ml-2">97%</Badge></p>
                <p><strong>Name:</strong> HIJAZIN, MUNTHER A <Badge variant="outline" className="ml-2">97%</Badge></p>
                <p><strong>License Type:</strong> Physician and Surgeon A <Badge variant="outline" className="ml-2">95%</Badge></p>
                <p><strong>Primary Status:</strong> License Renewed & Current <Badge variant="outline" className="ml-2">96%</Badge></p>
                <p><strong>Specialty:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Qualification:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>School Name:</strong> University of Sassari Faculty of Medicine and Surgery <Badge variant="outline" className="ml-2">93%</Badge></p>
                <p><strong>Graduation Year:</strong> 1988 <Badge variant="outline" className="ml-2">94%</Badge></p>
                <p><strong>Previous Names:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Address:</strong> 10916 Downey Ave DOWNEY CA 90241-3709 LOS ANGELES county <Badge variant="outline" className="ml-2">90%</Badge></p>
                <p><strong>Issuance Date:</strong> 3-Apr-98 <Badge variant="outline" className="ml-2">92%</Badge></p>
                <p><strong>Expiration Date:</strong> 31-Jan-26 <Badge variant="outline" className="ml-2">92%</Badge></p>
                <p><strong>Current Date/Time:</strong> August 7, 2025 9:5:35 AM <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Professional URL:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Disciplinary Actions:</strong> N/A <Badge variant="outline" className="ml-2">--</Badge></p>
                <p><strong>Public Record Actions:</strong> Administrative Disciplinary Actions (NO INFORMATION TO MEET THE CRITERIA FOR POSTING) <Badge variant="outline" className="ml-2">88%</Badge></p>
            </div>
        );
    }

    // Medical Training Certificate mock
    if (type === "MEDICAL_TRAINING_CERTIFICATE") {
        return (
            <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
                <p><strong>University / Issuer:</strong> University of California <Badge variant="outline" className="ml-2">95%</Badge></p>
                <p><strong>Campus:</strong> Irvine <Badge variant="outline" className="ml-2">96%</Badge></p>
                <p><strong>Recipient Name:</strong> Munther A Hijazin <Badge variant="outline" className="ml-2">94%</Badge></p>
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
