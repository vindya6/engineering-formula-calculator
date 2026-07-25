// Central formula library for the Engineering Formula Calculator platform.
// Each formula defines its variables + a `solve` map keyed by the unknown variable.

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface FormulaVar {
  key: string;
  name: string;
  unit: string;
  symbol?: string;
}

export interface Formula {
  id: string;
  name: string;
  subject: SubjectId;
  chapter: string;
  expression: string;
  description: string;
  theory: string;
  whenToUse: string;
  application: string;
  memoryTrick?: string;
  commonMistakes?: string[];
  difficulty: Difficulty;
  variables: FormulaVar[];
  // For each variable that can be the unknown, a function that computes it from the others
  solve: Record<string, (v: Record<string, number>) => number>;
  related?: string[];
}

export type SubjectId =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "beee"
  | "cprogramming"
  | "english";

export interface Subject {
  id: SubjectId;
  name: string;
  short: string;
  description: string;
  icon: string;
  accent: "primary" | "sky" | "mint" | "peach" | "lavender";
  difficulty: Difficulty;
}

export const SUBJECTS: Subject[] = [
  { id: "mathematics", name: "Engineering Mathematics", short: "Mathematics", description: "Linear algebra, matrices, calculus and functions.", icon: "Sigma", accent: "primary", difficulty: "Medium" },
  { id: "physics", name: "Engineering Physics", short: "Physics", description: "Mechanics, waves, optics and modern physics.", icon: "Atom", accent: "sky", difficulty: "Medium" },
  { id: "chemistry", name: "Engineering Chemistry", short: "Chemistry", description: "Stoichiometry, gas laws and thermochemistry.", icon: "FlaskConical", accent: "mint", difficulty: "Easy" },
  { id: "beee", name: "Basic Electrical & Electronics", short: "BEEE", description: "Ohm's law, power, AC circuits and semiconductors.", icon: "Zap", accent: "peach", difficulty: "Medium" },
  { id: "cprogramming", name: "Programming for Problem Solving", short: "C Programming", description: "Algorithm complexity, data-structure formulas and logic.", icon: "Code2", accent: "lavender", difficulty: "Easy" },
  { id: "english", name: "English Communication Skills", short: "English", description: "Grammar patterns and communication frameworks.", icon: "MessageSquare", accent: "primary", difficulty: "Easy" },
];

