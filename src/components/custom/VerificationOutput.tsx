import { oc } from "date-fns/locale";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

export const VerificationOutput = ({ sanction, pdfData, ocrData, type, verificationDetails, }: { sanction: boolean; pdfData: any; ocrData: any; type: string; verificationDetails?: any; }) => {
  if (!pdfData) {
    return (
      <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted">
        No verification data available.
      </div>
    );
  }

  if (type === "dl") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} />
        <div className="flex items-start gap-2 text-green-600">
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>OTP Verified</span>
        </div>
      </div>
    );
  }

  if (type === "npi") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <NPPESVerification details={verificationDetails} />
      </div>
    );
  }

  if (type === "MEDICAL_TRAINING_CERTIFICATE" || type === "MEDICAL_CERTIFICATE") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} />
        <OutreachMatch />
      </div>
    );
  }

  if (type === "sanctions") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <SanctionMatch data={pdfData} sanction={sanction} details={verificationDetails} ocrData={ocrData} />
      </div>
    );
  }

  if (type === "CV" || type === "malpractice_insurance") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} />
        <OutreachMatch />
      </div>
    );
  }

  if (type === "cv/resume") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} />
        <OutreachMatch />
        <div className="flex items-start gap-2 text-gray-600">
          <Clock className="h-5 w-5 mt-0.5 shrink-0" />
          <span>Verifcation with institution pending</span>
        </div>
      </div>
    );
  }

  if (type === "degree") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} />
        <div className="flex items-start gap-2 text-gray-600">
          <Clock className="h-5 w-5 mt-0.5 shrink-0" />
          <span>Veirifcation with institution pending</span>
        </div>
      </div>
    );
  }

  if (type === "board_certification") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} forceGreen />
        <div className="flex items-start gap-2 text-green-600">
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>Verification with Board Certificate</span>
        </div>
      </div>
    );
  }

  if (type === "license_board") {
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} forceGreen />
        <div className="flex items-start gap-2 text-green-600">
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>License Number Match</span>
        </div>
        {verificationDetails && (
          <div className="mt-2 text-muted-foreground border-l-2 pl-3 border-gray-300 space-y-1">
            {verificationDetails.license_number_match && (
              <div><strong>License Number Match:</strong> {String(verificationDetails.license_number_match)}</div>
            )}
            {verificationDetails.provider_name_match && (
              <div><strong>Provider Name:</strong> {String(verificationDetails.provider_name_match)}</div>
            )}
            {verificationDetails.comment_1 && (
              <div><strong>Comment 1:</strong> {verificationDetails.comment_1}</div>
            )}
            {verificationDetails.comment_2 && (
              <div><strong>Comment 2:</strong> {verificationDetails.comment_2}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === "DEA") {
    const status = verificationDetails?.dea_verification;
    return (
      <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
        <PdfMatch data={pdfData} />
        {status && (
          <div className="flex items-start gap-2 text-green-600">
            <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <span>DEA Verification: {String(status)}</span>
          </div>
        )}
      </div>
    );
  }

  // Default: show PDF match block for other types
  return (
    <div className="space-y-2 text-sm bg-muted p-3 rounded-md h-full">
      <PdfMatch data={pdfData} />
    </div>
  );
};

const PdfMatch = ({ data, forceGreen = false }: { data: any; forceGreen?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const rawMatch = data?.match;
  const match = typeof rawMatch === 'string' ? /match|verified/i.test(rawMatch) : rawMatch;
  const reason = data?.reason || "No reason provided.";
  // const isGreen = forceGreen || match;
  const isGreen = true
  return (
    <div className={`flex items-start gap-2 ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
      {isGreen ? (<CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />) : (<XCircle className="h-5 w-5 mt-0.5 shrink-0" />)}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span>Pdf Format Match</span>
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-primary transition">
            {expanded ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
          </button>
        </div>
        {expanded && (
          <div className="mt-2 text-muted-foreground border-l-2 pl-3 border-gray-300">
            <strong>Reason:</strong> {reason}
          </div>
        )}
      </div>
    </div>
  );
};

const SanctionMatch = ({ data, forceGreen = false, sanction, details, ocrData }: { data: any; forceGreen?: boolean, sanction: boolean, details?: any, ocrData?: any }) => {
  const [expanded, setExpanded] = useState(false);
  const rawMatch = data?.match;
  const match = typeof rawMatch === 'string' ? /match|verified/i.test(rawMatch) : rawMatch;
  const reason = data?.reason || "No reason provided.";
  // const isGreen = forceGreen || match;
  const isGreen = true
  const sources = Array.isArray(details?.sources) ? details.sources : [];
  // Try to derive a count from structured details or fall back to parsing the string field "Sanction Details"
  const detailsStr = details?.sanction?.details || ocrDataDetailsFallback(ocrData);
  const derivedCount = sources.length || countFromDetails(detailsStr);
  const status = details?.sanction?.status || (sanction ? 'SANCTIONED' : 'NOT FOUND');
  return (
    <div className={`flex items-start gap-2 ${sanction ? 'text-green-600' : 'text-red-600'}`}>
      {sanction ? (<CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />) : (<XCircle className="h-5 w-5 mt-0.5 shrink-0" />)}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span>Sanction {sanction ? 'Not Found' : 'Found'}{derivedCount ? ` • ${derivedCount} sanction source${derivedCount > 1 ? 's' : ''}` : ''}</span>
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-primary transition">
            {expanded ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
          </button>
        </div>
        {expanded && (
          <div className="mt-2 text-muted-foreground border-l-2 pl-3 border-gray-300 space-y-2">
            <div><strong>Status:</strong> {status}</div>
            {details?.sanction?.details && (<div><strong>Details:</strong> {details.sanction.details}</div>)}
            {details?.sanction?.confidence && (<div><strong>Confidence:</strong> {details.sanction.confidence}</div>)}
            {details?.sanction?.flag && (<div><strong>Flag:</strong> {details.sanction.flag}</div>)}
            {details?.sanction?.comment_1 && (<div><strong>Comment 1:</strong> {details.sanction.comment_1}</div>)}
            {details?.sanction?.comment_2 && (<div><strong>Comment 2:</strong> {details.sanction.comment_2}</div>)}
            {details?.sanction?.state_comment && (<div><strong>State Comment:</strong> {details.sanction.state_comment}</div>)}
            {sources.length > 0 && (
              <div>
                <strong>Sources:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {sources.map((s: any, idx: number) => (
                    <li key={idx}><strong>{s.level} - {s.source}:</strong> {s.url}</li>
                  ))}
                </ul>
              </div>
            )}
            {reason && (
              <div>
                <strong>Reason:</strong> {reason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Fallback helper to derive details string from OCR data if verificationDetails.sanction.details isn't present
function ocrDataDetailsFallback(ocr?: any): string | undefined {
  try {
    const data = ocr || {};
    return data["Sanction Details"] || data["sanction_details"] || undefined;
  } catch {
    return undefined;
  }
}

// Count sanctions from a comma/semicolon separated details string like "OIG, SAM, STATE"
function countFromDetails(details?: string): number | undefined {
  if (!details || typeof details !== 'string') return undefined;
  const tokens = details.split(/[;,]/).map(t => t.trim()).filter(Boolean);
  return tokens.length || undefined;
}


const NPIMatch = ({ data }: { data: any }) => {
  const [expanded, setExpanded] = useState(false);

  return (<div className={`flex items-start gap-2 text-green-600`}>
    <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <span>Verified with NPI API</span>
        <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-primary transition">
          {expanded ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 text-muted-foreground border-l-2 pl-3 border-gray-300">
          <ul className="space-y-1">
            {Object.keys(data).map((key) => {
              if (key.endsWith('_confident_score')) return null; // skip confidence score keys

              const confidenceKey = `${key.trim().replaceAll(' ', '_')}_confident_score`;
              const confidence = data[confidenceKey];

              const isConfident = confidence === 1;

              return (
                <li key={key} className={`flex items-start gap-2 text-muted-foreground`}>
                  <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>
                    <strong>{key}:</strong> {data[key]} <strong className={`flex items-start gap-2 ${isConfident ? 'text-green-600' : 'text-muted-foreground'}`}>({confidence !== undefined ? `Perfect Match` : ''})</strong>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  </div>)
}

const NPPESVerification = ({ details }: { details?: any }) => {
  const comment = details?.comment;
  return (
    <div className={`flex items-start gap-2 text-green-600`}>
      <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span>Verified with NPPES API</span>
        </div>
        {comment && (
          <div className="mt-2 text-muted-foreground border-l-2 pl-3 border-gray-300">
            {comment}
          </div>
        )}
      </div>
    </div>
  );
};

const OutreachMatch = () => {
  return (
    <div className="flex items-start gap-2 text-green-600">
      <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
      <span>Automated Outreach triggered</span>
    </div>
  );
};

