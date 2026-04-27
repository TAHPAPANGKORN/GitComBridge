import { graphql } from "@octokit/graphql";
import { subYears } from "date-fns";
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
    const oneYearAgo = subYears(now, 1);
    const twoYearsAgo = subYears(now, 2);

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

      try {
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
      } catch (err) {
        console.error(`Error fetching GitHub range ${from.toISOString()} - ${to.toISOString()}:`, err);
        // Don't throw, just let other ranges continue
      }
    };

    try {
      // Fetch ranges in parallel - GitHub range cannot exceed 1 year
      await Promise.all([
        fetchRange(oneYearAgo, now),
        fetchRange(twoYearsAgo, oneYearAgo)
      ]);

      return contributions;
    } catch (error) {
      console.error("Critical error in GitHub fetchContributions:", error);
      return {};
    }
  }
}
