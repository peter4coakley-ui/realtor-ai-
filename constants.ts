import type { EditAgent } from './types';
import { VirtualStagingIcon, TwilightIcon, ExteriorBoostIcon, FlooringIcon, PaintBrushIcon, SparklesIcon } from './components/icons';

export const EDIT_AGENTS: EditAgent[] = [
  // Interior Presets
  {
    id: 'room_clearout',
    name: 'Room Clearout',
    category: 'Interior',
    description: 'Instantly empty a room of all furniture and decor, creating a blank canvas for virtual staging.',
    prompt: `**CRITICAL DIRECTIVE: METICULOUS VIRTUAL ROOM CLEAROUT**
You are a meticulous digital restoration artist specializing in real estate. Your sole task is to execute a precise "room clearout."

**Primary Objective:** Remove ALL movable, non-permanent items. This includes: furniture, decorations, rugs (excluding wall-to-wall carpet), lamps, personal items, etc.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **STRUCTURAL IMMUTABILITY:** You **MUST NOT** alter, modify, move, damage, or "improve" ANY permanent part of the room. This includes: Walls, flooring, ceiling, windows, doors, baseboards, trim, built-in shelves, fireplaces, kitchen cabinets, countertops, and permanent light fixtures. These elements are SACROSANCT.
2.  **TEXTURE & LIGHTING CONTINUITY:** When an object is removed, you must reconstruct the area behind it by flawlessly cloning the textures, patterns, and lighting from the immediately surrounding, visible surfaces. The reconstruction must be seamless and imperceptible.
3.  **PRESERVE ORIGINAL AMBIANCE:** The original lighting, shadows, color temperature, and reflections MUST be maintained. Do not introduce new light sources or alter the natural light.

The final image must be a photorealistic representation of the exact same room, simply empty. It must appear as if it were photographed vacant.
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
    prompt: `**CRITICAL DIRECTIVE: PRECISION VIRTUAL FLOORING REPLACEMENT**
You are a meticulous digital restoration artist. Your sole task is to replace the main flooring surface with: {userInput}.

**ABSOLUTE, NON-NEGOTIABLE CONSTRAINTS:**
1.  **FLOOR ONLY:** You **MUST NOT** alter any other element in the room. Walls, baseboards, furniture, decor, doors, windows, and cabinets are SACROSANCT and must remain untouched.
2.  **PHOTOREALISTIC INTEGRATION:** The new flooring must perfectly follow the room's perspective, scale, and lighting. All existing shadows cast by furniture and walls MUST be realistically preserved and rendered onto the new floor surface.
3.  **CLEAN EDGES:** The boundary between the new floor and the baseboards/walls must be perfectly sharp and clean. No bleeding or blurring.

The final image must be a photorealistic representation of the exact same room with ONLY the floor changed to {userInput}.`,
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
