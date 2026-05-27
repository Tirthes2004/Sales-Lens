import re

import pandas as pd


REQUIRED_COLUMNS = {
    "order_date",
    "region",
    "product",
    "quantity",
    "unit_price",
    "cost",
}

COLUMN_ALIASES = {
    "order_date": [
        "date",
        "orderdate",
        "order_dt",
        "order_time",
        "created_at",
        "invoice_date",
        "transaction_date",
        "sale_date",
        "sales_date",
        "ship_date",
    ],
    "region": [
        "area",
        "branch",
        "city",
        "country",
        "county",
        "district",
        "location",
        "market",
        "province",
        "territory",
        "state",
        "store",
        "store_location",
        "warehouse",
    ],
    "product": [
        "item",
        "item_id",
        "item_name",
        "category",
        "product",
        "product_id",
        "product_sub_category",
        "sub_category",
        "subcategory",
        "product_category",
        "product_description",
        "product_name",
        "product_line",
        "product_type",
        "description",
        "stock_item",
        "sku",
    ],
    "quantity": [
        "qty",
        "count",
        "order_quantity",
        "ordered_quantity",
        "qty_ordered",
        "sold_qty",
        "units",
        "unit_sold",
        "units_sold",
        "quantity_sold",
        "sales_quantity",
        "volume",
    ],
    "unit_price": [
        "price",
        "rate",
        "unitprice",
        "unit_price_usd",
        "unit_selling_price",
        "average_price",
        "sale_price",
        "sales_price",
        "selling_price",
        "list_price",
        "retail_price",
    ],
    "cost": [
        "total_cost",
        "cogs",
        "cost_of_goods_sold",
        "expense",
        "expenses",
    ],
    "unit_cost": [
        "cost_price",
        "unit_cost",
        "purchase_price",
        "buying_price",
        "wholesale_price",
    ],
    "total_sales": [
        "sales",
        "revenue",
        "amount",
        "net_amount",
        "total",
        "total_amount",
        "sales_amount",
        "sales_value",
        "line_total",
        "order_total",
        "subtotal",
        "gross_sales",
        "total_revenue",
    ],
    "profit": [
        "margin",
        "profit_amount",
        "gross_income",
        "gross_profit",
        "net_profit",
    ],
}

KEYWORD_ALIASES = {
    "order_date": [
        ("order", "date"),
        ("invoice", "date"),
        ("transaction", "date"),
        ("sale", "date"),
        ("ship", "date"),
    ],
    "region": [
        ("region",),
        ("location",),
        ("territory",),
        ("branch",),
        ("market",),
        ("store",),
        ("city",),
        ("state",),
        ("country",),
    ],
    "product": [
        ("product", "name"),
        ("product", "sub", "category"),
        ("sub", "category"),
        ("item", "name"),
        ("sku",),
        ("description",),
    ],
    "quantity": [
        ("order", "quantity"),
        ("qty",),
        ("quantity",),
        ("units", "sold"),
        ("sales", "quantity"),
    ],
    "unit_price": [
        ("unit", "price"),
        ("selling", "price"),
        ("sale", "price"),
        ("retail", "price"),
        ("rate",),
    ],
    "cost": [
        ("total", "cost"),
        ("cost",),
        ("cogs",),
        ("expense",),
    ],
    "unit_cost": [
        ("unit", "cost"),
        ("cost", "price"),
        ("purchase", "price"),
        ("buying", "price"),
        ("wholesale", "price"),
    ],
    "total_sales": [
        ("total", "sales"),
        ("sales", "amount"),
        ("sales", "value"),
        ("revenue",),
        ("line", "total"),
        ("order", "total"),
        ("amount",),
    ],
    "profit": [
        ("profit",),
        ("gross", "income"),
        ("margin",),
    ],
}


def process_sales_file(file_obj, file_type):
    """Read, clean, transform, and return a Pandas DataFrame for Snowflake."""
    file_obj.seek(0)

    if file_type == "csv":
        dataframe = read_csv_file(file_obj)
    elif file_type == "xlsx":
        dataframe = pd.read_excel(file_obj)
    else:
        raise ValueError("Unsupported file type.")

    dataframe = normalize_column_names(dataframe)
    dataframe = dataframe.dropna(how="all")
    dataframe = apply_column_aliases(dataframe)
    dataframe = apply_keyword_aliases(dataframe)
    dataframe = derive_missing_columns(dataframe)
    validate_columns(dataframe)

    dataframe = dataframe.drop_duplicates()
    dataframe = handle_null_values(dataframe)
    dataframe = format_dates(dataframe)
    dataframe = calculate_sales_metrics(dataframe)

    return dataframe[
        [
            "order_date",
            "region",
            "product",
            "quantity",
            "unit_price",
            "cost",
            "total_sales",
            "profit",
            "profit_margin",
        ]
    ]


def normalize_column_names(dataframe):
    dataframe.columns = [
        normalize_column_name(column)
        for column in dataframe.columns
    ]
    return dataframe


def normalize_column_name(column):
    normalized = str(column).strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "_", normalized)
    return normalized.strip("_")


def read_csv_file(file_obj):
    encodings = ["utf-8-sig", "utf-8", "latin1"]

    for encoding in encodings:
        try:
            file_obj.seek(0)
            return pd.read_csv(file_obj, encoding=encoding)
        except UnicodeDecodeError:
            continue

    file_obj.seek(0)
    return pd.read_csv(file_obj)


