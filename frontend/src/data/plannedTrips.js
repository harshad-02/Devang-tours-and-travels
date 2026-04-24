export const plannedTrips = [
  {
    slug: "ratnagiri-darshan",
    title: "Ratnagiri Darshan",
    duration: "Full day coastal route",
    summary:
      "A scenic Konkan circuit covering beaches, temples, city viewpoints, and local food stops.",
    highlights: ["Ganpatipule", "Ratnadurg Fort", "Thiba Palace"],
    route:
      "Pickup from your selected city point, continue through Ganpatipule temple and beach, move into Ratnagiri city for fort and palace visits, then return via the coastal highway.",
    coverage: ["Temple darshan", "Beach stop", "Fort visit", "City viewpoints", "Food halt"],
    notes:
      "Best suited for early-morning departure so you can comfortably cover the coastal route and sightseeing stops in one day.",
  },
  {
    slug: "malvan-darshan",
    title: "Malvan Darshan",
    duration: "Leisure + sightseeing day",
    summary:
      "Ideal for sea-facing travel with heritage stops, local markets, and relaxed beach-side time.",
    highlights: ["Sindhudurg Fort", "Tarkarli", "Rock Garden"],
    route:
      "Begin from your boarding point, drive toward Malvan town, cover Sindhudurg and Tarkarli side attractions, then wrap up with market and sunset-side stops before return.",
    coverage: ["Sea-facing route", "Fort access points", "Market stop", "Beach leisure", "Photo stops"],
    notes:
      "This plan works well for families and groups who want a relaxed balance of sightseeing and free time near the coast.",
  },
  {
    slug: "pune-darshan",
    title: "Pune Darshan",
    duration: "City exploration plan",
    summary:
      "A balanced Pune city ride with cultural landmarks, shopping zones, and family-friendly stops.",
    highlights: ["Shaniwar Wada", "Dagdusheth", "Saras Baug"],
    route:
      "Travel across central Pune with planned stops around heritage landmarks, temple visits, garden spaces, and nearby shopping pockets before convenient drop-off.",
    coverage: ["City landmarks", "Temple visit", "Garden stop", "Shopping zone", "Flexible drop points"],
    notes:
      "Ideal for same-day city exploration with moderate travel time between locations and easy customization around traffic windows.",
  },
  {
    slug: "mumbai-darshan",
    title: "Mumbai Darshan",
    duration: "Popular city highlights",
    summary:
      "A full Mumbai city experience designed for major landmarks, marine views, and iconic routes.",
    highlights: ["Gateway of India", "Marine Drive", "Juhu Beach"],
    route:
      "Start from your preferred pickup point, move through South Mumbai landmarks, continue along Marine Drive, and close the day with western-side beach and city route coverage.",
    coverage: ["Monument stops", "Sea-link routes", "Marine views", "Beach stop", "City photo points"],
    notes:
      "We recommend a morning start for smoother landmark coverage and better flexibility around Mumbai traffic conditions.",
  },
  {
    slug: "goa-trip",
    title: "Goa Trip",
    duration: "Weekend escape route",
    summary:
      "A relaxed long-distance plan for beaches, nightlife spots, churches, and scenic coastal roads.",
    highlights: ["Calangute", "Baga", "Old Goa"],
    route:
      "A longer intercity route into Goa covering major beach belts, church circuits, and key local movement between North Goa highlights and heritage zones.",
    coverage: ["Long-route transfer", "Beach belt coverage", "Church visits", "Local sightseeing", "Flexible halt support"],
    notes:
      "Best for weekend or multi-day planning. Trip flow can be adjusted depending on stay location and preferred Goa side coverage.",
  },
  {
    slug: "pink-city-trip",
    title: "Pink City Trip",
    duration: "Heritage city journey",
    summary:
      "A Jaipur-focused travel plan with royal architecture, colorful bazaars, and signature city viewpoints.",
    highlights: ["Hawa Mahal", "Amber Fort", "City Palace"],
    route:
      "Cover the Jaipur heritage circuit with palace visits, fort access, old-city movement, and market-side travel through the main Pink City zones.",
    coverage: ["Fort route", "Palace circuit", "Bazaar area", "Heritage viewpoints", "Photo stops"],
    notes:
      "This route is ideal for travelers who want royal architecture and market exploration in one structured city plan.",
  },
  {
    slug: "mahabaleshwar-trip",
    title: "Mahabaleshwar Trip",
    duration: "Hill station getaway",
    summary:
      "A refreshing hill route with valley points, strawberry stops, lake views, and cool-weather breaks.",
    highlights: ["Mapro Garden", "Venna Lake", "Arthur Seat"],
    route:
      "Drive through the hill approach road into Mahabaleshwar, covering key viewpoints, garden and lake stops, and a comfortable return through the ghat section.",
    coverage: ["Hill drive", "Viewpoints", "Lake stop", "Garden visit", "Refreshment halt"],
    notes:
      "A daytime departure is recommended for clearer valley views and a more relaxed hill-station pace across all stops.",
  },
];

export function getPlannedTripBySlug(slug) {
  return plannedTrips.find((trip) => trip.slug === slug) || null;
}
