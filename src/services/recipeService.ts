import { supabase } from "../lib/supabaseClient";
import type { NewRecipe } from "../types/recipe";
import { StorageService } from "./storageService";

async function uploadImage(file: File, path?: string) {
  const filePath = path || `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
  return await StorageService.upload(file, filePath);
}


export async function createRecipe(recipe: NewRecipe,file?: File) {
  let image_path: string | undefined;

  if (file) {
    image_path = await uploadImage(file);
  }

  return await supabase.from("recipes").insert([{ ...recipe, image_path }]);
}

export async function getAllRecipes() {
  return await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
}

export async function updateRecipe(
  recipeId: number,
  updatedRecipe: Partial<NewRecipe>,
  file?: File
) {
  let image_path = updatedRecipe.image_path; 

  if (file) {
    if (image_path) {
      await StorageService.remove(image_path);
    }
    image_path = await uploadImage(file);
  }

  const { image_path: _old, ...rest } = updatedRecipe;
  return await supabase
    .from("recipes")
    .update({ ...rest, image_path })
    .eq("id", recipeId);
}

export async function deleteRecipe(recipeId: number, image_path?: string) {
  if (image_path) {
    await StorageService.remove(image_path);
  }

  return await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId);
}

export function getImageUrl(path: string): string {
  return StorageService.getUrl(path);
}