export const FORMULAS: Formula[] = [
  // ============ BEEE ============
  {
    id: "ohms-law", name: "Ohm's Law", subject: "beee", chapter: "DC Circuits",
    expression: "V = I × R", difficulty: "Easy",
    description: "Relates voltage, current and resistance in a conductor.",
    theory: "Georg Ohm found that current through a conductor is directly proportional to the voltage across it, at a constant temperature.",
    whenToUse: "Use whenever any two of voltage, current or resistance are known and the third is required.",
    application: "Designing resistors for LEDs, sizing wires, analysing DC circuits.",
    memoryTrick: "VIR triangle — cover the unknown to see the formula.",
    commonMistakes: ["Mixing mA with A", "Using AC RMS values in DC formulas"],
    variables: [
      { key: "V", name: "Voltage", unit: "V", symbol: "V" },
      { key: "I", name: "Current", unit: "A", symbol: "I" },
      { key: "R", name: "Resistance", unit: "Ω", symbol: "R" },
    ],
    solve: { V: v => v.I * v.R, I: v => v.V / v.R, R: v => v.V / v.I },
    related: ["electric-power", "resistors-series"],
  },
  {
    id: "electric-power", name: "Electric Power", subject: "beee", chapter: "DC Circuits",
    expression: "P = V × I", difficulty: "Easy",
    description: "Power dissipated by an electrical component.",
    theory: "Power is the rate of doing work; in electrical terms it is the product of the voltage across a component and the current through it.",
    whenToUse: "To calculate bulb wattage, appliance power, or heat dissipation.",
    application: "Rating household appliances, choosing power supplies.",
    memoryTrick: "PIV — 'Pi V' sounds like Pie-V.",
    variables: [
      { key: "P", name: "Power", unit: "W" },
      { key: "V", name: "Voltage", unit: "V" },
      { key: "I", name: "Current", unit: "A" },
    ],
    solve: { P: v => v.V * v.I, V: v => v.P / v.I, I: v => v.P / v.V },
    related: ["ohms-law"],
  },
  {
    id: "resistors-series", name: "Resistors in Series", subject: "beee", chapter: "DC Circuits",
    expression: "R = R₁ + R₂", difficulty: "Easy",
    description: "Equivalent resistance for two resistors in series.",
    theory: "In series, the same current flows through each resistor and voltages add up.",
    whenToUse: "When resistors are connected end-to-end.",
    application: "Voltage dividers, current limiters.",
    variables: [
      { key: "R", name: "Total Resistance", unit: "Ω" },
      { key: "R1", name: "Resistance 1", unit: "Ω" },
      { key: "R2", name: "Resistance 2", unit: "Ω" },
    ],
    solve: {
      R: v => v.R1 + v.R2,
      R1: v => v.R - v.R2,
      R2: v => v.R - v.R1,
    },
  },
  {
    id: "resistors-parallel", name: "Resistors in Parallel", subject: "beee", chapter: "DC Circuits",
    expression: "1/R = 1/R₁ + 1/R₂", difficulty: "Medium",
    description: "Equivalent resistance for two resistors in parallel.",
    theory: "In parallel, voltage across each resistor is equal and currents add up.",
    whenToUse: "When resistors share both terminals.",
    application: "Load sharing, redundant paths.",
    variables: [
      { key: "R", name: "Total Resistance", unit: "Ω" },
      { key: "R1", name: "Resistance 1", unit: "Ω" },
      { key: "R2", name: "Resistance 2", unit: "Ω" },
    ],
    solve: {
      R: v => (v.R1 * v.R2) / (v.R1 + v.R2),
      R1: v => (v.R * v.R2) / (v.R2 - v.R),
      R2: v => (v.R * v.R1) / (v.R1 - v.R),
    },
  },
  {
    id: "capacitor-energy", name: "Energy Stored in a Capacitor", subject: "beee", chapter: "Capacitors",
    expression: "E = ½ × C × V²", difficulty: "Medium",
    description: "Energy stored in the electric field of a capacitor.",
    theory: "Work done against the electric field while charging a capacitor is stored as electrostatic energy.",
    whenToUse: "Designing flash circuits, energy buffers, DC-link capacitors.",
    application: "Camera flashes, power electronics, filter design.",
    variables: [
      { key: "E", name: "Energy", unit: "J" },
      { key: "C", name: "Capacitance", unit: "F" },
      { key: "V", name: "Voltage", unit: "V" },
    ],
    solve: {
      E: v => 0.5 * v.C * v.V * v.V,
      C: v => (2 * v.E) / (v.V * v.V),
      V: v => Math.sqrt((2 * v.E) / v.C),
    },
  },
  // ============ PHYSICS ============
  {
    id: "newton-second", name: "Newton's Second Law", subject: "physics", chapter: "Mechanics",
    expression: "F = m × a", difficulty: "Easy",
    description: "Force required to accelerate a mass.",
    theory: "The net external force on an object equals the mass of the object times its acceleration.",
    whenToUse: "Whenever mass, acceleration or force are related.",
    application: "Vehicle dynamics, rocketry, structural loads.",
    memoryTrick: "Fma — 'Formula'.",
    variables: [
      { key: "F", name: "Force", unit: "N" },
      { key: "m", name: "Mass", unit: "kg" },
      { key: "a", name: "Acceleration", unit: "m/s²" },
    ],
    solve: { F: v => v.m * v.a, m: v => v.F / v.a, a: v => v.F / v.m },
  },
  {
    id: "kinetic-energy", name: "Kinetic Energy", subject: "physics", chapter: "Energy",
    expression: "KE = ½ × m × v²", difficulty: "Easy",
    description: "Energy of a moving mass.",
    theory: "Work-energy theorem: net work done equals change in kinetic energy.",
    whenToUse: "Calculating energy of moving vehicles, projectiles.",
    application: "Collision analysis, braking distances.",
    variables: [
      { key: "KE", name: "Kinetic Energy", unit: "J" },
      { key: "m", name: "Mass", unit: "kg" },
      { key: "v", name: "Velocity", unit: "m/s" },
    ],
    solve: {
      KE: v => 0.5 * v.m * v.v * v.v,
      m: v => (2 * v.KE) / (v.v * v.v),
      v: v => Math.sqrt((2 * v.KE) / v.m),
    },
  },
  {
    id: "potential-energy", name: "Gravitational Potential Energy", subject: "physics", chapter: "Energy",
    expression: "PE = m × g × h", difficulty: "Easy",
    description: "Energy due to a mass being at height in a gravitational field.",
    theory: "Work done against gravity is stored as potential energy.",
    whenToUse: "Hydro power, elevated tank sizing, roller coasters.",
    application: "Dam design, pendulum problems.",
    variables: [
      { key: "PE", name: "Potential Energy", unit: "J" },
      { key: "m", name: "Mass", unit: "kg" },
      { key: "g", name: "Gravity", unit: "m/s²" },
      { key: "h", name: "Height", unit: "m" },
    ],
    solve: {
      PE: v => v.m * v.g * v.h,
      m: v => v.PE / (v.g * v.h),
      g: v => v.PE / (v.m * v.h),
      h: v => v.PE / (v.m * v.g),
    },
  },
  {
    id: "wave-speed", name: "Wave Speed", subject: "physics", chapter: "Waves",
    expression: "v = f × λ", difficulty: "Easy",
    description: "Speed of a wave from frequency and wavelength.",
    theory: "Every point on a wave travels one wavelength in one period.",
    whenToUse: "Sound, light, radio wave problems.",
    application: "Antenna design, acoustics.",
    variables: [
      { key: "v", name: "Wave Speed", unit: "m/s" },
      { key: "f", name: "Frequency", unit: "Hz" },
      { key: "lambda", name: "Wavelength", unit: "m", symbol: "λ" },
    ],
    solve: {
      v: v => v.f * v.lambda,
      f: v => v.v / v.lambda,
      lambda: v => v.v / v.f,
    },
  },
  {
    id: "kinematics-v", name: "Kinematics: Final Velocity", subject: "physics", chapter: "Kinematics",
    expression: "v = u + a × t", difficulty: "Easy",
    description: "Final velocity under constant acceleration.",
    theory: "First equation of motion for uniformly accelerated linear motion.",
    whenToUse: "Straight-line motion problems with constant acceleration.",
    application: "Free fall, projectile launch, vehicle acceleration.",
    variables: [
      { key: "v", name: "Final Velocity", unit: "m/s" },
      { key: "u", name: "Initial Velocity", unit: "m/s" },
      { key: "a", name: "Acceleration", unit: "m/s²" },
      { key: "t", name: "Time", unit: "s" },
    ],
    solve: {
      v: x => x.u + x.a * x.t,
      u: x => x.v - x.a * x.t,
      a: x => (x.v - x.u) / x.t,
      t: x => (x.v - x.u) / x.a,
    },
  },
  // ============ MATHEMATICS ============
  {
    id: "quadratic", name: "Quadratic Formula (positive root)", subject: "mathematics", chapter: "Algebra",
    expression: "x = (-b + √(b² − 4ac)) / (2a)", difficulty: "Medium",
    description: "One root of a quadratic equation ax² + bx + c = 0.",
    theory: "Derived by completing the square on the general quadratic.",
    whenToUse: "Any second-degree polynomial equation.",
    application: "Projectile motion, optimisation, engineering models.",
    variables: [
      { key: "a", name: "Coefficient a", unit: "" },
      { key: "b", name: "Coefficient b", unit: "" },
      { key: "c", name: "Coefficient c", unit: "" },
      { key: "x", name: "Root x", unit: "" },
    ],
    solve: {
      x: v => (-v.b + Math.sqrt(v.b * v.b - 4 * v.a * v.c)) / (2 * v.a),
    },
  },
  {
    id: "pythagoras", name: "Pythagoras' Theorem", subject: "mathematics", chapter: "Geometry",
    expression: "c² = a² + b²", difficulty: "Easy",
    description: "Length of the hypotenuse in a right-angled triangle.",
    theory: "For any right triangle the sum of squares on the legs equals the square on the hypotenuse.",
    whenToUse: "Right-triangle problems, distance in 2D coordinates.",
    application: "Surveying, computer graphics.",
    variables: [
      { key: "a", name: "Side a", unit: "" },
      { key: "b", name: "Side b", unit: "" },
      { key: "c", name: "Hypotenuse c", unit: "" },
    ],
    solve: {
      c: v => Math.sqrt(v.a * v.a + v.b * v.b),
      a: v => Math.sqrt(v.c * v.c - v.b * v.b),
      b: v => Math.sqrt(v.c * v.c - v.a * v.a),
    },
  },
  {
    id: "matrix-2x2-det", name: "Determinant of a 2×2 Matrix", subject: "mathematics", chapter: "Matrices",
    expression: "det = a·d − b·c", difficulty: "Easy",
    description: "Scalar value describing invertibility of a 2×2 matrix.",
    theory: "A non-zero determinant means the matrix is invertible and the transformation preserves dimension.",
    whenToUse: "Solving 2×2 linear systems, checking invertibility.",
    application: "Computer graphics transforms.",
    variables: [
      { key: "a", name: "a", unit: "" },
      { key: "b", name: "b", unit: "" },
      { key: "c", name: "c", unit: "" },
      { key: "d", name: "d", unit: "" },
      { key: "det", name: "Determinant", unit: "" },
    ],
    solve: { det: v => v.a * v.d - v.b * v.c },
  },
  {
    id: "distance-2d", name: "Distance Between Two Points", subject: "mathematics", chapter: "Coordinate Geometry",
    expression: "d = √((x₂−x₁)² + (y₂−y₁)²)", difficulty: "Easy",
    description: "Euclidean distance between two points in a plane.",
    theory: "Direct application of Pythagoras' theorem to coordinate differences.",
    whenToUse: "Any 2D coordinate geometry problem.",
    application: "Path planning, computer graphics.",
    variables: [
      { key: "x1", name: "x₁", unit: "" },
      { key: "y1", name: "y₁", unit: "" },
      { key: "x2", name: "x₂", unit: "" },
      { key: "y2", name: "y₂", unit: "" },
      { key: "d", name: "Distance", unit: "" },
    ],
    solve: { d: v => Math.sqrt((v.x2 - v.x1) ** 2 + (v.y2 - v.y1) ** 2) },
  },
  {
    id: "compound-interest", name: "Compound Interest", subject: "mathematics", chapter: "Finance",
    expression: "A = P × (1 + r)ⁿ", difficulty: "Medium",
    description: "Future value of a principal with compounding.",
    theory: "Interest is added to the principal each period, growing exponentially.",
    whenToUse: "Loan, deposit and investment calculations.",
    application: "Personal finance, engineering economics.",
    variables: [
      { key: "A", name: "Amount", unit: "" },
      { key: "P", name: "Principal", unit: "" },
      { key: "r", name: "Rate (decimal)", unit: "" },
      { key: "n", name: "Periods", unit: "" },
    ],
    solve: {
      A: v => v.P * Math.pow(1 + v.r, v.n),
      P: v => v.A / Math.pow(1 + v.r, v.n),
    },
  },
  // ============ CHEMISTRY ============
  {
    id: "ideal-gas", name: "Ideal Gas Law", subject: "chemistry", chapter: "Gas Laws",
    expression: "P × V = n × R × T", difficulty: "Medium",
    description: "State equation for an ideal gas.",
    theory: "Combines Boyle, Charles and Avogadro's laws assuming no intermolecular forces.",
    whenToUse: "Estimating gas behaviour at moderate pressures and temperatures.",
    application: "HVAC, combustion, pneumatic systems.",
    variables: [
      { key: "P", name: "Pressure", unit: "Pa" },
      { key: "V", name: "Volume", unit: "m³" },
      { key: "n", name: "Moles", unit: "mol" },
      { key: "R", name: "Gas Constant", unit: "J/mol·K" },
      { key: "T", name: "Temperature", unit: "K" },
    ],
    solve: {
      P: v => (v.n * v.R * v.T) / v.V,
      V: v => (v.n * v.R * v.T) / v.P,
      n: v => (v.P * v.V) / (v.R * v.T),
      T: v => (v.P * v.V) / (v.n * v.R),
    },
  },
  {
    id: "molarity", name: "Molarity", subject: "chemistry", chapter: "Solutions",
    expression: "M = n / V", difficulty: "Easy",
    description: "Concentration in moles of solute per litre of solution.",
    theory: "Molarity is the SI-derived concentration unit for stoichiometric calculations.",
    whenToUse: "Preparing solutions, titrations.",
    application: "Lab work, industrial mixing.",
    variables: [
      { key: "M", name: "Molarity", unit: "mol/L" },
      { key: "n", name: "Moles", unit: "mol" },
      { key: "V", name: "Volume", unit: "L" },
    ],
    solve: {
      M: v => v.n / v.V,
      n: v => v.M * v.V,
      V: v => v.n / v.M,
    },
  },
  {
    id: "ph", name: "pH of a Solution", subject: "chemistry", chapter: "Acid–Base",
    expression: "pH = −log₁₀[H⁺]", difficulty: "Easy",
    description: "Acidity measure based on hydrogen ion concentration.",
    theory: "Logarithmic scale defined by Sørensen; each unit is a 10× change.",
    whenToUse: "Any acid or base concentration problem.",
    application: "Water treatment, biology, food chemistry.",
    variables: [
      { key: "pH", name: "pH", unit: "" },
      { key: "H", name: "[H⁺]", unit: "mol/L" },
    ],
    solve: {
      pH: v => -Math.log10(v.H),
      H: v => Math.pow(10, -v.pH),
    },
  },
  {
    id: "heat-capacity", name: "Heat Energy (Specific Heat)", subject: "chemistry", chapter: "Thermochemistry",
    expression: "Q = m × c × ΔT", difficulty: "Easy",
    description: "Heat required to change the temperature of a substance.",
    theory: "Energy transferred is proportional to mass, specific heat and temperature change.",
    whenToUse: "Heating/cooling calculations.",
    application: "Heat exchangers, calorimetry.",
    variables: [
      { key: "Q", name: "Heat", unit: "J" },
      { key: "m", name: "Mass", unit: "kg" },
      { key: "c", name: "Specific Heat", unit: "J/kg·K" },
      { key: "dT", name: "ΔTemperature", unit: "K" },
    ],
    solve: {
      Q: v => v.m * v.c * v.dT,
      m: v => v.Q / (v.c * v.dT),
      c: v => v.Q / (v.m * v.dT),
      dT: v => v.Q / (v.m * v.c),
    },
  },
  // ============ C PROGRAMMING ============
  {
    id: "array-address", name: "Array Element Address", subject: "cprogramming", chapter: "Arrays",
    expression: "addr = base + i × size", difficulty: "Easy",
    description: "Memory address of the i-th element of a 1D array.",
    theory: "Arrays are contiguous blocks; C uses pointer arithmetic sized by element type.",
    whenToUse: "Pointer arithmetic, low-level access.",
    application: "Embedded programming, memory layout.",
    variables: [
      { key: "addr", name: "Address", unit: "" },
      { key: "base", name: "Base Address", unit: "" },
      { key: "i", name: "Index", unit: "" },
      { key: "size", name: "Element Size", unit: "bytes" },
    ],
    solve: { addr: v => v.base + v.i * v.size },
  },
  {
    id: "factorial-count", name: "Factorial n!", subject: "cprogramming", chapter: "Recursion",
    expression: "n! = n × (n−1) × … × 1", difficulty: "Easy",
    description: "Product of integers from 1 to n; classic recursion example.",
    theory: "Base case 0! = 1; recursive case n! = n·(n−1)!",
    whenToUse: "Combinatorics, algorithm examples.",
    application: "Permutations, probability.",
    variables: [
      { key: "n", name: "n", unit: "" },
      { key: "fact", name: "n!", unit: "" },
    ],
    solve: {
      fact: v => {
        let r = 1;
        for (let i = 2; i <= v.n; i++) r *= i;
        return r;
      },
    },
  },
  {
    id: "binary-search-steps", name: "Binary Search Steps", subject: "cprogramming", chapter: "Algorithms",
    expression: "steps ≈ log₂(n)", difficulty: "Easy",
    description: "Worst-case comparisons for binary search on n elements.",
    theory: "Each step halves the search range, giving logarithmic complexity.",
    whenToUse: "Estimating algorithm performance.",
    application: "Search in sorted data.",
    variables: [
      { key: "n", name: "Array Size", unit: "" },
      { key: "steps", name: "Steps", unit: "" },
    ],
    solve: { steps: v => Math.ceil(Math.log2(v.n)) },
  },
  // ============ ENGLISH (informational — no numeric solver) ============
  {
    id: "active-passive", name: "Active → Passive Voice", subject: "english", chapter: "Grammar",
    expression: "Subject + verb + object  →  Object + be + past-participle + by + subject",
    difficulty: "Easy",
    description: "Rule to transform an active sentence into passive voice.",
    theory: "Passive voice puts the receiver of the action at the start; the doer becomes optional.",
    whenToUse: "Reports, formal writing, scientific descriptions.",
    application: "Technical writing, lab reports.",
    memoryTrick: "OBP: Object, Be-verb, Past-participle.",
    variables: [],
    solve: {},
  },
  {
    id: "swot-frame", name: "SWOT Communication Frame", subject: "english", chapter: "Presentation",
    expression: "Strengths · Weaknesses · Opportunities · Threats",
    difficulty: "Easy",
    description: "Structured framework for presentations and self-introductions.",
    theory: "Balances internal and external factors so speakers cover positive and negative aspects.",
    whenToUse: "Group discussions, project pitches.",
    application: "Interviews, business communication.",
    variables: [],
    solve: {},
  },
  {
    id: "star-answer", name: "STAR Answer Framework", subject: "english", chapter: "Interviews",
    expression: "Situation · Task · Action · Result",
    difficulty: "Easy",
    description: "Structure behavioural interview answers clearly.",
    theory: "STAR forces a narrative that moves from context to outcome, keeping answers focused.",
    whenToUse: "Behavioural interviews, essays about experience.",
    application: "Placement interviews.",
    variables: [],
    solve: {},
  },
];

export function getFormula(id: string): Formula | undefined {
  return FORMULAS.find(f => f.id === id);
}

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find(s => s.id === id);
}

export function formulasBySubject(id: SubjectId): Formula[] {
  return FORMULAS.filter(f => f.subject === id);
}

export function searchFormulas(query: string): Formula[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return FORMULAS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.description.toLowerCase().includes(q) ||
    f.expression.toLowerCase().includes(q) ||
    f.chapter.toLowerCase().includes(q) ||
    f.variables.some(v => v.name.toLowerCase().includes(q) || v.key.toLowerCase().includes(q))
  ).slice(0, 20);
}
