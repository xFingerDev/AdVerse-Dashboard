class AdMobRepository {
  constructor() {}

  async getAnalytics(): Promise<null> {
    try {
      // const analytics = await this.admob.getAnalytics();
      //  return analytics;
    } catch (error) {
      console.error("Error fetching AdMob analytics:", error);
      throw error;
    }
    return null;
  }
}

export default AdMobRepository;
