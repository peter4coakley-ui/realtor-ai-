import { supabase } from '../lib/supabase';
import type { PropertyListing, ImageProject, ImageVersion, ChatMessage } from '../types';

export class SupabaseService {
  static async uploadImage(file: Blob, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    return publicUrl;
  }

  static async getImageUrl(path: string): Promise<string> {
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  static async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('property-images')
      .remove([path]);

    if (error) throw error;
  }

  static async createProperty(userId: string, address: string): Promise<string> {
    const { data, error } = await supabase
      .from('properties')
      .insert({
        user_id: userId,
        address,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  static async getProperties(userId: string): Promise<PropertyListing[]> {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        address,
        description,
        property_type,
        status,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const propertiesWithProjects = await Promise.all(
      (properties || []).map(async (property) => {
        const imageProjects = await this.getImageProjects(property.id);
        return {
          id: property.id,
          address: property.address,
          imageProjects,
        };
      })
    );

    return propertiesWithProjects;
  }

  static async getImageProjects(propertyId: string): Promise<ImageProject[]> {
    const { data: projects, error } = await supabase
      .from('image_projects')
      .select('*')
      .eq('property_id', propertyId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    const projectsWithVersions = await Promise.all(
      (projects || []).map(async (project) => {
        const versions = await this.getImageVersions(project.id);
        const chatHistory = await this.getChatMessages(project.id);

        const originalFile = new File([], project.original_file_name || 'image.jpg', {
          type: 'image/jpeg',
        });

        return {
          id: project.id,
          name: project.name,
          versions,
          chatHistory,
          originalFile,
        };
      })
    );

    return projectsWithVersions;
  }

  static async getImageVersions(imageProjectId: string): Promise<ImageVersion[]> {
    const { data: versions, error } = await supabase
      .from('image_versions')
      .select('*')
      .eq('image_project_id', imageProjectId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (versions || []).map((v) => ({
      id: v.id,
      dataUrl: v.storage_path,
      prompt: v.prompt || '',
      type: v.version_type as ImageVersion['type'],
      timestamp: v.created_at,
      isSaved: v.is_saved,
    }));
  }

  static async getChatMessages(imageProjectId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('image_project_id', imageProjectId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (messages || []).map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      versionId: m.image_version_id || undefined,
    }));
  }

  static async createImageProject(
    propertyId: string,
    name: string,
    originalFileName: string,
    storagePath: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from('image_projects')
      .insert({
        property_id: propertyId,
        name,
        original_file_name: originalFileName,
        original_storage_path: storagePath,
        order_index: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  static async createImageVersion(
    imageProjectId: string,
    storagePath: string,
    prompt: string,
    versionType: ImageVersion['type']
  ): Promise<string> {
    const { data, error } = await supabase
      .from('image_versions')
      .insert({
        image_project_id: imageProjectId,
        storage_path: storagePath,
        prompt,
        version_type: versionType,
        is_saved: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  static async addChatMessage(
    imageProjectId: string,
    role: 'user' | 'assistant',
    content: string,
    imageVersionId?: string
  ): Promise<void> {
    const { error } = await supabase.from('chat_messages').insert({
      image_project_id: imageProjectId,
      role,
      content,
      image_version_id: imageVersionId || null,
    });

    if (error) throw error;
  }

  static async toggleVersionSaved(versionId: string, isSaved: boolean): Promise<void> {
    const { error } = await supabase
      .from('image_versions')
      .update({ is_saved: isSaved })
      .eq('id', versionId);

    if (error) throw error;
  }

  static async updatePropertyAddress(propertyId: string, newAddress: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .update({ address: newAddress })
      .eq('id', propertyId);

    if (error) throw error;
  }

  static async updateImageProjectName(imageProjectId: string, newName: string): Promise<void> {
    const { error } = await supabase
      .from('image_projects')
      .update({ name: newName })
      .eq('id', imageProjectId);

    if (error) throw error;
  }

  static async logUsage(
    userId: string,
    actionType: 'edit' | 'upload' | 'export' | 'delete',
    imageVersionId?: string
  ): Promise<void> {
    const { error } = await supabase.from('usage_logs').insert({
      user_id: userId,
      action_type: actionType,
      image_version_id: imageVersionId || null,
      credits_used: 1,
    });

    if (error) console.error('Failed to log usage:', error);
  }

  static dataUrlToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(parts[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }
}
