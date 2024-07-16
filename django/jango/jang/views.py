# views.py
from django.shortcuts import render
from .models import Producto

def buscador_view(request):
    return render(request, 'buscador.html')

def buscar_producto(request):
    if request.method == 'GET':
        nombre_producto = request.GET.get('nombre', '')
        productos = Producto.objects.filter(nombre__icontains=nombre_producto)
        
        # Filtrar productos únicos basados en el nombre
        unique_productos = []
        nombres_vistos = set()
        for producto in productos:
            if producto.nombre not in nombres_vistos:
                unique_productos.append(producto)
                nombres_vistos.add(producto.nombre)
        
        return render(request, 'buscador.html', {'productos': unique_productos})
    
    return render(request, 'buscador.html')
