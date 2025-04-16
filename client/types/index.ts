
export interface FunnelItem {
    label: string;
    acv: number;
    count: number;
    diffRate: number;
    diffacvRate: number;
    conversionRate: number;
    totalConversionRate: number;
    totalConversionACV: number;
    dropOffCount: number;
    dropOffACV: number;
    dropOffPercentage: number;
    formattedACV: string;
  }
  
  export interface FunnelSummary {
    totalLeads: number;
    totalACV: string;
    conversionRate: number;
    winRate: number;
  }
  
  export interface FunnelData {
    funnelData: FunnelItem[];
    summary: FunnelSummary;
  }