from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
# from pgvector.sqlalchemy import Vector
from .connection import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    brand = Column(String(100))
    category = Column(String(100))
    description = Column(Text)
    usage = Column(Text)
    price = Column(DECIMAL(10, 2))
    image_url = Column(String(500))
    created_at = Column(DateTime, server_default=func.now())
    
    embeddings = relationship("ProductEmbedding", back_populates="product")

class ProductEmbedding(Base):
    __tablename__ = "product_embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    embedding = Column(Text)  # Store as text for pgvector compatibility
    document_text = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    
    product = relationship("Product", back_populates="embeddings")