import * as  Constants from "expo-constants";

const facebookUrl = Constants.default.manifest.extra.facebookBaseUrl;

export default class FacebookGraph {
  public static async graphCallBasicInfo(token: string): Promise<BasicFbInfo> {
    return await fetch(
      `${facebookUrl}?fields=name,email&access_token=${token}`
    ).then((response: Response) => {
      return response.json();
    });
  }
}

export interface BasicFbInfo {
  name: string;
  email: string;
  id: string;
}
