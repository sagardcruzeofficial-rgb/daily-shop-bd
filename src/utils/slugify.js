// src/utils/slugify.js
export function createProductSlug(title, id) {
  if (!title) return id;
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with hyphens
  
  return `${cleanTitle}-${id}`;
}

// Slug theke ID ber korar function
export function getIdFromSlug(slug) {
  if (!slug) return null;
  const parts = slug.split('-');
  return parts[parts.length - 1]; // sesher part-ti holo Firestore document ID
}
