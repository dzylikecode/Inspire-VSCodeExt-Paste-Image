interface Clipboard {
  isImage(): Promise<boolean>;
  saveImage(fileDir: string, fileName: string): Promise<any>;
}
