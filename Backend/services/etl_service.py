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
        "sale_date",
        "sales_date",
    ],
    "region": [
        "area",
        "territory",
        "state",
    ],
    "product": [
        "item",
        "product_name",
        "sku",
    ],
    "quantity": [
        "qty",
        "units",
        "units_sold",
        "quantity_sold",
    ],
    "unit_price": [
        "price",
        "unitprice",
        "sale_price",
        "sales_price",
        "selling_price",
    ],
    "cost": [
        "unit_cost",
        "total_cost",
        "cogs",
        "expense",
        "expenses",
    ],
    "total_sales": [
        "sales",
        "revenue",
        "amount",
        "total",
        "total_amount",
    ],
    "profit": [
        "margin",
        "gross_profit",
        "net_profit",
    ],
}


def process_sales_file(file_obj, file_type):
    """Read, clean, transform, and return a Pandas DataFrame for Snowflake."""
    file_obj.seek(0)

    if file_type == "csv":
        dataframe = pd.read_csv(file_obj)
    elif file_type == "xlsx":
        dataframe = pd.read_excel(file_obj)
    else:
        raise ValueError("Unsupported file type.")

    dataframe = normalize_column_names(dataframe)
    dataframe = apply_column_aliases(dataframe)
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
        (
            str(column)
            .strip()
            .lower()
            .replace(" ", "_")
            .replace("-", "_")
            .replace("/", "_")
        )
        for column in dataframe.columns
    ]
    return dataframe


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


def derive_missing_columns(dataframe):
    if "unit_price" not in dataframe.columns and {"total_sales", "quantity"} <= set(dataframe.columns):
        quantity = pd.to_numeric(dataframe["quantity"], errors="coerce").fillna(0)
        total_sales = pd.to_numeric(dataframe["total_sales"], errors="coerce").fillna(0)
        dataframe["unit_price"] = total_sales.divide(quantity).where(quantity != 0, 0)

    if "cost" not in dataframe.columns and {"total_sales", "profit"} <= set(dataframe.columns):
        total_sales = pd.to_numeric(dataframe["total_sales"], errors="coerce").fillna(0)
        profit = pd.to_numeric(dataframe["profit"], errors="coerce").fillna(0)
        dataframe["cost"] = total_sales - profit

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

    numeric_columns = ["quantity", "unit_price", "cost"]
    for column in numeric_columns:
        dataframe[column] = pd.to_numeric(dataframe[column], errors="coerce").fillna(0)

    return dataframe


def format_dates(dataframe):
    dataframe["order_date"] = pd.to_datetime(dataframe["order_date"], errors="coerce")
    dataframe = dataframe.dropna(subset=["order_date"])
    dataframe["order_date"] = dataframe["order_date"].dt.date
    return dataframe


def calculate_sales_metrics(dataframe):
    dataframe["total_sales"] = dataframe["quantity"] * dataframe["unit_price"]
    dataframe["profit"] = dataframe["total_sales"] - dataframe["cost"]
    dataframe["profit_margin"] = dataframe.apply(
        lambda row: round((row["profit"] / row["total_sales"]) * 100, 2)
        if row["total_sales"]
        else 0,
        axis=1,
    )
    return dataframe
