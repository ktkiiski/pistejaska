import { MiscDataDTO } from "../domain/play";

export default function setMiscFieldValue(
  misc: MiscDataDTO[],
  fieldId: string,
  getNewData: (oldData: MiscDataDTO["data"] | undefined) => MiscDataDTO["data"]
): MiscDataDTO[] {
  const oldValue = misc.find((x) => x.fieldId === fieldId);
  const oldMisc = misc.filter((x) => x.fieldId !== fieldId);
  return oldMisc.concat({
    fieldId,
    data: getNewData(oldValue?.data),
  });
}
