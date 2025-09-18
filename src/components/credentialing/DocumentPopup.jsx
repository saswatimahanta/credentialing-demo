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
const DocumentPopup = ({filePath, showDocument, setShowDocument }) => {
    const getFileType = (path) => {
    const ext = path.split(".").pop()?.toLowerCase();
    return ext;
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
            onClose={()=>{setShowDocument(false)}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                {renderContent()}
            </Box>
        </Modal>
    )
}

export default DocumentPopup