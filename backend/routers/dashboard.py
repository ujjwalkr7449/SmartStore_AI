from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from core.deps import get_current_user
from models.product import Product
from models.supplier import Supplier
from models.purchase_order import PurchaseOrder

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_products = db.query(Product).count()
    low_stock = db.query(Product).filter(Product.stock <= Product.threshold).count()
    total_suppliers = db.query(Supplier).count()
    total_pos = db.query(PurchaseOrder).count()

    return {
        "total_products": total_products,
        "low_stock_products": low_stock,
        "total_suppliers": total_suppliers,
        "total_pos": total_pos
    }
