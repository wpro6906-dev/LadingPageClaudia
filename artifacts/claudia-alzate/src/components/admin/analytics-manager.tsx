import { useGetAnalytics, getGetAnalyticsQueryKey } from "@workspace/api-client-react";
import { Eye, MousePointer, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsManager() {
  const { data: analytics, isLoading } = useGetAnalytics({
    query: { queryKey: getGetAnalyticsQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif text-foreground">Analytics</h2>
          <p className="text-muted-foreground text-sm">Loading your analytics...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl bg-card/40" />)}
        </div>
      </div>
    );
  }

  const maxClicks = Math.max(...(analytics?.links?.map((l: any) => l.clicks) || [1]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Analytics Overview</h2>
        <p className="text-muted-foreground text-sm">Track your profile performance and link engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-2 border-t-primary border-x-border border-b-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
            <Eye className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{analytics?.totalVisits || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-t-2 border-t-primary border-x-border border-b-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            <MousePointer className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{analytics?.totalClicks || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-t-2 border-t-primary border-x-border border-b-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Clicked</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate max-w-full" title={analytics?.mostClicked || "None"}>
              {analytics?.mostClicked || "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-2 border-t-primary border-x-border border-b-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Activity</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {analytics?.lastActivity ? new Date(analytics.lastActivity).toLocaleDateString() : "No activity"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="font-serif">Link Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(!analytics?.links || analytics.links.length === 0) ? (
            <p className="text-sm text-muted-foreground text-center py-4">No link data available yet.</p>
          ) : (
            analytics?.links?.map((link: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{link.title}</span>
                  <span className="text-muted-foreground">{link.clicks} clicks</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
