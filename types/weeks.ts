export interface WeeksGeneralInfo {
  curWeekToPregnant: number;
  daysBeforePregnant: number;
  babyToday: {
    babySize: number;
    babyWeight: number;
    babyActivity: string;
    babyDevelopment: string;
    image: string;
  };
  momHint: string;
}

export interface AboutBaby {
  analogy: string;
  image: string;
  description: string[];
  interestingFact: string;
}

export interface AboutMom {
  feelings: {
    states: string[];
    sensationDescr: string;
  };
  comfortTips: {
    category: string;
    tip: string;
  }[];
}
