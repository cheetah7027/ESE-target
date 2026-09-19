// Seed data for ESE Civil Engineering 2027 Preparation Planner

export const INITIAL_SETTINGS = {
  examDate: '2027-01-10', // ESE Prelims 2027 approximate target date
  startDate: new Date().toISOString().split('T')[0],
  dailyTargetHours: 4.5,
  weekdayHours: 3.5,
  weekendHours: 7.0,
  preparationLevel: 'Intermediate', // Beginner | Intermediate | Advanced
  targetScore: 350,
  negativeMarking: true,
  theme: 'light', // 'light' | 'dark'
  isOnboarded: false,
};

export const INITIAL_SESSIONS = (() => {
  const sessions = [];
  const today = new Date();
  const sampleHours = [3.5, 4.0, 2.5, 4.5, 3.0, 5.0, 4.0];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    sessions.push({
      id: 'sess_init_' + i,
      date: d.toISOString().split('T')[0],
      duration: sampleHours[i % sampleHours.length],
      subjectId: 'som',
      chapterId: 'som-1',
      activity: 'Concept',
      questionsSolved: 20,
      correctAnswers: 16,
      notes: 'Study session'
    });
  }
  return sessions;
})();

export const CIVIL_SUBJECTS = [
  {
    id: 'som',
    name: 'Strength of Materials',
    code: 'SOM',
    category: 'Technical',
    historicalAvg: 18,
    priority: 'Critical',
    description: 'Stress-strain, elastic constants, Mohr circle, bending, shear, torsion, columns, strain energy.',
    chapters: [
      { id: 'som-1', name: 'Stress & Strain', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-2', name: 'Elastic Constants & Relationships', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-3', name: 'Principal Stress & Strains', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-4', name:"Mohr's Circle of Stress", priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-5', name: 'Shear Force & Bending Moment Diagrams', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-6', name: 'Bending Stresses in Beams', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-7', name: 'Shear Stresses in Beams', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-8', name: 'Torsion of Circular Shafts', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-9', name: 'Theory of Columns & Struts', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'som-10', name: 'Strain Energy & Thin Cylinders', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'bmg',
    name: 'Building Materials & Construction',
    code: 'BMC',
    category: 'Technical',
    historicalAvg: 14,
    priority: 'Critical',
    description: 'Timber, bricks, cement, concrete, mortar, paints, bituminous materials, scaffolding.',
    chapters: [
      { id: 'bmg-1', name: 'Cement & Concrete Technology', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'bmg-2', name: 'Bricks & Masonry Works', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'bmg-3', name: 'Timber & Wood Products', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'bmg-4', name: 'Stones, Aggregates & Mortar', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'bmg-5', name: 'Paints, Varnishes & Bitumen', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'rcc',
    name: 'RCC & Concrete Structures',
    code: 'RCC',
    category: 'Technical',
    historicalAvg: 13,
    priority: 'Critical',
    description: 'IS 456 concepts, LSM flexure, shear, torsion, bond, slabs, columns, footings, prestressed concrete.',
    chapters: [
      { id: 'rcc-1', name: 'Limit State Method & Flexure Analysis', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'rcc-2', name: 'Shear, Bond, Development Length & Torsion', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'rcc-3', name: 'One-Way & Two-Way Slabs Design', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'rcc-4', name: 'Short & Slender Columns', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'rcc-5', name: 'Footings & Retaining Walls', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'rcc-6', name: 'Prestressed Concrete Fundamentals', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'geotech',
    name: 'Geotechnical Engineering',
    code: 'GEO',
    category: 'Technical',
    historicalAvg: 13,
    priority: 'Critical',
    description: 'Soil properties, index tests, permeability, consolidation, shear strength, earth pressure, foundations.',
    chapters: [
      { id: 'geo-1', name: 'Three-Phase System & Soil Index Properties', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-2', name: 'Soil Classification & Structure', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-3', name: 'Permeability & Seepage Analysis', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-4', name: 'Effective Stress Principle & Compaction', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-5', name: '1D Consolidation Theory & Settlement', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-6', name: 'Shear Strength of Soil (Mohr-Coulomb)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-7', name: 'Earth Pressure Theories (Rankine & Coulomb)', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'geo-8', name: 'Shallow & Deep Foundations Bearing Capacity', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'transport',
    name: 'Transportation Engineering',
    code: 'TE',
    category: 'Technical',
    historicalAvg: 13,
    priority: 'Critical',
    description: 'Highway geometric design, pavement design, traffic engineering, railway track geometry, airport planning.',
    chapters: [
      { id: 'te-1', name: 'Highway Alignment & Sight Distances (SSD/OSD)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'te-2', name: 'Horizontal Alignment & Superelevation', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'te-3', name: 'Traffic Engineering & Signal Design (Webster)', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'te-4', name: 'Flexible & Rigid Pavement Design', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'te-5', name: 'Highway Materials & Testing (Marshal Stability)', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'te-6', name: 'Railway Engineering Track Geometry & Turnouts', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'te-7', name: 'Airport Planning & Runway Length Corrections', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'fm',
    name: 'Fluid Mechanics & Hydraulics',
    code: 'FM',
    category: 'Technical',
    historicalAvg: 13,
    priority: 'Critical',
    description: 'Fluid properties, statics, kinematics, dynamics, pipe flow, open channel flow, hydraulic machines.',
    chapters: [
      { id: 'fm-1', name: 'Fluid Properties & Hydrostatic Forces', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'fm-2', name: 'Buoyancy, Flotation & Fluid Kinematics', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'fm-3', name: 'Fluid Dynamics & Bernoulli Equation', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'fm-4', name: 'Laminar & Turbulent Pipe Flow (Darcy)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'fm-5', name: 'Boundary Layer Theory & Drag/Lift', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'fm-6', name: 'Open Channel Flow (Specific Energy & Hydraulic Jump)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'fm-7', name: 'Hydraulic Turbines & Pumps', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'env',
    name: 'Environmental Engineering',
    code: 'ENV',
    category: 'Technical',
    historicalAvg: 12,
    priority: 'High',
    description: 'Water demand, water quality, treatment units, sewerage, BOD/COD, air pollution, solid waste.',
    chapters: [
      { id: 'env-1', name: 'Water Quality Parameters & Standards', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'env-2', name: 'Water Treatment Units (Sedimentation, Filtration, Chlorination)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'env-3', name: 'Sewerage Systems & Wastewater Characteristics (BOD Kinetics)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'env-4', name: 'Wastewater Treatment (ASP, Trickling Filter, Septic Tank)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'env-5', name: 'Air Pollution & Noise Pollution Controls', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'env-6', name: 'Municipal Solid Waste & Hazardous Waste Management', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'steel',
    name: 'Steel Structures',
    code: 'STEEL',
    category: 'Technical',
    historicalAvg: 11,
    priority: 'High',
    description: 'Connections (bolted, welded), tension members, compression members, flexural members, plate girders, gantry.',
    chapters: [
      { id: 'stl-1', name: 'Bolted & Welded Connections Design (IS 800)', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'stl-2', name: 'Tension Members & Net Sectional Area', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'stl-3', name: 'Compression Members & Built-up Columns', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'stl-4', name: 'Beams & Flexural Members', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'stl-5', name: 'Plate Girders & Industrial Roof Trusses', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'cpm',
    name: 'Construction Management & Equipment',
    code: 'CPM',
    category: 'Technical',
    historicalAvg: 12,
    priority: 'High',
    description: 'CPM/PERT network techniques, float/slack, crashing, earthwork machinery, economics, tendering.',
    chapters: [
      { id: 'cpm-1', name: 'Network Diagram Construction & Rules', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'cpm-2', name: 'CPM Critical Path Method & Floats Analysis', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'cpm-3', name: 'PERT Probabilistic Analysis & Variance', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'cpm-4', name: 'Time-Cost Optimization & Project Crashing', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'cpm-5', name: 'Construction Machinery (Excavators, Hauling, Compactors)', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'survey',
    name: 'Surveying & Positioning',
    code: 'SUR',
    category: 'Technical',
    historicalAvg: 11,
    priority: 'High',
    description: 'Levelling, compass, traverse, curves, EDM, GPS, photogrammetry, remote sensing.',
    chapters: [
      { id: 'sur-1', name: 'Fundamental Concepts & Chain Surveying', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sur-2', name: 'Compass Surveying & Local Attraction Corrections', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sur-3', name: 'Levelling, Reciprocal Levelling & Contouring', priority: 'Critical', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sur-4', name: 'Theodolite Traverse & Tacheometry', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sur-5', name: 'Curves Design (Horizontal, Vertical, Transition)', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sur-6', name: 'GPS, GIS, Remote Sensing & Photogrammetry', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'sa',
    name: 'Structural Analysis',
    code: 'SA',
    category: 'Technical',
    historicalAvg: 6,
    priority: 'Medium',
    description: 'Static & kinematic indeterminacy, ILD, slope deflection, moment distribution, matrix methods.',
    chapters: [
      { id: 'sa-1', name: 'Static & Kinematic Indeterminacy of Trusses/Frames', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sa-2', name: 'Influence Line Diagrams (ILD) for Beams & Trusses', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sa-3', name: 'Energy Theorems & Deflection Methods', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sa-4', name: 'Slope Deflection & Moment Distribution Methods', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'sa-5', name: 'Arches, Cables & Matrix Stiffness Method', priority: 'Low', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'irrigation',
    name: 'Irrigation Engineering',
    code: 'IRR',
    category: 'Technical',
    historicalAvg: 9,
    priority: 'Medium',
    description: 'Crop water requirements, duty/delta, canal design (Lacey/Kennedy), gravity dams, spillways.',
    chapters: [
      { id: 'irr-1', name: 'Water Requirement of Crops (Duty, Delta, Consumptive Use)', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'irr-2', name: 'Canal Design Theories (Kennedy & Lacey)', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'irr-3', name: 'Weirs, Barrages & Seepage Theories (Bligh/Khosla)', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'irr-4', name: 'Gravity Dams, Earth Dams & Spillways', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'hydrology',
    name: 'Engineering Hydrology',
    code: 'HYD',
    category: 'Technical',
    historicalAvg: 4,
    priority: 'Low',
    description: 'Precipitation, losses, unit hydrograph, flood routing, groundwater well hydraulics.',
    chapters: [
      { id: 'hyd-1', name: 'Precipitation Analysis & Evaporation Losses', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'hyd-2', name: 'Infiltration Indices (Phi & W Index) & Runoff', priority: 'Medium', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'hyd-3', name: 'Hydrograph Theory & Unit Hydrograph S-Curve', priority: 'High', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'hyd-4', name: 'Flood Routing & Well Hydraulics (Steady Flow)', priority: 'Low', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
  {
    id: 'geology',
    name: 'Engineering Geology',
    code: 'EG',
    category: 'Technical',
    historicalAvg: 2,
    priority: 'Low',
    description: 'Rock types, structural geology, dip/strike, geological investigation for dams and tunnels.',
    chapters: [
      { id: 'eg-1', name: 'Mineralogy, Rock Types & Weathering', priority: 'Low', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
      { id: 'eg-2', name: 'Structural Features (Folds, Faults, Joints) & Site Selection', priority: 'Low', status: 'not-started', studyHours: 0, pyqsAttempted: 0, pyqsCorrect: 0, lastStudied: null, nextRevision: null, revisionCount: 0 },
    ],
  },
];

export const PAPER_1_SUBJECTS = [
  { id: 'p1-math', name: 'Engineering Mathematics', code: 'MATH', priority: 'Critical', chapters: [
    { id: 'p1m-1', name: 'Linear Algebra & Matrices', status: 'not-started', studyHours: 0 },
    { id: 'p1m-2', name: 'Calculus & Differential Equations', status: 'not-started', studyHours: 0 },
    { id: 'p1m-3', name: 'Probability & Statistics', status: 'not-started', studyHours: 0 },
    { id: 'p1m-4', name: 'Numerical Methods', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-apt', name: 'Engineering Aptitude & Reasoning', code: 'APT', priority: 'Critical', chapters: [
    { id: 'p1a-1', name: 'Logical Reasoning & Data Interpretation', status: 'not-started', studyHours: 0 },
    { id: 'p1a-2', name: 'Quantitative Aptitude & Spatial Ability', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-ethics', name: 'Ethics & Values in Engineering', code: 'ETH', priority: 'High', chapters: [
    { id: 'p1e-1', name: 'Professional Ethics & Code of Conduct', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-ict', name: 'Information & Communication Tech (ICT)', code: 'ICT', priority: 'High', chapters: [
    { id: 'p1i-1', name: 'Networking, Cyber Security & e-Governance', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-env', name: 'Environment, Energy & Climate Change', code: 'E&E', priority: 'High', chapters: [
    { id: 'p1env-1', name: 'Ecology, Biodiversity & Renewable Energy', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-proj', name: 'Project Management & Quality Standards', code: 'PM', priority: 'High', chapters: [
    { id: 'p1pm-1', name: 'Quality Tools, ISO Standards & Project Life Cycle', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-mat', name: 'Material Science & Engineering', code: 'MS', priority: 'Medium', chapters: [
    { id: 'p1ms-1', name: 'Crystal Structures, Alloys & Nano Materials', status: 'not-started', studyHours: 0 }
  ]},
  { id: 'p1-design', name: 'Design, Drawing & Industrial Safety', code: 'DES', priority: 'Medium', chapters: [
    { id: 'p1d-1', name: 'Engineering Curves, Projections & Safety Codes', status: 'not-started', studyHours: 0 }
  ]}
];

export const INITIAL_ROADMAP = [
  { id: 'rm-1', month: 'SEP 2026', title: 'Setup + Baseline Assessment', subjects: ['SOM Baseline', 'Maths'], completed: false, isCurrent: true },
  { id: 'rm-2', month: 'OCT 2026', title: 'Strength of Materials & BMC', subjects: ['Strength of Materials', 'Building Materials'], completed: false },
  { id: 'rm-3', month: 'NOV 2026', title: 'Fluid Mechanics & Hydraulics', subjects: ['Fluid Mechanics', 'Open Channel Flow'], completed: false },
  { id: 'rm-4', month: 'DEC 2026', title: 'Geotechnical Engineering', subjects: ['Soil Mechanics', 'Foundation Engg'], completed: false },
  { id: 'rm-5', month: 'JAN 2027', title: 'RCC & Structural Analysis', subjects: ['RCC Structures', 'Structural Analysis'], completed: false },
  { id: 'rm-6', month: 'FEB 2027', title: 'Steel Structures & CPM', subjects: ['Steel Structures', 'Construction Mgmt'], completed: false },
  { id: 'rm-7', month: 'MAR 2027', title: 'Transportation & Surveying', subjects: ['Highway Engg', 'Surveying'], completed: false },
  { id: 'rm-8', month: 'APR 2027', title: 'Environmental & Irrigation', subjects: ['Environmental Engg', 'Irrigation'], completed: false },
  { id: 'rm-9', month: 'MAY 2027', title: 'Paper I General Studies Sprint', subjects: ['Ethics', 'ICT', 'Energy', 'Maths'], completed: false },
  { id: 'rm-10', month: 'JUN 2027', title: 'PYQ Marathon & Weak Topic Fixing', subjects: ['All Technical PYQs'], completed: false },
  { id: 'rm-11', month: 'JUL 2027', title: 'First Full Revision & Subject Mocks', subjects: ['Revision R1 & R2'], completed: false },
  { id: 'rm-12', month: 'AUG 2027', title: 'Full Length Test Series (Paper I + II)', subjects: ['FLT Mocks 1 - 10'], completed: false },
  { id: 'rm-13', month: 'SEP 2027', title: 'Final Polish & Exam Execution', subjects: ['Formula Book', 'Mistake Review'], completed: false }
];
