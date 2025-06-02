interface blobs {
    url: string;
    downloadUrl: string;
    pathname: string;
    size: any;
    uploadedAt: string;
}

export interface BlobData {
    blobs: blobs[];
}