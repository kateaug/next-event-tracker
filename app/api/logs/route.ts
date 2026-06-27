import { NextResponse } from 'next/server';
import { NormalizedEvent, SeverityLevel } from '../../features/logs/schemas';

const URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function formatToReadableUTC(epochMs: number): string {
  const date = new Date(epochMs);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} (UTC)`;
}

export async function GET() {
  try {
    const response = await fetch(
      URL,
      { 
        method: 'GET',
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=59',
        },
        next: { 
          revalidate: 60 
        }
      }
    );

    if (!response.ok) throw new Error(`USGS HTTP Issue: ${response.status}`);
    const geoJson = await response.json();
    const features = geoJson.features || [];

    const normalizedEvents: NormalizedEvent[] = features.map((feat: any) => {
      const props = feat.properties || {};
      const geom = feat.geometry || {};
      const magnitude = props.mag || 0;
      const depth = Array.isArray(geom.coordinates) ? geom.coordinates[2] || 0 : 0;
      
      let severity: SeverityLevel = 'info';
      if (magnitude >= 5.5) severity = 'fatal';
      else if (magnitude >= 4.0) severity = 'critical';
      else if (magnitude >= 2.5) severity = 'notice';
      
      return {
        id: feat.id || `usgs-${Date.now()}-${Math.random()}`,
        timestamp: new Date(props.time || Date.now()).toISOString(),
        readableTime: formatToReadableUTC(props.time || Date.now()),
        source: props.net?.toUpperCase() || 'USGS',
        category: props.type || 'earthquake',
        severity,
        title: props.title || `M ${magnitude.toFixed(1)} - Event`,
        message: `Seismic activity record verified. Status code parameter: [${props.status || 'final'}]. Significance weighting: ${props.sig || 0}.`,
        metadata: {
          metricValue: magnitude,
          secondaryLabel: `${depth.toFixed(1)}km Depth`,
        },
      };
    });

    const activeStream = normalizedEvents.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return new NextResponse(JSON.stringify(activeStream), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=59',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}