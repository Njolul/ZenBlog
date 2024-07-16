# urls.py
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from jang import views  # Asegúrate de que 'views' apunte al módulo correcto

urlpatterns = [
    path('admin/', admin.site.urls),
    path('buscador/', views.buscador_view, name='buscador'),
    path('buscar-producto/', views.buscar_producto, name='buscar-producto'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
