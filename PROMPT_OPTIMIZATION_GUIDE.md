# Prompt Optimization Guide

## Overview

This guide explains the comprehensive prompt optimization system implemented in PropertyLens AI. The system ensures consistent, high-quality image generation results through modular prompts, quality tracking, and continuous improvement.

## System Architecture

### 1. Database-Driven Reference System

**Tables:**
- `material_specifications` - Detailed descriptions of flooring, walls, countertops, etc.
- `color_references` - Standardized color names with hex values and descriptions
- `prompt_templates` - Reusable prompt components
- `generation_quality_logs` - Performance tracking for each generation
- `prompt_versions` - Version control for prompt evolution
- `prompt_ab_tests` - A/B testing framework

**Benefits:**
- Consistent material and color descriptions across all prompts
- Easy updates without code changes
- Centralized knowledge base for prompt enhancement

### 2. Modular Prompt Components

**Location:** `services/promptComponents.ts`

**Component Categories:**
- **Preservation**: Ensuring previous edits are maintained
- **Quality**: Photorealism and professional standards
- **Lighting**: Accurate shadows, reflections, color temperature
- **Texture**: Material authenticity and continuity
- **Spatial**: Perspective, scale, and relationships
- **Materials**: Specific guidance for wood, stone, fabric, metal
- **Edges**: Perfect boundaries and transitions

**Usage:**
```typescript
import { buildPromptFromComponents, COMPONENT_PRESETS } from './promptComponents';

const prompt = buildPromptFromComponents(
  basePrompt,
  COMPONENT_PRESETS.FLOORING_CHANGE,
  customInstructions
);
```

### 3. Optimized System Instructions

**Location:** `services/geminiService.ts`

**Key Improvements:**

#### Cumulative Editing Emphasis
- **Before:** Generic preservation language
- **After:** Explicit "DO NOT" rules, specific examples of what to preserve
- Better context awareness with edit history integration

#### Photorealism Standards
- **Before:** General quality requirements
- **After:** Specific lighting rules, shadow requirements, texture guidelines
- Material-specific rendering instructions

#### Edge Work Precision
- **Before:** Simple "seamless integration" request
- **After:** Pixel-perfect edge requirements, baseboard preservation rules
- Specific guidance for different material boundaries

#### Masked Editing
- **Before:** Basic mask interpretation
- **After:** Detailed boundary blending, 2-4 pixel feathering specification
- Comprehensive lighting and texture matching across boundaries

### 4. Enhanced Preset Prompts

**Location:** `constants.ts`

All six presets have been significantly enhanced:

#### Room Clearout
- **Added:** Specific architectural preservation lists
- **Added:** Detailed floor/wall reconstruction techniques
- **Added:** Perspective alignment requirements
- **Improved:** Lighting preservation specifications

#### Flooring Upgrade
- **Added:** Material-specific rendering guidelines (wood grain, tile grout, stone veining)
- **Added:** Baseboard edge perfection requirements
- **Added:** Shadow and reflection preservation rules
- **Improved:** Perspective and scale accuracy

#### Repaint Walls
- **Added:** Texture preservation by type (smooth, orange peel, knockdown)
- **Added:** Lighting interaction rules (how color responds to light)
- **Added:** Edge perfection for all trim types
- **Improved:** Natural color variation guidance

#### Declutter & Repair
- **Added:** Intelligent item identification (remove vs keep)
- **Added:** Surface-specific reconstruction (countertops, tables, floors, walls)
- **Added:** Shadow removal/addition logic
- **Improved:** Natural appearance guidelines (avoid over-processing)

