export interface BabyToday {
  babySize: number;
  babyWeight: number;
  babyActivity: string;
  babyDevelopment: string;
  image: string;
}

export interface WeekGreetingResponse {
  babyToday: BabyToday;
}