def apply_column_aliases(dataframe):
    rename_map = {}
    existing_columns = set(dataframe.columns)

    for expected_column, aliases in COLUMN_ALIASES.items():
        if expected_column in existing_columns:
            continue

        matched_alias = next(
            (alias for alias in aliases if alias in existing_columns),
            None,
        )
        if matched_alias:
            rename_map[matched_alias] = expected_column

    if rename_map:
        dataframe = dataframe.rename(columns=rename_map)

    return dataframe


def apply_keyword_aliases(dataframe):
    rename_map = {}
    existing_columns = set(dataframe.columns)
    canonical_columns = set(COLUMN_ALIASES.keys())

    for expected_column, keyword_groups in KEYWORD_ALIASES.items():
        if expected_column in existing_columns:
            continue

        matched_column = None
        for column in dataframe.columns:
            if column in rename_map or column in canonical_columns:
                continue

            column_tokens = set(column.split("_"))
            if any(set(group) <= column_tokens for group in keyword_groups):
                matched_column = column
                break

        if matched_column:
            rename_map[matched_column] = expected_column
            existing_columns.add(expected_column)

    if rename_map:
        dataframe = dataframe.rename(columns=rename_map)

    return dataframe


def derive_missing_columns(dataframe):
    columns = set(dataframe.columns)

    if "region" not in columns:
        dataframe["region"] = "Unknown"

    if "product" not in dataframe.columns:
        dataframe["product"] = "Unknown"

    if "quantity" not in dataframe.columns and {"total_sales", "unit_price"} <= set(dataframe.columns):
        unit_price = clean_numeric_series(dataframe["unit_price"])
        total_sales = clean_numeric_series(dataframe["total_sales"])
        dataframe["quantity"] = total_sales.divide(unit_price).where(unit_price != 0, 0)

    if "quantity" not in dataframe.columns:
        dataframe["quantity"] = 1

    if "total_sales" not in dataframe.columns and {"quantity", "unit_price"} <= set(dataframe.columns):
        quantity = clean_numeric_series(dataframe["quantity"])
        unit_price = clean_numeric_series(dataframe["unit_price"])
        dataframe["total_sales"] = quantity * unit_price

    if "unit_price" not in dataframe.columns and {"total_sales", "quantity"} <= set(dataframe.columns):
        quantity = clean_numeric_series(dataframe["quantity"])
        total_sales = clean_numeric_series(dataframe["total_sales"])
        dataframe["unit_price"] = total_sales.divide(quantity).where(quantity != 0, 0)

    if "unit_price" not in dataframe.columns:
        dataframe["unit_price"] = 0

    if "cost" not in dataframe.columns and {"total_sales", "profit"} <= set(dataframe.columns):
        total_sales = clean_numeric_series(dataframe["total_sales"])
        profit = clean_numeric_series(dataframe["profit"])
        dataframe["cost"] = total_sales - profit

    if "cost" not in dataframe.columns and {"unit_cost", "quantity"} <= set(dataframe.columns):
        unit_cost = clean_numeric_series(dataframe["unit_cost"])
        quantity = clean_numeric_series(dataframe["quantity"])
        dataframe["cost"] = unit_cost * quantity

    if "cost" not in dataframe.columns:
        # Some sales reports contain revenue only. Keep the row loadable and mark cost as 0.
        dataframe["cost"] = 0

    if "order_date" not in dataframe.columns:
        dataframe["order_date"] = pd.Timestamp.today().date()

    return dataframe


def validate_columns(dataframe):
    missing_columns = REQUIRED_COLUMNS - set(dataframe.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        available = ", ".join(dataframe.columns)
        raise ValueError(
            f"Missing required columns: {missing}. Available columns: {available}"
        )


def handle_null_values(dataframe):
    dataframe["region"] = dataframe["region"].fillna("Unknown")
    dataframe["product"] = dataframe["product"].fillna("Unknown")

    numeric_columns = ["quantity", "unit_price", "cost", "total_sales", "profit"]
    for column in numeric_columns:
        if column in dataframe.columns:
            dataframe[column] = clean_numeric_series(dataframe[column])

    return dataframe


def clean_numeric_series(series):
    as_text = series.astype(str).str.strip()
    negative_parentheses = as_text.str.match(r"^\(.*\)$")
    cleaned = as_text.str.replace(",", "", regex=False)
    cleaned = cleaned.str.replace(r"[^0-9.\-]", "", regex=True)
    cleaned = cleaned.where(~negative_parentheses, "-" + cleaned)
    return pd.to_numeric(cleaned, errors="coerce").fillna(0)


def format_dates(dataframe):
    dataframe["order_date"] = pd.to_datetime(dataframe["order_date"], errors="coerce")
    dataframe = dataframe.dropna(subset=["order_date"])
    dataframe["order_date"] = dataframe["order_date"].dt.date
    return dataframe


def calculate_sales_metrics(dataframe):
    if "total_sales" not in dataframe.columns:
        dataframe["total_sales"] = dataframe["quantity"] * dataframe["unit_price"]

    dataframe["profit"] = dataframe["total_sales"] - dataframe["cost"]
    dataframe["profit_margin"] = dataframe.apply(
        lambda row: round((row["profit"] / row["total_sales"]) * 100, 2)
        if row["total_sales"]
        else 0,
        axis=1,
    )
    return dataframe