#### Twilight Conversion
- **Added:** Specific sky color gradient (#1a2a44 to #ff8c61)
- **Added:** Color temperature specifications (2700-3000K for lights)
- **Added:** Light falloff physics (inverse square law)
- **Added:** Multiple lighting layer integration (interior, exterior, ambient)
- **Improved:** Realistic intensity and contrast requirements

#### Exterior Boost
- **Added:** Target sky color values (#4a90e2, #5dade2)
- **Added:** Grass color specifications (emerald to forest green)
- **Added:** Detailed cloud rendering guidelines
- **Added:** Seamless sky blending requirements
- **Improved:** Natural landscaping enhancement (not oversaturated)

#### Repaint Exterior
- **Added:** Siding texture preservation by type (lap, shake, stucco, brick)
- **Added:** Outdoor lighting interaction rules (sun-facing vs shaded)
- **Added:** Weathering and aging guidance
- **Improved:** Edge perfection for all exterior trim

### 5. Quality Monitoring System

**Location:** `services/qualityMonitoringService.ts`

**Features:**

#### Generation Logging
```typescript
logGenerationQuality({
  user_id: userId,
  image_version_id: versionId,
  prompt_used: fullPrompt,
  preset_type: 'flooring_upgrade',
  generation_time_ms: 3500,
  quality_score: 8.5,
  consistency_score: 9.0,
  photorealism_score: 8.0
});
```

#### Quality Analytics
- Preset-specific quality statistics
- Regeneration rate tracking (indicates poor quality)
- Common issue identification
- User feedback collection

#### Database Integration
- Automatic logging to Supabase
- Historical performance tracking
- Trend analysis capabilities

### 6. Material & Color Database

**Benefits:**
- **Consistency:** Everyone uses same material descriptions
- **Accuracy:** Professionally curated specifications
- **Searchability:** Easy lookup by keyword
- **Extensibility:** Add new materials without code changes

**Example Materials:**
- Wide-Plank White Oak Hardwood (with grain patterns, color palette, reflectivity)
- Carrara Marble Tile (with veining, crystalline texture)
- Natural Cedar Shake Siding (with weathered texture, color shifts)

**Example Colors:**
- Benjamin Moore Revere Pewter (#C6C5BC)
- Sherwin Williams Agreeable Gray (#D1CBC1)
- Benjamin Moore Hale Navy (#3D4D5C)

## Best Practices

### 1. Prompt Construction

**DO:**
- Use specific measurements and proportions
- Reference standard material names from database
- Include explicit preservation rules
- Specify lighting behavior in detail
- Use quality checklists at the end

**DON'T:**
- Use vague terms like "nice" or "good"
- Omit preservation instructions
- Assume model knows material properties
- Skip edge work requirements
- Forget lighting and shadow specifications

### 2. Cumulative Editing

**Critical Rules:**
- ALWAYS emphasize current state preservation
- Include edit history in context
- Use explicit "DO NOT" rules for common failures
- Provide concrete examples of correct vs incorrect behavior
- End with comprehensive quality checklist

### 3. Material Specifications

**When replacing materials:**
- Name the specific material (not just "wood" but "Wide-Plank White Oak Hardwood")
- Describe texture characteristics (grain direction, veining, pattern)
- Specify reflectivity (matte, satin, semi-gloss, glossy, polished)
- Include color palette (not single color but range)
- Mention typical installation details (plank width, grout lines, etc.)

### 4. Color Specifications

**When changing colors:**
- Use specific color names (Benjamin Moore Revere Pewter)
- Provide hex values (#C6C5BC)
- Include descriptive terms (warm greige, neutral, sophisticated)
- Explain how color should interact with lighting
- Allow for natural variation (not perfectly uniform)

### 5. Edge Work

**For any modification affecting boundaries:**
- Specify pixel-perfect requirements
- Name specific elements to preserve (baseboards, trim, molding)
- Prohibit color bleeding explicitly
- Include separate instructions for different edge types
- Require crisp vs soft edges based on material

### 6. Lighting Preservation

**For all edits:**
- Identify all light sources (windows, fixtures, natural)
- Specify direction, intensity, color temperature
- Require shadow preservation with specific properties (angle, softness, opacity)
- Include reflection requirements for glossy surfaces
- Mention ambient occlusion in corners and recesses

## Continuous Improvement

### Monitoring Quality

1. **Track regeneration rate** - High rate indicates prompt issues
2. **Collect user feedback** - Direct input on problem areas
3. **Analyze common issues** - Pattern detection for systematic problems
4. **Compare preset performance** - Identify which presets need improvement

### A/B Testing

Use the `prompt_ab_tests` table to test variations:

```sql
INSERT INTO prompt_ab_tests (test_name, variant_a_prompt, variant_b_prompt, target_metric)
VALUES (
  'Flooring Edge Quality',
  'Baseboard edges must be perfect...',
  'Baseboard/floor boundary must be pixel-perfect with zero bleeding...',
  'edge_quality_score'
);
```

Track results and implement the winner.

### Version Control

When updating prompts:

1. Document the change in `prompt_versions`
2. Record performance delta
3. Mark as active version
4. Keep previous versions for rollback

```sql
INSERT INTO prompt_versions (
  prompt_type,
  version_number,
  prompt_content,
  change_description,
  is_active
) VALUES (
  'flooring_upgrade',
  2,
  'Updated prompt text...',
  'Added specific baseboard preservation rules',
  true
);
```

## Troubleshooting Common Issues

### Issue: Previous edits not preserved

**Solution:**
- Add more explicit preservation rules in system instruction
- Include edit history in context
- Use concrete examples of correct behavior
- Emphasize "CURRENT STATE" concept

### Issue: Poor edge quality (bleeding, halos)

**Solution:**
- Use "pixel-perfect" language
- Specify "ZERO color bleeding"
- Add baseboard-specific preservation rules
- Include checklist item for edge quality

### Issue: Unrealistic lighting

**Solution:**
- Specify exact light source preservation
- Include shadow angle/softness/opacity requirements
- Mention color temperature
- Add ambient occlusion instructions

### Issue: Wrong material texture

**Solution:**
- Reference material database for detailed descriptions
- Include specific texture characteristics (grain direction, veining)
- Specify reflectivity level
- Add material-specific rendering guidelines

### Issue: Incorrect scale or perspective

**Solution:**
- Require vanishing point alignment
- Specify proper scale relative to architectural elements
- Include perspective correction requirements
- Add spatial relationship guidelines

## Integration Points

### In Editor
```typescript
import { logGenerationQuality } from './services/qualityMonitoringService';
import { buildPromptFromComponents } from './services/promptComponents';

// When generating image
const startTime = Date.now();
const prompt = buildPromptFromComponents(basePrompt, components, userInput);
const image = await generateImageEdit(base64Image, prompt);
const generationTime = Date.now() - startTime;

// Log quality
await logGenerationQuality({
  user_id: userId,
  prompt_used: prompt,
  preset_type: presetType,
  generation_time_ms: generationTime
});
```

### User Feedback Collection
```typescript
import { submitUserFeedback } from './services/qualityMonitoringService';

// After user rates image
await submitUserFeedback(
  userId,
  imageVersionId,
  promptUsed,
  qualityScore,      // 1-10
  consistencyScore,  // 1-10
  photorealismScore, // 1-10
  optionalFeedback,
  issuesArray        // ['poor_edges', 'wrong_shadows']
);
```

## Metrics to Track

1. **Average Quality Score by Preset** - Which presets perform best
2. **Regeneration Rate** - Percentage of images regenerated (target < 20%)
3. **Generation Time** - Average processing time
4. **Common Issues** - Most frequent problems by preset
5. **User Satisfaction** - Direct feedback scores
6. **Consistency Score** - How well previous edits are preserved
7. **Photorealism Score** - How realistic the output appears

## Future Enhancements

1. **Machine Learning Analysis** - Analyze which prompt patterns correlate with high quality
2. **Automated A/B Testing** - Automatically test variations and implement winners
3. **Prompt Templates Library** - Expand modular components for more scenarios
4. **User-Specific Optimization** - Learn user preferences and adapt prompts
5. **Real-time Quality Prediction** - Predict likely quality before generation
6. **Automated Issue Detection** - Computer vision to detect common problems

## Conclusion

The prompt optimization system provides:
- **Consistency** through database-driven specifications
- **Quality** through detailed, tested prompts
- **Tracking** through comprehensive logging
- **Improvement** through data-driven iteration

By following this guide and monitoring the metrics, you can continuously improve generation quality and ensure users receive professional, photorealistic results every time.
