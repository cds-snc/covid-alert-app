export const INITIAL_TEK_UPLOAD_COMPLETE = 'INITIAL_TEK_UPLOAD_COMPLETE';

export enum ContagiousDateType {
  SymptomOnsetDate = 'symptomOnsetDate',
  TestDate = 'testDate',
  None = 'noDate',
}
export interface ContagiousDateInfo {
  dateType: ContagiousDateType;
  date: Date | null;
}
