import { graphql } from "@octokit/graphql";
import { ContributionData } from "@/lib/types/index";

export class GitHubService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Fetches GitHub contributions for the last 2 years using GraphQL API
   */
  async fetchContributions(): Promise<ContributionData> {
    if (!this.token) {
      console.warn("GITHUB_TOKEN is missing. Skipping GitHub data collection.");
      return {};
    }

    const contributions: ContributionData = {};
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Function to fetch a specific year range
    const fetchRange = async (from: Date, to: Date) => {
      const query = `
        query($from: DateTime, $to: DateTime) {
          viewer {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

      const response: any = await graphql(query, {
        from: from.toISOString(),
        to: to.toISOString(),
        headers: {
          authorization: `token ${this.token}`,
        },
      });

      const weeks = response.viewer.contributionsCollection.contributionCalendar.weeks;
      for (const week of weeks) {
        for (const day of week.contributionDays) {
          contributions[day.date] = day.contributionCount;
        }
      }
    };

    try {
      // Fetch current year and previous year in parallel
      await Promise.all([
        fetchRange(oneYearAgo, now),
        fetchRange(new Date(oneYearAgo.getTime() - 365 * 24 * 60 * 60 * 1000), oneYearAgo)
      ]);

      return contributions;
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      return {};
    }
  }
}
