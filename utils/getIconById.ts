const defualtIcon =
  "https://github.com/xFingerDev/AdVerse-Dashboard/blob/main/assets/images/icon.png?raw=true";

export const getIconById = async ({
  appId,
  platform,
}: {
  appId: string;
  platform: string;
}): Promise<string> => {
  switch (platform) {
    case "ANDROID":
      return await getIconByIdAndroid(appId);
    case "IOS":
      return await getIconByIdIOS(appId);
    default:
      return defualtIcon;
  }
};

const getIconByIdAndroid = async (appId: string) => {
  const response = await fetch(
    `https://play.google.com/store/apps/details?id=${appId}`,
    {
      headers: { "User-Agent": "Mozilla/5.0" },
    }
  );
  const html = await response.text();
  const iconMetaMatch = html.match(
    /<meta property="og:image" content="([^"]+)"/
  );
  const iconMeta = iconMetaMatch ? iconMetaMatch[1] : defualtIcon;

  return iconMeta;
};

const getIconByIdIOS = async (appId: string) => {
  try {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const iconUrl =
        data.results?.[0]?.artworkUrl512 || data.results?.[0]?.artworkUrl100;
      return iconUrl || defualtIcon;
    }

    return defualtIcon;
  } catch (error) {
    console.error("Error fetching iOS app icon:", error);
    return defualtIcon;
  }
};
