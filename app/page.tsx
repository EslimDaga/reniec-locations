import Map from "@/components/Map";

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      <Map
        initialCoordinates={[-77.0369, -12.0464]}
        zoom={13}
        className="absolute inset-0"
      />
    </main>
  );
}
