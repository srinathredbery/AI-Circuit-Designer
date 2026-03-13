const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const convertToKicadSch = (json: any): string => {
  if (!json || !json.schematic) {
    console.error("convertToKicadSch: Invalid JSON structure", json);
    return "";
  }

  const { name, components, connections } = json.schematic;
  
  // Minimal modern KiCad S-Expression format (v6+)
  let sch = `(kicad_sch (version 20211123) (generator eeschema)\n\n`;
  sch += `  (uuid ${uuidv4()})\n\n`;
  sch += `  (paper "A4")\n\n`;
  sch += `  (title_block\n    (title "${name || "Circuit"}")\n  )\n\n`;

  // We'll rely on KiCanvas having the standard Device/etc libraries loaded via the 'libraries' attribute.
  // In v6+, symbols usually need to be defined in lib_symbols if they aren't in the global cache, 
  // but KiCanvas is usually good at finding standard ones if we provide the lib_id.

  const compPositions: { [ref: string]: { x: number, y: number } } = {};

  // Component Mapping Logic
  components.forEach((comp: any, index: number) => {
    // Spread them out on a scale that works for KiCad (mm)
    // KiCad v6 uses mm, but internal units are often 1/1000 inch for legacy. 
    // In S-expressions, these are usually mm.
    const x = 50 + (index * 40); 
    const y = 50;
    compPositions[comp.ref] = { x, y };

    let libType = comp.type;
    // Standard Device mapping
    if (libType === "Resistor" || libType === "R") libType = "Device:R";
    else if (libType === "Capacitor" || libType === "C") libType = "Device:C";
    else if (libType === "Inductor" || libType === "L") libType = "Device:L";
    else if (libType === "Transistor" || libType === "Q") libType = "Device:Q_NPN_BCE";
    else if (libType === "LED") libType = "Device:LED";
    else if (libType === "Antenna") libType = "Device:Antenna";
    else if (libType === "Speaker") libType = "Device:Speaker";
    else if (!libType.includes(":")) libType = `Device:${libType}`;

    sch += `  (symbol (lib_id "${libType}") (at ${x} ${y} 0) (unit 1)\n`;
    sch += `    (in_bom yes) (on_board yes) (fields_autoplaced)\n`;
    sch += `    (uuid ${uuidv4()})\n`;
    sch += `    (property "Reference" "${comp.ref}" (id 0) (at ${x} ${y - 5} 0))\n`;
    sch += `    (property "Value" "${comp.value}" (id 1) (at ${x} ${y + 5} 0))\n`;
    sch += `  )\n\n`;
  });

  // Connection Mapping Logic
  connections.forEach((conn: any) => {
    const fromParts = conn.from.split(".");
    const toParts = conn.to.split(".");
    const fromRef = fromParts[0];
    const toRef = toParts[0];

    const fromPos = compPositions[fromRef] || { x: 50, y: 50 };
    let toPos = compPositions[toRef] || { x: 50, y: 50 };
    
    if (conn.to === "GND") {
        toPos = { x: fromPos.x, y: fromPos.y + 20 };
        // We could add a GND symbol here too
        sch += `  (symbol (lib_id "power:GND") (at ${toPos.x} ${toPos.y} 0) (unit 1)\n`;
        sch += `    (uuid ${uuidv4()})\n`;
        sch += `    (property "Reference" "#PWR?" (id 0) (at ${toPos.x} ${toPos.y + 3} 0) (effects (hide yes)))\n`;
        sch += `    (property "Value" "GND" (id 1) (at ${toPos.x} ${toPos.y + 3} 0))\n`;
        sch += `  )\n\n`;
    }

    sch += `  (wire (pts (xy ${fromPos.x} ${fromPos.y}) (xy ${toPos.x} ${toPos.y}))\n`;
    sch += `    (stroke (width 0) (type default) (color 0 0 0 0))\n`;
    sch += `    (uuid ${uuidv4()})\n`;
    sch += `  )\n\n`;
  });

  sch += `)\n`;
  
  console.log("Generated .kicad_sch content:\n", sch);
  return sch;
};
