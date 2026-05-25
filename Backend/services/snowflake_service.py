import snowflake.connector
from django.conf import settings


def get_connection():
    return snowflake.connector.connect(
        user=settings.SNOWFLAKE_USER,
        password=settings.SNOWFLAKE_PASSWORD,
        account=settings.SNOWFLAKE_ACCOUNT,
        warehouse=settings.SNOWFLAKE_WAREHOUSE,
        database=settings.SNOWFLAKE_DATABASE,
        schema=settings.SNOWFLAKE_SCHEMA,
    )


def create_sales_table():
    query = """
    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER AUTOINCREMENT,
        order_date DATE,
        region STRING,
        product STRING,
        quantity NUMBER(18, 2),
        unit_price NUMBER(18, 2),
        cost NUMBER(18, 2),
        total_sales NUMBER(18, 2),
        profit NUMBER(18, 2),
        profit_margin NUMBER(8, 2),
        loaded_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    )
    """
    execute_query(query)


def insert_sales_rows(dataframe):
    insert_query = """
    INSERT INTO sales (
        order_date,
        region,
        product,
        quantity,
        unit_price,
        cost,
        total_sales,
        profit,
        profit_margin
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    rows = [
        (
            row.order_date,
            row.region,
            row.product,
            float(row.quantity),
            float(row.unit_price),
            float(row.cost),
            float(row.total_sales),
            float(row.profit),
            float(row.profit_margin),
        )
        for row in dataframe.itertuples(index=False)
    ]

    if not rows:
        return

    connection = get_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.executemany(insert_query, rows)
        connection.commit()
    finally:
        if cursor:
            cursor.close()
        connection.close()


def execute_query(query, params=None):
    connection = get_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute(query, params)
        connection.commit()
    finally:
        if cursor:
            cursor.close()
        connection.close()


def fetch_one(query, params=None):
    connection = get_connection()
    cursor = None
    try:
        cursor = connection.cursor(snowflake.connector.DictCursor)
        cursor.execute(query, params)
        row = cursor.fetchone()
        return row or {}
    finally:
        if cursor:
            cursor.close()
        connection.close()


def fetch_all(query, params=None):
    connection = get_connection()
    cursor = None
    try:
        cursor = connection.cursor(snowflake.connector.DictCursor)
        cursor.execute(query, params)
        return cursor.fetchall()
    finally:
        if cursor:
            cursor.close()
        connection.close()
