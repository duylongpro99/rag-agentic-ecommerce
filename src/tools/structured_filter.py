from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from ..database.models import Product
from ..database.connection import get_db

class StructuredFilterTool:
    def __init__(self):
        pass
    
    def filter_products(
        self,
        brand: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        name_contains: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Filter products based on structured criteria"""
        db = next(get_db())
        try:
            query = db.query(Product)
            
            # Apply filters
            if brand:
                query = query.filter(Product.brand.ilike(f"%{brand}%"))
            
            if category:
                query = query.filter(Product.category.ilike(f"%{category}%"))
            
            if min_price is not None:
                query = query.filter(Product.price >= min_price)
            
            if max_price is not None:
                query = query.filter(Product.price <= max_price)
            
            if name_contains:
                query = query.filter(Product.name.ilike(f"%{name_contains}%"))
            
            products = query.all()
            
            result = []
            for product in products:
                result.append({
                    "id": product.id,
                    "name": product.name,
                    "brand": product.brand,
                    "category": product.category,
                    "description": product.description,
                    "usage": product.usage,
                    "price": float(product.price) if product.price else None,
                    "image_url": product.image_url
                })
            
            return result
            
        finally:
            db.close()
    
    def __call__(self, filters: Dict[str, Any]) -> str:
        """Tool interface for LangGraph agent"""
        products = self.filter_products(**filters)
        
        if not products:
            return "No products found matching the specified criteria."
        
        result = f"Found {len(products)} products matching your criteria:\n\n"
        for product in products:
            result += f"• {product['name']} by {product['brand']}\n"
            result += f"  Category: {product['category']}\n"
            result += f"  Price: ${product['price']}\n"
            result += f"  Description: {product['description']}\n\n"
        
        return result