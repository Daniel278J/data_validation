import pyodbc  
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

class SybaseEngine:
    def __init__(self, conn_details):
        self.conn_details = conn_details

    def __enter__(self):
        connection_string = (
             "DRIVER={Adaptive Server Enterprise};"
             f"SERVER={self.conn_details['Host']};"
             f"PORT={self.conn_details['Port']};"
             f"DATABASE={self.conn_details['Database']};"
             f"UID={self.conn_details['Username']};"
             f"PWD={self.conn_details['Password']};"
             f"CHARSET=iso_1"
                )
        connection_url = URL.create(
            "sybase+pyodbc", 
            query={"odbc_connect": connection_string}
        )
        print(str(connection_url))
        self.engine = create_engine(connection_url,
        pool_size=5,
        max_overflow=2,
        pool_timeout=30,
        pool_recycle=1800,   
        pool_pre_ping=True,)
        

        return  self.engine

    def __exit__(self, exc_type, exc_value, traceback):

        if exc_type:
            print(f"An error occurred: {exc_value}")

        if self.engine:
            self.engine.close()
            print("Sybase closed")

if __name__ == '__main__':
    with SybaseEngine() as sybase:
        pass

