import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getTodayAsString } from "../common/dateUtils";
import { app } from "../common/firebase";
import { v4 as uuid } from "uuid";

const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export default async function uploadPlayImage(
  playId: string,
  file: File
): Promise<string> {
  const storage = getStorage(app);
  const dateString = getTodayAsString();
  const extension = getFileExtension(file.name);
  const filename = `${dateString}--${playId}--${uuid()}.${extension}`;
  const storageRef = ref(storage, "play-images/" + filename);
  await uploadBytes(storageRef, file);
  return filename;
}
