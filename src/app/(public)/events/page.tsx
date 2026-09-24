import { eventService } from "@/services/event.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Events", description: "Upcoming school events and activities" };

export default async function PublicEventsPage() {
  const upcoming = await eventService.findUpcoming(20);
  const past = await eventService.findPast(1, 12);

  return (
    <main>
      <div className="bg-[#003d78] text-white py-16">
        <Container>
          <h1 className="text-4xl font-bold">School Events</h1>
          <p className="mt-2 text-white/80 text-lg">Stay updated with upcoming activities and celebrations</p>
        </Container>
      </div>

      <Container className="py-12">
        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ffb300] rounded-full" /> Upcoming Events
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => {
                const date = new Date(event.eventDate);
                return (
                  <Card key={event._id.toString()} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-[#ffb300]">
                    {event.image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0b5699] mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        {event.startTime && <><Clock className="h-3.5 w-3.5 ml-2" />{event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</>}
                      </div>
                      <CardTitle className="text-lg group-hover:text-[#0b5699] transition-colors">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /> {event.location}</p>
                      )}
                      {event.description && <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>}
                      <div className="flex items-center gap-3">
                        <Link href={`/events/${event.slug}`} className="text-sm font-medium text-[#003d78] hover:text-[#0b5699] inline-flex items-center gap-1">
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {event.registrationUrl && (
                          <a href={event.registrationUrl} target="_blank" rel="noopener" className="text-sm font-medium text-[#ffb300] hover:text-[#ffa000] inline-flex items-center gap-1">
                            Register <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.data.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-muted-foreground/30 rounded-full" /> Past Events
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.data.map((event) => {
                const date = new Date(event.eventDate);
                return (
                  <Link key={event._id.toString()} href={`/events/${event.slug}`} className="group">
                    <Card className="hover:shadow-md transition-all opacity-80 group-hover:opacity-100">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-center bg-muted rounded-lg px-3 py-2 shrink-0">
                          <div className="text-2xl font-bold text-[#003d78]">{date.getDate()}</div>
                          <div className="text-xs text-muted-foreground uppercase">{date.toLocaleDateString("en-IN", { month: "short" })}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm group-hover:text-[#0b5699] transition-colors truncate">{event.title}</h3>
                          {event.location && <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {upcoming.length === 0 && past.data.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No events scheduled at the moment. Check back soon!</p>
        )}
      </Container>
    </main>
  );
}
