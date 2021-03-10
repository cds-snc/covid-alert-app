export enum ContagiousDateType {
  SymptomOnsetDate = 'symptomOnsetDate',
  TestDate = 'testDate',
  None = 'noDate',
}
export interface ContagiousDateInfo {
  dateType: ContagiousDateType;
  date: Date | null;
}
