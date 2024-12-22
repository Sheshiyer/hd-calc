declare module 'astronomia' {
  export namespace julian {
    export function DateToJDE(date: Date): number;
  }

  export namespace solar {
    export class ApparentVSOP87 {
      constructor(jde: number);
      lon: number;  // longitude in radians
    }
  }
}
