export type Export =
   | string
   | {
        names: '*' | string[];
        path: string;
     };
