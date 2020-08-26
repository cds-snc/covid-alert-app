export type Region = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NT' | 'NS' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT' | 'None';
export type RegionCase = 'regionNotCovered' | 'noRegionSet' | 'regionCovered';

export interface RegionContent {
  Active: Region | Region[];
  en: any;
  fr: any;
}
