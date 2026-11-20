import saveAs from 'file-saver';
import { FileExportWindow } from '@definition/file_export';
import { exportFileName } from '@utils/file_export';

type Exporter = (blob: Blob, name: string) => Promise<boolean>;
let nativeExporter: Exporter | undefined;
export const registerFileExporter = (exporter: Exporter) => {
  nativeExporter = exporter;
};

/** False means the user cancelled; cancellation is never reported as a failure. */
export const exportFile = async (
  source: Blob | (() => Promise<Blob>),
  name: string
): Promise<boolean> => {
  const createBlob = () => (typeof source === 'function' ? source() : source);
  const filename = exportFileName(name);
  if (nativeExporter) return nativeExporter(await createBlob(), filename);

  // Invoke the picker before any asynchronous work so the click remains a user gesture.
  const browser = window as FileExportWindow;
  if (browser.showSaveFilePicker) {
    try {
      const handle = await browser.showSaveFilePicker({
        suggestedName: filename,
      });
      const blob = await createBlob();
      const stream = await handle.createWritable();
      try {
        await stream.write(blob);
        await stream.close();
      } catch (error) {
        await stream.abort().catch(() => {});
        throw error;
      }
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') return false;
      throw error;
    }
  }

  // Safari and Firefox use a download. Do not substitute sharing for saving.
  const blob = typeof source === 'function' ? await source() : source;
  saveAs(blob, filename);
  return true;
};
