import { Injectable } from '@angular/core';
import * as Filesaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  downloadFile(data: any, filename: string, fileType: string) {
    const blob = new Blob([data], { type: fileType });
    Filesaver.saveAs(blob, `${filename}.csv`);
  }
}
