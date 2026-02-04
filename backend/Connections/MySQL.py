from sqlalchemy import create_engine

class MySQLEngine:
    def __init__(self, conn_details):
        self.conn_details = conn_details
        print(f"mysql+pymysql://{self.conn_details['Username']}:{self.conn_details['Password']}@{self.conn_details['Host']}:{self.conn_details['Port']}/{self.conn_details['Database']}")

    def __enter__(self):
        self.conn = create_engine(f"mysql+pymysql://{self.conn_details['Username']}:{self.conn_details['Password']}@{self.conn_details['Host']}:{self.conn_details['Port']}/{self.conn_details['Database']}",
        pool_size=5,
        max_overflow=2,
                                            #---------------------->Modified<-----------------------
        pool_timeout=30,
        pool_recycle=1800,
        pool_pre_ping=True)
        self.connection = self.conn.connect()

        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            self.connection.close()
            print("MySQL closed")
