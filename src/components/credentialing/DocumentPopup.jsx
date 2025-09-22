'use client';

import { Modal, Typography, Box } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const DocumentPopup = ({ filePath, showDocument, setShowDocument }) => {
  const nextCandidate = (current) => {
    if (!current) return current;
    const parts = current.split('/');
    const name = parts.pop();
    const [base, ext] = (name || '').split('.');
    const lower = (s) => (s || '').toLowerCase();
    const candidates = [
      `${base}.${ext}`,
      `${lower(base)}.${ext}`,
      `${base}.png`,
      `${lower(base)}.png`,
    ];
    const idx = candidates.findIndex((c) => c.toLowerCase() === `${lower(base)}.${lower(ext)}`);
    const next = candidates[Math.min(idx + 1, candidates.length - 1)];
    return [...parts, next].join('/');
  };
  const getFileType = (path) => {
    const ext = path.split(".").pop()?.toLowerCase();
    return ext;
  };

  const handleDownload = () => {
    if (!filePath) return;
    const link = document.createElement('a');
    link.href = filePath;
    const name = filePath.split('/').pop() || 'document';
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderContent = () => {
    const fileType = getFileType(filePath);

    if (!fileType) return <p>Unsupported file</p>;

    // 📸 Image Preview
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
      return (
        <img
          src={filePath}
          alt="document"
          className="w-full h-full object-contain"
          onError={(e) => {
            const img = e.currentTarget;
            const tried = img.dataset.step ? parseInt(img.dataset.step, 10) : 0;
            if (tried > 2) { img.style.display = 'none'; return; }
            img.dataset.step = String(tried + 1);
            img.src = nextCandidate(img.src);
          }}
        />
      );
    }

    // 📄 PDF Preview
    if (fileType === "pdf") {
      return (
        <iframe
          src={filePath}
          title="PDF Viewer"
          className="w-full h-full border-0"
        />
      );
    }

    return <p>Cannot preview this file type</p>;
  };
  return (
    <Modal
      open={showDocument}
      onClose={() => { setShowDocument(false) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, position: 'relative' }}>
        {/* Controls */}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8, zIndex: 2 }}>
          <button
            onClick={handleDownload}
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Download
          </button>
          <button
            onClick={() => setShowDocument(false)}
            className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
        {renderContent()}
      </Box>
    </Modal>
  )
}

export default DocumentPopup