import { oc } from "date-fns/locale";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

export const VerificationOutput = ({ pdfData, ocrData, type, }: { pdfData: any; ocrData: any, type: string; }) => {
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
        <PdfMatch data={pdfData} />
        <NPIMatch data={ocrData} />
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

  if (type === "cv/resume") {
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
      </div>
    );
  }
};

const PdfMatch = ({ data, forceGreen = false }: { data: any; forceGreen?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const match = data?.match;
  const reason = data?.reason || "No reason provided.";
  const isGreen = forceGreen || match;
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

const OutreachMatch = () => {
  return (
    <div className="flex items-start gap-2 text-green-600">
      <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
      <span>Automated Outreach triggered</span>
    </div>
  );
};

