import { ReactNode, useReducer, useState } from "react";
import { defaultButtonClasses } from "./Button";

interface UploadButtonProps {
  idleLabel: ReactNode;
  uploadingLabel: ReactNode;
  disabled?: boolean;
  accept: string;
  onUpload: (file: File) => Promise<void>;
}

function UploadButton({
  idleLabel,
  uploadingLabel,
  disabled,
  accept,
  onUpload,
  ...props
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [id, remountInput] = useReducer((oldId: number) => oldId + 1, 0);
  const isEnabled = !isUploading && !disabled;

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !isEnabled) return;
    try {
      setIsUploading(true);
      for (let idx = 0; idx < files.length; idx += 1) {
        const file = files.item(idx);
        if (file) {
          await onUpload(file);
        }
      }
    } finally {
      remountInput();
      setIsUploading(false);
    }
  };

  return (
    <label
      // Using ID to forcefully re-creating the file input on upload, to reset the selection
      key={id}
      className={`${defaultButtonClasses} bg-purple-700 hover:bg-purple-800 ${
        isEnabled ? "" : "text-gray-400 bg-gray-300 hover:bg-gray-300"
      }`}
      {...props}
    >
      {isUploading ? uploadingLabel : idleLabel}
      <input
        type="file"
        className="sr-only"
        accept={accept}
        onChange={onChange}
        disabled={!isEnabled}
      />
    </label>
  );
}

export default UploadButton;
