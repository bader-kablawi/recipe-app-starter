import type { Recipe } from "../types/recipe";
import { getImageUrl } from "../services/recipeService";

type RecipeCardProps = {
  recipe: Recipe;
  categoryName: string;
  isOwner: boolean;
  isLoggedIn: boolean;
  isFavorite: boolean;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: number) => void;
  onToggleFavorite: (recipeId: number, isFavorite: boolean) => void;
};

export default function RecipeCard({
  recipe,
  categoryName,
  isOwner,
  isLoggedIn,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite
}: RecipeCardProps) {
  const imageUrl = recipe.image_path ? getImageUrl(recipe.image_path) : "/placeholder.png";

  return (
    <div className="recipe-card">
      <img 
        src={imageUrl} 
        alt={recipe.title} 
        style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '16px' }} 
      />
      <div className="recipe-card-badge">{categoryName}</div>
      <h3 className="recipe-card-title">{recipe.title}</h3>
      <div className="recipe-card-meta">
        <span>By: {recipe.owner_email || recipe.user_id}</span>
        <span>•</span>
        <span>{recipe.prep_time} mins prep</span>
      </div>
      
      <div className="recipe-card-desc">
        <p>{recipe.description}</p>
      </div>
      
      <div className="recipe-card-actions">
        {isOwner && (
          <>
            <button className="btn-outline" onClick={() => onEdit(recipe)}>Edit Recipe</button>
            <button className="btn-danger" onClick={() => onDelete(recipe.id)}>Delete</button>
          </>
        )}
        
        {isLoggedIn ? (
          <button 
            className={isFavorite ? "btn-favorite" : "btn-outline"} 
            onClick={() => onToggleFavorite(recipe.id, isFavorite)}
          >
            {isFavorite ? "★ Favorited" : "☆ Add Favorite"}
          </button>
        ) : (
          <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", marginLeft: "auto" }}>
            Login required for favorite actions
          </span>
        )}
      </div>
    </div>
  );
}
