/**
 * Quality Monitoring Service
 *
 * Tracks prompt performance, generation quality, and provides data for continuous improvement.
 * Integrates with Supabase to store quality metrics and user feedback.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface GenerationQualityLog {
  user_id: string;
  image_version_id?: string;
  prompt_used: string;
  preset_type?: string;
  model_name?: string;
  generation_time_ms?: number;
  quality_score?: number;
  consistency_score?: number;
  photorealism_score?: number;
  user_regenerated?: boolean;
  user_feedback?: string;
  issues_detected?: string[];
  metadata?: Record<string, any>;
}

/**
 * Log a generation quality event to the database
 */
export async function logGenerationQuality(log: GenerationQualityLog): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping quality log');
    return;
  }

  try {
    const { error } = await supabase
      .from('generation_quality_logs')
      .insert({
        ...log,
        issues_detected: log.issues_detected || [],
        metadata: log.metadata || {}
      });

    if (error) {
      console.error('Failed to log generation quality:', error);
    }
  } catch (err) {
    console.error('Error logging generation quality:', err);
  }
}

/**
 * Track when a user regenerates an image (indicates dissatisfaction with quality)
 */
export async function trackRegeneration(
  userId: string,
  imageVersionId: string,
  promptUsed: string,
  presetType?: string
): Promise<void> {
  await logGenerationQuality({
    user_id: userId,
    image_version_id: imageVersionId,
    prompt_used: promptUsed,
    preset_type: presetType,
    user_regenerated: true,
    metadata: {
      event_type: 'regeneration',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Get quality statistics for a specific preset type
 */
export async function getPresetQualityStats(presetType: string): Promise<{
  average_quality: number;
  average_consistency: number;
  average_photorealism: number;
  regeneration_rate: number;
  sample_size: number;
} | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('generation_quality_logs')
      .select('quality_score, consistency_score, photorealism_score, user_regenerated')
      .eq('preset_type', presetType)
      .not('quality_score', 'is', null);

    if (error) {
      console.error('Failed to fetch quality stats:', error);
      return null;
    }

    if (!data || data.length === 0) return null;

    const stats = data.reduce((acc, log) => {
      if (log.quality_score) acc.total_quality += log.quality_score;
      if (log.consistency_score) acc.total_consistency += log.consistency_score;
      if (log.photorealism_score) acc.total_photorealism += log.photorealism_score;
      if (log.user_regenerated) acc.regenerations++;
      acc.count++;
      return acc;
    }, { total_quality: 0, total_consistency: 0, total_photorealism: 0, regenerations: 0, count: 0 });

    return {
      average_quality: stats.total_quality / stats.count,
      average_consistency: stats.total_consistency / stats.count,
      average_photorealism: stats.total_photorealism / stats.count,
      regeneration_rate: stats.regenerations / stats.count,
      sample_size: stats.count
    };
  } catch (err) {
    console.error('Error fetching quality stats:', err);
    return null;
  }
}

/**
 * Get common issues for a specific preset type
 */
export async function getCommonIssues(presetType: string, limit: number = 10): Promise<{
  issue: string;
  count: number;
}[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('generation_quality_logs')
      .select('issues_detected')
      .eq('preset_type', presetType)
      .not('issues_detected', 'is', null);

    if (error) {
      console.error('Failed to fetch common issues:', error);
      return [];
    }

    if (!data) return [];

    const issueCounts: Record<string, number> = {};

    data.forEach(log => {
      const issues = log.issues_detected as string[];
      issues.forEach(issue => {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
      });
    });

    return Object.entries(issueCounts)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (err) {
    console.error('Error fetching common issues:', err);
    return [];
  }
}

/**
 * Submit user feedback about a generated image
 */
export async function submitUserFeedback(
  userId: string,
  imageVersionId: string,
  promptUsed: string,
  qualityScore: number,
  consistencyScore: number,
  photorealismScore: number,
  feedback?: string,
  issues?: string[]
): Promise<void> {
  await logGenerationQuality({
    user_id: userId,
    image_version_id: imageVersionId,
    prompt_used: promptUsed,
    quality_score: qualityScore,
    consistency_score: consistencyScore,
    photorealism_score: photorealismScore,
    user_feedback: feedback,
    issues_detected: issues,
    metadata: {
      event_type: 'user_feedback',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Get materials from the database for prompt enhancement
 */
export async function getMaterialsByCategory(category: string): Promise<any[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('material_specifications')
      .select('*')
      .eq('category', category)
      .eq('is_active', true);

    if (error) {
      console.error('Failed to fetch materials:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching materials:', err);
    return [];
  }
}

/**
 * Get colors by family for prompt enhancement
 */
export async function getColorsByFamily(family: string): Promise<any[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('color_references')
      .select('*')
      .eq('color_family', family);

    if (error) {
      console.error('Failed to fetch colors:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching colors:', err);
    return [];
  }
}

/**
 * Search for specific material by name
 */
export async function searchMaterial(searchTerm: string): Promise<any | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('material_specifications')
      .select('*')
      .ilike('material_name', `%${searchTerm}%`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to search material:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error searching material:', err);
    return null;
  }
}

/**
 * Search for specific color by name
 */
export async function searchColor(searchTerm: string): Promise<any | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('color_references')
      .select('*')
      .ilike('color_name', `%${searchTerm}%`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to search color:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error searching color:', err);
    return null;
  }
}

/**
 * Enhanced prompt builder that integrates database materials and colors
 */
export async function enhancePromptWithDatabase(
  userPrompt: string,
  editType: string
): Promise<string> {
  let enhanced = userPrompt;

  // Detect material mentions and enhance with database details
  const materialKeywords = ['flooring', 'floor', 'wood', 'tile', 'hardwood', 'marble', 'granite', 'oak', 'walnut'];
  for (const keyword of materialKeywords) {
    if (userPrompt.toLowerCase().includes(keyword)) {
      const material = await searchMaterial(keyword);
      if (material) {
        enhanced += `\n\n**Material Specification:** ${material.detailed_description}`;
        break;
      }
    }
  }

  // Detect color mentions and enhance with database details
  const colorKeywords = ['gray', 'grey', 'white', 'blue', 'green', 'beige', 'navy', 'black'];
  for (const keyword of colorKeywords) {
    if (userPrompt.toLowerCase().includes(keyword)) {
      const color = await searchColor(keyword);
      if (color) {
        enhanced += `\n\n**Color Specification:** ${color.color_name} (${color.hex_value}). ${color.descriptive_terms.join(', ')}.`;
        break;
      }
    }
  }

  return enhanced;
}
