import { Recipe } from "@/stores/recipeStore";

export const recipes: Recipe[] = [
  {
    name: "Cà phê sữa",
    ingredients: [
      { name: "Cà phê", quantity: 50, unit: "ml" },
      { name: "Sữa đặc", quantity: 20, unit: "ml" },
      { name: "Nước sôi", quantity: 100, unit: "ml" },
    ],
  },
  {
    name: "Cà phê đá",
    ingredients: [
      { name: "Cà phê", quantity: 50, unit: "ml" },
      { name: "Đá", quantity: 5, unit: "cube" }, // Thay "only number" bằng "cube"
    ],
  },
  {
    name: "Cà phê đen nóng",
    ingredients: [
      { name: "Cà phê", quantity: 50, unit: "ml" },
      { name: "Nước sôi", quantity: 100, unit: "ml" },
    ],
  },
  {
    name: "Trà chanh",
    ingredients: [
      { name: "Trà", quantity: 200, unit: "ml" },
      { name: "Nước cốt chanh", quantity: 10, unit: "ml" },
      { name: "Đường", quantity: 2, unit: "tablespoon" },
    ],
  },
  {
    name: "Sinh tố xoài",
    ingredients: [
      { name: "Xoài", quantity: 1, unit: "piece" }, // Miếng xoài
      { name: "Sữa tươi", quantity: 200, unit: "ml" },
      { name: "Đá", quantity: 5, unit: "cube" },
    ],
  },
  {
    name: "Sinh tố dâu",
    ingredients: [
      { name: "Dâu tây", quantity: 5, unit: "piece" }, // 5 miếng dâu tây
      { name: "Sữa chua", quantity: 100, unit: "ml" },
      { name: "Đá", quantity: 5, unit: "cube" },
    ],
  },
  {
    name: "Nước cam ép",
    ingredients: [
      { name: "Cam", quantity: 2, unit: "piece" }, // 2 quả cam
      { name: "Đường", quantity: 1, unit: "tablespoon" },
      { name: "Nước", quantity: 100, unit: "ml" },
    ],
  },
  {
    name: "Nước chanh dây",
    ingredients: [
      { name: "Chanh dây", quantity: 2, unit: "piece" },
      { name: "Đường", quantity: 2, unit: "tablespoon" },
      { name: "Nước", quantity: 200, unit: "ml" },
    ],
  },
  {
    name: "Sữa đậu nành",
    ingredients: [
      { name: "Đậu nành", quantity: 100, unit: "gram" },
      { name: "Nước", quantity: 500, unit: "ml" },
    ],
  },
  {
    name: "Trà đào",
    ingredients: [
      { name: "Trà", quantity: 200, unit: "ml" },
      { name: "Đào", quantity: 2, unit: "slice" }, // 2 lát đào
      { name: "Đường", quantity: 2, unit: "tablespoon" },
    ],
  },
];

export const UnitArray: string[] = [
  "ml", // Milliliter (số ít và số nhiều vẫn là ml)
  "gram", // Gram (số ít: 1 gram, số nhiều: 5 grams)
  "tablespoon", // Muỗng canh
  "teaspoon", // Muỗng cà phê
  "piece", // Miếng
  "slice", // Lát
  "cup", // Cốc
  "pinch", // Nhúm
  "tablet", // Viên
  "cube", // Viên đá
];
