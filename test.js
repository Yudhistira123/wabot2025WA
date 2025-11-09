import Openrouteservice from "openrouteservice-js";

const orsDirections = new Openrouteservice.Directions({
  api_key:
    "5b3ce3597851110001cf624834ac8052057984493f97fcc0a28c98b2ce09c978bce1e159e0470756",
});

async function getDistance() {
  try {
    const result = await orsDirections.calculate({
      coordinates: [
        [107.57496222096368, -6.849854077903357], // Start (lon, lat)
        [107.619123, -6.917464], // End (lon, lat)
      ],
      profile: "driving-car",
      format: "json",
    });

    const route = result.routes[0].summary;

    const distanceKm = (route.distance / 1000).toFixed(2);
    const durationMinutes = (route.duration / 60).toFixed(1);

    // Convert minutes → human readable hours + minutes
    const hours = Math.floor(route.duration / 3600);
    const minutes = Math.round((route.duration % 3600) / 60);
    const readableTime =
      hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

    console.log("🚗 Route Summary");
    console.log("------------------------------");
    console.log(`📍 Start:  [107.57496, -6.84985]`);
    console.log(`🏁 End:    [107.61912, -6.91746]`);
    console.log(`📏 Distance: ${distanceKm} km`);
    console.log(`⏱️ Duration: ${readableTime}`);
    console.log("------------------------------");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  }
}

getDistance();
