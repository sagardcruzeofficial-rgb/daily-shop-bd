export function createProductSlug(title, id) {
  if (!title) return id || 'product';
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
    
  return id ? `${slug}-${id}` : slug;
}
