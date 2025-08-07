import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Mail, MessageSquare } from "lucide-react"

export default function CommunicationPage() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Communication Hub</CardTitle>
        <CardDescription>
          Send announcements, reminders, and messages to students and staff.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />Email</TabsTrigger>
            <TabsTrigger value="sms"><MessageSquare className="w-4 h-4 mr-2" />SMS</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email-recipients">Recipients</Label>
                <Select>
                    <SelectTrigger id="email-recipients">
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-students">All Students</SelectItem>
                        <SelectItem value="all-staff">All Staff</SelectItem>
                        <SelectItem value="grade-10">Grade 10 Students</SelectItem>
                        <SelectItem value="science-faculty">Science Faculty</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" placeholder="Important Announcement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea id="email-message" placeholder="Type your message here..." rows={8} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="sms">
          <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sms-recipients">Recipients</Label>
                <Select>
                    <SelectTrigger id="sms-recipients">
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-students">All Students</SelectItem>
                        <SelectItem value="all-staff">All Staff</SelectItem>
                        <SelectItem value="grade-10">Grade 10 Students</SelectItem>
                        <SelectItem value="science-faculty">Science Faculty</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-message">Message (160 characters max)</Label>
                <Textarea id="sms-message" placeholder="Type your SMS here..." maxLength={160} rows={4} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
