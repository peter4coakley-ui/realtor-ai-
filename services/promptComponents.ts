/**
 * Modular Prompt Components System
 *
 * This file contains reusable prompt components that can be mixed and matched
 * to create optimized prompts for different editing scenarios.
 */

export interface PromptComponent {
  id: string;
  category: 'preservation' | 'quality' | 'lighting' | 'texture' | 'spatial' | 'materials' | 'edges';
  text: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const PROMPT_COMPONENTS: Record<string, PromptComponent> = {
  // PRESERVATION COMPONENTS
  PRESERVE_PREVIOUS_EDITS: {
    id: 'preserve_previous',
    category: 'preservation',
    priority: 'critical',
    text: `**CRITICAL PRESERVATION RULE:** The image you are viewing contains ALL previous modifications from earlier generations. You MUST preserve every element currently visible unless explicitly instructed to change it. Do NOT remove, alter, or revert any existing edits.`
  },

  CUMULATIVE_AWARENESS: {
    id: 'cumulative_awareness',
    category: 'preservation',
    priority: 'critical',
    text: `**CUMULATIVE EDITING MODE:** This is NOT the original image - it is the current state with all prior edits applied. Your task is to ADD ONLY the new modification while keeping everything else exactly as shown.`
  },

  PRESERVE_ARCHITECTURE: {
    id: 'preserve_architecture',
    category: 'preservation',
    priority: 'high',
    text: `Preserve all permanent architectural features including walls, windows, doors, built-in fixtures, crown molding, baseboards, ceiling details, and structural elements exactly as they appear.`
  },

  PRESERVE_CURRENT_COLORS: {
    id: 'preserve_colors',
    category: 'preservation',
    priority: 'high',
    text: `Maintain all current wall colors, floor colors, and existing color schemes unless the modification specifically targets these elements.`
  },

  // QUALITY COMPONENTS
  PHOTOREALISM_MANDATE: {
    id: 'photorealism',
    category: 'quality',
    priority: 'critical',
    text: `**PHOTOREALISM REQUIREMENT:** The final output must be indistinguishable from a professionally captured photograph. Every element must have authentic textures, realistic lighting interactions, accurate shadows, and natural material properties.`
  },

  SEAMLESS_INTEGRATION: {
    id: 'seamless',
    category: 'quality',
    priority: 'critical',
    text: `All modifications must integrate seamlessly with zero visible boundaries, transitions, or compositing artifacts. The edit should be completely undetectable.`
  },

  NO_ARTIFACTS: {
    id: 'no_artifacts',
    category: 'quality',
    priority: 'high',
    text: `Generate clean results with no visible artifacts, distortions, blending errors, unnatural patterns, repetitive textures, or manipulation signs.`
  },

  PROFESSIONAL_STANDARD: {
    id: 'professional',
    category: 'quality',
    priority: 'high',
    text: `Meet professional real estate photography standards with exceptional clarity, proper exposure, accurate colors, and presentation-ready quality.`
  },

  // LIGHTING COMPONENTS
  PRESERVE_LIGHTING: {
    id: 'preserve_lighting',
    category: 'lighting',
    priority: 'critical',
    text: `**LIGHTING PRESERVATION:** Maintain the exact lighting conditions currently present - direction, intensity, color temperature, and quality of light. New elements must match this existing lighting perfectly.`
  },

  NATURAL_SHADOWS: {
    id: 'natural_shadows',
    category: 'lighting',
    priority: 'high',
    text: `Generate realistic shadows that correspond accurately to the scene's light sources. Shadows must have appropriate softness, direction, length, and opacity based on the lighting conditions.`
  },

  ACCURATE_REFLECTIONS: {
    id: 'reflections',
    category: 'lighting',
    priority: 'high',
    text: `Create accurate reflections on glossy surfaces (floors, countertops, windows, mirrors) that correspond to the scene's lighting and spatial relationships.`
  },

  AMBIENT_OCCLUSION: {
    id: 'ambient_occlusion',
    category: 'lighting',
    priority: 'medium',
    text: `Include subtle ambient occlusion - darker shading where surfaces meet or in corners - to enhance depth and realism.`
  },

  // TEXTURE COMPONENTS
  AUTHENTIC_MATERIALS: {
    id: 'authentic_materials',
    category: 'texture',
    priority: 'critical',
    text: `Render all materials with authentic physical properties: wood grain direction and variation, fabric weave patterns, metal reflectivity, stone veining, concrete texture, and appropriate surface characteristics.`
  },

  TEXTURE_CONTINUITY: {
    id: 'texture_continuity',
    category: 'texture',
    priority: 'high',
    text: `When reconstructing surfaces, seamlessly clone and extend existing textures. Match grain patterns, color variation, aging, wear, and surface characteristics precisely.`
  },

  NATURAL_VARIATION: {
    id: 'natural_variation',
    category: 'texture',
    priority: 'medium',
    text: `Include natural color and texture variation within materials. Avoid perfectly uniform surfaces - real materials have subtle inconsistencies, grain patterns, and tonal shifts.`
  },

  MATERIAL_AGING: {
    id: 'material_aging',
    category: 'texture',
    priority: 'medium',
    text: `Match the wear level and aging of surrounding elements. New additions should have appropriate weathering, patina, or pristine finish depending on context.`
  },

  // SPATIAL COMPONENTS
  CORRECT_PERSPECTIVE: {
    id: 'correct_perspective',
    category: 'spatial',
    priority: 'critical',
    text: `**PERSPECTIVE ACCURACY:** Maintain perfect perspective alignment with the camera's vanishing points. All new elements must follow the established spatial geometry and lens distortion.`
  },

  PROPER_SCALE: {
    id: 'proper_scale',
    category: 'spatial',
    priority: 'high',
    text: `Ensure new elements are correctly scaled relative to surrounding objects. Furniture, fixtures, and architectural elements must have realistic proportions and sizes.`
  },

  SPATIAL_RELATIONSHIPS: {
    id: 'spatial_relationships',
    category: 'spatial',
    priority: 'high',
    text: `Position new elements with logical spatial relationships. Objects should have appropriate distances from walls, clearances for function, and natural arrangements.`
  },

  DEPTH_CUES: {
    id: 'depth_cues',
    category: 'spatial',
    priority: 'medium',
    text: `Maintain depth through atmospheric perspective, appropriate blur for depth of field, size relationships, and overlap of objects.`
  },

  // EDGE WORK COMPONENTS
  PERFECT_EDGES: {
    id: 'perfect_edges',
    category: 'edges',
    priority: 'critical',
    text: `**EDGE PERFECTION:** All edges where different materials or surfaces meet must be pixel-perfect. No color bleeding, halos, soft edges, or visible compositing seams.`
  },

  BASEBOARD_PRECISION: {
    id: 'baseboard_precision',
    category: 'edges',
    priority: 'high',
    text: `Where floors meet baseboards, maintain crisp separation with zero color contamination. Baseboards must retain their exact profile, shadows, and detail.`
  },

  TRIM_PRESERVATION: {
    id: 'trim_preservation',
    category: 'edges',
    priority: 'high',
    text: `Keep all trim, molding, window frames, and door frames perfectly intact with sharp edges and preserved shadows.`
  },

  FEATHERED_BLENDING: {
    id: 'feathered_blending',
    category: 'edges',
    priority: 'medium',
    text: `For organic transitions (like adding elements), use subtle feathered edges that blend naturally without visible boundaries.`
  },

  // MATERIAL-SPECIFIC COMPONENTS
  WOOD_GRAIN_DETAILS: {
    id: 'wood_grain',
    category: 'materials',
    priority: 'high',
    text: `For wood surfaces: Show realistic grain patterns with proper direction, cathedral or straight grain as appropriate, subtle color variation within the wood, and authentic growth rings or ray fleck patterns.`
  },

  STONE_CHARACTERISTICS: {
    id: 'stone_characteristics',
    category: 'materials',
    priority: 'high',
    text: `For stone surfaces: Include natural veining, crystalline structure for granite/marble, consistent grout lines for tile, and authentic color variation within the stone.`
  },

  FABRIC_TEXTURE: {
    id: 'fabric_texture',
    category: 'materials',
    priority: 'medium',
    text: `For fabric/upholstery: Show appropriate weave patterns, natural wrinkles and folds, how light interacts with the fabric nap, and realistic drape physics.`
  },

  METAL_REFLECTIVITY: {
    id: 'metal_reflectivity',
    category: 'materials',
    priority: 'medium',
    text: `For metal surfaces: Display proper reflectivity levels (brushed vs polished), accurate environmental reflections, appropriate highlights and specular shine, and authentic finish quality.`
  }
};

/**
 * Builds a comprehensive prompt by combining relevant components
 */
export function buildPromptFromComponents(
  basePrompt: string,
  components: string[],
  customInstructions?: string
): string {
  const selectedComponents = components
    .map(id => PROMPT_COMPONENTS[id])
    .filter(c => c !== undefined)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const componentsByCategory = selectedComponents.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component.text);
    return acc;
  }, {} as Record<string, string[]>);

  let fullPrompt = basePrompt + '\n\n';

  const categoryOrder: Array<'preservation' | 'quality' | 'lighting' | 'spatial' | 'texture' | 'materials' | 'edges'> = [
    'preservation',
    'quality',
    'spatial',
    'lighting',
    'texture',
    'materials',
    'edges'
  ];

  categoryOrder.forEach(category => {
    if (componentsByCategory[category]) {
      fullPrompt += componentsByCategory[category].join('\n\n') + '\n\n';
    }
  });

  if (customInstructions) {
    fullPrompt += `**SPECIFIC MODIFICATION REQUEST:**\n${customInstructions}\n\n`;
  }

  fullPrompt += `**EXECUTION CHECKLIST:**
✓ All previous edits preserved
✓ New modification applied precisely
✓ Lighting consistent throughout
✓ Shadows and reflections accurate
✓ Textures and materials photorealistic
✓ Zero visible seams or artifacts
✓ Perspective and scale correct
✓ Color harmony maintained
✓ Professional photography quality`;

  return fullPrompt;
}

