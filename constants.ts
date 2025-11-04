import type { EditAgent } from './types';
import { VirtualStagingIcon, TwilightIcon, ExteriorBoostIcon, FlooringIcon, PaintBrushIcon, SparklesIcon } from './components/icons';

export const EDIT_AGENTS: EditAgent[] = [
  // Interior Presets
  {
    id: 'room_clearout',
    name: 'Room Clearout',
    category: 'Interior',
    description: 'Instantly empty a room of all furniture and decor, creating a blank canvas for virtual staging.',
    prompt: `**CRITICAL DIRECTIVE: PROFESSIONAL MLS-COMPLIANT VIRTUAL ROOM CLEAROUT**
You are an elite digital restoration artist with 10+ years specializing in high-end real estate photography. Your sole task is to execute a flawless, photorealistic "room clearout" that meets strict MLS and NAR compliance standards.

**Primary Objective:** Remove ALL movable, non-permanent items while maintaining absolute photographic realism. This includes: furniture, decorations, area rugs (excluding wall-to-wall carpet), lamps, artwork, personal items, electronics, and clutter.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **STRUCTURAL IMMUTABILITY (MLS CRITICAL):** You **MUST NOT** alter, modify, move, damage, or "improve" ANY permanent structural element. This includes: walls, flooring (material/color/pattern), ceiling, windows, doors, door frames, baseboards, crown molding, trim, built-in shelving, fireplace structure, kitchen cabinets, countertops, backsplashes, appliances, permanent light fixtures (chandeliers, recessed lighting, sconces), outlets, switches, thermostats, vents, and architectural details. These elements are LEGALLY PROTECTED and UNTOUCHABLE.
2.  **PHOTOREALISTIC RECONSTRUCTION:** When removing objects, reconstruct the exposed area using advanced content-aware techniques. Clone textures, patterns, grain, lighting, shadows, and highlights from immediately adjacent visible surfaces. Pay extreme attention to: perspective distortion, light fall-off, subtle color variations, floor reflections, and wall texture continuity. The reconstruction must pass professional photographer scrutiny.
3.  **LIGHTING PHYSICS PRESERVATION:** Maintain exact original lighting conditions including: direction, intensity, color temperature (warm/cool), shadow angles and softness, specular highlights, ambient occlusion in corners, light bounce from walls/ceiling, and time-of-day indicators. Do NOT add new light sources, brighten the scene, or alter window light quality.

**QUALITY REQUIREMENTS:**
- Final output must be indistinguishable from a professionally photographed empty room
- No visible artifacts, blending errors, or unnatural patterns
- Maintain original camera perspective, lens distortion, and depth of field
- Preserve image resolution and sharpness throughout
- Ensure consistent lighting across all surfaces

**REAL ESTATE COMPLIANCE:**
- This edit must be MLS-compliant: no structural misrepresentation
- The empty room must accurately represent the actual space dimensions and features
- All permanent fixtures must remain exactly as they exist in reality

User's optional refinement: {userInput}`,
    icon: VirtualStagingIcon,
    requiresInput: false,
    inputPlaceholder: 'Enhance your edit (Optional)',
  },
  {
    id: 'flooring_upgrade',
    name: 'Flooring Upgrade',
    category: 'Interior',
    description: 'Replace old flooring with a new style. Specify the style and color in the text box.',
    prompt: `**CRITICAL DIRECTIVE: PHOTOREALISTIC MLS-COMPLIANT FLOORING REPLACEMENT**
You are an elite architectural visualization specialist. Your task is to replace ONLY the main flooring surface with: {userInput}, while maintaining perfect photorealistic quality and MLS compliance.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **FLOORING SURFACE ONLY:** You **MUST NOT** alter ANY other element. Walls, wall color, baseboards, trim, furniture, decor, rugs ON the floor, doors, door frames, windows, cabinets, countertops, appliances, lighting, and ceiling are LEGALLY PROTECTED and UNTOUCHABLE.
2.  **ARCHITECTURAL PRECISION:** The new flooring must:
   - Follow exact room perspective and vanishing points
   - Match proper scale and plank/tile proportions for the specified material
   - Respect all floor contours, transitions, and elevation changes
   - Align properly with doorways and room geometry
   - Show appropriate material characteristics (wood grain direction, tile grout lines, pattern repeats)
3.  **ADVANCED LIGHTING INTEGRATION:**
   - Preserve ALL existing shadows cast by furniture, cabinets, and architectural elements
   - Match the new floor's reflectivity to the material type (matte hardwood vs glossy tile)
   - Maintain light fall-off patterns from windows and fixtures
   - Show proper ambient occlusion where floor meets walls and objects
   - Preserve any natural light patterns, sun spots, or window reflections
4.  **PERFECT EDGE WORK:** Baseboards/floor boundary must be pixel-perfect with zero bleeding, color contamination, or blur. Maintain original baseboard shadows and detail.

**QUALITY STANDARDS:**
Final output must look like the room was originally built with {userInput} flooring. Material texture, wear patterns, and finish quality should match high-end installation. No visible compositing artifacts.`,
    icon: FlooringIcon,
    requiresInput: true,
    inputPlaceholder: 'Enter flooring style & color...',
  },
  {
    id: 'repaint_walls',
    name: 'Repaint Walls',
    category: 'Interior',
    description: 'Repaint the interior walls. Specify the new color in the text box.',
    prompt: `**CRITICAL DIRECTIVE: PRECISION VIRTUAL WALL REPAINT**
You are a meticulous digital restoration artist. Your sole task is to repaint ONLY the primary wall surfaces with the color: {userInput}.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **WALLS ONLY:** You **MUST NOT** alter any non-wall surface. Ceilings, floors, trim, baseboards, window frames, doors, furniture, decor, outlets, and light switches are SACROSANCT.
2.  **PRESERVE TEXTURE & LIGHTING:** You are only changing the color. The original wall texture (e.g., plaster, drywall) must be preserved. The new color must realistically interact with the existing lighting, shadows, and highlights.
3.  **CLEAN EDGES:** The edges where walls meet trim, ceilings, and floors must be perfectly sharp and clean, as if done by a master painter.

The final image must be a photorealistic representation of the exact same room with ONLY the wall color changed to {userInput}.`,
    icon: PaintBrushIcon,
    requiresInput: true,
    inputPlaceholder: 'Enter a wall color...',
  },
  {
    id: 'declutter',
    name: 'Declutter & Repair',
    category: 'Interior',
    description: 'Remove small distracting items like toys, papers, and fix minor wall scuffs.',
    prompt: `**CRITICAL DIRECTIVE: SUBTLE DECLUTTER & MINOR REPAIR**
You are a meticulous digital restoration artist. Your task is to perform a subtle decluttering and touch-up.

**Primary Objective:** Remove only small, distracting, non-permanent items. Examples: papers on a counter, a stray toy on the floor, a phone charger, a small smudge on a wall.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **MINOR ITEMS ONLY:** You **MUST NOT** remove any furniture, large decor (like lamps or large plants), rugs, or any significant items. This is for minor cleanup only.
2.  **STRUCTURAL IMMUTABILITY:** You **MUST NOT** alter any permanent structure: walls, floors, windows, doors, cabinets, etc.
3.  **SEAMLESS RECONSTRUCTION:** When an item is removed or a scuff is repaired, the area behind it must be flawlessly reconstructed by cloning the immediate surrounding texture and lighting. The repair must be invisible.
4.  **MAINTAIN ORIGINAL PHOTO:** The overall character and content of the room should remain the same, just cleaner and tidier.

User's optional focus area: {userInput}`,
    icon: SparklesIcon,
    requiresInput: false,
    inputPlaceholder: 'Point out specific items (Optional)',
  },
  // Exterior Presets
  {
    id: 'twilight_conversion',
    name: 'Twilight Conversion',
    category: 'Exterior',
    description: 'Transform a daytime exterior photo into a stunning twilight shot.',
    prompt: `**CRITICAL DIRECTIVE: ELEGANT TWILIGHT CONVERSION**
You are a master architectural photographer. Your task is to transform a daytime photo into a high-end twilight shot.

**Primary Objective:** Change the time of day to twilight, adding interior and exterior lighting for a warm, inviting feel.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **PROPERTY IMMUTABILITY:** You **MUST NOT** alter the physical structure, materials, or colors of the house.
2.  **LANDSCAPE IMMUTABILITY:** You **MUST NOT** move, remove, or add any landscaping or hardscaping. Trees, shrubs, walkways, and driveways are SACROSANCT.
3.  **PHOTOREALISTIC LIGHTING:** The new sky, interior glow, and any added landscape lighting must be perfectly blended. Shadows and highlights must be cast realistically and consistently across the entire scene. The result must look like a real photograph, not a composite.

Optional user refinement: {userInput}`,
    icon: TwilightIcon,
    requiresInput: false,
    inputPlaceholder: 'Enhance your edit (Optional)',
  },
  {
    id: 'exterior_boost',
    name: 'Exterior Boost',
    category: 'Exterior',
    description: 'Enhance curb appeal with a perfect blue sky and lush green lawn.',
    prompt: `**CRITICAL DIRECTIVE: PERFECT DAY CURB APPEAL BOOST**
You are a master architectural photographer. Your task is to enhance an exterior photo to look like it was taken on a perfect, sunny day.

**Primary Objective:** Replace the sky with a beautiful blue sky and make the lawn a healthy, lush green.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **PHYSICAL OBJECT IMMUTABILITY:** This is the most important rule. You **MUST NOT** alter, move, remove, or add ANY physical object. This includes the house, trees, shrubs, flowers, sidewalks, driveways, fences, cars, neighboring houses, etc. Everything must remain exactly where it is.
2.  **PHOTOREALISM:** The new sky must blend seamlessly. The green lawn must look vibrant but realistic, not oversaturated. Existing shadows MUST be preserved and remain consistent with a sunny day.

The final image must be the exact same scene, just with a better sky and healthier-looking grass.
Optional user refinement: {userInput}`,
    icon: ExteriorBoostIcon,
    requiresInput: false,
    inputPlaceholder: 'Enhance your edit (Optional)',
  },
  {
    id: 'repaint_exterior',
    name: 'Repaint Exterior',
    category: 'Exterior',
    description: 'Repaint the exterior of the house. Specify the new color in the text box.',
    prompt: `**CRITICAL DIRECTIVE: PRECISION VIRTUAL EXTERIOR REPAINT**
You are a meticulous digital restoration artist. Your sole task is to repaint ONLY the primary exterior siding/wall surfaces with the color: {userInput}.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **SIDING ONLY:** You **MUST NOT** alter any non-siding surface. The roof, trim, window frames, shutters, doors, gutters, foundation, decks, and railings are SACROSANCT.
2.  **ENVIRONMENT IMMUTABILITY:** You **MUST NOT** alter the sky, lawn, trees, driveway, or any other part of the environment.
3.  **PRESERVE TEXTURE & LIGHTING:** Preserve the original siding texture (e.g., wood grain, stucco). The new color must realistically respect the existing outdoor lighting, shadows, and highlights. Edges must be perfectly clean.

The final image must be a photorealistic representation of the exact same property with ONLY the main exterior color changed to {userInput}.`,
    icon: PaintBrushIcon,
    requiresInput: true,
    inputPlaceholder: 'Enter an exterior color...',
  },
];
