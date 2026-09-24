import { notFound } from "next/navigation";
import { eventService } from "@/services/event.service";
import { Container } from "@/components/layout/container";
import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await eventService.findPublishedBySlug(slug);
  if (!event) return { title: "Not Found" };
  return { title: event.title, description: event.description };
}

export default async function PublicEventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await eventService.findPublishedBySlug(slug);
  if (!event) notFound();

  const date = new Date(event.eventDate);
  const isPast = date < new Date();

  return (
    <main>
      <div className="bg-[#003d78] text-white py-12">
        <Container>
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" /> All Events
          </Link>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.description && <p className="text-white/80 mt-2 max-w-2xl">{event.description}</p>}
        </Container>
      </div>

      <Container className="py-12 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {event.image && (
              <div className="rounded-xl overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full object-cover max-h-[400px]" />
              </div>
            )}
            {event.content && <RichTextRenderer content={event.content} />}
          </div>

          <div className="space-y-4">
            <Card className="border-l-4 border-l-[#ffb300]">
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#0b5699]" />
                    {date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {(event.startTime || event.endTime) && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Time</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#0b5699]" />
                      {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}
                    </p>
                  </div>
                )}

                {event.location && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Location</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#0b5699]" /> {event.location}
                    </p>
                  </div>
                )}

                {event.registrationUrl && !isPast && (
                  <div className="pt-2 border-t">
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ffb300] text-[#003d78] hover:bg-[#ffa000] font-semibold transition-colors">
                      <ExternalLink className="h-4 w-4" /> Register Now
                    </a>
                    {event.registrationDeadline && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {isPast && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground font-medium">This event has concluded.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
