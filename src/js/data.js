/* ==========================================================================
   JOMETRY MODULAR ARCHITECTURAL SYSTEMS - DATA LOADER MODULE
   ========================================================================== */

export async function fetchProductData() {
  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) {
      throw new Error(`Failed to load products.json: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

export function getAllVariants(productData) {
  if (!productData) return [];
  const groups = productData.typologies || productData.families || [];
  const variants = [];
  groups.forEach(group => {
    if (group.variants) {
      group.variants.forEach(variant => {
        variants.push({
          ...variant,
          typologyId: group.id,
          typologyNum: group.num || '',
          typologyName: group.name,
          typologyStatus: group.status,
          typologyTagline: group.tagline,
          typologyBenefits: group.keyBenefits || []
        });
      });
    }
  });
  return variants;
}

export function getProjectReferences(productData) {
  return productData?.projectReferences || [];
}
