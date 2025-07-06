// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


/****************************************************/
//SERVIDOR LOCAL//
export const dominIamge = 'http://localhost:4200/'
//export const domin = 'https://apibuskm.bioonix.com'
//export const socket = 'https://api.quality.bioonix.com'
/****************************************************/

/****************************************************/
//SERVIDOR LOCAL// 
//export const dominIamge = 'https://bestpadelranking.com/qa/'
export const domin = 'https://apibuskm.bioonix.com'
export const socket = 'https://api.quality.bioonix.com'
/****************************************************/

/****************************************************/
//SERVIDOR DEV// 
//export const dominIamge = 'https://padel.bioonix.com/'
//export const domin = 'http://localhost:3000'
//export const ip = 'http://localhost:3000'


export const environment = {
  production: false,
  API_URL: domin,
  API_SOCKET: socket
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
