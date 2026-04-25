import axios from "axios";
import { format, subYears } from "date-fns";
import { ContributionData } from "@/lib/types/index";

export class GitLabService {
  private token: string;
  private username: string;
  private instanceUrl: string;

  constructor(token: string, username: string, instanceUrl: string = "https://gitlab.com") {
    this.token = token;
    this.username = username;
    this.instanceUrl = instanceUrl.replace(/\/$/, ""); 
  }

  /**
   * Fetches GitLab events and aggregates them into contribution counts by date.
   * Optimized with Parallel Requests for speed.
   */
  async fetchContributions(): Promise<ContributionData> {
    if (!this.token || !this.username) {
      console.warn("GITLAB_TOKEN or GITLAB_USERNAME is missing. Skipping GitLab data collection.");
      return {};
    }

    const contributions: ContributionData = {};
    const oneYearAgo = format(subYears(new Date(), 1), "yyyy-MM-dd");
    
    try {
      // Fetch multiple pages in parallel (e.g., first 5 pages for speed)
      const pageNumbers = [1, 2, 3, 4, 5];
      
      const pageRequests = pageNumbers.map(page => 
        axios.get(`${this.instanceUrl}/api/v4/events`, {
          params: {
            after: oneYearAgo,
            per_page: 100,
            page: page,
          },
          headers: {
            "Authorization": `Bearer ${this.token}`,
          },
        }).catch(err => {
          console.error(`Error fetching GitLab page ${page}:`, err.message);
          return { data: [] };
        })
      );

      const responses = await Promise.all(pageRequests);
      
      for (const response of responses) {
        const events = response.data;
        if (!events || !Array.isArray(events)) continue;

        for (const event of events) {
          if (!event.created_at) continue;
          const date = format(new Date(event.created_at), "yyyy-MM-dd");
          contributions[date] = (contributions[date] || 0) + 1;
        }
      }

      return contributions;
    } catch (error) {
      console.error("Error fetching GitLab contributions:", error);
      return {};
    }
  }
}
