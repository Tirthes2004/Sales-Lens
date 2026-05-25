from rest_framework.response import Response
from rest_framework.views import APIView

from services.snowflake_service import fetch_all, fetch_one


class DashboardView(APIView):
    def get(self, request):
        total_sales = fetch_one("SELECT COALESCE(SUM(total_sales), 0) AS total_sales FROM sales")
        total_profit = fetch_one("SELECT COALESCE(SUM(profit), 0) AS total_profit FROM sales")
        top_regions = fetch_all(
            """
            SELECT region, COALESCE(SUM(total_sales), 0) AS total_sales
            FROM sales
            GROUP BY region
            ORDER BY total_sales DESC
            LIMIT 5
            """
        )
        top_products = fetch_all(
            """
            SELECT product, COALESCE(SUM(total_sales), 0) AS total_sales
            FROM sales
            GROUP BY product
            ORDER BY total_sales DESC
            LIMIT 5
            """
        )

        return Response(
            {
                "total_sales": total_sales["TOTAL_SALES"],
                "total_profit": total_profit["TOTAL_PROFIT"],
                "top_regions": top_regions,
                "top_products": top_products,
            }
        )


class TotalSalesView(APIView):
    def get(self, request):
        monthly_sales = fetch_all(
            """
            SELECT
                TO_CHAR(DATE_TRUNC('month', order_date), 'YYYY-MM') AS month,
                COALESCE(SUM(total_sales), 0) AS total_sales
            FROM sales
            GROUP BY DATE_TRUNC('month', order_date)
            ORDER BY DATE_TRUNC('month', order_date)
            """
        )
        total_sales = fetch_one("SELECT COALESCE(SUM(total_sales), 0) AS total_sales FROM sales")

        return Response(
            {
                "total_sales": total_sales["TOTAL_SALES"],
                "monthly_sales": monthly_sales,
            }
        )


class TotalProfitView(APIView):
    def get(self, request):
        profit = fetch_one("SELECT COALESCE(SUM(profit), 0) AS total_profit FROM sales")
        margin = fetch_one(
            """
            SELECT
                CASE
                    WHEN COALESCE(SUM(total_sales), 0) = 0 THEN 0
                    ELSE ROUND((SUM(profit) / SUM(total_sales)) * 100, 2)
                END AS profit_margin
            FROM sales
            """
        )

        return Response(
            {
                "total_profit": profit["TOTAL_PROFIT"],
                "profit_margin": margin["PROFIT_MARGIN"],
            }
        )


class RegionSalesView(APIView):
    def get(self, request):
        rows = fetch_all(
            """
            SELECT region, COALESCE(SUM(total_sales), 0) AS total_sales
            FROM sales
            GROUP BY region
            ORDER BY total_sales DESC
            """
        )
        return Response(rows)


class TopProductsView(APIView):
    def get(self, request):
        rows = fetch_all(
            """
            SELECT
                product,
                COALESCE(SUM(quantity), 0) AS quantity_sold,
                COALESCE(SUM(total_sales), 0) AS total_sales,
                COALESCE(SUM(profit), 0) AS total_profit
            FROM sales
            GROUP BY product
            ORDER BY total_sales DESC
            LIMIT 10
            """
        )
        return Response(rows)
