import { supabase } from '../lib/supabaseClient'

const BUCKET = 'recipe-images'

export class StorageService {
  static async upload(file: File, path: string) {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
    if (error) throw error
    return this.getUrl(path)
  }

  static getUrl(path: string) {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  static async remove(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw error
  }
}
