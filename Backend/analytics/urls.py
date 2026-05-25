from django.urls import path

from .views import (
    DashboardView,
    RegionSalesView,
    TopProductsView,
    TotalProfitView,
    TotalSalesView,
)


urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="analytics-dashboard"),
    path("sales/", TotalSalesView.as_view(), name="analytics-sales"),
    path("profit/", TotalProfitView.as_view(), name="analytics-profit"),
    path("regions/", RegionSalesView.as_view(), name="analytics-regions"),
    path("products/", TopProductsView.as_view(), name="analytics-products"),
]