/**
 * Preset component combinations for common scenarios
 */
export const COMPONENT_PRESETS = {
  CUMULATIVE_EDIT: [
    'preserve_previous',
    'cumulative_awareness',
    'photorealism',
    'seamless',
    'preserve_lighting',
    'natural_shadows',
    'correct_perspective',
    'perfect_edges'
  ],

  MASKED_EDIT: [
    'preserve_previous',
    'photorealism',
    'seamless',
    'preserve_lighting',
    'natural_shadows',
    'texture_continuity',
    'perfect_edges',
    'feathered_blending'
  ],

  FLOORING_CHANGE: [
    'preserve_architecture',
    'preserve_colors',
    'photorealism',
    'correct_perspective',
    'preserve_lighting',
    'natural_shadows',
    'baseboard_precision',
    'trim_preservation',
    'authentic_materials',
    'wood_grain'
  ],

  WALL_REPAINT: [
    'preserve_architecture',
    'photorealism',
    'preserve_lighting',
    'trim_preservation',
    'perfect_edges',
    'texture_continuity',
    'natural_variation'
  ],

  OBJECT_REMOVAL: [
    'preserve_previous',
    'photorealism',
    'seamless',
    'texture_continuity',
    'preserve_lighting',
    'no_artifacts',
    'natural_shadows'
  ],

  FURNITURE_ADDITION: [
    'preserve_previous',
    'photorealism',
    'seamless',
    'preserve_lighting',
    'natural_shadows',
    'correct_perspective',
    'proper_scale',
    'spatial_relationships',
    'fabric_texture',
    'wood_grain'
  ],

  EXTERIOR_ENHANCEMENT: [
    'photorealism',
    'seamless',
    'preserve_lighting',
    'natural_shadows',
    'texture_continuity',
    'no_artifacts',
    'natural_variation'
  ]
};

/**
 * Get recommended components based on edit type
 */
export function getRecommendedComponents(editType: string): string[] {
  const recommendations: Record<string, string[]> = {
    room_clearout: COMPONENT_PRESETS.OBJECT_REMOVAL,
    flooring_upgrade: COMPONENT_PRESETS.FLOORING_CHANGE,
    repaint_walls: COMPONENT_PRESETS.WALL_REPAINT,
    declutter: COMPONENT_PRESETS.OBJECT_REMOVAL,
    twilight_conversion: COMPONENT_PRESETS.EXTERIOR_ENHANCEMENT,
    exterior_boost: COMPONENT_PRESETS.EXTERIOR_ENHANCEMENT,
    repaint_exterior: COMPONENT_PRESETS.WALL_REPAINT,
    chat: COMPONENT_PRESETS.CUMULATIVE_EDIT,
    inpaint: COMPONENT_PRESETS.MASKED_EDIT
  };

  return recommendations[editType] || COMPONENT_PRESETS.CUMULATIVE_EDIT;
}
