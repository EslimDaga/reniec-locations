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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[420px] bg-white/90 rounded-3xl shadow-lg border border-zinc-100/30 backdrop-blur-xl overflow-hidden z-50 animate-float">
        <div className="px-6 py-8 text-center">
          <div className="relative mb-6">
            {/* Gradient orb effect */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-orange-200/40 to-rose-200/40 rounded-full blur-2xl" />

            {/* Icon container with hover effect */}
            <div className="relative mx-auto w-14 h-14 bg-gradient-to-b from-orange-50 to-orange-100/50 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3">
              <MapPin className="w-7 h-7 text-orange-500/90" />
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-lg font-medium text-zinc-800">
              Selecciona una Oficina 🏢
            </h3>
            <p className="text-sm text-zinc-500/90 max-w-[280px] mx-auto leading-relaxed">
              Explora el mapa para encontrar la oficina más cercana a tu
              ubicación
            </p>
          </div>

          {/* Subtle interaction hint */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-pulse" />
            Haz clic en cualquier marcador
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] max-h-[45vh] bg-white/95 rounded-3xl shadow-2xl border border-zinc-200/50 backdrop-blur-md overflow-hidden z-50 animate-slide-up">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-zinc-100/50 flex items-center justify-between p-4">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-zinc-100 rounded-xl flex-none">
              <Building className="w-5 h-5 text-zinc-700" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-900 line-clamp-1">
                {location.serviceCenter}
              </h3>
            </div>
          </div>
          <span
            className={`px-2 py-1 font-medium rounded-full whitespace-nowrap text-sm flex items-center ${
              location.status === "OPERATIVO"
                ? "bg-emerald-100 text-emerald-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {location.status === "OPERATIVO" ? "Operativo" : "No operativo"}

            {location.status === "OPERATIVO" ? (
              <Zap className="w-4 h-4 ml-1 text-emerald-500" />
            ) : (
              <Zap className="w-4 h-4 ml-1 text-red-500" />
            )}
          </span>
        </div>
      </div>

      {/* Card Body - Adjusted padding and max-height */}
      <div className="p-4 pb-16 overflow-y-auto max-h-[calc(46vh-4rem)]">
        {/* Location Section */}
        <div className="flex flex-col space-y-2 px-3 py-2 bg-zinc-50/50 rounded-xl mb-4">
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
        </div>

        {/* Address and Hours Section */}
        <div className="flex flex-col space-y-3 mb-4">
          {/* Address Card */}
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

          {/* Hours Card */}
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

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* DNI Services */}
          <div className="p-3 rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <IdCard className="w-4 h-4 text-zinc-800" />
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

          {/* Civil Records */}
          <div className="p-3 rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-zinc-800" />
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
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100">
        <a
          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <MapPin className="w-4 h-4 text-zinc-600" />
            </div>
            <span className="text-sm font-medium text-zinc-700">
              Ver ubicación en Google Maps
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
        </a>
      </div>
    </div>
  );
};

export default LocationCard;
