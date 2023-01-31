import Spinner from "../Spinner";
import ButtonUpload from "./ButtonUpload";

interface ButtonImageUploadProps {
  onUpload?: (file: File) => Promise<void>;
}

export default function ButtonImageUpload({
  onUpload,
}: ButtonImageUploadProps) {
  return (
    <ButtonUpload
      idleLabel="Upload image"
      uploadingLabel={
        <>
          <Spinner className="inline-block w-4 h-4 mr-2" />
          Uploading…
        </>
      }
      accept="image/*"
      onUpload={onUpload}
    />
  );
}
