import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const events = [
  { title: "Parent-Teacher Meetings", date: "2024-08-15", time: "9:00 AM - 4:00 PM", type: "meeting" },
  { title: "Mid-term Exams Start", date: "2024-08-19", time: "All Day", type: "exam" },
  { title: "Science Fair", date: "2024-08-22", time: "10:00 AM - 2:00 PM", type: "event" },
  { title: "Guest Lecture: AI in Education", date: "2024-08-25", time: "3:00 PM", type: "lecture" },
]

export default function SchedulePage() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md w-full"
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>What's happening on campus.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-md flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">{new Date(event.date).toLocaleDateString('en-US', { day: '2-digit' })}</span>
                    <span className="text-xs text-primary-foreground/80">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                    <Badge variant="outline" className="mt-1">{event.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
