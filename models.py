from tortoise.models import Model
from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator


class Product(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=35, nullable=False)
    stockQty = fields.IntField(default=0)
    soldQty = fields.IntField(default=0)
    unitPrice = fields.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    revenue = fields.DecimalField(max_digits=20, decimal_places=2, default=0.00)

    suppliedBy = fields.ForeignKeyField('models.Supplier', related_name="supplied_goods")


class Supplier(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=20)
    company = fields.CharField(max_length=20)
    email = fields.CharField(max_length=100)
    phone = fields.CharField(max_length=15)


# Creating the pydantic Models ...
pydantic_product = pydantic_model_creator(Product, name="Product")
pydantic_productIn = pydantic_model_creator(Product, name="ProductIn", exclude_readonly=True)

pydantic_supplier = pydantic_model_creator(Supplier, name="Supplier")
pydantic_supplierIn = pydantic_model_creator(Supplier, name="SupplierIn", exclude_readonly=True)

