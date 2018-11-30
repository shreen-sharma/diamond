// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //  serverUrl: 'http://ec2-13-126-74-170.ap-south-1.compute.amazonaws.com:8080/derp' // nmbr testing server
  serverUrl: 'http://localhost:8080/derp'
};
