export interface IAlias {
   path: string;
   baseUrl: string;
   paths: {
      [path: string]: [string];
   };
}
