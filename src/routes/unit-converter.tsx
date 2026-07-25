import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

type Category = "length" | "mass" | "temperature" | "voltage" | "current" | "power" | "energy" | "time" | "pressure";

type UnitDef = { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number };

const CATEGORIES: Record<Category, UnitDef[]> = {
  length: [
    { key: "m", label: "Meter (m)", toBase: v => v, fromBase: v => v },
    { key: "km", label: "Kilometer (km)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: "cm", label: "Centimeter (cm)", toBase: v => v / 100, fromBase: v => v * 100 },
    { key: "mm", label: "Millimeter (mm)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: "in", label: "Inch (in)", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { key: "ft", label: "Foot (ft)", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  ],
  mass: [
    { key: "kg", label: "Kilogram (kg)", toBase: v => v, fromBase: v => v },
    { key: "g", label: "Gram (g)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: "mg", label: "Milligram (mg)", toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { key: "lb", label: "Pound (lb)", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  ],
  temperature: [
    { key: "C", label: "Celsius (°C)", toBase: v => v + 273.15, fromBase: v => v - 273.15 },
    { key: "K", label: "Kelvin (K)", toBase: v => v, fromBase: v => v },
    { key: "F", label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5 / 9 + 273.15, fromBase: v => (v - 273.15) * 9 / 5 + 32 },
  ],
  voltage: [
    { key: "V", label: "Volt (V)", toBase: v => v, fromBase: v => v },
    { key: "mV", label: "Millivolt (mV)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: "kV", label: "Kilovolt (kV)", toBase: v => v * 1000, fromBase: v => v / 1000 },
  ],
  current: [
    { key: "A", label: "Ampere (A)", toBase: v => v, fromBase: v => v },
    { key: "mA", label: "Milliampere (mA)", toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: "uA", label: "Microampere (μA)", toBase: v => v / 1e6, fromBase: v => v * 1e6 },
  ],
  power: [
    { key: "W", label: "Watt (W)", toBase: v => v, fromBase: v => v },
    { key: "kW", label: "Kilowatt (kW)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: "hp", label: "Horsepower (hp)", toBase: v => v * 745.7, fromBase: v => v / 745.7 },
  ],
  energy: [
    { key: "J", label: "Joule (J)", toBase: v => v, fromBase: v => v },
    { key: "kJ", label: "Kilojoule (kJ)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: "cal", label: "Calorie (cal)", toBase: v => v * 4.184, fromBase: v => v / 4.184 },
    { key: "kWh", label: "Kilowatt-hour (kWh)", toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
  ],
  time: [
    { key: "s", label: "Second (s)", toBase: v => v, fromBase: v => v },
    { key: "min", label: "Minute (min)", toBase: v => v * 60, fromBase: v => v / 60 },
    { key: "h", label: "Hour (h)", toBase: v => v * 3600, fromBase: v => v / 3600 },
  ],
  pressure: [
    { key: "Pa", label: "Pascal (Pa)", toBase: v => v, fromBase: v => v },
    { key: "kPa", label: "Kilopascal (kPa)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: "bar", label: "Bar", toBase: v => v * 1e5, fromBase: v => v / 1e5 },
    { key: "atm", label: "Atmosphere (atm)", toBase: v => v * 101325, fromBase: v => v / 101325 },
  ],
};

export const Route = createFileRoute("/unit-converter")({
  head: () => ({
    meta: [
      { title: "Unit Converter — Formula Lab" },
      { name: "description", content: "Convert between engineering units: length, mass, voltage, current, power, energy and more." },
      { property: "og:title", content: "Engineering Unit Converter" },
      { property: "og:description", content: "Fast conversions across engineering units." },
    ],
  }),
  component: UnitConverter,
});

function UnitConverter() {
  const [cat, setCat] = useState<Category>("length");
  const units = CATEGORIES[cat];
  const [from, setFrom] = useState(units[0].key);
  const [to, setTo] = useState(units[1]?.key ?? units[0].key);
  const [value, setValue] = useState("1");

  const fromUnit = units.find(u => u.key === from) ?? units[0];
  const toUnit = units.find(u => u.key === to) ?? units[0];
  const num = Number(value);
  const result = Number.isNaN(num) ? "" : String(Number(toUnit.fromBase(fromUnit.toBase(num)).toPrecision(8)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold">Unit Converter</h1>
      <p className="mt-2 text-muted-foreground">Engineering-grade unit conversions.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.keys(CATEGORIES).map(c => (
          <button
            key={c}
            onClick={() => {
              setCat(c as Category);
              const u = CATEGORIES[c as Category];
              setFrom(u[0].key);
              setTo(u[1]?.key ?? u[0].key);
            }}
            className={`rounded-full border px-3 py-1 text-sm capitalize ${
              cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card-elevated mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</label>
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-lg"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">To</label>
          <select
            value={to}
            onChange={e => setTo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
          <div className="mt-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-lg font-mono">
            {result || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
