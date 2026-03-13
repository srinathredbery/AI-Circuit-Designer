import uuid

def convert_to_kicad_sch(json_data: dict) -> str:
    if not json_data or "schematic" not in json_data:
        return ""

    schematic = json_data["schematic"]
    name = schematic.get("name", "Circuit").replace("\n", " ").strip()
    components = schematic.get("components", [])
    connections = schematic.get("connections", [])

    # Standard KiCad v6+ S-Expression Header
    sch = f'(kicad_sch (version 20211123) (generator eeschema)\n'
    sch += f'  (uuid {uuid.uuid4()})\n'
    sch += f'  (paper "A4")\n'
    sch += f'  (title_block\n    (title "{name}")\n  )\n'

    # Essential Symbol Definitions for rendering
    # Minimalist versions that KiCanvas should understand easily
    sch += """
  (lib_symbols
    (symbol "Device:R" (pin_numbers hide) (pin_names (offset 0)) (in_bom yes) (on_board yes)
      (property "Reference" "R" (id 0) (at 2.032 0 90))
      (property "Value" "R" (id 1) (at 0 0 90))
      (symbol "R_0_1"
        (rectangle (start -1.016 -2.54) (end 1.016 2.54) (stroke (width 0.254)))
      )
      (pin passive line (at 0 3.81 270) (length 1.27) (name "~" (effects (font (size 1.27 1.27)))) (number "1" (effects (font (size 1.27 1.27)))))
      (pin passive line (at 0 -3.81 90) (length 1.27) (name "~" (effects (font (size 1.27 1.27)))) (number "2" (effects (font (size 1.27 1.27)))))
    )
    (symbol "Device:C" (pin_numbers hide) (pin_names (offset 0)) (in_bom yes) (on_board yes)
      (property "Reference" "C" (id 0) (at 0.635 2.54 0))
      (property "Value" "C" (id 1) (at 0.635 -2.54 0))
      (symbol "C_0_1"
        (polyline (pts (xy -2.032 -0.635) (xy 2.032 -0.635)) (stroke (width 0.508)))
        (polyline (pts (xy -2.032 0.635) (xy 2.032 0.635)) (stroke (width 0.508)))
      )
      (pin passive line (at 0 3.81 270) (length 3.175) (name "~" (effects (font (size 1.27 1.27)))) (number "1" (effects (font (size 1.27 1.27)))))
      (pin passive line (at 0 -3.81 90) (length 3.175) (name "~" (effects (font (size 1.27 1.27)))) (number "2" (effects (font (size 1.27 1.27)))))
    )
    (symbol "Device:LED" (pin_numbers hide) (pin_names (offset 0)) (in_bom yes) (on_board yes)
      (property "Reference" "D" (id 0) (at 0 2.54 0))
      (property "Value" "LED" (id 1) (at 0 -2.54 0))
      (symbol "LED_0_1"
        (polyline (pts (xy -1.27 -1.27) (xy -1.27 1.27) (xy 1.27 0) (xy -1.27 -1.27)) (stroke (width 0.254)))
        (polyline (pts (xy 1.27 -1.27) (xy 1.27 1.27)) (stroke (width 0.254)))
      )
      (pin passive line (at -3.81 0 0) (length 2.54) (name "A" (effects (font (size 1.27 1.27)))) (number "1" (effects (font (size 1.27 1.27)))))
      (pin passive line (at 3.81 0 180) (length 2.54) (name "K" (effects (font (size 1.27 1.27)))) (number "2" (effects (font (size 1.27 1.27)))))
    )
    (symbol "power:GND" (power) (pin_names (offset 0)) (in_bom yes) (on_board yes)
      (property "Reference" "#PWR" (id 0) (at 0 -6.35 0) (effects (hide yes)))
      (property "Value" "GND" (id 1) (at 0 -3.81 0))
      (pin power_in line (at 0 0 270) (length 0) hide (name "GND" (effects (font (size 1.27 1.27)))) (number "1" (effects (font (size 1.27 1.27)))))
    )
  )
"""

    comp_positions = {}

    for index, comp in enumerate(components):
        ref = comp.get("ref", f"U{index}")
        value = comp.get("value", "Unknown")
        comp_type = comp.get("type", "Resistor")
        
        # Mapping
        if comp_type in ["Resistor", "R"]: lib_type = "Device:R"
        elif comp_type in ["Capacitor", "C"]: lib_type = "Device:C"
        elif comp_type in ["LED"]: lib_type = "Device:LED"
        elif ":" not in comp_type: lib_type = f"Device:{comp_type}"
        else: lib_type = comp_type

        x = 100 + (index * 40)
        y = 100
        comp_positions[ref] = (x, y)

        sch += f'\n  (symbol (lib_id "{lib_type}") (at {x} {y} 0) (unit 1)\n'
        sch += f'    (in_bom yes) (on_board yes) (fields_autoplaced)\n'
        sch += f'    (uuid {uuid.uuid4()})\n'
        sch += f'    (property "Reference" "{ref}" (id 0) (at {x} {y - 10} 0))\n'
        sch += f'    (property "Value" "{value}" (id 1) (at {x} {y + 10} 0))\n'
        sch += f'  )\n'

    for conn in connections:
        conn_from = conn.get("from", "")
        conn_to = conn.get("to", "")
        
        from_ref = conn_from.split(".")[0]
        to_ref = conn_to.split(".")[0]
        
        from_pos = comp_positions.get(from_ref, (100, 100))
        
        if conn_to == "GND":
            to_pos = (from_pos[0], from_pos[1] + 30)
            sch += f'\n  (symbol (lib_id "power:GND") (at {to_pos[0]} {to_pos[1]} 0) (unit 1)\n'
            sch += f'    (uuid {uuid.uuid4()})\n'
            sch += f'    (property "Reference" "#PWR?" (id 0) (at {to_pos[0]} {to_pos[1]} 3) (effects (hide yes)))\n'
            sch += f'    (property "Value" "GND" (id 1) (at {to_pos[0]} {to_pos[1]} 3))\n'
            sch += f'  )\n'
        else:
            to_pos = comp_positions.get(to_ref, (100, 100))

        sch += f'\n  (wire (pts (xy {from_pos[0]} {from_pos[1]}) (xy {to_pos[0]} {to_pos[1]}))\n'
        sch += f'    (stroke (width 0) (type default) (color 0 0 0 0))\n'
        sch += f'    (uuid {uuid.uuid4()})\n'
        sch += f'  )\n'

    sch += f'\n)\n'
    return sch
