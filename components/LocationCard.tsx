import {
  Building,
  Building2,
  ChevronRight,
  Clock,
  FileText,
  Globe2,
  Home,
  IdCard,
  MapPin,
  Zap,
} from "lucide-react";

import { LocationCardProps } from "@/types/location";

const toSentenceCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const LocationCard = ({ location }: LocationCardProps) => {
  if (!location) {
    return (
      <aside
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(420px,90vw)]
        bg-white/90 rounded-3xl shadow-lg border border-zinc-100/30
        backdrop-blur-xl overflow-hidden z-30 animate-float"
        role="complementary"
        aria-label="Location selector"
      >
        <div className="px-4 sm:px-4 py-4 sm:py-4 text-center">
          <div className="relative mb-4 sm:mb-6">
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32
              bg-gradient-to-r from-orange-200/40 to-rose-200/40 rounded-full blur-2xl"
            />
            <div
              className="relative mx-auto w-12 sm:w-14 h-12 sm:h-14
              bg-gradient-to-b from-orange-50 to-orange-100/50 rounded-2xl
              flex items-center justify-center transform transition-all duration-300
              hover:scale-105 hover:rotate-3"
            >
              <MapPin className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500/90" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-medium text-zinc-800">
              Selecciona una Oficina 🏢
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500/90 max-w-[280px] mx-auto leading-relaxed">
              Explora el mapa para encontrar la oficina más cercana a tu
              ubicación
            </p>
          </div>

          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <div className="relative flex">
              <span className="relative w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            </div>
            Haz clic en cualquier marcador
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`
        fixed sm:bottom-4 left-1/2 -translate-x-1/2 w-full sm:w-[min(480px,90vw)] max-h-[15dvh] sm:max-h-[45vh] min-h-[40dvh] sm:min-h-0 bg-white/95 rounded-t-2xl sm:rounded-3xl shadow-2xl border border-zinc-200/50 backdrop-blur-md overflow-hidden z-50 flex flex-col transition-all duration-300 ease-out
        ${
          location
            ? "translate-y-0 bottom-0"
            : "translate-y-full bottom-[-200px]"
        }
      `}
      role="complementary"
      aria-label="Location details"
    >
      <header className="flex-none sticky top-0 bg-white/95 backdrop-blur-md border-b border-zinc-100/50 flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3 justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="p-1.5 sm:p-2 bg-zinc-100 rounded-xl flex-none">
              <Building className="w-4 sm:w-5 h-4 sm:h-5 text-zinc-700" />
            </div>
            <h1 className="font-medium text-zinc-900 text-sm sm:text-base line-clamp-1 max-w-[200px] sm:max-w-[300px]">
              {location.serviceCenter}
            </h1>
          </div>
          <span
            className={`px-2 py-1 font-medium rounded-full whitespace-nowrap text-xs sm:text-sm
            flex items-center ${
              location.status === "OPERATIVO"
                ? "bg-emerald-100 text-emerald-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {location.status === "OPERATIVO" ? "Operativo" : "No operativo"}
            <Zap
              className={`w-3 sm:w-4 h-3 sm:h-4 ml-1
              ${
                location.status === "OPERATIVO"
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            />
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 scroll-smoot scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300/50 hover:scrollbar-thumb-zinc-400/50 scrollbar-thumb-rounded-full">
        <section className="flex flex-col space-y-2 px-3 py-2 bg-zinc-50/50 rounded-xl mb-3 sm:mb-4">
          <p className="flex items-center gap-2 text-sm text-zinc-700">
            <Globe2 className="w-4 h-4 text-zinc-500" />
            <span className="font-medium">
              {toSentenceCase(location.department)}
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm text-zinc-700">
            <Building2 className="w-4 h-4 text-zinc-500" />
            <span>{toSentenceCase(location.province)}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-zinc-700">
            <Home className="w-4 h-4 text-zinc-500" />
            <span>{toSentenceCase(location.district)}</span>
          </p>
        </section>

        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-start gap-3 p-3 bg-zinc-50/50 rounded-xl">
            <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-zinc-800 mb-0.5">
                Dirección
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {location.streetName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-zinc-50/50 rounded-xl">
            <Clock className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-zinc-800 mb-0.5">
                Horario de Atención
              </p>
              <p className="text-sm text-zinc-600">
                {location.publicServiceHours}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <IdCard className="w-4 h-4 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-800">
                Servicios DNI
              </h4>
            </div>
            <ul className="space-y-2">
              {[
                { label: "Toma de Fotos", value: location.takesPhoto === "SI" },
                {
                  label: "DNI Electrónico",
                  value: location.deliversElectronicDNI === "SI",
                },
                {
                  label: "Entrega de DNI",
                  value: location.dniDeliveries === "SI",
                },
              ].map((service, index) => (
                <li key={index} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      service.value ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                  />
                  <span className="text-zinc-600">{service.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-800">
                Registros Civiles
              </h4>
            </div>
            <ul className="space-y-2">
              {[
                {
                  label: "Registro Civil",
                  value: location.civilRecordsRegistration === "SI",
                },
                {
                  label: "Certificación",
                  value: location.civilRecordsCertification === "SI",
                },
                { label: "RUIPN", value: location.ruipnCertification === "SI" },
              ].map((service, index) => (
                <li key={index} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      service.value ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                  />
                  <span className="text-zinc-600">{service.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="flex-none bg-white/95 backdrop-blur-md border-t border-zinc-100">
        <a
          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 sm:p-4 hover:bg-zinc-50
          transition-colors group"
          aria-label="Ver ubicación en Google Maps"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-zinc-100 rounded-xl">
              <MapPin className="w-4 h-4 text-zinc-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-zinc-700">
              Ver ubicación en Google Maps
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
        </a>

        {/* Add signature section */}
        <div className="border-t border-zinc-100">
          <a
            href="https://github.com/eslimdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4
            text-xs text-zinc-800 hover:text-zinc-700 transition-colors
            bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50"
          >
            <span className="animate-bounce inline-block">✨</span>
            <span className="font-medium"> Made with magic by Eslim</span>
            <span className="animate-bounce inline-block">🦄</span>
          </a>
        </div>
      </footer>
    </aside>
  );
};

export default LocationCard;
