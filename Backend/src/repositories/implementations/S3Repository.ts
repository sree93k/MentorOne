export class S3Repository {
  public static getFileUrl(file: Express.MulterS3.File): string {
    return file.location; // AWS returns full URL
  }
}
