import { useEffect, useState } from "react";
import type { NewRecipe, Recipe } from "../types/recipe";
import { createRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../services/recipeService";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadRecipes() {
    setLoading(true);
    setError("");

    const { data, error } = await getAllRecipes();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRecipes(data as Recipe[] ?? []);
    setLoading(false);
  }

  useEffect(() => {
    let isMounted = true;
    
    getAllRecipes().then(({ data, error }) => {
      if (!isMounted) return;
      
      if (error) {
        setError(error.message);
      } else {
        setRecipes((data as Recipe[]) ?? []);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function addRecipe(recipe: NewRecipe, file?: File) {
    clearMessages();
    const { error } = await createRecipe(recipe, file);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe added successfully.");
    await loadRecipes();
    return true;
  }

  async function editRecipe(recipeId: number, updatedData: Partial<NewRecipe>, file?: File) {
    clearMessages();
    const { error } = await updateRecipe(recipeId, updatedData, file);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe updated successfully.");
    await loadRecipes();
    return true;
  }

  async function removeRecipe(recipeId: number, image_path?: string) {
    clearMessages();
    const { error } = await deleteRecipe(recipeId, image_path);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe deleted successfully.");
    await loadRecipes();
    return true;
  }

  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  return {
    recipes,
    loading,
    error,
    successMessage,
    addRecipe,
    editRecipe,
    removeRecipe,
    refreshRecipes: loadRecipes,
    clearMessages,
  };
}
