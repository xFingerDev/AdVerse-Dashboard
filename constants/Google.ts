import { GoogleSignin } from "@react-native-google-signin/google-signin";

const scopes = [
  "https://www.googleapis.com/auth/admob.readonly",
  "https://www.googleapis.com/auth/admob.report",
  //"https://www.googleapis.com/auth/androidpublisher",
  //"https://www.googleapis.com/auth/playdeveloperreporting",
  //"https://www.googleapis.com/auth/adsense",
  //"https://www.googleapis.com/auth/adsense.readonly",
];

GoogleSignin.configure({
  scopes: scopes,
  iosClientId:
    "955716707860-solhabc5jfk8bi3jnk2okrm1ibqdvf39.apps.googleusercontent.com",
});
