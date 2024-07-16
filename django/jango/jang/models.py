from django.db import models

# Create your models here.
class Producto(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    detalles = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre