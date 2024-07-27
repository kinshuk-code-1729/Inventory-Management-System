# emails
from typing import List

# dot env
from dotenv import dotenv_values
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from tortoise.contrib.fastapi import register_tortoise

from models import pydantic_supplier, pydantic_supplierIn, Supplier, pydantic_product, pydantic_productIn, Product

# credentials
credentials = dotenv_values(".env")

app = FastAPI()

# CORS URL
origins = [
    'http://localhost:3000'
]

# add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get('/')
def index():
    return {"Msg": "go to /docs for the API Documentation"}


@app.post('/supplier')
async def add_supplier(supplier_info: pydantic_supplierIn):
    sup_obj = await Supplier.create(**supplier_info.dict(exclude_unset=True))
    response = await pydantic_supplier.from_tortoise_orm(sup_obj)
    return {"status": "ok", "data": response}


@app.get('/supplier')
async def get_all_suppliers():
    response = await pydantic_supplier.from_queryset(Supplier.all())
    return {"status": "ok", "data": response}


@app.get('/supplier/{supplier_id}')
async def get_specific_supplier(supplier_id: int):
    response = await pydantic_supplier.from_queryset_single(Supplier.get(id=supplier_id))
    return {"status": "ok", "data": response}


@app.put('/supplier/{supplier_id}')
async def update_supplier(supplier_id: int, updated: pydantic_supplierIn):
    supplier = await Supplier.get(id=supplier_id)
    updated_data = updated.dict(exclude_unset=True)
    supplier.name = updated_data['name']
    supplier.company = updated_data['company']
    supplier.phone = updated_data['phone']
    supplier.email = updated_data['email']
    await supplier.save()
    response = await pydantic_supplier.from_tortoise_orm(supplier)
    return {"status": "ok", "data": response}


@app.delete('/supplier/{supplier_id}')
async def delete_supplier(supplier_id: int):
    supplier = await Supplier.get(id=supplier_id)
    await supplier.delete()
    return {"status": "ok"}


@app.post('/product/{supplier_id}')
async def add_product(supplier_id: int, product_details: pydantic_productIn):
    supplier = await Supplier.get(id=supplier_id)
    product_data = product_details.dict(exclude_unset=True)
    product_data['revenue'] += product_data['soldQty'] * product_data['unitPrice']
    pro_obj = await Product.create(**product_data, suppliedBy=supplier)
    response = await pydantic_product.from_tortoise_orm(pro_obj)
    return {"status": "ok", "data": response}


@app.get('/product')
async def all_products():
    response = await pydantic_product.from_queryset(Product.all())
    return {"status": "ok", "data": response}


@app.get('/product/{id}')
async def specific_product(id: int):
    response = await pydantic_product.from_queryset_single(Product.get(id=id))
    return {"status": "ok", "data": response}


@app.put('/product/{id}')
async def update_product(id: int, updated: pydantic_productIn):
    product = await Product.get(id=id)
    updated_data = updated.dict(exclude_unset=True)
    product.name = updated_data['name']
    product.stockQty = updated_data['stockQty']
    product.revenue += (updated_data['soldQty'] * updated_data['unitPrice']) + updated_data['revenue']
    product.soldQty += updated_data['soldQty']
    product.unitPrice = updated_data['unitPrice']
    await product.save()
    response = await pydantic_product.from_tortoise_orm(product)
    return {"status": "ok", "data": response}


@app.delete('/product/{id}')
async def delete_product(id: int):
    await Product.filter(id=id).delete()
    return {"status": "ok"}


class EmailSchema(BaseModel):
    email: List[EmailStr]


class EmailContent(BaseModel):
    message: str
    subject: str


conf = ConnectionConfig(
    MAIL_USERNAME=credentials['EMAIL'],
    MAIL_PASSWORD=credentials['PASS'],
    MAIL_FROM=credentials['EMAIL'],
    MAIL_PORT=465,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


@app.post('/email/{product_id}')
async def send_email(product_id: int, content: EmailContent):
    product = await Product.get(id=product_id)
    supplier = await product.suppliedBy
    supplier_email = [supplier.email]

    html = f"""
    <h4>Obify Consulting Private Ltd.</h5>
    <br>
    <p>{content.message}</p>
    <br>
    <h5>Best Regards</h5>
    <h5>Obify Consulting Private Ltd.</h5>
    """

    message = MessageSchema(
        subject=content.subject,
        recipients=supplier_email,
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return {"status": "ok"}


register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)
