import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

export interface RsvpProgressProps {
  isLoading?: boolean;
  totalInvitations: number;
  totalGuests: number;
  respondedGuests: number;
  responseRate: number;
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
}

export function RsvpProgress({
  isLoading = false,
  totalInvitations,
  totalGuests,
  respondedGuests,
  responseRate,
  attendingGuests,
  declinedGuests,
  pendingGuests,
}: RsvpProgressProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">RSVP Progress</CardTitle>
          <CardDescription>Track your guest responses</CardDescription>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div>
            <p className="text-2xl font-semibold tabular-nums">
              {isLoading ? "-" : totalInvitations}
            </p>
            <p className="text-xs text-muted-foreground">Invitations</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">
              {isLoading ? "-" : totalGuests}
            </p>
            <p className="text-xs text-muted-foreground">Guests</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Responses received</span>
            <span className="font-medium text-foreground">
              {isLoading ? "-" : respondedGuests} of{" "}
              {isLoading ? "-" : totalGuests} guests
            </span>
          </div>
          <Progress value={isLoading ? 0 : responseRate} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center p-4 rounded-lg bg-accent/10">
            <p className="text-2xl font-semibold text-accent">
              {isLoading ? "-" : attendingGuests}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Attending</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-destructive/10">
            <p className="text-2xl font-semibold text-destructive">
              {isLoading ? "-" : declinedGuests}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Declined</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-2xl font-semibold text-muted-foreground">
              {isLoading ? "-" : pendingGuests}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
