export interface LocationCardProps {
  location?: {
    id: string;
    serviceCenter: string;
    department: string;
    province: string;
    district: string;
    streetName: string;
    publicServiceHours: string;
    status: string;
    localTypeAbbreviation: string;
    takesPhoto: string;
    deliversElectronicDNI: string;
    dniMajorProcedure: string;
    dniDeliveries: string;
    civilRecordsRegistration: string;
    civilRecordsCertification: string;
    ruipnCertification: string;
    erep: string;
  } | null;
}
